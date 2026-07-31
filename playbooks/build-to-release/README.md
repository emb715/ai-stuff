---
title: "Build to Release"
status: draft
confidence: high
last_tested: 2026-07-26
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "gh-cli"
tags:
  - playbook
  - operations
  - specification
  - implementation-readiness
  - release
  - workflow
  - orchestrator
owner: "@emb715"
---

# Purpose

Takes an idea from proof-of-concept to release-ready implementation through a 13-phase gated pipeline. Each phase gates the next — no skipping. The pipeline: proof → brief → specs → readiness → implement → handoffs → review → fix-loop → adversarial → release. An orchestrator that chains existing playbooks (`product-brief`, `quick-spec`) and prompts (`loop-implementation-readiness`, `review-release-candidate`) rather than replacing them.

# When to use

When the user says "build this feature", "take this idea to release", or when a project spans the full path from technical-risk verification through shipped, adversarially-proven implementation. Use when the work is large enough to need specs (3+ implementation stories) and important enough to need a release scorecard.

Not for: single-file tweaks (just do it), pure research (use brainstorming), single-feature specs without the build phase (use `quick-spec` directly), or work that has already been specced and only needs implementation (start at Phase 7).

# Preconditions

- A rough idea or problem statement (the playbook sharpens it)
- Access to the codebase (indexed or searchable) for proof-of-concept and spec investigation
- The user is available for confirmation at brief, breakdown, and readiness verdict stages
- The [`product-brief`](../product-brief/), [`quick-spec`](../quick-spec/), and [`issue-to-ready-specs`](../issue-to-ready-specs/) playbooks available for sub-steps
- The [`loop-implementation-readiness`](../../prompts/loop-implementation-readiness/) and [`review-release-candidate`](../../prompts/review-release-candidate/) prompts available for gates

# Inputs

- An idea, a problem statement, or a rough feature description
- User preferences on architecture decisions (collected during Phase 1 brief)
- A budget for the readiness loop (default: 1 round per 2 specs, floored at 8)

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

Validated in a real session (2026-07-26): the memory-bank project ran the full pipeline from proof-of-concept through release. Outcomes:

- **Proof of concept** verified `sqlite-memory` + `sqlite-vector` extensions load and `memory_add_text` / `memory_search` work — the core technical risk before any spec was written.
- **4 specs** (SPEC-1 core domain, SPEC-2 MCP server + 8 tools, SPEC-3 CLI + dashboard, SPEC-4 opencode plugin) written in parallel, all passing the 6-criterion Ready-for-Development standard.
- **Handoff resolution** parsed 19 handoffs (16 blocking, 3 non-blocking) — all resolved by spec amendment before implementation. Two shared-root-cause groups (missing SPEC-1 functions; signature conflicts) resolved in two amendment passes instead of 19.
- **Readiness loop** (8 rounds) extracted 29 requirements from the brief: 27 covered, 2 partial (success metrics that are post-launch measurements, not implementable ACs), 0 missing, 0 conflict. Verdict: READY_WITH_CONDITIONS.
- **Shared-assumption check** found 3 inconsistencies (1 internal counting error, 2 stale `k=` parameter references that didn't propagate from the reconciliation note to the task body) — all fixed before implementation. These would have caused `TypeError` at runtime.
- **Implementation** produced 88 Python tests passing + 84 TypeScript tests passing + `tsc --noEmit` clean. 172 tests total, 0 errors, 0 failures.
- **Release scorecard** verified 92 ACs (84 pass, 0 fail, 8 blocked on live-runtime verification), 9 ADRs holding, 7 defects (0 P0, 0 P1, 3 P2, 4 P3). Verdict: READY_WITH_CONDITIONS.

Key observations from the validating session:
- **Handoff resolution was the highest-value phase.** 19 handoffs caught and resolved before implementation — without it, downstream specs would have imported nonexistent functions and hit compile errors.
- **The shared-assumption check caught what Step 7 missed.** The reconciliation notes were correct; the task body code blocks they were supposed to reconcile were stale. The check verified the bodies, not just the notes.
- **The fix loop runs until green.** No P0/P1 defects shipped — the review surfaced them and the fix loop closed them.
- **Adversarial proving is the final gate.** Every user-facing surface tested for happy path, edge cases, and adversarial inputs before release.

# Failure Modes / Boundaries

- **Skipping the proof-of-concept** on a stack you haven't used before means spec'ing on unproven foundations. If the proof fails, the architecture changes — and so do all the specs. Always run Phase 0 for unfamiliar stacks.
- **Skipping the shared-assumption check** because "the specs look consistent" misses the most common parallel-spec failure: 3 specs guessing the same wrong schema field. Consensus is not verification — verify against the actual schema.
- **Shipping with open P0/P1 defects** violates the fix-loop gate. The loop runs until green. If a blocker can't be cleared, stop the release and escalate — don't ship with unowned blockers.
- **Treating the release scorecard as a formality** misses its value. The scorecard is where evidence anchors (test name, file:line, runtime check) get captured for every AC. A scorecard without evidence is not a scorecard.
- **Skipping adversarial proving** ships untested assumptions. Every user-facing surface (MCP tools, CLI commands, dashboard routes, plugin events) must be exercised against adversarial inputs — empty, null, oversized, injection, concurrent.
- **Large projects produce long sessions.** 4 specs with the full pipeline produced ~2500 lines of spec artifacts. Scope to what's actually shippable; defer the rest to a follow-up pipeline run.

# Related artifacts

- [`playbooks/product-brief/`](../product-brief/) — used in Phase 1 (Brief)
- [`playbooks/quick-spec/`](../quick-spec/) — used in Phase 3 (Spec Writing), provides the 6-criterion Ready-for-Development standard
- [`playbooks/issue-to-ready-specs/`](../issue-to-ready-specs/) — the predecessor orchestrator (issue → specs only; this playbook extends it through implementation and release)
- [`prompts/loop-implementation-readiness/`](../../prompts/loop-implementation-readiness/) — used in Phase 5 (Readiness Loop)
- [`prompts/review-release-candidate/`](../../prompts/review-release-candidate/) — used in Phase 9 (Release Candidate Review)