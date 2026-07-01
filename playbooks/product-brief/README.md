---
title: "Product Brief"
status: validated
confidence: medium
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - product
  - planning
  - facilitation
owner: "@ezequielbenitez"
---

# Purpose

Turns brainstorm output or a rough idea into a structured product brief through facilitated discovery. Covers five sections — problem, users, success, scope, constraints — one at a time, each confirmed before moving to the next. The output directly feeds into plan refinement. Fills the gap between brainstorming and planning.

# When to use

When the user says "help me create a product brief" or "I have an idea I want to structure", or immediately after a brainstorming session before writing a plan. ~45-60 minutes.

Not for: teams with an existing plan doc (route to plan refinement directly), or pure research sessions with no product direction yet.

# Preconditions

- A rough idea, brainstorm output, or a problem statement
- ~15-20 minutes. Can extend into inline plan refinement in the same session.

# Inputs

None — copy and run as-is. The agent orients in Step 1.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Based on create-product-brief workflow, validated externally in that framework. -->
<!-- Standalone rewrite not yet tested in this repo. -->

_TODO: Document at least one real run — what idea was briefed, how long it took, whether each section required significant revision, whether the output fed into plan refinement successfully._

# Failure Modes / Boundaries

- The out-list gate (Step 5) is the most likely failure point. Users resist naming exclusions because it feels like giving up features. The playbook requires a non-empty out-list — enforce it. An empty out-list means scope was not defined, only wished.
- Pushing vague answers toward specificity requires friction the agent may not apply consistently. Weaker models accept "users will love it" without pushing for measurable outcomes. Review the Success section for actual metrics before accepting it.
- The two-persona limit is a judgment call. A product with genuinely distinct user types may need three. The limit exists to prevent scope creep through persona multiplication. Override it only when the third persona has meaningfully different needs from the first two.
- If the user already has a partial plan doc, this playbook adds overhead. Run plan refinement directly instead.
- The brief is a pre-PRD artifact, not a PRD. It does not contain acceptance criteria, technical architecture, user journeys, or functional specifications. Those belong in the next stage.

# Related artifacts

None — self-contained.
