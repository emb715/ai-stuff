# ndv PR Review: maintenance notes

## Origin

Built from a design session on 2026-11-24. The goal was a PR review that uses the ndv fleet and decides what to look at from the system impact of the change, and runs locally, in GitHub and on any other surface that is cheap to reach. The official `code-review` and `pr-review-toolkit` plugins were the reference for structure.

## Decisions

- **Lives in the vault, not the fleet repo.** The fleet is installed from npm at run time, so where the plugin sits doesn't affect drift. The vault already holds the change-impact skill.
- **No bundled agents.** A copy of an agent file would drift from the fleet. The plugin only builds the plan.
- **Flow dispatches.** One orchestrator in the fleet, not two. The plugin hands Flow a read-only workload (every task S0 at V0) because Flow has no review mode yet. A review mode in the fleet is the clean fix, and it is optional upstream work.
- **Layer x op routing.** Change-impact's op alone can't tell a frontend change from a backend one, and the reviewers that matter differ. The matrix lives in `references/classify.md` so it can be tuned without touching the steps.
- **Verify every run.** Each Critical gets its own verifying agent and one agent checks all Warnings together (v0.8). Unverified findings cost the author's trust, and the per-finding pass on everything was most of the cost in v0.6.
- **ndv-explain writes last.** It may reorder and reword but must keep the severity counts. If the counts change, the unexplained summary ships instead.
- **Install globally when the fleet is missing,** so a local review never edits the repository's `CLAUDE.md`.
- **Re-review on push re-runs everything.** Per-primitive hashes come later. A head that already has a review comment is skipped.
- **Foreground agents only (v0.9).** In a headless run the session ends with the main turn, so a background agent's result never arrives and nothing is posted.
- **Flow, base-vs-head tests and explain are required (v0.9).** On the action's default model (Sonnet) they were skipped when optional. Run details lists each as `done` or `not run (<reason>)`.
- **OAuth token for the Action.** Workload identity signs in, but it bills API credit, and promotional API credit does not cover Claude Code. The OAuth token bills the subscription.
- **Promoted to `tools/` on 2026-11-27** after the first end-to-end Action review.

## Maintenance

- After editing `skills/change-impact-diagram/` in the vault, run `./sync-skills.sh`.
- When the fleet adds or renames an agent, update the routing matrix.
- When the fleet gains a review mode for Flow or a version stamp, remove the matching workaround from Step 6 or from `bin/ndv-fleet-check`.

## Known gaps

- The explain pass adds little on small PRs (one filler paragraph on a one-line change). Try running it only above a size, or tightening its brief.

- The verify pass uses `ndv-review` with a single-finding brief. A skeptic-shaped verifier (the `ndv-skeptical` module) may reject false positives better. This is untested.
- No OpenCode command yet.
- The routing matrix is a first guess, with no measurements behind it yet.
