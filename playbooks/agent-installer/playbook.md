# The Installer Playbook

How to build a multi-platform agent installer with a polished TUI — agnostic, reusable, structurally correct. Read this before writing a single line of installer code.

This playbook is not tied to any fleet, project, or brand. It describes the architecture, principles, and build sequence for shipping an installer that copies your agents/skills into the right directories across multiple AI coding tools (Claude Code, OpenCode, Cursor, Copilot, or anything that follows), with a `@clack/prompts`-style interactive flow.

---

## 0. What this playbook is for

You need a CLI that:

- Asks the user a few questions (which tool? project or global? which modules?)
- Copies your agent definitions into the right place per platform
- Writes a routing file (or injects a block into an existing one) so the host tool knows how to dispatch tasks to your agents
- Optionally installs auxiliary modules (skills, prompts, commands)
- Works interactively (TUI) **and** non-interactively (args, CI)
- Is idempotent — running twice does not duplicate content
- Can be reused across projects by swapping config, not rewriting code

If that is not what you are building, stop. This playbook does not apply.

---

## 1. The one principle that governs everything

> The installer engine must not contain any string that names your project.

No project name in the source. No routing content as a string literal. No hardcoded agent filenames. No branded intro title. Everything project-specific is data: a config object, a templates directory, a targets table.

If your installer code contains the name of your project, it is not agnostic. It is a project-specific script wearing a reusable costume. Extract until the code is silent about who it serves.

This principle produces every downstream decision in this playbook.

---

## 2. Layer separation — the only architecture that survives

```
┌────────────────────────────────────────────────────────────┐
│  bin/<cli>.js            CLI arg parsing + command dispatch │  project-specific, thin
├────────────────────────────────────────────────────────────┤
│  lib/installer/          Pure install engine                │  reusable, no project identity
│    ├─ targets.js           destination table + branding      │  data
│    ├─ transforms.js        per-platform content transforms   │  registry, one fn per platform
│    ├─ routing.js           routing block load + write/merge  │
│    ├─ skills.js            auxiliary module metadata + copy │
│    └─ install.js           orchestrator — composes the above│
├────────────────────────────────────────────────────────────┤
│  bin/prompt.js           TUI adapter over @clack/prompts     │  reusable, copy verbatim
├────────────────────────────────────────────────────────────┤
│  templates/              routing blocks, frontmatter stubs   │  content, not code
│    ├─ routing-<platform>.md                                  │
│    └─ copilot-header.md                                      │
└────────────────────────────────────────────────────────────┘
```

The agnostic kernel you can lift into any new project is: `bin/prompt.js` + `lib/installer/*` + `templates/` skeleton. The project supplies its own `targets.js` (its destination dirs and branding), its own `templates/` (its routing content), and its own `bin/<cli>.js` (its command surface).

### Layer responsibilities — non-negotiable

| Layer                | Owns                                            | Must not own                                   |
|----------------------|-------------------------------------------------|------------------------------------------------|
| `bin/<cli>.js`       | arg parsing, dispatch, help text, branding      | install logic, transforms, routing content     |
| `lib/installer/install.js` | orchestration: call targets, transforms, routing in order | platform-specific branches, content literals |
| `lib/installer/targets.js` | destination paths, extensions, per-platform metadata | install flow                                   |
| `lib/installer/transforms.js` | content mutation per platform (frontmatter rewrite, etc.) | CLI, file I/O orchestration                  |
| `lib/installer/routing.js` | load routing block from templates, write/merge idempotently | the routing content itself                  |
| `lib/installer/skills.js` | auxiliary module discovery, metadata parse, copy | the wizard UI (that lives in `bin/<cli>.js` via `prompt.js`) |
| `bin/prompt.js`      | TUI primitives wrapping clack                    | business logic, project identity              |
| `templates/`         | routing block markdown, header stubs             | code                                           |

If a layer starts owning a concern from another layer's column, stop. You are building a god file.

---

## 3. The TUI adapter — copy this verbatim

`bin/prompt.js` wraps `@clack/prompts` into project-neutral primitives. It has zero business logic. Every project that wants a clack-style TUI uses the same file.

Required exports:

| Function | Signature | Purpose |
|----------|-----------|---------|
| `isTTY()` | `→ boolean` | true when stdin is a real terminal (false in CI, pipes) |
| `intro(title)` | `(title: string)` | banner |
| `outro(message)` | `(message: string)` | closing frame |
| `cancel(message?)` | `(message?: string)` | clean exit on Ctrl+C, calls `process.exit(1)` |
| `promptSelect(message, options)` | `→ Promise<string>` | single select, auto-cancels on Ctrl+C |
| `promptMultiSelect(message, groups)` | `→ Promise<string[]>` | grouped multiselect, pre-selects all by default |
| `promptConfirm(message, initial?)` | `→ Promise<boolean>` | yes/no |
| `withSpinner(message, fn)` | `→ Promise<T>` | spinner lifecycle around an async fn |
| `logInfo(message)` | `(message: string)` | info line inside the frame |

Rules for the adapter:

1. **Every prompt calls `cancel()` on `isCancel`.** The caller never handles Ctrl+C. This is the entire point of the wrapper — it makes every prompt safe by construction.
2. **No project strings.** No `intro('my-project installer')` inside `prompt.js`. The title is passed in.
3. **`withSpinner` exposes the spinner instance to `fn`** so the caller can update the message per item (`s.message('✓ thing')`).
4. **`promptMultiSelect` accepts grouped input** (`[{label, items: [{value, label, hint}]}]`) and flattens to clack's `groupMultiselect` shape internally. Pre-selects all items by default — the common case is "install everything," unselecting is the exception.

The file header should say: *"Reusable TUI primitives built on @clack/prompts. Zero project-specific logic. Copy this file into any project."* Then honor it.

### Dependencies

```
"@clack/prompts": "^1.3.0"
"picocolors": "^1.1.1"
```

That is the complete runtime dep list for the installer. Everything else is Node stdlib (`fs`, `path`, `os`, `url`, `child_process`). Do not add more. Every extra dep is a thing that breaks in `npx` cold-start or gets deprecation-flagged.

---

## 4. The targets table — open/closed by construction

`lib/installer/targets.js` exports a single object: the map of platform name → destination spec.

```js
export const TARGETS = {
  claude: {
    dest: '.claude/agents',
    ext: '.md',
    routingFile: 'CLAUDE.md',
    global: {
      dest: join(HOME, '.claude', 'agents'),
      ext: '.md',
      routingFile: null,
    },
  },
  opencode: { /* ... */ },
  cursor:   { /* ... */ },
  copilot:  { /* ... */ },
}

export const SKILL_TARGETS = {
  claude:   { project: '.claude/skills',  global: join(HOME, '.claude', 'skills') },
  opencode: { project: '.opencode/skills', global: join(HOME, '.config', 'opencode', 'skills') },
}

export const BRANDING = {
  name: 'my-fleet',
  introTitle: 'my-fleet — agent installer',
  fleetNoun: 'fleet',     // "Fleet installed" / "3 modules installed"
  routingMarker: 'myf',   // <!-- myf:start --> / <!-- myf:end -->
}
```

Rules:

1. **Adding a platform = adding a row.** No edits to the install flow. No `if (tool === 'newplatform')` branches anywhere else.
2. **`BRANDING` is the only place project identity lives.** Every `console.log`, `intro()`, `outro()` pulls from it. If you grep the `lib/installer/` tree for your project name and find a hit outside `targets.js`, you have a leak.
3. **`routingMarker` is the idempotency key.** Routing blocks are delimited by `<!-- <marker>:start -->` / `<!-- <marker>:end -->`. Install is idempotent because the merge checks for the start marker. Same marker for every platform's routing file — it is your project's signature, not per-platform.

---

## 5. The transforms registry — kill the platform branches

Every platform needs slightly different content: Claude Code wants a `tools:` YAML list, OpenCode wants a `permission:` block derived from those tools, Cursor wants `.mdc` frontmatter, Copilot wants everything flattened into one instructions file.

The wrong way (and the way every ad-hoc installer does it):

```js
// DON'T
if (toolName === 'opencode') content = transformForOpenCode(content)
else if (toolName === 'cursor') content = transformForCursor(content)
// ... grows forever
```

The right way:

```js
// lib/installer/transforms.js
const identity = (content) => content

export const TRANSFORMS = {
  claude:   identity,
  opencode: transformForOpenCode,
  cursor:   identity,
  copilot:  'special',   // copilot is handled by its own installer path, not per-file
}
```

Then in the orchestrator:

```js
const transform = TRANSFORMS[toolName]
const destContent = transform === 'special' ? content : transform(content)
```

Rules:

1. **One transform function per platform.** `identity` is a valid transform — most platforms copy content verbatim.
2. **Transforms are pure functions of content string → content string.** They do not read the filesystem, do not know the destination path, do not log. Testable in isolation with a string fixture.
3. **`'special'` sentinel for platforms that need a different install shape entirely** (Copilot: one aggregated file, not per-agent copies). The orchestrator routes those to a separate code path. This is a one-line branch, not a growing one.
4. **A transform that derives one platform's metadata from another platform's format** (e.g. deriving OpenCode's `permission:` block from Claude Code's `tools:` list) is correct and good — it makes Claude Code's agent files the source of truth and other platforms projections. Document the derivation rule in a comment; it is the kind of thing that looks like magic six months later.

---

## 6. Routing — content lives in `templates/`, not in code

The routing block is the markdown your installer injects into the host tool's config file so the host knows how to dispatch tasks to your agents. It is content. It belongs in a file.

```
templates/
  routing-claude.md      ← the block injected into CLAUDE.md
  routing-opencode.md     ← injected into .opencode/AGENTS.md
  routing-cursor.mdc      ← written to .cursor/rules/<marker>.mdc
  routing-copilot.md      ← the header for .github/copilot-instructions.md
```

`lib/installer/routing.js` does three things and only these three things:

1. **Load** — `readFileSync(join(TEMPLATES_DIR, 'routing-<platform>.md'))`
2. **Write** — if the target file does not exist, create it with the block
3. **Merge** — if it exists, check for `<!-- <marker>:start -->`. If present, skip (idempotent). If absent, append the block.

```js
export function writeRouting(routingFile, marker, blockFile) {
  const block = readFileSync(blockFile, 'utf8')
  if (existsSync(routingFile)) {
    const existing = readFileSync(routingFile, 'utf8')
    if (existing.includes(`<!-- ${marker}:start -->`)) {
      console.log(`  ${marker} block already present in ${routingFile} — skipping`)
      return
    }
    appendFileSync(routingFile, `\n\n${block}\n`)
  } else {
    mkdirSync(dirname(routingFile), { recursive: true })
    writeFileSync(routingFile, `${block}\n`)
  }
}
```

Rules:

1. **Routing content is never a string literal in code.** If you find yourself writing `const ROUTING_BLOCK = \`<!-- ... -->\`` in a `.js` file, you have violated the principle. Move it to `templates/`.
2. **The merge is append-only.** Never edit content outside your marker block. The user's `CLAUDE.md` may contain their own notes — your installer preserves them.
3. **The marker is your idempotency contract.** Test it: install twice, assert exactly one marker block in the output. This is the most common bug in installers that "mostly work."
4. **Global installs of some platforms need to write into a JSON config instead of a markdown file** (OpenCode global: `~/.config/opencode/opencode.json` gets an `instructions: [path]` entry, the routing content itself goes into a rules markdown file). Handle this in `routing.js` as a named function (`writeRoutingGlobalOpenCode`-style), not as a branch in the orchestrator. The JSON mutation must be idempotent on the same marker check.

---

## 7. The orchestrator — compose, do not decide

`lib/installer/install.js` is the one function that knows the order of operations. It does not know what any platform needs — it asks `targets`, `transforms`, `routing`, and `skills`.

```js
export async function install({ toolName, isGlobal, interactive, branding, targets, transforms, templatesDir }) {
  const target = isGlobal ? targets[toolName].global : targets[toolName]
  mkdirSync(target.dest, { recursive: true })

  const sourceFiles = readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'))
  const transform = transforms[toolName]

  for (const file of sourceFiles) {
    const content = readFileSync(join(AGENTS_DIR, file), 'utf8')
    const destName = file.replace('.md', target.ext)
    const destContent = transform === 'special' ? content : transform(content)
    writeFileSync(join(target.dest, destName), destContent)
  }

  if (target.routingFile) {
    writeRouting(target.routingFile, branding.routingMarker, join(templatesDir, `routing-${toolName}.md`))
  }
}
```

That is the entire shape. Skills, parity checks, symlink mirroring, command fallbacks — each is its own step called from the orchestrator, not inlined.

Rules:

1. **The orchestrator takes a config object, not globals.** `{ toolName, isGlobal, interactive, branding, targets, transforms, templatesDir }` passed explicitly. No module-level `isAll`, no shared `HOME` closure, no `__dirname` reaching up into the project. If a value is needed, it is a parameter.
2. **One function per concern.** `installAgents`, `installSkills`, `installCopilot` (for the special-case platform), `writeRouting`. The orchestrator calls them in order. It does not implement them.
3. **The orchestrator returns structured results** (`{ installed, skipped, commandFallbacks }`), not void. The CLI layer decides how to print. The engine does not `console.log` except for per-item progress inside a spinner — and even that should be a callback, not a hardcoded `console.log`.
4. **Special-case platforms get their own entry function, not a branch.** Copilot aggregates all agents into one file — that is a different install shape. Implement `installCopilot({ sourceDir, destFile, headerTemplate })` and call it from the CLI dispatcher when `toolName === 'copilot'`. Do not bend the per-agent loop to handle it.

---

## 8. Skills / auxiliary modules — separate concern, separate module

If your project ships cognitive modules, prompts, or any auxiliary content beyond agents, that is a *different* install surface, not a feature of the agent installer.

`lib/installer/skills.js` owns:

- **Discovery** — scan a source dir for valid module directories (each has a `SKILL.md` entrypoint)
- **Metadata parse** — read frontmatter (`description`, `metadata.type`) for the picker UI
- **Filter** — exclude frozen/deprecated modules
- **Copy** — copy selected module dirs to the destination

It does **not** own:

- The TUI for the picker (that is `bin/<cli>.js` using `prompt.js`)
- The agent install (different module, different source dir, different dest)
- The grouping labels (those are presentation; pass them in or derive from `metadata.type` in the CLI layer)

```js
// lib/installer/skills.js
export function getAllSkills(skillsDir) { /* returns string[] of dir names */ }
export function parseSkillDescription(content) { /* → string */ }
export function parseSkillType(content) { /* → string */ }
export function copySkillFiles(selected, srcDir, destDir, onProgress) { /* */ }
```

The CLI layer builds the grouped options for `promptMultiSelect` from the parsed metadata. The engine returns raw data; the CLI shapes it for display. This is the only way the engine stays reusable — a different project may want different group labels, different pre-selection, no picker at all.

---

## 9. The CLI layer — thin, branded, disposable

`bin/<cli>.js` is the only file that knows the project's command surface. It should be under ~150 lines. If it is longer, you have leaked engine logic up.

Responsibilities:

1. **Parse args** — `[, , cmd, ...rest]`, `--global`/`-g`, `--all`, positional tool arg
2. **Dispatch** — `switch (cmd)` over `install`, `install-skills`, `list`, `help`
3. **Branding** — pull `BRANDING` from `targets.js`, pass to `intro()`/`outro()`
4. **Interactive vs non-interactive** — `isTTY()` decides; `--all` forces non-interactive
5. **Help text** — the only place long prose strings live

```js
import { BRANDING, TARGETS, SKILL_TARGETS } from '../lib/installer/targets.js'
import { TRANSFORMS } from '../lib/installer/transforms.js'
import { install } from '../lib/installer/install.js'
import { installSkills } from '../lib/installer/skills.js'
import { intro, outro, isTTY, promptSelect, promptConfirm, withSpinner } from './prompt.js'

const TEMPLATES_DIR = join(__dirname, '..', 'templates')

switch (cmd) {
  case 'install': {
    const toolName = arg ?? await promptToolInteractive()
    await install({ toolName, isGlobal, interactive: isTTY(), branding: BRANDING, targets: TARGETS, transforms: TRANSFORMS, templatesDir: TEMPLATES_DIR })
    break
  }
  // ...
}
```

Rules:

1. **The CLI imports from `lib/`, never the reverse.** Dependencies point one direction: `bin/ → lib/ → templates/`. A cycle here means the engine knows about the CLI, which means it is not reusable.
2. **`help()` is the only place with long string literals.** Even then, prefer building it from `Object.keys(TARGETS)` so adding a platform updates help automatically.
3. **Detection hints.** The interactive tool picker should show "✓ detected" next to platforms whose signal files exist in cwd (`.claude/`, `.opencode/`, etc.). This is a small UX thing that makes the installer feel intelligent. Implement it in the CLI layer, not the engine — it is presentation.

---

## 10. The four-mode dispatch — every installer needs all four

Every command (`install`, `install-skills`) must work in all four modes:

| Mode | Trigger | Behavior |
|------|---------|----------|
| Interactive + tool arg | `install claude` in a TTY | Run the install for that tool, but still ask scope/skills questions interactively |
| Interactive + no arg | `install` in a TTY | Show tool picker first, then the rest of the wizard |
| Non-interactive + tool arg | `install claude --all` (or piped stdin) | No prompts, install everything for that tool, exit 0 |
| Non-interactive + no arg | `install` in CI | Error with a clear message and an example — do not hang waiting for input |

The fourth mode is the one most installers get wrong. A hanging installer in CI is worse than a crash. Detect `!isTTY()` early and fail fast with a remediation hint:

```
No tool specified. Use --all to run non-interactively, or run in a terminal.
Example: npx <package> install claude --all
```

`--all` semantics: requires a tool argument, skips every prompt, installs every agent and (for tools that support it) every skill. This is the CI path. Test it.

---

## 11. Global vs project scope

Every platform has two install locations:

- **Project** — inside `cwd` (`.claude/agents/`, `.opencode/agents/`, `.cursor/rules/`)
- **Global** — inside `$HOME` (`~/.claude/agents/`, `~/.config/opencode/agents/`, `~/.cursor/rules/`)

The targets table encodes both. The installer picks based on `--global` or an interactive scope prompt.

Rules:

1. **Global is opt-in.** Default to project scope. Installing into `$HOME` without asking is the kind of thing that makes users distrust your installer.
2. **Some platforms have no global location** (Copilot: `.github/copilot-instructions.md` is project-only). Error cleanly: `Global install not supported for <tool> — <reason>.`
3. **Global installs of some platforms benefit from cross-tool mirroring** (e.g. global OpenCode agents symlinked into `~/.claude/agents/` so Claude Code also picks them up). If you do this: use `lstatSync` (not `existsSync`) to detect existing symlinks — `existsSync` returns false for dangling symlinks and you will clobber them. Check the existing link target with `readlinkSync` + `resolve`; only recreate if the target is wrong. Never overwrite a regular file (a non-ndv agent the user placed there).
4. **Parity check on global installs.** After install, count source files vs installed files. Warn on mismatch: `⚠ Parity mismatch: N expected, M found in <dir>`. This catches silent failures (permissions, partial writes, name collisions).

---

## 12. Idempotency — the contract that makes the installer trustworthy

Running the installer twice must produce the same state as running it once. This is not a nice-to-have. Users run installers repeatedly. A non-idempotent installer accumulates duplicate routing blocks, duplicate symlinks, duplicate skill copies.

The idempotency surface:

| Operation | Idempotency mechanism |
|-----------|----------------------|
| Copy agent file | `writeFileSync` overwrites — idempotent by nature |
| Write routing block | Check for `<!-- <marker>:start -->` before append |
| Merge routing into JSON config | Check for marker in `instructions` array before push |
| Create symlink | `lstatSync` → if existing symlink points to right target, skip; if wrong target, unlink + recreate; if regular file, skip (do not clobber) |
| Copy skill dir | `writeFileSync` overwrites the `SKILL.md` — idempotent |
| Append to `instructions` array in opencode.json | Check `arr.some(i => i.includes(marker))` before push |

Test idempotency explicitly: install twice into a temp dir, assert the output dir matches a single install. This is the single highest-value test you can write for an installer.

---

## 13. The test contract — `node:test` in temp dirs

The installer must be testable without touching the user's home directory. Every test:

1. `mkdtempSync(join(tmpdir(), '<prefix>-'))` — fresh isolated dir
2. `spawnSync(process.execPath, [BIN, ...args], { cwd: tempDir })` — run the CLI as a subprocess
3. `assert.equal(result.status, 0)` and check `stderr` for errors
4. `readdirSync`/`readFileSync` the temp dir to verify output
5. `rmSync(tempDir, { recursive: true, force: true })` in `finally`

Minimum test matrix:

| Test | What it asserts |
|------|-----------------|
| Per-platform agent copy | Every source agent file present in dest with correct extension |
| Routing block written | Target routing file contains `marker:start` and `marker:end` |
| Idempotency | Two installs → exactly one marker block in routing file |
| Non-interactive `--all` | Exit 0, all agents installed, no prompts attempted |
| Non-interactive no-arg | Non-zero exit, error message printed, no hang |
| Global install | Files in `$HOME`-relative path (use `HOME` env override in spawn) |
| Unsupported tool arg | Non-zero exit, error message lists available tools |
| Parity check | Installed count matches source count (minus platform skips) |

For global tests, override `HOME` via spawn env so you do not pollute the real home dir:

```js
spawnSync(process.execPath, [BIN, 'install', 'claude', '--global'], {
  cwd: tempDir,
  env: { ...process.env, HOME: tempHomeDir },
  encoding: 'utf8',
})
```

Rules:

1. **The test is the spec.** If a behavior is not tested, it is not a contract. The idempotency test is what makes idempotency real.
2. **No mocks of the filesystem.** Use real temp dirs. Mocks let your installer pass while the real fs calls fail in ways you did not predict.
3. **Run the suite in CI.** `node --test test/install.test.js` in the `pre-commit` or CI step. An installer that is not tested in CI drifts.

---

## 14. Per-platform specifics you will need to handle

These are the concrete details per host tool. They go in `targets.js` (data) and `transforms.js` (functions), never in the orchestrator.

### Claude Code
- Dest: `.claude/agents/` (project) · `~/.claude/agents/` (global)
- Extension: `.md`
- Routing: `CLAUDE.md` (project) · no global routing file (the agents dir is enough)
- Frontmatter: full — `name`, `description`, `tools`, `mode`, `effort`, `model` all valid
- Transform: `identity`
- Skills: `.claude/skills/` (project) · `~/.claude/skills/` (global)

### OpenCode
- Dest: `.opencode/agents/` (project) · `~/.config/opencode/agents/` (global)
- Extension: `.md`
- Routing: `.opencode/AGENTS.md` (project) · `~/.config/opencode/opencode.json` (global — JSON, not markdown)
- Frontmatter: strip `tools:` (Claude-only, causes OpenCode validation error), strip `effort:`, strip `model:` (provider prefix unknown at install time — subagents inherit from invoking primary), strip `name:` (filename is the agent ID). Normalize `mode:` — `all` preserved, `agent` coerced to `subagent`, absent injected as `subagent`. Derive `permission:` block from the stripped tools list:
  - `Write` or `Edit` present → `edit: allow`, else `edit: deny`
  - `Bash` present → `bash: allow`, else `bash: deny`
  - `webfetch` present → `webfetch: allow`
- Global routing: write the routing block to `~/.config/opencode/rules/<marker>.md`, push that file's path into `opencode.json`'s `instructions` array, and add `permission.external_directory['~/.config/opencode/agents/**'] = 'allow'` so global agents can actually read/write. All three mutations must be idempotent.
- Skills: `.opencode/skills/` (project) · `~/.config/opencode/skills/` (global)
- Commands: `.opencode/commands/` (project) · `~/.config/opencode/commands/` (global) — markdown slash command files, copied as-is

### Cursor
- Dest: `.cursor/rules/` (project) · `~/.cursor/rules/` (global)
- Extension: `.mdc`
- Routing: `.cursor/rules/<marker>.mdc` (a dedicated file, not appended to an existing one)
- Frontmatter: Cursor's own format — see Cursor docs. Agents that require tools Cursor does not support (e.g. `Task`) must be skipped, not transformed. Maintain an `UNSUPPORTED_TOOLS` set per platform.
- No skills spec — Cursor does not implement Agent Skills. `SKILL_TARGETS` omits it; `install-skills` errors cleanly.

### Copilot
- Dest: `.github/copilot-instructions.md` (project only — no global location)
- Shape: one aggregated file, not per-agent copies. Strip YAML frontmatter from each agent, concatenate with `# Agent: <name>\n\n<body>` headers, prepend a routing header block.
- Idempotency: the header block carries the marker. On re-install, replace everything between `<!-- <marker>:start -->` and `<!-- <marker>:end -->` plus the aggregated agent sections; preserve any user content outside the block.
- No global, no skills.

---

## 15. The build sequence — in order, no skipping

Each step leaves the system functional. Run the test suite after every step, not just at the end.

### Step 1 — TUI adapter + deps (0.5 day)
Create `bin/prompt.js` with the exports from §3. Add `@clack/prompts` and `picocolors` to `package.json`. Verify: a one-line script calling `intro`/`promptConfirm`/`outro` works in a TTY and fails cleanly in a pipe.

### Step 2 — Targets table + branding (0.5 day)
Create `lib/installer/targets.js` with `TARGETS`, `SKILL_TARGETS`, `BRANDING`. Decide your marker (`routingMarker`). Verify: `grep -r "<your-project-name>" lib/` returns nothing.

### Step 3 — Templates directory (0.5 day)
Create `templates/routing-<platform>.md` for each platform you support. Create `lib/installer/routing.js` with `writeRouting` (load + write + idempotent merge). Verify: write a script that calls `writeRouting` twice into a temp file and assert one marker block.

### Step 4 — Transforms registry (0.5 day)
Create `lib/installer/transforms.js`. Implement `transformForOpenCode` (or whatever your non-identity platforms need). Export `TRANSFORMS` map. Verify: each transform is a pure function tested with a string fixture, no fs.

### Step 5 — Orchestrator (1 day)
Create `lib/installer/install.js` with `install({ toolName, isGlobal, branding, targets, transforms, templatesDir })`. Implement per-agent copy loop, routing call, skills call. Verify: full install into a temp dir produces the expected file tree.

### Step 6 — Skills module (0.5 day)
Create `lib/installer/skills.js` with discovery, metadata parse, copy. Wire into the orchestrator as a separate step. Verify: skills install to the right place, frozen modules excluded.

### Step 7 — CLI layer (0.5 day)
Create `bin/<cli>.js` — arg parsing, dispatch, interactive picker, `help()`, `list()`. Wire to engine. Verify: all four modes work (interactive w/ arg, interactive no arg, `--all` w/ arg, no arg in CI).

### Step 8 — Test suite (1 day)
Create `test/install.test.js` with the minimum matrix from §13. Add to `package.json` `scripts.test`. Run in CI. Verify: `npm test` passes, including the idempotency test.

### Step 9 — Global + special-case platforms (1 day)
Add global install paths, symlink mirroring (with `lstatSync`/`readlinkSync` safety), parity check, Copilot aggregated-file path. Verify: global tests pass with `HOME` override.

**Total: ~5.5 days for a production-quality multi-platform installer.**

Highest-risk step: **Step 5**. The orchestrator is where implicit coupling hides — module-level state, `__dirname` reaching up to find source dirs, `isAll` flags. Pass everything explicitly. If the orchestrator takes a config object and returns a result, you have it right. If it reads globals, you have a god file in waiting.

---

## 16. Smells — stop and refactor when you see these

| Smell | What it means | Fix |
|-------|---------------|-----|
| `if (toolName === 'X')` outside the CLI dispatcher | Open/Closed violation — adding a platform requires editing the branch | Move to `TRANSFORMS` registry or `TARGETS` row |
| `const BLOCK = \`...\`` over 10 lines in a `.js` file | Content in code — violates the principle | Move to `templates/` |
| `console.log('<project-name> ...')` in `lib/` | Project identity in the engine | Pull from `BRANDING` |
| `bin/<cli>.js` over 200 lines | CLI layer doing engine work | Extract the concern to `lib/installer/` |
| Module-level mutable (`let isAll`) | Implicit data flow through globals | Pass as parameter |
| `existsSync` used to check a symlink | Dangling symlinks return false — you will clobber them | Use `lstatSync` + `readlinkSync` |
| Test that mocks the filesystem | Tests pass while real fs calls fail | Use real temp dirs |
| Installer hangs in CI | Non-interactive mode not implemented | `isTTY()` gate + fail-fast error with example |
| Routing block written twice after two runs | Idempotency contract broken | Marker check before append — add a test |

---

## 17. What you ship to other projects

The agnostic kernel, lifted wholesale:

```
bin/prompt.js              ← copy verbatim, change nothing
lib/installer/
  targets.js                ← copy structure, fill in your platforms + branding
  transforms.js             ← copy structure, implement your non-identity transforms
  routing.js                ← copy verbatim (marker + template path are params)
  skills.js                 ← copy verbatim if you ship skills, else omit
  install.js                 ← copy verbatim (takes config object, returns result)
templates/
  routing-<platform>.md     ← write your own routing content per platform
```

The new project's `bin/<cli>.js` is its own ~150-line file — arg surface, command names, help text differ. The engine does not care.

If you find yourself editing `lib/installer/install.js` or `bin/prompt.js` to make the kernel work in a new project, you have found a leak. Report it back to the kernel, fix it once, every downstream project benefits.

---

## 18. The one-sentence summary

The installer is a config-driven engine that copies content and writes routing blocks, knows nothing about your project, and is tested by running itself into temp directories. Everything else is data.
