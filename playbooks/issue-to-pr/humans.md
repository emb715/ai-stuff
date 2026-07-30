# Humans — Issue to PR

## What this is

A thin orchestrator that chains three existing playbooks — [issue-to-ready-specs](../issue-to-ready-specs/), [raa](../raa/), [implementation-orchestration](../implementation-orchestration/) — into one full cycle from a GitHub issue to a merged PR. It does not re-implement any of the underlying work. Its only novel logic is the human review gates between phases.

## Why two modes

- **Gated (default)** gives the human control at each phase transition: after specs, after the plan, and before PR merge. Safe but slow. Use when the issue has ambiguity, the codebase is unfamiliar, or the human wants oversight.
- **Continuous** runs end-to-end with no gates, stopping only on BLOCKED or ABORT from the underlying playbooks. Fast but risky — a continuous run can sail past an error a human would have caught at a gate. Use only when the issue is well-scoped and the human trusts the chain.

The mode is selected once at the start and fixed for the run. Switching mid-run would mix oversight levels and break the contract.

## Design decisions

- **Compose, don't re-implement.** Each underlying playbook owns its phase. This playbook routes between them and adds gates. The specs come from issue-to-ready-specs; the plan comes from raa; the branch/PR come from implementation-orchestration. If an underlying playbook changes its contract, this playbook's chain updates — it does not absorb the logic.
- **Gates are the only novel logic.** Step 3, Step 6, and Step 8 (gated mode) are human approval points. Everything else is delegation to an underlying playbook or a one-line `gh` command.
- **Mode is fixed at the start.** Selected once, held for the run. No mid-run switching — that would produce a run with mixed oversight levels.
- **Plan validation is always run.** Step 5 (loop-implementation-readiness) runs in both modes, not just gated. A plan that fails against the codebase fails the whole cycle regardless of mode.
- **PR merge method is the repo's call.** The playbook defaults to `--squash --delete-branch` but defers to the repo's known convention. Not a decision this playbook makes.

## Origin

Created to fill the gap where [issue-to-ready-specs](../issue-to-ready-specs/) stops at "specs READY" with no routing to implementation. The chain from specs → plan → implementation → PR already existed as separate playbooks; this one wires them together and adds the human gates that make the full cycle safe to run.

## Fleet role mapping (reference)

This playbook was authored under the ndv fleet. The role names below are functions, not fleet members. Map them to whatever your fleet provides.

| Role | ndv agent |
|------|-----------|
| Researcher | ndv-research |
| Analyst | ndv-review |
| Architect | ndv-architect |
| Builder | ndv-build |
| Reviewer | ndv-review |
| Orchestrator | ndv-flow |

## Known gaps

- **Continuous mode can run past errors a human would catch.** The gates exist precisely to catch mid-chain errors. Continuous mode removes them. If the chain is wrong, continuous mode is wrong end-to-end.
- **No rollback if a late phase fails after early phases committed.** If implementation-orchestration commits a branch and a later step fails, the branch exists but the PR is not merged. This playbook does not auto-rollback the branch. The human reviews the partial state and decides whether to amend and re-run or discard the branch.
- **Assumes `gh` CLI is available.** Step 1 (issue fetch) and Steps 7-8 (PR create/merge) require `gh`. Without it, the playbook cannot run.
- **Merge method is guessed, not detected.** The playbook defaults to `--squash --delete-branch` and notes the repo convention may differ. It does not auto-detect the convention.