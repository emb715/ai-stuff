---
title: "Review Release Candidate"
status: draft
confidence: low
last_tested: 2026-07-26
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - prompt
  - one-shot
  - release
  - verification
  - qa
owner: "@emb715"
---

# Purpose

Build a release-candidate review harness. Inventory every user-facing surface against its documented acceptance criteria: features, states, workflows, and risk-ranked edge cases. Verify each as a real user would, capture concrete evidence for every defect, regression, and spec deviation, triage by shared root cause and blast radius, and gate fix batches with regression tests until all P0/P1 criteria pass and residual risk is signed off or explicitly deferred.

# When to use

You have a release candidate (branch, build, tag) and a set of documented acceptance criteria, and you need to verify it is safe to roll out. The prompt drives the full verification lifecycle: inventory → evidence capture → triage → fix batches → re-verification → sign-off.

Not for: pre-release planning, feature design, or ongoing QA without a defined candidate window.

# Inputs

`{{CANDIDATE}}` — release candidate identifier (branch, tag, build, commit range). Confirm it is present in the current session before starting.

`{{ACCEPTANCE_CRITERIA}}` — the documented set of features, states, workflows, and edge cases the release must satisfy. If not explicitly referenced, the agent should surface that as a blocker before starting.

# Prompt

See [`prompt.md`](prompt.md) — standalone copy-paste body.

# Stop signal

All of:
- all P0/P1 criteria pass
- no unowned rollout-blockers remain
- residual risk is signed off or explicitly deferred

Otherwise: stop blocked, surfacing the exact user decision needed. Do not continue past a block unilaterally. Stop the release and escalate immediately on any blocker that cannot be cleared within the candidate window.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome before promotion to validated. -->
<!-- No run evidence captured yet. Fill before relying on this section. -->

_TODO: Document at least one real run — candidate name, criteria count, defects found by severity, fix batches applied, re-verification rounds, final verdict (ship / hold / block)._

# Failure Modes / Boundaries

- If `{{CANDIDATE}}` or `{{ACCEPTANCE_CRITERIA}}` are vague or not in session, the agent may hallucinate criteria rather than asking. Always provide explicit references or confirm visibility before running.
- The release scorecard is a living artifact across fix batches. If the agent regenerates it from scratch each round instead of updating it, traceability is lost — re-inject and require incremental updates.
- "Resolved" in a fix batch is not "verified." Re-run the full verification inventory after each batch; skipping this ships regressions.
- The prompt has no authority to touch production, real customer data, paid infrastructure, or anything destructive or irreversible. It defaults to read-only verification. If the agent starts making changes without asking, the contract is broken.
- Large release surfaces produce long sessions and review fatigue. Consider scoping to a segment or splitting criteria into multiple runs.
- Residual risk sign-off is a human decision, not the agent's. If the user is unavailable, the loop blocks correctly but cannot proceed.

# Related prompts

- [`prompts/loop-implementation-readiness/`](../loop-implementation-readiness/) — narrower: verify a codebase implements a planning doc, not a release candidate
- [`playbooks/adversarial-code-review/`](../../playbooks/adversarial-code-review/) — code-level review of git changes, not user-facing surface verification