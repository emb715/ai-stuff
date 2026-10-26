---
title: "artifact-router"
status: validated
confidence: medium
last_tested: 2026-10-26
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

Routes the current task to the right playbook in the ai-stuff vault. On user confirmation, reads and surfaces the playbook's `playbook.md` as the active procedure. Scope is playbooks only — does not route to prompts, skills, agents, or tools.

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

**Routing correctness — 12 cases, ground truth quoted from each playbook's own README before any run. Two full runs.**

| Measure | baseline | rev 1 (`95fa5a46`) | **rev 2 (`c4a0f976`)** |
|---|---|---|---|
| Cases fully correct | 3 / 11 | 8 / 11 | **6 / 11** |
| Assertions passed | 15 / 23 | 20 / 23 | **18 / 23** |
| Regressions against baseline | — | 0 | **0** |

**Read the range, not the best figure: 6–8 of 11, with activation as the unstable element.** Rerunning the same eleven cases against the shipped file flipped two cells that had passed (R1, R5) — both by never engaging the skill, neither by declining on scope. Variance here is demonstrated, not merely unmeasured.

The margin over an unaided session comes from finding playbooks it misses — `agent-installer` (R7), `implementation-orchestration` with `adversarial-code-review` as its embedded gate (R10), and in one run each `adversarial-code-review` (R1) and `issue-to-pr` gated (R5) — and from answering with an ordered sequence where no single playbook spans the task (R6: `decision-making` → `product-brief`, which both baseline and revision 1's predecessors got wrong). R12 confirms the `experiments/` boundary holds.

**Every case the skill demonstrably engaged on was routed correctly, in both runs, across 23 routing runs.** The routing rules work; being reached is the problem.

**Discovery — 8 probes, 7 correct.** Zero false activations, including on the two most expensive non-activation conditions: a playbook the user already named, and a vault lifecycle operation. One positive miss (T4): a task describing `retrospective`'s situation without using the word "retro" went to the framebook instead.

**Three candidate failures, all of them activation failures rather than reasoning failures.** R2 (`readiness-cycle` never found), R3 (activation lost to `skills/issues-to-roadmap`), R4.2 (the "no playbook covers this" decline never issued). In every case where the router demonstrably engaged, the route was correct. The routing rules are in better shape than the activation is, and more manifest work will not fix R2 or R3.

**The playbooks-only boundary cost less than predicted, for a reason outside the skill.** On the notes→issues coverage gap (R4), all three conditions avoided the predicted misroute into `issue-to-ready-specs` — because the router never activated and `skills/issues-to-roadmap` self-activated and handled the task correctly every time. The decline behaviour added in this revision is therefore **untested text**.

**Manifest accuracy, checked rather than assumed.** 14 of 14 manifest rows matched reality on 2026-10-21: no playbook added, renamed, or status-changed since 2026-08-04. The four artifacts the vault gained in that window were all skills, outside this manifest's scope. The hand-maintained manifest has consequently never faced a drift event — see `humans.md` for what that does and does not say about the design.

**The `experiments/` boundary (R12, 2026-10-23).** On owner instruction, `experiments/` is an explicit hard boundary alongside playbooks-only, and filesystem verification may only confirm or drop a manifest row, never add one. Given a prompt paraphrasing `experiments/arch-design-pipeline/`'s own purpose, the session declined the experiment by name-shape — "not routable — untested, unsanitized, outside `playbooks/`" — and answered with a valid `product-brief` → `quick-spec` sequence.

**Shipped file is revision 3, `7f984bb0`.** The promotion to `skills/` tripped DL011, which forbids a promoted runtime artifact from referencing `experiments/` paths — it is a bare substring check for *dependencies* and cannot tell a dependency from a prohibition. Reworded to "the `experiments` tree" in three places, no semantic change (4 lines, diff in git). R12, the only case that exercises that text, was rerun on revision 3 and passed both assertions: it declined the near-perfect wording match explicitly — "I'd decline the `experiments/` PRD→RFD→NRFD→tech-spec pipeline despite the near-perfect wording match: experiments are untested and non-routable by rule" — and routed `product-brief` → `quick-spec`. R1–R11 were not rerun on revision 3 and remain revision-2 results.

One run per cell, so no per-case result stands alone. Activation was measured by self-report plus output fingerprints rather than harness instrumentation, and three runs reported `SKILLS_USED: none` while reasoning in the manifest's own Entry/Exit vocabulary — activation counts are a floor. The 8 discovery probes were run against revision 1 and were not repeated. Only OpenCode discovery has ever been exercised. Full limitations in `evals/comparison.json`.

**Status: `validated`.** Satisfies `_meta/framebook/promote-artifact/` §2 — two documented runs against the shipped hash, baseline beaten on identical prompts in both, non-empty failure modes, sanitization clean, lint PASS.

**Not a candidate for `vetted`, and the evidence says so rather than being silent on it.** `vetted` requires "repeatable"; two runs of the same eleven cases on near-identical files disagreed on two of them. Closing that needs activation stabilised (R2 and R3 fail in both runs) and repeats per cell to quantify variance.

# Failure Modes / Boundaries

- **Activation is the weak half, not routing.** Measured 2026-10-21: in every case where the skill engaged, the route was correct; all three routing failures were cases where it never activated. Two were lost to a competing skill (`skills/issues-to-roadmap`, whose description claims "when asked to break work down"), and one positive discovery probe missed because the task described a playbook's situation without using that playbook's vocabulary. A session with many installed skills will not always reach this one, and no manifest change fixes that.
- **The decline path is untested.** The "no playbook covers this" behaviour, including the known-coverage-gaps list in `SKILL.md`, was never exercised in a run — the one case designed to trigger it (notes → tracker issues) was taken by `skills/issues-to-roadmap` in all three conditions. Treat the decline behaviour as specified but unverified.
- **Manifest drift.** The manifest is hand-maintained. The moment a playbook is added/renamed/deleted without updating this file, routes go stale or dead. Mitigation: treat the manifest as a cache, not a source of truth. When a route seems wrong, verify the playbook still exists before routing. The real source of truth is each playbook's `README.md`. Verified accurate 14/14 on 2026-10-21, but the manifest has never yet faced a drift event, so the cost of repairing one is still unmeasured.
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
