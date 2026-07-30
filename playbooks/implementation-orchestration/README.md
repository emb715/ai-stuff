---
title: "Implementation Orchestration"
status: draft
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - implementation
  - orchestration
  - fleet
owner: "@emb715"
---

# Purpose

Executes a validated implementation plan across a fleet of build agents. The plan is the input — this playbook assumes readiness has already been confirmed. The output is a committed, reviewed, CI-green branch ready for merge.

# When to use

When a validated plan exists (phased, file-scoped, dependency-ordered) and you need to turn it into code. The plan may come from an architect agent, a PRD, a sprint story, or a human — the source doesn't matter, but the plan must have phases with ordered dependencies, file-level scope per phase, named risks, and a handoff list.

If the plan lacks any of these, stop and run a planning phase first ([RAA](../raa/playbook.md), an architect agent, or ask the user).

Not for: planning itself (use RAA or an architect), or for single-file mechanical changes that don't warrant fleet orchestration.

The mandatory review phase uses [adversarial-code-review](../adversarial-code-review/) internally. Run it standalone only if you want a second pass on changes made after the first review.

**Paradigm:** this playbook belongs to the plan paradigm. Use the spec paradigm ([quick-spec](../quick-spec/), [issue-to-ready-specs](../issue-to-ready-specs/)) when a single agent or human will implement the feature in one session — the spec is the contract, the implementer handles phasing. Use the plan paradigm ([raa](../raa/), [implementation-orchestration](../implementation-orchestration/)) when a fleet will implement in parallel — the plan handles phasing, file ownership, and handoffs. The paradigms compose: specs feed RAA as the feature description. See [request-triage](../request-triage/) if unsure which to use.

# Preconditions

- A validated plan with phases, file-level scope, named risks, and a handoff list
- Access to a codebase (git repo) the plan targets
- An agent fleet (or solo execution) with role equivalents for research/review/architect/build/test/optimize/refactor
- The repo's CI/PR tooling available (`gh` CLI for PR creation and CI monitoring)

# Inputs

- `{{PLAN}}` — the validated implementation plan. Must contain:
  - Phases with ordered dependencies
  - File-level scope per phase (which files change, what changes in each)
  - Named risks that could inflate the estimate
  - A handoff list (agents to dispatch after or during implementation)
- `{{CODEBASE}}` — a git repo the plan targets (working tree, default branch, CI configured)
- `{{FLEET}}` — an agent fleet or solo execution path with role equivalents for each step
- `{{CI_TOOLING}}` — `gh` CLI (or equivalent) for PR creation and CI check monitoring

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Draft status — not yet tested in real use. -->

_TODO: Document at least one real run — which plan, how many phases/streams, fleet used, parallel streams dispatched, review loops to PASS, CI failures hit and fixed, time to DONE. Quantitative preferred (e.g. "3-phase plan on [repo], 7 streams across 2 parallel groups, 1 review loop (2 passes), 3 CI fixes, 90 min to merge-ready PR")._

# Failure Modes / Boundaries

- **Review non-convergence.** If the review agent loops ≥3 times on the same finding class, the playbook escalates to ABORT — the plan is underspecified. Repeated P0/P1 findings on the same issue signal a planning defect, not an implementation defect.
- **Pre-existing CI failures.** CI may be red on `main` before this work starts. The playbook baselines against `main` to distinguish pre-existing failures from new ones, but if the baseline itself is broken, the DONE condition becomes ambiguous. Confirm `main` is green before starting, or record the pre-existing failures explicitly.
- **Scope creep.** Each build agent receives a minimal-diff brief. If an agent touches files outside its scope, parallel streams collide and the post-phase file-conflict check fails. The "what NOT to touch" exclusion list is the guardrail — if it's missing from a brief, scope creep is likely.
- **File conflicts from parallel streams.** Parallel dispatch is only safe when file sets are disjoint. If the file-overlap matrix is wrong (a shared file missed), two streams write the same file and the post-phase protocol must resolve it manually before proceeding.
- **Missing dependency in a phase.** If a prior phase is incomplete, the dependent phase blocks. The playbook blocks rather than guessing, but a poorly-ordered plan produces repeated blocking — a sign the plan's dependency order is wrong, not the playbook.
- **Handoff ledger drift.** Handoffs are tracked, not forgotten — but if a build agent emits a handoff that isn't captured in the ledger, it's lost. The post-phase protocol extracts handoffs from each stream's return; skipping it (a "Never" violation) drops handoffs silently.
- **`git add .` violation.** Staging the whole working tree pulls in unrelated changes. The playbook requires explicit file paths; violating this contaminates the PR with out-of-scope work.
- Agent-agnostic by design — weaker models may not follow the parallelism discipline (disjoint file sets, serialized shared files). The structure assumes the orchestrator enforces file ownership as the parallelism boundary.

# Related artifacts

- [RAA](../raa/playbook.md) — produces the validated plan this playbook consumes. Run RAA (or an equivalent planning phase) first if no plan exists.
- [loop-implementation-readiness](../../prompts/loop-implementation-readiness/) — validates the plan is ready before this playbook runs. Confirms phases, file scope, risks, and handoffs are present.