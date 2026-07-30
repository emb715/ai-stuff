---
title: "change-impact-diagram"
status: validated
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "mermaid/github-render"
  - "gh-cli"
tags:
  - skill
  - impact-analysis
  - mermaid
  - diagrams
  - primitives
owner: "@emb715"
---

# Purpose

Diagrams how a code change impacts the system and its primitives. Produces four diagram types — system map, decision graph, state map, endpoint interaction — grounded in the diff or the plan. Markdown-rendered (mermaid + tables), no external service. Targets three output destinations by mode: PR description (recap), repo markdown plan/spec (plan), chat message (chat).

# When to use

- A non-trivial change is being planned and you need to diagram its intended impact before implementing (plan mode).
- A PR is being created or meaningfully updated and you need a visual recap of what the diff actually touches (recap mode).
- Mid-session, someone asks how a change affects the system, an endpoint, or a state flow, and you need a quick inline diagram (chat mode).

Not for: single-file edits with no system impact, repos with no identifiable primitives (the map phase has nothing to classify against), or non-code changes (docs-only, config-only).

# Inputs

- For recap mode: PR number, base branch, and `gh` CLI authenticated.
- For plan mode: the plan/spec file path to write the section into.
- For chat mode: the code or change description the question scopes to.
- For all modes: a primitives source — `primitives.yaml` if present, else `prompts/repo-primitive-audit/prompt.md` run in full (map + breakdown + review) with `{{REVIEW_PLAYBOOK}}` set to the repo's adversarial-code-review or a map-vs-source consistency check.

# Skill

Use [`SKILL.md`](SKILL.md) — identity, three modes, four diagram specs, block format, workflow, footgun, routing to repo-primitive-audit.

# Evidence

## Run 1 — chat mode (2026-07-30)

**Change:** refactor removing a primitive (prepaid balance) and introducing a replacement (budget gate). 24 files, -816 / +569 lines. Touches API route, infra config, DB schema, UI, tRPC router, scripts.

**Map source:** improvised from diff + architecture docs (no `primitives.yaml`, no full repo-primitive-audit). Classification confidence: medium. A verified map would have surfaced a deleted script the improvised map missed.

**Diagrams produced:** all four. Each had grounded edges — no omissions needed.
- System map: 7 primitives (1 added, 1 removed, 2 extended, 2 touched, 1 untouched). Exposed the need for a `removed` classDef (added to SKILL.md after this run).
- Decision graph: highest-value output. Captured a 3-way error collapse (3 status codes → 1) and a flag-trap (two opposite-polarity flags controlling one gate). Unreadable from the diff stat alone.
- State map: showed the deleted reservation lifecycle (reserved → finalized → released, with the stuck-reserved failure mode) vs the new stateless gate.
- Endpoint interaction: showed the read-only gate (no mutation) vs the old reserve-then-finalize flow, and the post-stream usage logging that creates the concurrency-overshoot trade.

**What the test exposed (fixed in SKILL.md):**
1. Four-class `classDef` scheme cannot represent a removed primitive. Added a fifth class (`removed`, dark red, dashed border).
2. No edge-style convention for mixing old and new paths. Added solid `-->` for current/new, dotted `-.->` for deleted paths.
3. Chat-mode classification with an improvised map is medium confidence. Added a confidence-by-mode table to SKILL.md so the output states its confidence level.
4. The drift-check protocol for `primitives.yaml` (validate-don't-trust: path + mtime + structure checks) was designed and added to SKILL.md to solve the cache-rot problem.

## Run 2 — recap mode, dry run (2026-07-30)

**Change:** feature PR adding server-side search to a chat history panel — new tRPC procedure, DB indexes (first indexes on the table), visibility-scoped client resolution, cursor pagination, three-way query merge. 27 files, +3548 / -175.

**Map source:** improvised from PR diff + PR description (no `primitives.yaml`). Classification confidence: medium. Block produced as a marker-delimited file; the upsert script's marker validation and splice logic were verified against the real PR body (fetched via `gh`) without writing back to the PR.

**Diagrams produced:** all four.
- System map: 12 nodes showing search flow from UI → hook → tRPC → query layer → DB + visibility scope, with index dependencies.
- Decision graph: captured the three-way search branching with two gating rules (trigram-run check skips one arm, LIKE-metacharacter check skips another). This is the diagram the PR description prose can't convey quickly.
- State map: `getAllChats` shifting from unbounded `findMany` to cursor pagination — old and new lifecycles side by side.
- Endpoint interaction: full sequence from user typing → debounced hook → tRPC → visibility scope → three query arms → merge → response with client badges.

**What the test exposed:**
- The upsert script's splice logic works against a real PR body (would append on first run, not replace). Markers validated. No real PR was modified.
- "Plan vs actual" section is empty when no prior plan block existed — the skill handles this (says "recap-only"), but it reveals plan-recap coupling: if plan blocks aren't written, this section is dead.
- Decision graph syntax for "one check gates one arm of a parallel flow" is awkward in mermaid — works best for strictly sequential decisions.

## Run 3 — plan mode + plan-vs-actual (2026-07-30)

**Change:** produced a plan-mode block from an issue (feature: add search bar to chat history), then compared against the recap block from Run 2 (the PR that closed the issue). The drift between issue and PR is significant: the issue reads as a UI feature; the PR shipped search infrastructure.

**Map source:** improvised from issue text + session context. Classification confidence: medium.

**Plan-mode block produced:** 3 diagrams (system map, decision graph, endpoint interaction). State map omitted — no grounded state transitions from the issue. The decision graph correctly predicted the implementation fork: "Where to filter?" (client vs server), "Index available?" (seq scan vs migration).

**Plan vs actual drift:**
- Classification elevated from `composes` (low-medium, plan) to `adds` (high, actual) — the implementer chose server-side + indexed, which the issue didn't frame.
- 5 of 8 requirements shipped as planned; 7 items drifted (new DB indexes, visibility-scope dependency, three-way search, pagination rewrite, threshold shift, snippet strategy, single-page-by-contract design).
- The plan-mode decision graph predicted the fork; the PR resolved it. The plan-vs-actual table made the discoveries visible as a structured list.

**What the test exposed (fixed in SKILL.md):**
1. Plan-mode classification stated a single value (`composes`, low) when the decision graph showed branches with different risk levels. Fixed: plan-mode classification must state a risk range tied to the decision graph branches, not a single value.
2. Plan mode with an improvised map is riskier than chat mode with one — plan mode is where you decide *whether* to do something, and an unverified map can be wrong by a full risk level. Fixed: confidence table now splits plan and chat modes; plan with improvised map = medium + risk range warning.

## Run 4 — recap mode, real PR upsert (2026-07-30)

**Change:** same PR as Run 2 (feature adding server-side search, 27 files, +3548 / -175). This run upserted the block into the real PR description via `gh pr edit`, then verified and removed it.

**Steps verified:**
1. First upsert → `added change-impact block to PR #N` — block appended to PR body.
2. Marker verification via `gh pr view` → both `<!-- change-impact:start -->` and `<!-- change-impact:end -->` present.
3. Content verification via API → all four mermaid blocks + plan-vs-actual present.
4. Re-upsert (idempotency) → `updated change-impact block on PR #N` — splice replaced between markers, no duplication (exactly 1 start marker after re-run).
5. Body line count stable at 229 after upsert (matches dry-run simulation), confirming the splice never touches text outside the markers.
6. Cleanup → block removed, body restored to original line count, 0 `change-impact` references.

**What was verified:**
- The upsert script works against a real PR via `gh` CLI authenticated.
- First-run append works (no existing block → appends).
- Re-run replace works (existing block → splices between markers, no duplication).
- The splice never touches text outside the markers (original body restored cleanly).
- Block format is correct (markers, `<details>`, fenced mermaid blocks).

**What was not verified:**
- Visual rendering on GitHub's UI. The block was upserted and removed in the same session; no browser-based visual check was performed. The `<details>` + mermaid rendering on GitHub's UI remains unconfirmed and is the one open boundary before promotion.

**What this run prompted (fixed in SKILL.md):**
- The block format was updated to include a `### Change impact` heading + shields badges line above the `<details>`, so the block is titled and risk-badged without requiring the reviewer to expand the collapsible. The badges sit on their own line between the heading and the `<details>`, separated by blank lines.

**Status of modes:** chat ✅, recap ✅ (dry run + real upsert), plan ✅. All three modes tested.

# Failure Modes / Boundaries

- **Unverified primitives map.** Classification against a map that hasn't passed the review phase of repo-primitive-audit is a hypothesis, not a fact. The footgun in SKILL.md is explicit: ungrounded edges trace back to an unverified map. If neither `primitives.yaml` nor a review-verified map is available, classification is blocked — produce only the diagrams that don't require it.
- **Speculative edges.** The highest-risk failure: inventing decision graph branches that aren't in the diff or plan. Every edge must trace to a code path or a stated plan decision. The skill instructs omission over fiction.
- **Mermaid rendering inside `<details>`.** Missing blank lines around fenced blocks inside `<details>` silently break GitHub rendering. The block format enforces blank lines; a future ingestion parser depends on them too. Run 4 verified markers and splice logic against a real PR via `gh`, but no browser-based visual check was performed — `<details>` + mermaid rendering on GitHub's UI is the one open boundary before promotion.
- **Chat mode over-production.** Producing all four diagrams when the question calls for one. Chat mode is scoped to the question — match the diagram to the question, not the full block. Run 1 produced all four, but the question was broad. A narrow question should produce only the system map. The endpoint interaction diagram is the densest and slowest to produce — for quick chat questions omit it unless the question is explicitly about flows.
- **Plan-mode single-value classification.** A plan-mode block that states a single classification when the decision graph shows branches with different risk levels hides the high-risk path. Fixed in SKILL.md: plan-mode must state a risk range. Run 3 exposed this — the plan said `composes` (low) when the actual was `adds` (high) because the implementer took the server-side branch.
- **Plan-mode improvised map is riskier than chat-mode.** Plan mode is where you decide *whether* to do something; an unverified map there can be wrong by a full risk level. Fixed: confidence table splits plan and chat; plan with improvised map = medium + risk range warning.
- **Decision graph awkward on parallel-arm gating.** Mermaid `flowchart` works best for strictly sequential decisions. When one check gates one arm of a parallel flow (not the whole flow), the diagram syntax is awkward — the gating condition and the parallel arms don't compose cleanly. Run 2 exposed this. Workaround: show the gating as a separate decision node that connects to the arm it controls, not to the entry point.
- **Large repos, large maps.** On very large repos the primitives map can exceed the agent's output budget. Scope to the sections the change touches, or accept a high-level map with drill-downs.
- **Recap mode requires `gh` CLI.** The upsert script depends on `gh pr view` and `gh pr edit`. If `gh` is not authenticated or the PR is local-only, the manual `gh` sequence documented in SKILL.md is the fallback.
- **plan vs recap drift is not automatic.** The "Plan vs actual" section only appears when a plan-mode block existed. If the plan block was lost or never written, there is nothing to compare against — recap stands alone. Run 2 produced an empty plan-vs-actual for this reason; Run 3 proved the section is valuable when both blocks exist.
- **Drift-check false positives.** The path/mtime/structure checks are cheap but heuristic. A file rename or a refactor that moves code without changing the primitive's behavior would trip the mtime/structure check and force a full repo-primitive-audit run. Tuning the sensitivity is an open problem.

# Related artifacts

- [`prompts/repo-primitive-audit/`](../../prompts/repo-primitive-audit/) — the primitives map source. Run in full (map + breakdown + review) when no `primitives.yaml` exists or when a cached map is stale. The review phase validates the map.
- `primitives.yaml` (target repo, if present) — the cached primitives map. Treated as a verified cache, not static documentation; the drift check (path + mtime + structure) gates its use before each classification.
- [`docs/references/change-impact-checklist.md`](../../docs/references/change-impact-checklist.md) — a pre-change decision framework: trigger analysis, path-forward selection, approval gating. Use the checklist when the question is *whether* to make a change (trigger-driven); use this skill when the change is underway and the question is *what it touches* (diff-driven). The checklist's section 3 (artifact impact) is the prose version of this skill's system map.
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows.
- Provenance: [kcd-skills/visual-recap](https://github.com/kentcdodds/kcd-skills/tree/main/skills/visual-recap) — generalized. visual-recap produces one diagram type (system map) for one destination (PR description); this skill adds decision graph, state map, and endpoint interaction, plus plan and chat modes, the `removed` classDef, edge-style conventions, and the drift-check protocol for cached primitives maps.