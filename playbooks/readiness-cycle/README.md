---
title: "Readiness Cycle"
status: draft
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - orchestrator
  - readiness
  - release
  - assessment
  - cycle
owner: "@emb715"
---

# Purpose

Takes an existing artifact (template, repo, package, document) from "is it ready to share/release/open-source?" to "verified ready or blocked with a fix plan." Chains [raa](../raa/) (assess + plan) → [implementation-orchestration](../implementation-orchestration/) (fix) → [review-release-candidate](../../prompts/review-release-candidate/) (verify) into a single readiness cycle. The cycle loops until the verifier returns ship, or the human explicitly defers the remaining gaps.

This is a cycle, not a one-shot: fixes can introduce new gaps, so each fix round re-assesses before re-verifying.

## Why chain these two

A consumer's first question is: "why chain RAA and review-release-candidate — don't they overlap?" They compose, they don't overlap. RAA tells you what to fix; review-release-candidate verifies you fixed it.

| | RAA (in this cycle) | review-release-candidate (in this cycle) |
|---|---|---|
| Question | "What's a plan to make this ready?" | "Does this pass its readiness criteria now?" |
| Output | A plan (file-scoped, phased, handoff ledger) | A scorecard (pass/fail per criterion, defects by severity, ship/hold/block verdict) |
| When | Before fixes — planning the work | After fixes — verifying the result |
| Mode | Read + map + plan (doesn't touch the artifact) | Read + verify + triage + fix-batch + re-verify (operates on the candidate) |
| Loop | One pass: research → analyze → assess → hand off | Multi-round: fix batch → re-verify → repeat until P0/P1 clear |
| Consumer | implementation-orchestration (executes the plan) | Human sign-off (ship/hold/block decision) |

The sequence is: RAA → fix the gaps → review-release-candidate. Each does one job; the cycle sequences them.

# When to use

When you have an existing artifact (template, repo, package, document) and a readiness question (e.g., "is this ready to share / release / open-source / hand off?"), and you want the full path to a verified-ready verdict or a fix plan — not just a review.

Not for:
- Building from scratch — use [build-to-release](../build-to-release/)
- Turning an issue into a PR — use [issue-to-pr](../issue-to-pr/)
- A one-off review without fixes — use [adversarial-code-review](../adversarial-code-review/) or [review-release-candidate](../../prompts/review-release-candidate/) standalone

# Preconditions

- An existing artifact to assess (template, repo, package, document)
- Access to the artifact's codebase/files
- A readiness question
- An agent fleet or solo execution path with role equivalents for the underlying playbooks (Researcher, Analyst, Architect, Builder, Reviewer, Orchestrator)

# Inputs

- `{{ARTIFACT}}` — the thing to assess: a path, repo, package, or document
- `{{READINESS_QUESTION}}` — the readiness question (e.g., "is this ready to share?", "is this ready to open-source?", "is this ready to hand off?")
- `{{CRITERIA}}` — optional. Explicit readiness criteria. If absent, RAA derives them from the readiness question.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Draft status — not yet validated through real use. -->

_TODO: Document at least one real run — which artifact, what readiness question, whether criteria were provided or derived, how many P0/P1 gaps RAA found, how many fix cycles the loop ran, whether review-release-candidate converged, final verdict (ship / blocked / deferred), time to verdict. Quantitative preferred (e.g. "readiness cycle on [artifact] with question 'ready to open-source?', RAA derived 6 criteria, found 3 P0 + 2 P1, 2 fix cycles, converged to ship in ~90 min")._

# Failure Modes / Boundaries

- **RAA returns SCOPE TOO LARGE** — the artifact is too complex for a single readiness assessment. Break it into sub-artifacts and run a cycle on each.
- **review-release-candidate never converges** — after repeated fix cycles the same finding class keeps recurring. Escalate to the human — the artifact may need fundamental rework, which this cycle does not provide. Return to [build-to-release](../build-to-release/).
- **Fix loop introduces new gaps** — a fix batch closes one gap but opens another. The cycle handles this by re-running RAA on the remaining gaps as the new trigger; this is expected behavior, not a failure. If the new-gap rate exceeds the close rate across cycles, escalate.
- **Criteria are vague** — if `{{CRITERIA}}` is absent and RAA cannot derive clear criteria from the readiness question, RAA should flag this. If it does not, the cycle produces a meaningless plan — verify the derived criteria before approving the plan at Step 3.
- **RAA returns BLOCKED** — a fundamental issue prevents readiness (the artifact conflicts with a hard requirement, depends on something that can't be satisfied). Surface the blocker and stop. The cycle offers no rework path — return to [build-to-release](../build-to-release/).
- **Human defer is an escape hatch, not a default.** Explicitly deferring remaining gaps is a human judgment call, not the cycle's. If the human is unavailable, the loop blocks correctly but cannot proceed.

# Related artifacts

- [raa](../raa/) — Step 2. Assesses the artifact and produces a file-scoped fix plan.
- [implementation-orchestration](../implementation-orchestration/) — Step 4. Executes the fix plan to committed, reviewed fixes.
- [review-release-candidate](../../prompts/review-release-candidate/) — Step 5. Verifies the fixed artifact against readiness criteria; produces the ship/hold/block scorecard.
- [loop-implementation-readiness](../../prompts/loop-implementation-readiness/) — validates the plan against the codebase; can be inserted between Step 2 and Step 4 if the plan needs codebase validation before fixing.
- [issue-to-pr](../issue-to-pr/) — the issue→PR variant of a chained cycle.
- [build-to-release](../build-to-release/) — the idea→release variant; starts upstream of an existing artifact.