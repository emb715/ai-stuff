# Tier 0 · Groundwork

Day one. Five pieces that make every later tier cheaper: a lean steering doc, one command that means "green", a commit standard, one hook that proves enforcement works, and a written boundary for what agents may do unattended.

## Steering doc — AGENTS.md / CLAUDE.md

**Rule:** under 200 lines. Every line is paid for on every task, by every agent — a rule that could be a hook, an ADR, or a skill costs context all day to protect one moment.

Audit test for each line: *does this line name an event?*
- Yes → it's a **hook** (Tier 0 · Hooks).
- It's a decision tied to a path → it's an **ADR** (Tier 2).
- It's a how-to → it's a **skill** (Tier 1).
- Otherwise → it stays as steering.

Multi-tool teams: keep real content in `AGENTS.md`. If the tool also reads `CLAUDE.md`, make it one line: `@AGENTS.md`.

Monorepos: keep the root file lean, push package-specific detail into a nested steering file that only loads on a path match (Claude Code: `.claude/rules/*` with a `paths` glob in frontmatter).

Template: `assets/templates/tier-0/AGENTS.md`
Check: `scripts/checks/steering-drift.sh` — fails if over budget or a backticked path is dangling.

## Validation gates — one command called `validate`

Lint, types, tests, and any project-specific check, run in one command with a fixed name every caller uses. `validate` is called from three places with the same script, so local and CI can never quietly disagree:

| Caller | Trigger |
|---|---|
| Agent | Stop hook, before the agent says "done" |
| Developer | pre-push git hook |
| CI | before merge |

**Stop at the first failure.** A long report costs context and invites fixing five things at once. Order gates cheapest first (steering/ADR/lint checks before slow test suites) and print only the first failure's output, capped.

| Tool | Stop-at-first-failure flag |
|---|---|
| Vitest | `--bail 1` |
| pytest | `-x` |
| go test | `-failfast` (new tests don't start; running ones finish) |
| Gradle | `--fail-fast` |
| cargo test | default behavior |
| ESLint / ruff / mypy / tsc | none — cap output length instead |

Templates: `assets/templates/tier-0/package.json`, `assets/templates/tier-0/validate.sh`, `assets/templates/tier-0/lefthook.yml`

## Commit conventions

Conventional Commits, enforced by a `commit-msg` hook (commitlint), identical rules for humans and agents.

| Type | SemVer bump |
|---|---|
| `feat` | minor |
| `fix` | patch |
| `feat!` / `BREAKING CHANGE:` | major |
| `chore` · `docs` · `refactor` · `test` | none per spec — this guide's release-drafter config ships them as patch under Maintenance; change that if you want silent commits |

Reject: `updated stuff`, `fix bug`, `WIP`, `feat: changes per JIRA-4821` (ticket refs belong in the PR, not the commit).
Accept: `fix(cart): stop double-charging on retry`.

Templates: `assets/templates/tier-0/commitlint.config.mjs`, `assets/templates/tier-0/release-drafter.yml`, `assets/templates/tier-0/release-drafter-workflow.yml`
Check: `scripts/checks/no-ticket-refs.sh <base-ref>` — fails a diff that introduces a ticket ID.

## Hooks, not rules

If a rule names an **event**, enforce it with a hook (or a declarative permission rule), not a sentence in AGENTS.md. LLMs are not deterministic — a rule left as prose eventually gets skipped. The exit code is the whole API: `0` allow, `2` block (stderr goes back to the agent), anything else is a non-blocking error.

| Steering line | Type | Because |
|---|---|---|
| "Route calls service, service calls repo" | lint gate | import rule, not judgment — delete the line, add a boundary linter |
| "After implementing, run the tests" | Stop hook | names an event: the agent finishing |
| "Migrations must be reversible" | rule (stays prose) | needs judgment; back with a CI check if you can |
| "Never read the env file" | deny rule + hook | deny rule covers file tools + recognized Bash; hook catches `source .env` style readers |
| "Never force-push or `rm -rf`" | PreToolUse hook | best-effort only — branch protection is the real control |
| "Format files after editing" | PostToolUse hook | runs after the tool; can fix, can't undo |
| "Load the ADR index at start" | SessionStart hook | names an event: session begins |

**Hooks are the fast-feedback layer, not the enforcement layer.** They live in files an agent with write access can edit. Put real enforcement below the agent (Permissions, below). Hooks are agent-tool-specific; the portable equivalents:

| Agent hook | Portable equivalent |
|---|---|
| PreToolUse (block) | Sandbox, egress allowlist, read-only mounts |
| PreToolUse (git) | Git hooks, branch protection, pre-receive rules |
| PostToolUse (log) | CI logs, audit log on the agent's token |
| SessionStart | Steering doc + ADR index, by convention |
| Stop | Required status checks, merge queue |
| UserPromptSubmit | None — validate at the issue instead |

A hook that times out doesn't block — the call goes ahead. A slow hook is not a gate.

Templates: `assets/templates/tier-0/settings.json`, `assets/templates/tier-0/block-env.sh`, `assets/templates/tier-0/stop-validate.sh`

## Permissions & blast radius

The question this pillar answers: *what can an agent do at 3am with nobody watching, and what is the worst outcome if it is wrong?* Write the answer as three tiers, then enforce it at a layer the agent cannot talk its way past.

| Tier | Meaning | Examples |
|---|---|---|
| Autonomous | Reversible, no external side effects | Read source/docs/tests. Run the gate. Write to a feature branch. Open a PR. Comment on issues. |
| Ask first | Agent proposes, human approves | New dependencies. CI config. Migrations. Auth/session/crypto code. Deploy/infra config. **The gate definitions themselves.** |
| Never | Needs a human's hands | Force-push protected branches. Delete branches/tags. Publish releases. Migrate anything but a local DB. Touch production credentials or customer data. |

**Why gate definitions are "ask first":** an agent that can edit the thing blocking it will eventually edit the thing blocking it. CODEOWNERS assigns gate paths to a human team that does not include the agent's identity.

Four enforcement layers, weakest to strongest — a rule only counts if something in the bottom three also enforces it:

| Layer | Example | Can the agent get around it? |
|---|---|---|
| Prose | A rule in AGENTS.md | Yes — can skip or misjudge it |
| Permission rules + hooks | `permissions.deny`, a PreToolUse hook | Partly — deny rules cover built-in tools and recognized Bash forms, not a script that opens the file itself |
| OS sandbox | `sandbox` in settings | No, for Bash and children, once unsandboxed fallback is off |
| Managed settings | `managed-settings.json` | No — highest precedence, can't be loosened |
| Outside the agent | Branch protection, CODEOWNERS, agent identity, egress policy | No — the agent doesn't hold the keys |

Structural controls (none of these are repo-checkable — confirm by hand):
- **Agent identity** — commits under its own scoped-token account, not a person's. Gives an audit trail and lets you revoke it alone.
- **Egress allowlist** — default-deny outbound. An agent with open network + repo read is an exfiltration path.
- **No plaintext secrets on disk** — short-lived injected credentials or a secrets broker.
- **Read-only mounts** — mount anything the agent shouldn't write read-only, instead of maintaining a forbidden-paths list.

Sourced from OWASP LLM06:2025 Excessive Agency (minimum-necessary permissions, human-in-the-loop for high-impact actions, authorization enforced downstream — not by the LLM deciding) and NIST least-privilege. The tier *shape* is sourced; the *contents* of each tier (which paths land where) is this guide's own proposal — yours will differ.

Templates: `assets/templates/tier-0/PERMISSIONS.md`, `assets/templates/tier-0/settings-permissions.json`, `assets/templates/tier-0/managed-settings.json`
Checks: `scripts/checks/permissions-drift.sh` (the policy doc must match `.claude/settings.json`), `scripts/checks/check-codeowners.sh` (the agent identity must not own its own gates)

**A green report is not "safe".** A repo check can't see branch protection, token scope, network policy, or secrets on disk. List those in PERMISSIONS.md, confirm by hand, and don't treat an automated pass as covering more than it verified.
