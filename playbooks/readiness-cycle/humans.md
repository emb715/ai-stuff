# Readiness Cycle — maintenance context

## What this is

A thin orchestrator chaining [raa](../raa/) → [implementation-orchestration](../implementation-orchestration/) → [review-release-candidate](../../prompts/review-release-candidate/) into a readiness cycle. Input: an existing artifact plus a readiness question. Output: verified-ready (with evidence) or blocked with a fix plan.

## Why it works

The three artifacts compose without overlap — each does one job:

- **RAA plans** (what to fix). It reads and maps the artifact, analyzes the gaps, and produces a file-scoped fix plan. It does not touch the artifact.
- **implementation-orchestration executes** (the fixes). It consumes the plan and produces committed, reviewed fixes.
- **review-release-candidate verifies** (did the fixes work). It runs the full verification lifecycle against the fixed artifact and produces a ship/hold/block scorecard.

The cycle sequences them. The loop handles the case where fixes introduce new gaps — after each fix cycle, re-assess before re-verifying.

## Design decisions

- **The cycle loops because fixes can introduce new gaps.** A single pass (RAA → fix → verify) would miss regressions introduced by the fix batch itself. Each fix round re-runs RAA on the remaining gaps as the new trigger, then re-verifies.
- **The human reviews the plan (Step 3) because "ready" is partly a judgment call.** What's good enough to share, release, or open-source is not fully determined by criteria — the human decides whether the plan addresses the right gaps. The gate also catches the case where RAA derived vague criteria from a vague question.
- **The ALREADY READY stop condition avoids unnecessary work.** If RAA's analysis finds no P0/P1 gaps, there is nothing to fix — skip implementation and go straight to verification. This handles artifacts that were already ready and just needed confirmation.
- **Defaulting to 3 cycles max on the same finding class prevents infinite loops.** Same threshold as implementation-orchestration's review non-convergence. After 3 cycles on the same class, escalate to the human — the artifact likely needs fundamental rework, which this cycle does not provide.
- **DEFERRED is an explicit human escape hatch, not a cycle output.** The cycle's clean output is VERIFIED READY or BLOCKED. DEFERRED exists because "ready" is a judgment call and the human may accept residual gaps the verifier flagged — but it is signed off explicitly, never silently.

## Origin

Created to fill the gap where an existing artifact needs a readiness assessment + fix cycle — not a build-from-scratch pipeline ([build-to-release](../build-to-release/)) or an issue→PR flow ([issue-to-pr](../issue-to-pr/)). The differences table in the README documents why RAA and review-release-candidate compose rather than overlap: RAA asks "what's a plan to make this ready?" and outputs a plan; review-release-candidate asks "does this pass its readiness criteria now?" and outputs a scorecard. Before fixes vs. after fixes. Plan vs. verdict. They sequence, they don't duplicate.

## Fleet role mapping (reference)

This playbook was authored under the ndv fleet. Role names below are functions, not fleet members — any equivalent role can fill them.

- **Orchestrator** = ndv-flow runs the cycle (Step 1, 3, 6 — the gates and loop control)
- **RAA** dispatches its own roles — see [raa/humans.md](../raa/humans.md) (Researcher, Analyst, Architect)
- **implementation-orchestration** dispatches its own roles — see [implementation-orchestration/humans.md](../implementation-orchestration/humans.md) (Builder, Reviewer)
- **review-release-candidate** is a prompt, no fleet role — it runs as a verification pass driven by the orchestrator

## Known gaps

- **Doesn't handle artifacts with no clear readiness criteria.** RAA must derive criteria from the readiness question. If the question is vague ("is this good?"), the derived criteria may miss implicit expectations. The Step 3 human gate is the guard, but it depends on the human noticing vague criteria.
- **The loop assumes fixes are possible.** If the artifact needs fundamental rework, BLOCKED fires correctly but the cycle offers no rework path — return to [build-to-release](../build-to-release/).
- **Doesn't handle multiple artifacts assessed in parallel.** One cycle per artifact. Parallel assessment would need a coordinator above this playbook — not yet authored.
- **No automatic criteria drift detection across cycles.** If the human amends criteria mid-cycle, the loop continues against the new criteria but prior-cycle findings were against the old. The orchestrator does not reconcile this — the human must re-trigger from Step 1 if criteria change materially.