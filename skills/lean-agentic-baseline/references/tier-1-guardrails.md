# Tier 1 · Guardrails

Make bad output hard to ship: remote checks that mirror the local ones, a branching model agents can reason about, skills that turn conventions into one-step actions, and controls that stop an agent reaching green by weakening the check.

## CI/CD — a fail-closed pipeline

Sequential stages, each requiring the previous to exit green. A red result halts the pipeline before the next stage runs: no build off broken validation, no deploy off a broken build.

```
validate (gates) → build → bot review (by impact) → preview (label-gated) → release (drafted)
```

Preview waits on bot review — a blocking finding halts before a preview environment is even built, saving the infra cost of standing one up for a change already known broken. Gate a preview build itself behind a label (e.g. `preview`) — not every PR needs one.

Template: `assets/templates/tier-1/ci.yml`

## Trunk-based development

One trunk, short-lived branches (merge within a day). Agents work best against a branch close to what's actually shipping — a long-lived branch is stale context waiting to mislead one.

| | Long-lived branches | Trunk-based |
|---|---|---|
| Merge target | Days to weeks away | Within a day |
| Unfinished work | Held on the branch | Carried on trunk behind a flag |
| What the agent sees | Code that diverges from production | Code that matches production |
| Merge cost | Grows with every day of drift | Small, reviewable |
| Before a release | Stabilization branch | Nothing — trunk is always releasable |

Unfinished work ships dark behind a feature flag instead of aging on a branch. Use `git worktree` for one worktree per agent session so parallel sessions don't step on each other's files — delete the worktree with the branch.

Templates: `assets/templates/tier-1/feature-flag-example.md`, `assets/templates/tier-1/worktree-commands.md`

## Skills

Four is enough. Before adding a fifth, ask: will it need constant human upkeep? Models keep improving at raw coding — lock in as little as possible.

| Skill | What it does |
|---|---|
| Create PR | Follows the PR template: impact, system effect, ADR links, reviewer notes |
| Create commit | Follows commit conventions and project-specific requirements |
| Record a decision | Writes the next numbered ADR, adds its INDEX line with path globs, marks any superseded ADR |
| Project-specific | This repo's CLI tools, MCPs, coding style — not library docs (fetch those by version, see Tier 2) |

Before writing a skill, ask:
- Will a newer model do this well without it? → skip it.
- Will it need human hours every month to stay current? → it will rot; skip or shrink it.
- Does it encode *this repo's* convention, or a general tutorial? → keep the first, drop the second.
- Does it restate a public library's docs? → don't write it, it goes stale at the next version bump. Retrieve docs for the installed version instead (Tier 2 · Versioned docs).

Templates: `assets/templates/tier-1/create-pr-SKILL.md`, `assets/templates/tier-1/pull_request_template.md`

## Clean code & comments

A comment must earn its place on top of clear types/interfaces. A comment that explains *what* code does is a refactor candidate; comments say *why*, never *what*.

```
// Before — narrates the next line
// loop through users and check if they are over 18
for (const u of users) { if (u.age >= 18) eligible.push(u); }

// After — the name says it
const eligible = users.filter(isAdult);
```

Ticket refs and names are fine in a working session; they must never reach a PR:

```
// Before — dead weight in a year
// fix for JIRA-4821, see comment from @asmith on 2024-03-02
if (retries > 3) return null;

// After — reasoning moved to where it stays useful
// Caps retries at 3. See docs/decisions/0031-retry-cap.md
if (retries > 3) return null;
```

| Keep | Cut |
|---|---|
| A non-obvious constraint. A workaround with its ADR link. A public API contract types can't express. | Narration of the next line. Commented-out code. Ticket IDs, names, dates. Anything a better name would say. |

Check: `scripts/checks/no-ticket-refs.sh <base-ref>` — fails a diff introducing a project ticket key.

## Test integrity & self-verification

Gates only mean something if the agent can't reach green by changing the gate. Common shortcuts: skip the failing test, delete/soften an assertion, loosen a type to `any`, lower a threshold, add a suppression comment. Each is legitimate sometimes; none is legitimate silently.

Three enforcement layers:
1. **Ask first** — an `ask` rule prompts a human before editing lint/type/test config or workflows.
2. **Diff check in CI** — fails the PR on newly skipped tests or fewer assertions than before. Below the agent, so it can't be switched off from inside the session.
3. **Human-owned config** — CODEOWNERS on gate paths, agent identity absent.

Check: `scripts/checks/no-test-weakening.sh <base-ref>` — flags newly `.skip`/`.only`/`xit`/`@Disabled`-style tests, and diffs where assertions removed exceed assertions added.

Beyond the mechanical check:
- **Write the test from acceptance criteria first**, watch it fail for the expected reason. A test written after the code passes tautologically.
- **Verify by running the thing** — lint and unit tests can be green while the feature is broken. Give the agent a way to observe real behavior (smoke script, `curl`, Playwright).
- **Quarantine flaky tests before running agents unattended.** A human sees a flake and retries; an agent sees a failure, forms a theory, and changes correct code to fix a bug that doesn't exist.
- **Mutation testing (optional)** — Stryker (JS), mutmut (Python), PIT (JVM). Slow; run nightly, not per commit.

## Architecture as a gate

"Route calls service, service calls repo" reads like it needs judgment. It doesn't — layer boundaries are import rules, and a boundary linter fails the build the moment an import crosses one. That turns a line of AGENTS.md into a check you can then delete.

| Stack | Tool | Run |
|---|---|---|
| TS/JS | dependency-cruiser (or eslint-plugin-boundaries) | `depcruise src --config .dependency-cruiser.js` |
| Python | import-linter | `lint-imports` |
| JVM | ArchUnit, as a normal test | `gradle test` |
| Go | depguard, via golangci-lint | `golangci-lint run` |

Templates: `assets/templates/tier-1/dependency-cruiser.js`, `assets/templates/tier-1/import-linter.toml`, `assets/templates/tier-1/ArchUnitExample.java`

Note for import-linter: a `layers` contract lets a higher layer import *any* lower one, so `routes → repos` still passes it — pair it with a `forbidden` contract to close that gap, and set `allow_indirect_imports = true` so the legitimate `route → service → repo` chain doesn't count as a violation.

## Devcontainer

One containerized environment for humans and agents alike — the practical home for the sandbox and several structural controls (no host secrets, egress allowlist, read-only mounts, same toolchain everywhere).

Template: `assets/templates/tier-1/devcontainer.json`

`--dangerously-skip-permissions` inside a non-root container is possible for unattended work, but it does not stop a malicious project from exfiltrating anything reachable inside the container, including stored credentials. Use only on trusted repos, pair with egress limits, and block it fleet-wide via `permissions.disableBypassPermissionsMode` in managed settings if you don't want others reaching for it.
