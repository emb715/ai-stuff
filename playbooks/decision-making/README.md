---
title: "Decision-Making (Convergence)"
status: draft
confidence: medium
last_tested: 2026-11-01
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - decision
  - convergence
  - selection
  - multi-criteria
owner: "@emb715"
---

# Purpose

Takes N options (typically from brainstorming, but any decision with multiple candidates) and produces a ranked shortlist (top 3-5) with explicit rationale per ranking criterion, using multi-criteria decision analysis. Scores each option against user-defined criteria, computes weighted totals, runs a sensitivity check, and hands off a robustness-verdicted shortlist ready to feed product-brief or direct selection. Fills the brainstorming → product-brief gap where too many options need structured convergence.

# When to use

After brainstorming produces too many options, or when facing any decision with multiple candidates and no clear winner.

Not for:
- Binary decisions (just pick).
- Decisions requiring stakeholder alignment (use a voting/alignment process).
- Single-option scenarios (nothing to rank).

# Preconditions

- A set of 3+ options to choose between.
- The user is available to define and weight criteria (or accepts the defaults).

# Inputs

- `{{OPTIONS}}` — a list of options, or "from brainstorming session"
- `{{CRITERIA}}` — optional. Defaults to impact / effort / novelty / risk
- `{{WEIGHTS}}` — optional. Defaults to equal weight across criteria

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

First real run (2026-11-01), headless and non-interactive, with the context, options and "accept the defaults" answers supplied up front: deciding which vault improvement to do next. 7 options, default criteria (impact, effort, novelty, risk) at equal weight. 7 turns, about 1 minute. Every score carried a one-sentence reason anchored in repo facts (it checked which tools were installed and found the stale links it was told about). Sensitivity verdict: fragile, the top two tied at 3.75 and swapped under every ±20% shift, while the top-3 set stayed stable. It noted that option D was a prerequisite of option E without choosing for the user. The shortlist was usable: the tied pair was then planned with raa and built with implementation-orchestration.

Gap found and fixed: Step 6 did not say how to total higher-is-worse criteria (effort, risk). The run inverted them as (6 − score) on its own and said so; Step 6 now makes that the rule.

Not yet tested: an interactive run where the user sets criteria and weights.

# Failure Modes / Boundaries

- Options too vague to score — ask the user to sharpen each option to a one-line definition before scoring.
- Criteria conflict — impact and effort often inversely correlate; flag it when the ranking hinges on that tension rather than on the options' merits.
- Sensitivity check shows all options fragile — the criteria need redefinition, not the weights. Stop and redefine before re-scoring.
- User disagrees with all scores — the criteria are wrong, not the scores. Redefine criteria with the user and re-score from scratch.
- Doesn't handle multi-stakeholder decisions (no voting/consensus mechanism).
- Doesn't handle interdependent options (A enables B). Score independently and flag dependencies in the shortlist rationale.
- Doesn't handle criteria that can't be known until implementation — flag those criteria as "unknowable pre-implementation" and exclude from scoring.

# Related artifacts

- [brainstorming](../brainstorming/README.md) — produces the options this playbook consumes.
- product-brief — consumes the shortlist this playbook produces.