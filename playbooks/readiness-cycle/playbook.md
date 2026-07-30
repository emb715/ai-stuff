Take an existing artifact from a readiness question to a verified-ready verdict or a blocked-with-plan state by chaining [raa](../raa/playbook.md) → [implementation-orchestration](../implementation-orchestration/playbook.md) → [review-release-candidate](../../prompts/review-release-candidate/prompt.md) into a cycle. The cycle loops until the verifier returns ship, or the human explicitly defers the remaining gaps. The orchestrator's only novel logic is the loop and the human plan-review gate; the underlying artifacts do the work.

## Trigger

The user has an existing artifact and asks a readiness question: "is this ready to share / release / open-source / hand off?", "readiness check on {{ARTIFACT}}", or provides an artifact plus a readiness question and wants the full path to a verified-ready verdict without manually routing between the underlying artifacts.

## Preconditions

- An existing artifact to assess (template, repo, package, document) — path or repo reference
- Access to the artifact's codebase/files
- A readiness question
- An agent fleet or solo execution path with role equivalents for the underlying artifacts (Researcher, Analyst, Architect, Builder, Reviewer, Orchestrator)

## Step 1 — Confirm the artifact and readiness question

Identify the artifact (`{{ARTIFACT}}`) and the readiness question (`{{READINESS_QUESTION}}`). Define what "ready" means for this context: share, release, open-source, or hand off.

Determine the readiness criteria:
- If `{{CRITERIA}}` is provided, use it.
- If not, derive criteria from the readiness question before proceeding. Surface the derived criteria to the human. If the criteria are vague and cannot be made concrete, stop and surface the ambiguity — do not proceed with a meaningless plan.

## Step 2 — Run RAA

Run the [raa](../raa/playbook.md) playbook against the artifact. Inputs:
- `{{FEATURE_DESCRIPTION}}` = the readiness question, with the derived/provided criteria as the feature description
- `{{CODEBASE}}` = the artifact (`{{ARTIFACT}}`)

Output: a file-scoped fix plan addressing the gaps that block readiness.

If RAA returns BLOCKED, surface the blocker and stop — a fundamental issue prevents readiness. If RAA returns SCOPE TOO LARGE, break the artifact into sub-artifacts and run a cycle on each.

## Step 3 — Human plan review

Present the plan to the human.

- If the plan shows no P0/P1 gaps (RAA's analysis found the artifact already ready), skip to Step 5 — go straight to verification.
- If the human approves the plan, continue to Step 4.
- If the human rejects the plan, stop and surface what was rejected and why.

## Step 4 — Run implementation-orchestration

Run the [implementation-orchestration](../implementation-orchestration/playbook.md) playbook on the fix plan. Input: the validated plan as `{{PLAN}}`, the artifact's codebase as `{{CODEBASE}}`. Output: committed, reviewed fixes to the artifact.

If implementation-orchestration returns BLOCKED or ABORT, surface the blocker and stop. Do not proceed to Step 5.

## Step 5 — Run review-release-candidate

Run the [review-release-candidate](../../prompts/review-release-candidate/prompt.md) prompt against the fixed artifact. Inputs:
- `{{CANDIDATE}}` = the fixed artifact (`{{ARTIFACT}}`)
- `{{ACCEPTANCE_CRITERIA}}` = the readiness criteria (from Step 1)

Output: a release scorecard with pass/fail per criterion, defects by severity, and a ship/hold/block verdict.

## Step 6 — Evaluate the verdict

- If verdict is **ship**: done — the artifact is verified ready. All P0/P1 criteria pass; residual risk is signed off or deferred.
- If verdict is **hold** or **block**: surface the remaining blockers. Loop back to Step 2 with the remaining gaps as the new readiness trigger, or have the human explicitly defer the remaining gaps with justification. Each cycle must address the prior cycle's remaining gaps.

## Stop conditions

- **VERIFIED READY:** review-release-candidate returns ship — all P0/P1 criteria pass, residual risk signed off or deferred.
- **ALREADY READY:** RAA's analysis finds no P0/P1 gaps — skip implementation (Step 4) and go straight to verification (Step 5).
- **BLOCKED:** RAA returns BLOCKED (a fundamental issue prevents readiness), or implementation-orchestration returns ABORT (fixes can't complete), or review-release-candidate can't converge after 3 cycles on the same finding class — escalate to the human.
- **DEFERRED:** the human explicitly defers the remaining gaps with justification. Recorded as a signed-off residual, not a verified-ready state.

## Verification checklist

Before declaring done:

- [ ] Artifact and readiness question confirmed
- [ ] Readiness criteria identified (provided or derived)
- [ ] RAA produced a file-scoped fix plan
- [ ] Human reviewed the plan (or plan showed no P0/P1 gaps — ALREADY READY path)
- [ ] Fixes applied via implementation-orchestration (if any gaps existed)
- [ ] review-release-candidate produced a scorecard
- [ ] Verdict is ship, OR remaining gaps explicitly deferred with human sign-off
- [ ] If looped: each cycle addressed the prior cycle's remaining gaps