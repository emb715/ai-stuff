# humans.md — agent-installer

## What this is

A standalone playbook for building a multi-platform agent installer with a `@clack/prompts`-style TUI. Prescribes a layered architecture that keeps the engine free of project identity, registries that make the system open/closed to new platforms, idempotency via marker blocks, and a test contract that runs in temp dirs. Written to be portable: any project shipping agents across AI coding tools can follow it without modification.

## Why it works

Three structural choices carry most of the value:

**The engine knows nothing about your project.** The installer code contains no project name, no routing content as a string literal, no hardcoded agent filenames. Everything project-specific is data — a `BRANDING` object, a `targets.js` table, a `templates/` directory. This is what makes the engine reusable: you lift `lib/installer/*` + `bin/prompt.js` into a new project, fill in the data, and the code does not change. The grep test is the contract: `grep -r "<your-project-name>" lib/` must return nothing.

**Registries instead of branches.** Platforms differ in destination paths, file extensions, frontmatter transforms, and routing shapes. The wrong way is `if (toolName === 'X')` scattered through the install flow — adding a platform means editing the core. The right way is four registries: `TARGETS` (destinations), `TRANSFORMS` (content mutation per platform), `templates/routing-<platform>.md` (routing content as files), `SKILL_TARGETS` (auxiliary module destinations). Adding a platform is adding a row. This is Open/Closed applied to a real codebase, not as theory.

**Idempotency as a contract, tested explicitly.** Users run installers repeatedly. A non-idempotent installer accumulates duplicate routing blocks, clobbers symlinks, duplicates skill copies. The marker block (`<!-- <marker>:start -->` / `<!-- <marker>:end -->`) is the idempotency key — the merge checks for it before appending. Symlink safety requires `lstatSync` + `readlinkSync`, not `existsSync` (which returns false for dangling symlinks and causes silent clobbering). The test that runs the installer twice and asserts one marker block is the single highest-value test in the suite.

## Design decisions

- **Four layers, not one god file.** The audited codebase held CLI parsing, platform transforms, routing literals, symlink mirroring, parity checks, and skill metadata parsing in a single 837-line file. The playbook splits this into `bin/<cli>.js` (under ~150 lines, arg parsing + dispatch only), `lib/installer/install.js` (orchestrator), `lib/installer/{targets,transforms,routing,skills}.js` (concerns), and `templates/` (content). A change to routing content no longer touches the same file as a change to CLI ergonomics.

- **Routing content in `templates/`, not in code.** The audited codebase had a 67-line `NDV_BLOCK` string literal embedded in the installer. Any other project would inherit the wrong routing table. The playbook moves routing content to `templates/routing-<platform>.md` and makes `routing.js` a pure loader + idempotent merger. Content is content; code is code.

- **`BRANDING` as the only identity surface.** The engine never says the project's name. `intro()`, `outro()`, `console.log` strings all pull from a `BRANDING = { name, introTitle, fleetNoun, routingMarker }` object in `targets.js`. One place to change the project's voice; every consumer updates.

- **Transforms as a registry, `identity` as a valid entry.** Most platforms copy content verbatim. The `TRANSFORMS = { claude: identity, opencode: transformForOpenCode, ... }` map makes this explicit. The orchestrator does `TRANSFORMS[toolName](content)` — no branch. A transform that derives one platform's metadata from another's (OpenCode's `permission:` block derived from Claude Code's `tools:` list) is correct and good: it makes Claude Code's agent files the source of truth and other platforms projections.

- **`'special'` sentinel for platforms with a different install shape.** Copilot aggregates all agents into one file, not per-agent copies. Bending the per-agent loop to handle this would pollute the common path. The sentinel routes to a separate `installCopilot` entry function called from the CLI dispatcher. One branch in the dispatcher, not a growing set of branches in the orchestrator.

- **Skills as a separate module, not a feature of the installer.** Skill discovery, metadata parsing, and copying are a different concern from agent install. They live in `skills.js`, have their own source dir and dest, and the TUI for the picker lives in the CLI layer (presentation), not the engine. A project that does not ship skills omits the module entirely — the orchestrator does not reference it.

- **The four-mode dispatch is non-negotiable.** Interactive + arg, interactive + no arg, non-interactive + arg (`--all`), and non-interactive + no arg. The fourth mode is where most installers fail — they hang in CI waiting for input that never comes. The playbook prescribes `isTTY()` gating with a fail-fast error and a remediation example. Tested explicitly.

- **`node:test` in temp dirs, no fs mocks.** Mocks let the installer pass while real filesystem calls fail in ways you did not predict. Every test uses `mkdtempSync`, runs the CLI via `spawnSync` with `HOME` overridden for global tests, and asserts on real `readdirSync`/`readFileSync` output. The idempotency test (install twice, assert one marker block) is the keystone.

## Origin

Derived from an architectural audit of a real installer (neurodiveragents `bin/ndv.js`). The audit was performed with a structural-review agent and identified:

- A 837-line god file mixing four concerns (CLI, transforms, routing literals, skills plumbing)
- Open/Closed violations: `if (toolName === 'opencode')` and `if (arg === 'copilot')` branches scattered through the install flow
- A 67-line routing content literal embedded in code
- Skills metadata parsing (presentation concerns) living in the installer engine
- A module-level mutable (`isAll`) consumed 400 lines from where it was set — implicit data flow through globals

The playbook prescribes the extraction that resolves each violation, ordered so the system stays functional after every step and the test suite runs after each. The build sequence is ~5.5 days for a production-quality multi-platform installer; highest-risk step is the orchestrator (Step 5), where implicit coupling hides.

Kept from the audited codebase: the `bin/prompt.js` TUI adapter (already agnostic, header literally says "Copy this file into any project"), the `TARGETS`/`SKILL_TARGETS` table pattern, the marker-based idempotency, the `lstatSync`/`readlinkSync` symlink safety, and the temp-dir test approach. Cut: the god file, the in-code routing literal, the platform branches in the orchestrator, the skills plumbing in the engine, and the module-level mutable.

## Maintenance

- **If a new platform is added and it requires editing the orchestrator**, the Open/Closed contract is broken. Move the platform-specific logic to a `TRANSFORMS` entry or a `TARGETS` row. The orchestrator must not grow branches.
- **If `grep -r "<project-name>" lib/` returns hits**, identity has leaked into the engine. Move the string to `BRANDING` in `targets.js` or to a `templates/` file.
- **If the idempotency test fails after a change**, the marker check was bypassed or the marker was changed without updating existing installs. The marker is a contract — changing it requires a migration path for already-installed routing blocks.
- **If a transform grows to read the filesystem or log**, it is no longer a pure function. Pull the fs read up to the orchestrator and pass the content in. Transforms are string → string; everything else is a leak.
- **If `bin/<cli>.js` exceeds ~200 lines**, engine logic has leaked up. Extract the concern to `lib/installer/`. The CLI layer is arg parsing, dispatch, help text, and branding — nothing else.
- **Promote to `status: validated`** only after 2-3 real runs building installers in fresh projects, with outcomes documented in the README Evidence section. Current state: derived from a validated codebase audit, the playbook itself not yet run end-to-end on a fresh project.