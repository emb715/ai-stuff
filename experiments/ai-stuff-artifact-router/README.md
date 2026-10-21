---
title: "artifact-router"
status: draft
confidence: medium
last_tested: 2026-10-21
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
- Operating the vault itself (lifecycle, lint, audit) — those are `_meta/commands/` and `_meta/framebook/`.

# Inputs

None. The skill reads the task description from the current session and matches against the embedded manifest.

# Skill

Use [`SKILL.md`](SKILL.md) — routing procedure, intent categories, an Entry/Exit-indexed manifest, the fit-first priority rule, the chain rule and chain table, the disambiguation footgun including direction-of-flow, the known-coverage-gaps decline list, and routing examples.

Evaluation records live in [`evals/`](evals/) and are working files, not vault records; this README's Evidence section is the vault record.

# Evidence

Round 1, 2026-10-21. Plan pre-registered and committed (`c93d472`) before the candidate was written; full records in [`evals/`](evals/) — `plan.md`, `evals.json`, `trigger-evals.json`, `comparison.json`, `results.md`.

**Setup.** 23 live OpenCode sessions, one independent session per cell, executor = `general` subagent at the harness default model. The skill was discovered through the project-level symlink `.opencode/skills/ai-stuff-artifact-router` and was never named in a prompt. Three conditions: `baseline` (symlink moved aside), `old` (frozen pre-revision snapshot `0463a757…`, 4 cases), `candidate` (revision `95fa5a46…`, frozen before its first run, all cases). Every prompt carried an identical read-only constraint.

**Routing correctness — 11 cases, ground truth quoted from each playbook's own README before any run.**

| Measure | baseline | candidate |
|---|---|---|
| Cases fully correct | 3 / 11 | **8 / 11** |
| Assertions passed | 15 / 23 | **20 / 23** |
| Regressions against baseline | — | **0** |

Only 5 of 23 assertions discriminate between conditions; all 5 favour the candidate. The margin comes from finding playbooks an unaided session misses — `adversarial-code-review` (R1), `issue-to-pr` in gated mode (R5), `agent-installer` (R7), `implementation-orchestration` with `adversarial-code-review` as its embedded gate (R10) — and from answering with an ordered sequence where no single playbook spans the task (R6: `decision-making` → `product-brief`, which both other conditions got wrong).

**Discovery — 8 probes, 7 correct.** Zero false activations, including on the two most expensive non-activation conditions: a playbook the user already named, and a vault lifecycle operation. One positive miss (T4): a task describing `retrospective`'s situation without using the word "retro" went to the framebook instead.

**Three candidate failures, all of them activation failures rather than reasoning failures.** R2 (`readiness-cycle` never found), R3 (activation lost to `skills/issues-to-roadmap`), R4.2 (the "no playbook covers this" decline never issued). In every case where the router demonstrably engaged, the route was correct. The routing rules are in better shape than the activation is, and more manifest work will not fix R2 or R3.

**The playbooks-only boundary cost less than predicted, for a reason outside the skill.** On the notes→issues coverage gap (R4), all three conditions avoided the predicted misroute into `issue-to-ready-specs` — because the router never activated and `skills/issues-to-roadmap` self-activated and handled the task correctly every time. The decline behaviour added in this revision is therefore **untested text**.

**Manifest accuracy, checked rather than assumed.** 14 of 14 manifest rows matched reality on 2026-10-21: no playbook added, renamed, or status-changed since 2026-08-04. The four artifacts the vault gained in that window were all skills, outside this manifest's scope. The hand-maintained manifest has consequently never faced a drift event — see `humans.md` for what that does and does not say about the design.

Variance is untested (n=1 per cell), activation was measured by self-report plus output fingerprints rather than harness instrumentation, and only OpenCode discovery was exercised. Full limitations in `evals/comparison.json`.

**Status.** These runs satisfy `_meta/framebook/promote-artifact/` §2 for `draft -> validated`. The transition itself is left to the owner; `status` stays `draft` until then, and `confidence` is raised `low -> medium` on the strength of one documented round.

# Failure Modes / Boundaries

- **Activation is the weak half, not routing.** Measured 2026-10-21: in every case where the skill engaged, the route was correct; all three routing failures were cases where it never activated. Two were lost to a competing skill (`skills/issues-to-roadmap`, whose description claims "when asked to break work down"), and one positive discovery probe missed because the task described a playbook's situation without using that playbook's vocabulary. A session with many installed skills will not always reach this one, and no manifest change fixes that.
- **The decline path is untested.** The "no playbook covers this" behaviour, including the known-coverage-gaps list in `SKILL.md`, was never exercised in a run — the one case designed to trigger it (notes → tracker issues) was taken by `skills/issues-to-roadmap` in all three conditions. Treat the decline behaviour as specified but unverified.
- **Manifest drift.** The manifest is hand-maintained. The moment a playbook is added/renamed/deleted without updating this file, routes go stale or dead. Mitigation: treat the manifest as a cache, not a source of truth. When a route seems wrong, verify the playbook still exists before routing. The real source of truth is each playbook's `README.md`. Verified accurate 14/14 on 2026-10-21, but the manifest has never yet faced a drift event, so the cost of repairing one is still unmeasured.
- **Overlapping triggers.** Playbooks share trigger verbs ("review", "plan", "implement") but act on different objects. The disambiguation rule in SKILL.md (Footgun) handles this: match the task's object against each candidate's `When to use` + `Not for`, not the verb alone. Skipping this step produces wrong routes.
- **Over-triggering.** The skill activates on "task matches a playbook's domain" — a broad condition. If the user already has the right playbook in mind and just didn't name it, the skill adds noise. Mitigation: do not activate when the user names a playbook explicitly.
- **Playbook scope only.** The skill does not route to prompts, skills, agents, or tools. A task that would benefit from a non-playbook artifact gets "no playbook covers this" even if a prompt or skill would fit. This is a deliberate boundary — the vault has other routing surfaces (`USAGE.md`, `AGENTS.md`) for the full inventory.
- **Cannot execute the playbook.** The skill surfaces `playbook.md` as the active procedure; it does not run the playbook's steps. The user (or the session agent) follows the procedure. This is a routing skill, not an execution layer.

# Related artifacts

- [`skills/skill-authoring/`](../../skills/skill-authoring/) — the process that produced this skill's structure
- [`USAGE.md`](../../USAGE.md) — full inventory for external harnesses; this skill is the playbook routing layer
- [`AGENTS.md`](../../AGENTS.md) — repo-wide agent guidance; this skill does not duplicate framebook routing
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows
