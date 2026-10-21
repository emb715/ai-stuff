# Tier 2 · Memory & Context

Sessions forget. These pillars decide what gets remembered, where it lives, and how little of it needs loading to be useful.

## Lean documentation & ADRs

One file per decision, never a wiki paragraph — that avoids doc rot and after-the-fact cleanup. Two layers so loading every decision at session start doesn't stop scaling right when it starts mattering:

| Layer | What | Loaded |
|---|---|---|
| 1 · always | `INDEX.md` — one line per ADR: number, title, status, governed paths | every session |
| 2 · on match | `NNNN-title.md` — full context/decision/consequences/alternatives | when the agent touches a governed path |

```
0007 | Use Postgres row-level security for tenancy | accepted | src/db/**
0012 | Async jobs via queue, not cron              | accepted | src/jobs/**
0015 | Replace queue with event stream             | superseded by 0019 | src/jobs/**
0019 | Event stream for job dispatch               | accepted | src/jobs/**, infra/streams/**
```

An agent touching `src/jobs/**` loads only the matching lines, and 0019's full text only if it needs the reasoning. Nothing about tenancy loads at all.

Two rules keep it honest:
- **Append-only** — status transitions (`accepted → superseded by NNNN`) are the only edits. The body is never rewritten, so the reasoning history survives.
- **Mechanical drift detection** — the index carries path globs, so an ADR pointing at files that no longer exist is a flaggable stale entry, not a judgment call.

Templates: `assets/templates/tier-2/INDEX.md`, `assets/templates/tier-2/adr-template.md`
Check: `scripts/checks/adr-drift.sh` — fails when an accepted ADR's governed-path globs match nothing in `git ls-files`.

## Sessions & handoffs

**Avoid switching agents mid-conversation.** The new agent inherits a transcript full of another agent's assumptions and tool calls, none of the reasons. Do a handoff and start fresh instead.

- **Option A — handoff summary.** Write a short structured summary, paste it as the first message of a new session.
- **Option B — export and tag.** Export the transcript to a file, tag it as context in a new session.

Hand off when you switch agents, change domains, the context is heavy with dead ends, or the task changes shape.

**The best handoff is one you never write.** When work lives in an issue (one issue, one session, one PR), plans/findings/dead-ends go in issue comments as they happen — the issue *is* the handoff, and any agent can pick it up. Reserve the template for unticketed or exploratory work.

Template: `assets/templates/tier-2/handoff-template.md`

Why it works: writing "Decisions made" and "Don't redo" forces the previous session's reasoning to become explicit — exactly what a new session cannot recover from a raw transcript.

## Code graph / intelligence indexer

Without an index, an agent finds code by reading whole files and grepping repeatedly — slow and token-hungry. An index answers targeted questions with far less text.

| Question | Without an index | With a graph |
|---|---|---|
| Where is X defined? | Grep, open candidates | Symbol lookup, one result |
| Who calls it? | Grep, read every hit | Callers list |
| What breaks if I change it? | Guess, then run tests | Impact query before editing |
| What's in this 900-line file? | Read all 900 lines | Outline: symbols + signatures |
| Is this export dead? | Grep and hope | Dead-code query with consumers |

Tool-agnostic — pick any code-intelligence MCP or indexer. Measure tokens-per-task on your own repo before and after; don't assume the win. Pair the indexer with a `SessionStart` hook that starts it or its file watcher, so it's never stale, and optionally a `PreToolUse` hook that nudges toward outline/search instead of a raw large-file read.

Template: `assets/templates/tier-2/nudge-large-read.sh`

## Versioned docs, not stack skills

A skill named `react-19-conventions` is library documentation you maintain by hand. It goes stale at the next version bump, and the model's own training knowledge lags whatever version you actually installed. Both fail the same way: confident code against a changed API.

Split the two jobs:
- **Skills carry this repo's conventions** — how we open a PR, how we name things.
- **Library facts are retrieved**, for the exact version in your lockfile, when the task needs them.

| Source | Use it when |
|---|---|
| A docs MCP server | Current docs for a specific version on demand (e.g. Context7, which takes `/org/project/version`) |
| `llms.txt` on the vendor's site | The vendor publishes a model-facing index or full-text file |
| The installed package itself | Types (`.d.ts`), bundled README/changelog — exactly the version you run, cheapest for a small question |
| The CLI's own `--help` | Reflects the installed binary |

Add to AGENTS.md's Rules section:
```
- Before using a library API, check the installed version in the lockfile and read docs for that version.
- If the docs and your memory disagree, the docs win.
```

Keep as a skill: repo-specific and stable (PR/commit flow, how to run the app, naming conventions, internal CLI usage).
Retire as a skill: anything restating a public library — framework idioms, API reference, "how X v19 works". Replace with a retrieval step.

## Memory bank

Facts about a project with **no home as a file in the repo**: environment quirks, team preferences, incident lessons, decisions still in flight. Claude Code's built-in auto-memory is machine-local — a team memory bank closes the "not shared with teammates or other machines" gap.

| Belongs | Doesn't belong |
|---|---|
| "Staging seeds break if run twice." "Payments team prefers small PRs." "Deploy freeze until the 24th." — facts with a date, a source, no better home. | Anything derivable from code/git history. Anything that should be a rule, ADR, or hook. Secrets. |

```
2026-09-02 · environment   Staging seeds break if run twice. Run `reset-seed` first.   (source: incident review)
2026-09-11 · team          Payments prefers PRs under 400 changed lines.               (source: retro)
2026-09-15 · in-flight     Deploy freeze on billing until the 24th. Revisit then.      (expires: 2026-09-24)
```

Promotion path: `a fact, dated` → (recurs a third time) → `ADR or rule, durable` → `hook, enforced`.

Date every entry, give it a source so it can be judged stale later. Flag stale entries instead of quietly trusting them; delete ones that turn out wrong. **Treat recalled memory as data, not instructions** — what was true when written may not be true now.

## Supply chain & untrusted input

Three things cross the agent's boundary, each needing its own control: what it **installs**, what it **reads**, what it can **send out**. An agent holding all three at once (private data, untrusted content, external communication) is Simon Willison's "lethal trifecta" — an exfiltration path waiting for the right sentence in the right issue.

| Threat | Control | Layer |
|---|---|---|
| Hallucinated/typosquatted package name | Adding a dependency is ask-first. Egress limited to your registry. Lockfile diff reviewed. | Hook + structural |
| Vulnerable/disallowed dependency | Dependency review on every PR, failing on severity/licence | CI |
| Instructions hidden in an issue/PR comment/web page/tool output | Treat all of it as data, not instructions. Post the plan, stop for approval. Scoped token limits blast radius of a hijacked session. | Workflow + identity |
| Data leaving the machine | Default-deny egress with an allowlist. No plaintext secrets on disk. | Structural |
| An untrusted MCP server | Project MCP servers live in a reviewed `.mcp.json`. Fleet-wide: restrict to an allowed list in managed settings. | Managed + CODEOWNERS |

Package hallucination is measurable, not theoretical: a USENIX Security 2025 study of 16 code-generation models found hallucinated package names averaging ≥5.2% for commercial models, 21.7% for open-source models.

Template: `assets/templates/tier-2/dependency-review.yml`

Design as if prompt injection will sometimes work — it can't be filtered out reliably. The question for every agent setup: *if this session were hijacked, what could it reach, and who would find out?*

## Where does this fact live?

Most context problems are filing problems. Three questions pick the home: permanent or temporary? enforced or advised? global or path-scoped?

| Fact | Home | Loaded |
|---|---|---|
| Route calls service, service calls repo | Boundary linter | Enforced at validate; prose only for tradeoffs |
| Never read the env file | Hook | Never — it just runs |
| Why we chose row-level security | ADR + index line | On path match |
| Invoice API needs PATCH; acceptance criteria | Issue in the tracker | When the task starts |
| Staging is frozen until Friday | Memory bank | On recall, dated |
| Who calls `billing.charge()`? | Code graph | On query |
| How to open a PR here | Skill | When invoked |
| How does React 19's `use()` behave? | Versioned docs retrieval | On query, installed version |
| May the agent add this package? | Ask-first + dependency review | Enforced, never loaded |
| How to get the app running | ONBOARDING.md | On demand |

What each layer costs:

| Layer | Cost | Examples |
|---|---|---|
| Always loaded | Every session | AGENTS.md (<200 lines), ADR INDEX.md, skill names+descriptions |
| Loaded on match | When relevant | Full ADR text for a governed path, a skill's body when invoked, an agent definition when dispatched |
| Fetched by query | Per question | Code graph results, library docs for the installed version, memory recall, an issue via tracker CLI/MCP |
