Take a GitHub issue to a merged PR by chaining [issue-to-ready-specs](../issue-to-ready-specs/playbook.md) → [raa](../raa/playbook.md) → [implementation-orchestration](../implementation-orchestration/playbook.md). Two modes: gated (human review gates between phases) and continuous (end-to-end, no gates). The orchestrator's only novel logic is the gates; the underlying playbooks do the work.

## Trigger

The user says "issue to PR", "take issue #N to a merged PR", or provides a GitHub issue number and wants the full cycle to a merged PR without manually routing between playbooks.

## Preconditions

- A GitHub issue number and repo
- Access to the codebase the issue targets
- An agent fleet or solo execution path with role equivalents for the underlying playbooks (Researcher, Analyst, Architect, Builder, Reviewer, Orchestrator)
- `gh` CLI installed for issue fetching and PR create/merge

## Mode selection

At the start, the user selects the mode. Default = `gated`.

- **gated** — human review gates after specs (Step 3), after the plan (Step 6), and before PR merge (Step 8). The playbook stops at each gate and waits for human approval. Use when the issue has ambiguity or the human wants oversight.
- **continuous** — no gates. Runs end-to-end from issue to merged PR. Only stops on BLOCKED or ABORT from the underlying playbooks. Use only when the issue is well-scoped and the human trusts the chain.

The mode is fixed for the run. Do not switch modes mid-run.

## Step 1 — Fetch the issue

Fetch the issue text and metadata:

```
gh issue view {{ISSUE_NUMBER}} --repo {{REPO}} --json title,body,labels,state
```

Parse the title, body, and labels into a feature description. If the issue is closed or lacks enough context to scope a feature, stop and surface what's missing.

## Step 2 — Run issue-to-ready-specs

Run the [issue-to-ready-specs](../issue-to-ready-specs/playbook.md) playbook against the issue. Input: the issue number and repo. Output: a PRD plus N implementation specs, all passing the Ready-for-Development standard (READY or READY_WITH_CONDITIONS).

If issue-to-ready-specs returns NOT_READY or SCOPE TOO LARGE, surface the blocker and stop. Do not proceed to Step 3.

## Step 3 — [GATED only] Spec review gate

Present the produced specs (PRD + N specs) to the human.

- If not approved → STOP. Surface what was rejected and why.
- If approved → continue to Step 4.

In continuous mode, skip this step. Proceed directly to Step 4.

## Step 4 — Run raa

Run the [raa](../raa/playbook.md) playbook, consuming the specs from Step 2 as the feature description. Input: the specs (PRD + N specs) as `{{FEATURE_DESCRIPTION}}`, the codebase as `{{CODEBASE}}`. Output: a validated, file-scoped, implementation-ready plan.

If raa returns BLOCKED or SCOPE TOO LARGE, surface the blocker and stop. Do not proceed to Step 5.

## Step 5 — Run loop-implementation-readiness

Run the [loop-implementation-readiness](../../prompts/loop-implementation-readiness/) prompt to validate the plan against the codebase. Input: the plan as `{{DOC}}`, the codebase as `{{CODEBASE}}`.

- If the verdict is NOT_READY → fix the plan and re-run the loop. Repeat until READY or READY_WITH_CONDITIONS.
- If READY or READY_WITH_CONDITIONS → proceed to Step 6.

Document any READY_WITH_CONDITIONS P1 unknowns and their required decisions before continuing.

## Step 6 — [GATED only] Plan review gate

Present the validated plan to the human.

- If not approved → STOP. Surface what was rejected and why.
- If approved → continue to Step 7.

In continuous mode, skip this step. Proceed directly to Step 7.

## Step 7 — Run implementation-orchestration

Run the [implementation-orchestration](../implementation-orchestration/playbook.md) playbook. Input: the validated plan as `{{PLAN}}`, the codebase as `{{CODEBASE}}`. Output: a committed, reviewed, CI-green branch and a created PR.

implementation-orchestration's Steps 6-7 (commit/push + create PR) already produce the PR. Do not duplicate those steps. The PR URL is available from `gh pr view --json url`.

If implementation-orchestration returns BLOCKED or ABORT, surface the blocker and stop. Do not proceed to Step 8.

## Step 8 — PR merge

**Gated mode:** present the PR to the human before merge.

- If not approved → STOP. Surface what was rejected and why.
- If approved → merge the PR.

**Continuous mode:** auto-merge the PR if CI is green and the mandatory review passed (implementation-orchestration's DONE condition). Do not merge if CI is red or review failed.

Merge command:

```
gh pr merge <PR_NUMBER> --repo {{REPO}} --squash --delete-branch
```

Adjust the merge method (`--squash`, `--merge`, `--rebase`) to match the repo's convention if known.

## Stop conditions

- **DONE:** PR merged. In continuous mode, auto-merged after CI green + review passed. In gated mode, merged after the human approves at Step 8.
- **BLOCKED:** any underlying playbook returns BLOCKED. Surface the blocker and which phase produced it (specs / plan / implementation).
- **ABORT:** any underlying playbook returns ABORT. Discard the branch and return to planning.
- **GATE_REJECTED (gated only):** the human rejects at a review gate (Step 3, 6, or 8). Stop and surface what was rejected and why.

## Verification checklist

Before declaring DONE:

- [ ] Issue fetched and parsed (Step 1)
- [ ] Specs produced and READY, or READY_WITH_CONDITIONS with documented P1 unknowns (Step 2)
- [ ] Specs human-approved (gated mode only) (Step 3)
- [ ] Plan produced and validated against the codebase (Steps 4-5)
- [ ] Plan human-approved (gated mode only) (Step 6)
- [ ] Implementation complete: branch committed, reviewed (0 P0/P1), CI-green (Step 7)
- [ ] PR created (Step 7)
- [ ] PR merged (continuous) or human-approved and merged (gated) (Step 8)