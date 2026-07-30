---
title: "Issue to PR"
status: draft
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "gh"
tags:
  - playbook
  - operations
  - orchestrator
  - issue
  - pr
  - full-cycle
owner: "@emb715"
---

# Purpose

Chains [issue-to-ready-specs](../issue-to-ready-specs/playbook.md) → [raa](../raa/playbook.md) → [implementation-orchestration](../implementation-orchestration/playbook.md) into a single full-cycle playbook that takes a GitHub issue to a merged PR. Adds optional human review gates between phases so a human can control each phase transition (gated mode) or trust the chain to run end-to-end (continuous mode).

# When to use

When you have a GitHub issue and want the full path to a merged PR without manually routing between the underlying playbooks. Two modes:

- **Gated (default):** human review gates after specs, after the plan, and before PR merge. Safe — the human controls each phase transition. Use for issues with ambiguity or when the human wants oversight.
- **Continuous:** no gates. Runs end-to-end from issue to merged PR. Only stops on BLOCKED or ABORT from the underlying playbooks. Use only when the issue is well-scoped and the human trusts the chain.

Not for: partial runs (use the underlying playbooks directly), or issues that need research before a spec can be written (use [issue-to-ready-specs](../issue-to-ready-specs/) alone first).

# Preconditions

- A GitHub issue with enough context to scope the feature
- Access to the codebase the issue targets (git repo, working directory)
- An agent fleet or solo execution path with role equivalents for each underlying playbook
- `gh` CLI installed for issue fetching and PR creation/merge

# Inputs

- `{{ISSUE_NUMBER}}` — the GitHub issue number to process
- `{{REPO}}` — the repository in `org/repo` form (e.g., `your-org/your-repo`)
- `{{MODE}}` — `gated` (default) or `continuous`. Selected once at the start and fixed for the run.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Draft status — not yet validated through real use. -->

_TODO: Document at least one real run — which issue, which mode (gated/continuous), how many specs produced, whether each gate was passed/rejected, whether the plan validated, time to merge, any BLOCKED/ABORT encountered. Quantitative preferred (e.g. "issue #N in gated mode → 4 specs, 3 gate approvals, plan validated on first pass, 2 review loops, 120 min to merged PR")._

# Failure Modes / Boundaries

- **Underlying playbook returns BLOCKED or ABORT.** Surface the blocker, name which phase produced it (specs / plan / implementation), and stop. Do not retry the failing phase automatically — the blocker needs a decision.
- **Mode mismatch in continuous.** Continuous mode can run past an error a human would have caught at a gate. The human trusts the chain — if that trust is misplaced, the error propagates. Use continuous only for well-scoped issues.
- **Issue too large for one cycle.** If issue-to-ready-specs returns a scope-too-large signal, or raa returns SCOPE TOO LARGE, do not force a single cycle. Split the issue and run the playbook on each sub-issue.
- **Gate rejection in gated mode.** A rejected gate stops the run. The playbook does not retry the rejected phase automatically — the human decides whether to amend and re-run or discard.
- **No rollback after late-phase failure.** If implementation commits land and a later step fails, the branch exists but the PR is not merged. The playbook does not auto-rollback the branch — the human reviews the partial state. (See humans.md known gaps.)
- **Assumes `gh` CLI is available.** Issue fetch (Step 1) and PR create/merge (Steps 7-8) require `gh`. Without it, the playbook cannot run.

# Related artifacts

- [issue-to-ready-specs](../issue-to-ready-specs/) — Step 2. Produces PRD + N READY specs from the issue.
- [raa](../raa/) — Step 4. Produces a validated file-scoped plan from the specs.
- [loop-implementation-readiness](../../prompts/loop-implementation-readiness/) — Step 5. Validates the plan against the codebase.
- [implementation-orchestration](../implementation-orchestration/) — Step 7. Executes the plan to a committed, reviewed, CI-green branch + PR.
- [build-to-release](../build-to-release/) — the idea→release variant; a broader cycle that starts upstream of a GitHub issue.