---
title: "Issue to Ready Specs"
status: draft
confidence: medium
last_tested: 2026-07-13
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "gh-cli"
tags:
  - playbook
  - operations
  - specification
  - implementation-readiness
  - workflow
owner: "@emb715"
---

# Purpose

Turns a GitHub issue into a complete, implementation-ready spec suite — PRD plus N implementation specs — in one session. Chains the product-brief and quick-spec playbooks with research, architecture, handoff resolution, and a readiness audit. Produces specs that pass a six-criterion Ready-for-Development standard with all decision points resolved.

# When to use

When the user says "spec this issue", "break down issue #N", or when a GitHub issue needs to become implementable work items with acceptance criteria, file-level tasks, and test plans. Usable by any agent or human — does not require a specific agent fleet.

Not for: single-feature quick specs (use `quick-spec` directly), pure architecture decisions (use an architect), or brainstorming (use `brainstorming`).

**Paradigm:** this playbook belongs to the spec paradigm. Use the spec paradigm ([quick-spec](../quick-spec/), [issue-to-ready-specs](../issue-to-ready-specs/)) when a single agent or human will implement the feature in one session — the spec is the contract, the implementer handles phasing. Use the plan paradigm ([raa](../raa/), [implementation-orchestration](../implementation-orchestration/)) when a fleet will implement in parallel — the plan handles phasing, file ownership, and handoffs. The paradigms compose: specs feed RAA as the feature description. See [request-triage](../request-triage/) if unsure which to use.

# Preconditions

- A GitHub issue with enough context to scope the feature
- Access to the codebase (indexed or searchable)
- The user is available for brief confirmation and preference decisions
- `gh` CLI installed for issue fetching

# Inputs

- Issue number and repo (e.g., `1696` from `PineapplesDev/scruffy`)
- User preferences on key architecture decisions (collected during Step 2)

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

Validated in a real session (2026-07-13): GitHub issue #1696 → PRD + 9 implementation specs, all passing the Ready-for-Development standard. 4 handoffs surfaced and resolved during spec writing. Readiness audit found 3 blockers (shared wrong schema assumption across 3 parallel specs), all fixed. Final verdict: READY. Session produced ~4500 lines including verbatim research — the actual decision content was ~200 lines.

Key observations from the validating session:
- The readiness loop was the highest-value phase (caught 3 blockers + 1 stale test plan)
- Parallel spec writers independently made the same wrong schema assumption 3 times
- Amendments to spec Tasks did not propagate to Test Plans — caught only on re-verification
- The product-brief research phase was redundant because research was done upstream

# Failure Modes / Boundaries

- **Large issues produce long sessions.** A 9-story breakdown generated a 4500-line session. Consider fewer, broader specs (3-4) and let the implementer split during implementation
- **Parallel spec writing requires the shared-assumption check.** Without it, parallel writers make the same wrong guess. If working sequentially, this risk is lower but not zero
- **The readiness loop is not optional.** Skipping it ships specs with unverified assumptions. The loop is where quality control happens
- **Handoffs that remain unresolved are a failure state.** A handoff with status "pending" means the spec is not ready, even if it passes the other criteria
- **Requires user availability for decision points.** Architecture decisions (units, reset mechanism, hierarchy) need user input. If the user is unavailable, the session stalls at Step 2

# Related artifacts

- [`playbooks/product-brief/`](../product-brief/) — used in Step 3 (Brief)
- [`playbooks/quick-spec/`](../quick-spec/) — used in Step 6 (Spec writing), provides the six-criterion standard
- [`prompts/loop-prd-readiness/`](../../prompts/loop-prd-readiness/) — alternative readiness approach for PRD-level docs