---
title: "artifact-router"
status: validated
confidence: medium
last_tested: 2026-10-31
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - skill
  - routing
  - meta
  - discovery
  - playbooks
owner: "@emb715"
---

# Purpose

Routes the current task to the right playbook or prompt in the ai-stuff vault. On user confirmation, reads and surfaces that artifact's consumable file — `playbook.md` as the active procedure, `prompt.md` as text to paste. Scope is the 15 active playbooks and 5 prompts in its manifests; it does not route to skills, agents, tools, or anything in `experiments/`.

# When to use

- A task is described that maps to a playbook's domain, but no playbook is named.
- User asks "which playbook should I use" / "how do I do X in this repo".
- User is about to start multi-step work and the right playbook is non-obvious.

Not for:
- Tasks where the user already named a playbook — let them proceed.
- Tasks no playbook covers — say so and stop. Do not improvise.
- Routing to non-playbook artifacts (prompts, skills, agents, tools) — out of scope.
- Routing to anything under `experiments/`, whatever shape it has. Only `playbooks/` is routable; the manifest is the complete routable set.
- Operating the vault itself (lifecycle, lint, audit) — those are `_meta/commands/` and `_meta/framebook/`.

# Inputs

None. The skill reads the task description from the current session and matches against the embedded manifest.

# Skill

Use [`SKILL.md`](SKILL.md) — routing procedure, intent categories, an Entry/Exit-indexed manifest, the fit-first priority rule, the chain rule and chain table, the disambiguation footgun including direction-of-flow, the known-coverage-gaps decline list, and routing examples.

Evaluation records live in [`evals/`](evals/) and are working files, not vault records; this README's Evidence section is the vault record.

# Evidence

Round 1, 2026-10-21. Plan pre-registered and committed (`c93d472`) before the candidate was written; full records in [`evals/`](evals/) — `plan.md`, `evals.json`, `trigger-evals.json`, `comparison.json`, `results.md`.

**Setup.** 23 live OpenCode sessions, one independent session per cell, executor = `general` subagent at the harness default model. The skill was discovered through the project-level symlink `.opencode/skills/ai-stuff-artifact-router` and was never named in a prompt. Three conditions: `baseline` (symlink moved aside), `old` (frozen pre-revision snapshot `0463a757…`, 4 cases), `candidate` (revision `95fa5a46…`, frozen before its first run, all cases). Every prompt carried an identical read-only constraint.

**Current figures, measured against the shipped file (revision 5, `3ca6d81a`) on 2026-10-27.** 17 cases, ground truth quoted from each artifact's own README and pre-registered before any run.

| Measure | baseline | **shipped** |
|---|---|---|
| Routing cases fully correct | 3 / 11 | **14 / 17** |
| Routing assertions passed | 15 / 23 | **30 / 35** |
| Discovery probes | — | **8 / 8** |
| False activations | — | **0**, across 16 negative-probe runs |

Case counts are not directly comparable across revisions — the baseline predates five prompt cases and the R3 → R3a correction. What is comparable: on identical prompts, the baseline never found `adversarial-code-review`, `issue-to-pr`, `agent-installer`, `implementation-orchestration` or the `decision-making` → `product-brief` sequence, and the shipped file finds all of them.

**The two cells that blocked a reliability claim are now 5/5 each.** R5 went from 2 of 4 across earlier revisions to 5 of 5; T4 from 1 of 3 to 5 of 5. That also killed the plausible hypothesis that a long multi-situation description dilutes matching — adding five prompts and more situations improved both. Activation appears to strengthen when a situation gains *more* anchors, not fewer. Two cells at 5/5 is still two cells; the other fifteen are n=1 on this revision.

**Three cases short of clean.** R4 avoids the wrong route but still does not say "nothing covers this". P4 (one session's dead ends → `knowledge-extraction`) and P5 (repo doc-vs-source drift → `repo-primitive-audit`) fail by non-activation. Two of the three prompt failures recorded across rounds 4–5 are attributable to ambient non-vault instructions describing a competing workflow for the same task shape — P1 failed that way in round 4 and passed on the identical file in round 5, which confirms the confound over a routing defect. P4 has no such excuse and is the one genuine open defect.

**Every case the skill demonstrably engaged on was routed correctly, across all five rounds and 60-plus routing runs.** The routing rules work; being reached is the remaining problem, and it is now much less of one.

**Discovery — 8 probes, 7 correct.** Zero false activations, including on the two most expensive non-activation conditions: a playbook the user already named, and a vault lifecycle operation. One positive miss (T4): a task describing `retrospective`'s situation without using the word "retro" went to the framebook instead.

**Three candidate failures, all of them activation failures rather than reasoning failures.** R2 (`readiness-cycle` never found), R3 (activation lost to `skills/issues-to-roadmap`), R4.2 (the "no playbook covers this" decline never issued). In every case where the router demonstrably engaged, the route was correct. The routing rules are in better shape than the activation is, and more manifest work will not fix R2 or R3.

**The playbooks-only boundary cost less than predicted, for a reason outside the skill.** On the notes→issues coverage gap (R4), all three conditions avoided the predicted misroute into `issue-to-ready-specs` — because the router never activated and `skills/issues-to-roadmap` self-activated and handled the task correctly every time. The decline behaviour added in this revision is therefore **untested text**.

**Manifest accuracy, checked rather than assumed.** 14 of 14 manifest rows matched reality on 2026-10-21: no playbook added, renamed, or status-changed since 2026-08-04. The four artifacts the vault gained in that window were all skills, outside this manifest's scope. The hand-maintained manifest has consequently never faced a drift event — see `humans.md` for what that does and does not say about the design.

**The `experiments/` boundary (R12, 2026-10-23).** On owner instruction, `experiments/` is an explicit hard boundary alongside playbooks-only, and filesystem verification may only confirm or drop a manifest row, never add one. Given a prompt paraphrasing `experiments/arch-design-pipeline/`'s own purpose, the session declined the experiment by name-shape — "not routable — untested, unsanitized, outside `playbooks/`" — and answered with a valid `product-brief` → `quick-spec` sequence.

**Round 9, 2026-10-31 — activation fix for Claude Code.** `AGENTS.md` session start now routes work requests through the router, and the description names a resolved incident. 11 runs: loading on the target cells rose from 1 in 5 to 4 in 8, R1 recovered 2/2, every loaded run routed correctly, and no false activations. The remaining misses name the router as a first step and stop. Details in `evals/results.md`, Round 9.

**Round 8, 2026-10-31 — request-triage retired.** 5 runs. The router's own spec-or-plan rule worked when it loaded (R8b run 1); readiness regressions held; no run routed to the deprecated playbook. Two activation misses (R8b run 2, R19) repeat round 7's pattern. Details in `evals/results.md`, Round 8.

**Round 7, 2026-10-31 — the QA-line routes, first run in Claude Code.** 19 headless runs on `main` at `f25c4ef`, criteria pre-registered. `acceptance-verification` 2/2, `incident-response` 2/2, `review-release-candidate` against `acceptance-verification` held, `test-authoring` territory left alone. Two misses, both activation: R17 (resolved outage to retrospective) and the R1 regression (diff review), which passed in every OpenCode round. Does not combine with OpenCode rounds for variance. Details in `evals/results.md`, Round 7.

**Round 4, 2026-10-27 — prompts in scope, collision fixed upstream (shipped revision 5, `3ca6d81a`).** Six-run verification batch on two owner decisions; does not supersede round 3's figures. Scope widened to 5 of 6 prompts (`ai-stuff-command-installer` excluded as vault tooling, not work). `skills/issues-to-roadmap/` narrowed to the execution-setup moment.

The headline: **a one-sentence change to each of two descriptions converted a 0/3 case into a pass without touching the router's logic.** R3's ambiguous phrasing — "break down issue #214 into work items with acceptance criteria" — went to `issues-to-roadmap` three times out of three in rounds 1–3. After the narrowing it routes to `playbooks/issue-to-ready-specs/` and volunteers "tracker issues afterward are a separate step". The narrowed skill still fires at its own moment, and types the pieces by kind. Prompt routing landed mechanically too: P2 routed `loop-prd-readiness`, excluded `quick-spec` and `raa` on entry grounds, and noted "it's a prompt, not a procedure I run here". Negatives stayed silent.

One failure, recorded inconclusive: P1 ("here's the PRD, here's the codebase — does the code do what the doc says?") did not reach `prompts/loop-implementation-readiness/`. The session's ambient instructions carry a detailed claim-verification workflow for that exact task shape, so it had a strong non-vault prior; a cleaner probe needs a shape those instructions do not cover.

**Round 3, 2026-10-27 — the activation fix (revision 4, `7503824d`).** 19 runs, criteria pre-registered and committed before the fix was written. Only the `description` changed; manifest, priority rule, chain rule and boundaries untouched.

| Criterion | Result |
|---|---|
| R2, the primary target | **3/3** — up from 0/3 across three earlier rounds |
| Negatives stay silent (blocker) | **4/4 silent**, zero false activations |
| T1–T3 positives | 3/3 trigger |
| R3a, disambiguated | 2/2 |
| R1 / R5 no regression | R1 2/2, R5 1/2 |
| T4 | **1/3 clear activation** — missed its ≥2/3 criterion |

The hypothesis was that activation keys on the **nouns of artifact names** rather than the **situations users describe**. Rewriting the description into situations took R2 from never routing to routing every time, and one T4 run quoted the new phrasing back as its reason — "since *'work just finished, capture the lessons'* is exactly its trigger" — a phrase that exists only in revision 4. Breadth cost no precision: T5 declined unprompted because "it's the named playbook, so no router needed."

**First quantified variance figure, and it is poor: R5 is 2 of 4 across all rounds.** Passing runs name `issue-to-pr`, gated mode and the containment rule; failing runs produce a competent generic PR flow and never mention the vault. R1 went 2/2 after being unstable, so instability is per-case, not uniform.

R4 and R6–R12 were not rerun on revision 4 and remain earlier-revision results; no new 11-case aggregate is claimed.

**Revision 3, `7f984bb0`.** The promotion to `skills/` tripped DL011, which forbids a promoted runtime artifact from referencing `experiments/` paths — it is a bare substring check for *dependencies* and cannot tell a dependency from a prohibition. Reworded to "the `experiments` tree" in three places, no semantic change (4 lines, diff in git). R12, the only case that exercises that text, was rerun on revision 3 and passed both assertions: it declined the near-perfect wording match explicitly — "I'd decline the `experiments/` PRD→RFD→NRFD→tech-spec pipeline despite the near-perfect wording match: experiments are untested and non-routable by rule" — and routed `product-brief` → `quick-spec`. R1–R11 were not rerun on revision 3 and remain revision-2 results.

One run per cell, so no per-case result stands alone. Activation was measured by self-report plus output fingerprints rather than harness instrumentation, and three runs reported `SKILLS_USED: none` while reasoning in the manifest's own Entry/Exit vocabulary — activation counts are a floor. The 8 discovery probes were run against revision 1 and were not repeated. Only OpenCode discovery has ever been exercised. Full limitations in `evals/comparison.json`.

**Status: `validated`.** Satisfies `_meta/framebook/promote-artifact/` §2 — two documented runs against the shipped hash, baseline beaten on identical prompts in both, non-empty failure modes, sanitization clean, lint PASS.

**Not a candidate for `vetted`, and the evidence says so rather than being silent on it.** `vetted` requires "repeatable"; two runs of the same eleven cases on near-identical files disagreed on two of them. Closing that needs activation stabilised (R2 and R3 fail in both runs) and repeats per cell to quantify variance.

# Failure Modes / Boundaries

- **Activation is the weak half, not routing.** Measured across rounds 1–3: in every case where the skill engaged, the route was correct; every routing failure was a case where it never activated. Round 3 narrowed this by rewriting the `description` into situations rather than artifact nouns — R2 went 0/3 to 3/3 — but did not close it. **R5 is 2 of 4 across all rounds on an identical prompt**, and T4 fires on only 1 of 3. A session with many installed skills will not reliably reach this one, and no manifest change fixes that; the `description` is the only surface that moves it.
- **One collision is upstream and this skill cannot fix it.** `playbooks/issue-to-ready-specs/` and `skills/issues-to-roadmap/` both advertise "break down" + "issue" + "work items with acceptance criteria". Their only disambiguator — repo spec documents versus tracker issues — lives in their READMEs, which the harness does not read when selecting a skill. A task that does not state where the output should land gets whichever description wins. When the task *does* state it, the router holds the boundary (R3a, 2/2, one run rejecting `issues-to-roadmap` as "wrong direction and wrong artifact"). Fixing the ambiguous case means editing those two artifacts' descriptions.
- **The decline path is untested.** The "no playbook covers this" behaviour, including the known-coverage-gaps list in `SKILL.md`, was never exercised in a run — the one case designed to trigger it (notes → tracker issues) was taken by `skills/issues-to-roadmap` in all three conditions. Treat the decline behaviour as specified but unverified.
- **Manifest drift.** The manifest is hand-maintained. The moment a playbook is added/renamed/deleted without updating this file, routes go stale or dead. Mitigation: treat the manifest as a cache, not a source of truth. When a route seems wrong, verify the playbook still exists before routing. The real source of truth is each playbook's `README.md`. Verified accurate 14/14 on 2026-10-21. First drift event 2026-10-31: `acceptance-verification` and `incident-response` added as rows and `test-authoring` under Covered elsewhere; routing evals were not re-run for them.
- **Overlapping triggers.** Playbooks share trigger verbs ("review", "plan", "implement") but act on different objects. The disambiguation rule in SKILL.md (Footgun) handles this: match the task's object against each candidate's `When to use` + `Not for`, not the verb alone. Skipping this step produces wrong routes.
- **Over-triggering.** The skill activates on "task matches a playbook's domain" — a broad condition. If the user already has the right playbook in mind and just didn't name it, the skill adds noise. Mitigation: do not activate when the user names a playbook explicitly.
- **Experiments are never routable, and the rule needed stating.** `experiments/` contains procedure-shaped drafts — `arch-design-pipeline/` has a `playbook.md`, a `playbook` tag and a `plan`-adjacent purpose. Until 2026-10-23 nothing in `SKILL.md` excluded them: the manifest listed only `playbooks/` rows, but the instruction to "treat the manifest as a cache" and verify against each playbook's README left a filesystem scan free to surface an experiment as a candidate. The exclusion is now explicit in three places, and verification can only confirm or drop a row, never add one. Not covered by any eval case — no round-1 probe attempted an experiment route, so this is specified and unverified.
- **Playbook scope only.** The skill does not route to prompts, skills, agents, or tools. A task that would benefit from a non-playbook artifact gets "no playbook covers this" even if a prompt or skill would fit. This is a deliberate boundary — the vault has other routing surfaces (`USAGE.md`, `AGENTS.md`) for the full inventory.
- **Cannot execute the playbook.** The skill surfaces `playbook.md` as the active procedure; it does not run the playbook's steps. The user (or the session agent) follows the procedure. This is a routing skill, not an execution layer.

# Related artifacts

- [`skills/skill-authoring/`](../../skills/skill-authoring/) — the process that produced this skill's structure
- [`USAGE.md`](../../USAGE.md) — full inventory for external harnesses; this skill is the playbook routing layer
- [`AGENTS.md`](../../AGENTS.md) — repo-wide agent guidance; this skill does not duplicate framebook routing
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows
