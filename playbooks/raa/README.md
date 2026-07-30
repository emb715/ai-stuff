---
title: "Research, Analyze, Assess (RAA)"
status: draft
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - planning
  - research
  - assessment
owner: "@emb715"
---

# Purpose

Takes a feature request or change description and produces a validated, file-scoped, implementation-ready plan that the [implementation-orchestration](../implementation-orchestration/playbook.md) playbook can consume directly. The output is a plan, not code.

# When to use

When a feature request, issue, bug report, or change request needs a plan before implementation. The input is a description of what to build. The output is a phased plan with file-level scope, named risks, a handoff ledger, and an effort estimate.

If a plan already exists, skip to the readiness loop ([loop-implementation-readiness](../../prompts/loop-implementation-readiness/) prompt) to validate it against the codebase.

**Paradigm:** this playbook belongs to the plan paradigm. Use the spec paradigm ([quick-spec](../quick-spec/), [issue-to-ready-specs](../issue-to-ready-specs/)) when a single agent or human will implement the feature in one session — the spec is the contract, the implementer handles phasing. Use the plan paradigm ([raa](../raa/), [implementation-orchestration](../implementation-orchestration/)) when a fleet will implement in parallel — the plan handles phasing, file ownership, and handoffs. The paradigms compose: specs feed RAA as the feature description. See [request-triage](../request-triage/) if unsure which to use.

# Preconditions

- A description of the feature/change (issue text, user request, PRD section, or verbal description)
- A codebase to research against (git repo, working directory)
- Access to at least one agent capable of reading files and searching code (or a human doing it manually)

# Inputs

- `{{FEATURE_DESCRIPTION}}` — the feature request, issue, bug report, or change request to plan against
- `{{CODEBASE}}` — a codebase to research against (git repo or working directory)

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- This playbook is draft status — not yet validated through real use. -->

_TODO: Document at least one real run — what feature was planned, how many files the research map covered, how many P0/P1 findings the analysis produced, whether the plan was consumed successfully by implementation-orchestration, and how the effort estimate compared to actual implementation effort. Quantitative preferred (e.g. "RAA on [feature], research map covered 14 files across 3 layers, analysis found 2 P0 + 4 P1, plan consumed by orchestration without rework, estimated 13 SP vs actual 18 SP")._

# Failure Modes / Boundaries

- **BLOCKED** — Research or analysis surfaces a fundamental issue that prevents planning: the feature conflicts with an existing architectural decision, the request is infeasible (critical dependency doesn't exist and can't be built), or already satisfied (feature already exists, wrong repo, impossible dependency). Surface the blocker with: what's missing or duplicated, why it blocks, and the smallest action that would unblock.
- **SCOPE TOO LARGE** — The feature is too complex for a single plan. Break it into sub-features and run RAA on each. Signal with: what the sub-features are, which one to start with, and why the others depend on it.
- **Never let the architect re-do research or analysis.** The architect consumes the prior outputs; it does not regenerate them. Violating this produces a plan built on unverified claims.
- **Never produce a plan without file-level scope.** "Update the list component" is not file-level scope. "Modify `src/components/list.tsx` lines 35-44 to replace client-side filtering with a server query" is. A plan without file-level scope cannot be consumed by implementation-orchestration.
- **Never produce an estimate without a confidence level.** "8 SP" is meaningless without "medium confidence because query performance at the expected row count is unknown."
- Research quality depends on actually reading code, not guessing. Weaker agents may skip file reads and infer patterns — every claim must carry a file:line anchor or it is not evidence.
- The plan stops at the plan. Do not write code, create branches, or modify files. Crossing this boundary turns RAA into implementation and breaks the handoff contract.

# Related artifacts

- [implementation-orchestration](../implementation-orchestration/playbook.md) — consumes the plan RAA produces; the plan's output contract is structured for direct consumption by this playbook.
- [loop-implementation-readiness](../../prompts/loop-implementation-readiness/) — validates the plan against the codebase before orchestration; catches errors RAA missed (e.g., a Task referencing a field the schema does not have).
- [issue-to-ready-specs](../issue-to-ready-specs/playbook.md) — related planning playbook; a natural predecessor when the input is a raw issue that needs structuring before RAA can plan against it.