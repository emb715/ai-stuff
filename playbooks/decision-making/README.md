---
title: "Decision-Making (Convergence)"
status: draft
confidence: medium
last_tested: 2026-07-30
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

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Draft, not yet tested in this repo. -->

_TODO: Document at least one real run — what decision, how many options, which criteria/weights, whether the shortlist was usable, whether the sensitivity verdict held, how long it took. Quantitative preferred (e.g. "decision on [X], 8 options, criteria impact/effort/risk weighted 5/3/4, top option robust to ±20%, fed to product-brief")._

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