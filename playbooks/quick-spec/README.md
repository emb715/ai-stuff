---
title: "Quick Spec"
status: validated
confidence: medium
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - specification
  - implementation-readiness
  - development
owner: "@emb715"
---

# Purpose

Creates implementation-ready technical specifications through conversational discovery, code investigation, and structured documentation. Enforces a six-criterion Ready-for-Development standard: Actionable, Logical, Testable, Complete, Self-contained, Consistent. A spec that fails any criterion is not handed off.

# When to use

When the user says "create a quick spec" or "generate a tech spec", or when a feature or change needs an implementation-ready spec before development starts. Produces a document a fresh agent can implement from without session history.

Not for: full PRD creation (use `prompts/loop-prd-readiness/`), architectural decision records, or research documents.

**Paradigm:** this playbook belongs to the spec paradigm. Use the spec paradigm ([quick-spec](../quick-spec/), [issue-to-ready-specs](../issue-to-ready-specs/)) when a single agent or human will implement the feature in one session — the spec is the contract, the implementer handles phasing. Use the plan paradigm ([raa](../raa/), [implementation-orchestration](../implementation-orchestration/)) when a fleet will implement in parallel — the plan handles phasing, file ownership, and handoffs. The paradigms compose: specs feed RAA as the feature description. See [request-triage](../request-triage/) if unsure which to use.

# Preconditions

- A feature description or change request (can be rough — the playbook sharpens it)
- Access to the existing codebase (the spec must reference real files and patterns)
- The user is available for clarification questions

# Inputs

None — copy and run as-is. The agent asks the user for the feature description, investigates the codebase, and produces the spec.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Based on quick-spec workflow, validated externally in that framework. -->
<!-- Standalone rewrite not yet tested in this repo. -->

_TODO: Document at least one real run — what feature was specced, did it pass the Ready-for-Dev standard, was the spec usable by a fresh agent, how many revisions were needed. Quantitative preferred (e.g. "specced a 5-task feature in 15 min, passed all 5 criteria on first validation, implemented by a fresh agent with zero clarification questions")._

# Failure Modes / Boundaries

- The Ready-for-Development standard is only as good as the validation step. A weak model may rubber-stamp a spec that has vague tasks or untestable ACs. Review the validation explicitly.
- The Self-contained criterion is the hardest to satisfy. What seems obvious from the conversation may be opaque to a fresh agent. When in doubt, add more context rather than less.
- Code investigation quality depends on the agent's ability to search the codebase effectively. Large or unfamiliar codebases may produce incomplete Context sections. Scope the investigation if needed.
- The spec template is a starting point, not a rigid format. Some features need additional sections (data models, API contracts, migration plans). Add what the feature requires.
- If the feature is too complex for a single spec, split it. A spec that tries to cover too much fails the Complete criterion because details get glossed over.
- Schema-field assumptions are the single largest source of spec rework. A spec writer who assumes `User.orgId` exists (when membership is via a `Member` join table) produces Tasks that won't compile. Step 2 now requires verifying every referenced field against the actual schema — enforce this.

# Related artifacts

- [`prompts/loop-prd-readiness/`](../../prompts/loop-prd-readiness/) — drive planning docs to readiness before speccing
- [`playbooks/adversarial-code-review/`](../adversarial-code-review/) — review the implementation after development
