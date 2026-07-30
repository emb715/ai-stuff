Execute a validated implementation plan across a fleet of build agents. Input: a validated plan (readiness already confirmed via [loop-implementation-readiness](../../prompts/loop-implementation-readiness/) or equivalent). Output: a committed, reviewed, CI-green branch ready for merge.

## Trigger

A validated plan exists (phased, file-scoped, dependency-ordered). The plan must have:

- Phases with ordered dependencies
- File-level scope per phase (which files change, what changes in each)
- Named risks that could inflate the estimate
- A handoff list (agents to dispatch after or during implementation)

If the plan lacks any of these, stop and run a planning phase first ([RAA](../raa/playbook.md), architect agent, or ask the user).

## Principles

- **Agent-agnostic.** Operate by role, not by fleet. Each step names a role (Builder, Reviewer, Tester, Optimizer, Refactorer, Orchestrator); dispatch that role to whatever agent your fleet provides for it, or run it yourself in solo mode. The structure is what matters: research → review → architect → build → test → optimize → refactor → review.
- **File ownership is the parallelism boundary.** Run two agents in parallel only if their file sets are disjoint. Serialize shared files. Parallelism is proven, not assumed.
- **One phase at a time.** A phase is complete when all its streams return success. Do not start the next phase until its dependencies are satisfied. Partial completion blocks.
- **Track every handoff.** Record each build-agent handoff (to a tester, optimizer, refactorer) in a ledger with a dispatch trigger. Classify as blocking (dispatch before next phase), conditional (dispatch only if triggered), or non-blocking (batch at the end).
- **Review gates merge.** Do not declare a branch "done" until a review agent passes it with zero P0/P1 findings.
- **Minimal diff.** Give each build agent a scoped brief: exact files, exact changes, what NOT to touch. Reject scope creep — it breaks parallelism.

## Step 1 — Parse the plan

Extract from the validated plan:

1. **Phase list** — ordered phases with dependencies. For each phase:
   - Stream decomposition (which work can parallelize within the phase)
   - File scope per stream (the exact files that stream will modify or create)
   - Architectural decisions that constrain implementation

2. **File-overlap matrix** — cross-reference all streams across all phases. Identify:
   - **Parallel-safe groups:** streams in the same or different phases whose file sets are disjoint
   - **Serialization constraints:** files touched by multiple streams or phases — these must execute in dependency order
   - **Cross-phase parallelism:** streams from different phases that can run simultaneously if their files don't overlap and the later phase's data dependencies are already satisfied

3. **Handoff ledger** — extract all handoffs mentioned in the plan:
   - Agent, source (which phase/stream produces it), trigger condition, file/symbol, description
   - Classify each: blocking (gates next phase), conditional (only if a risk materializes), non-blocking (batch after all phases)

4. **Risk register** — extract named risks with their inflation estimates. These become conditional handoff triggers.

Record all four as the orchestration state. Update this state after every phase and review it before dispatching the next.

## Step 2 — Execute Phase 1 (foundation)

Phase 1 is the foundation — data layer, type definitions, schema changes, or whatever the rest of the plan depends on. It blocks all subsequent phases.

### Dispatch rules

1. Identify streams within the phase. Order them by internal dependencies (Stream A may produce a type that Stream B needs).
2. Streams with no internal dependency and disjoint file sets → dispatch in parallel (single message, multiple agent calls).
3. Streams with internal dependencies → dispatch sequentially. Do not dispatch a dependent stream until the dependency stream returns.
4. Provide each build agent a brief containing:
   - Exact files to modify/create (with current file state if needed)
   - Exact changes to make (code snippets, signatures, return shapes)
   - What NOT to touch (explicit exclusion list)
   - Already-completed context (what prior phases/streams have done, so the agent doesn't redo work)
   - Verification command (type-check, test, or lint to run after changes)
   - A completion sentinel (a unique string the agent returns to confirm it finished)

### Post-phase protocol

After all streams in the phase return:

1. **Verify no file conflicts.** If two streams touched the same file, read it and confirm the changes merged cleanly. Resolve conflicts manually before proceeding.
2. **Extract handoffs.** Check each stream's return for handoff requests. Add them to the ledger with their classification.
3. **Check for blockers.** Resolve any reported failure or dependency gap before the next phase.
4. **Update orchestration state.** Mark the phase complete, record what was built, update the file-overlap matrix (files created here may affect later phases).

## Step 3 — Execute subsequent phases

For each remaining phase:

1. **Confirm dependencies are satisfied.** All prior phases this phase depends on must be complete. If a prior phase is incomplete, block.
2. **Check cross-phase parallelism.** If this phase has streams whose files don't overlap with any incomplete streams from other phases, run them in parallel with those streams. Most phases depend on the prior phase's output — verify the dependency is satisfied before relying on cross-phase parallelism.
3. **Dispatch streams** using the same rules as Step 2 (parallel if disjoint, sequential if dependent).
4. **Run post-phase protocol** (verify, extract handoffs, check blockers, update state).

### Common phase patterns

| Phase type | Typical scope | Parallelism |
|------------|--------------|-------------|
| Data layer | Types, DB queries, API procedures, service methods | 2-3 streams (type extension ‖ query functions ‖ procedures) |
| UI layer | Components, routes, hooks | 2 streams per file group (shared files serialize) |
| Integration | Wiring components to data layer, route loaders | Usually sequential (touches files from multiple prior phases) |
| Polish | Shared component extraction, dedup, naming normalization | Sequential (touches files from multiple prior phases) |

## Step 4 — Dispatch handoffs

After all implementation phases complete, dispatch the handoff ledger.

### Blocking handoffs
Dispatch immediately — these gate the review.
- Dispatch trigger: immediately after the phase that produced them.

### Conditional handoffs
Dispatch only if the trigger condition is met.
- Dispatch trigger: the risk condition materializing (e.g., test shows slow query, type-check reveals missing method).

### Non-blocking handoffs
Batch and dispatch after all phases + blocking handoffs complete. These are quality improvements that don't gate the review.
- Dispatch trigger: after the mandatory review passes (or in parallel with it if file sets are disjoint).

### Dispatch parallelism for handoffs
Same rule as phases: parallel if file sets are disjoint, serialize if shared files. Handoffs from different agents (tester, optimizer, refactorer) typically have disjoint file sets — dispatch in parallel.

## Step 5 — Mandatory review

After all phases and blocking handoffs complete: dispatch a review agent.

### Review brief
Provide the review agent:
- The complete list of changed files (from `git diff --name-only`)
- The acceptance criteria or requirements list
- The architectural decisions to verify
- The plan's risk register (to check if risks materialized)

### Review focus
- Correctness: does the implementation match the plan?
- N+1 queries: are batch joins actually batched?
- Type safety: holes, unsafe casts, missing null checks?
- Security: input sanitization, injection risks?
- Accessibility: if UI changes, are ARIA/keyboard/screen-reader concerns addressed?
- Performance: unbounded queries, missing limits, unnecessary recomputation or re-renders?
- Error handling: missing try/catch, swallowed errors?
- Backward compatibility: do existing callers still work?
- Test quality: real assertions, not placeholders?

### Review verdict
- **PASS** (zero P0/P1): proceed to commit.
- **BLOCKED** (any P0/P1): fix all P0/P1 findings before proceeding. Dispatch fix agents (same parallelism rules). Re-run review after fixes. Repeat until PASS. If review loops ≥3 times on the same finding class, escalate to ABORT — the plan is underspecified.

## Step 6 — Commit and push

1. Create a feature branch from `main` (or the repo's default branch). If `main` is checked out elsewhere, branch from `origin/main`: `git fetch origin main && git checkout -b <branch> origin/main`.
2. Stage only the feature files (explicit `git add` with file paths, not `git add .`). Exclude unrelated working-tree changes.
3. Commit with a descriptive message matching the repo's convention. Do not add co-author lines unless the repo uses them.
4. If handoffs produced additional commits (tests, optimizations, refactors), commit those separately with scoped messages.
5. Push the branch: `git push -u origin <branch>`.

## Step 7 — Create PR

1. Read the repo's PR template (check `.github/pull_request_template.md` or equivalent).
2. Create the PR using `gh pr create` with `--base main --head <branch>`.
3. Fill the PR template with:
   - Summary: why the change exists, not just what it does
   - Test plan: automated tests + manual verification checklist
   - Any repo-specific checklist items (AI tool checks, compliance checks, etc.)
4. Get the PR URL from `gh pr view --json url`.

## Step 8 — CI fix loop

After the PR is created, CI checks run. Monitor and fix failures:

1. `gh pr checks <PR_NUMBER>` — see which checks pass/fail.
2. For each failed check, get the logs: `gh run view <run-id> --job <job-id> --log`.
3. Classify the failure:
   - **Lint:** formatting/import errors → run the repo's linter fix command (e.g., `biome check --write`, `eslint --fix`)
   - **Type-check:** TS errors → add guards, fix types, narrow unions
   - **Tests:** failing assertions → fix the code or update the test (if the test was wrong)
   - **Build:** import errors, missing modules → fix imports, regenerate types
4. Fix all failures. Fix failures in different files in parallel.
5. Commit the fixes with a scoped message (e.g., `fix: biome formatting + TS null guards in test files`).
6. Push. CI re-runs automatically.
7. Repeat until all checks pass (or only pre-existing failures remain). Baseline: checkout `main`, run the same check; if it fails there, it's pre-existing — record it and exclude from this PR's scope.

## Stop conditions

- **DONE:** PR created, all CI checks green (or only pre-existing failures), mandatory review passed (0 P0/P1), all blocking handoffs resolved.
- **BLOCKED:** a phase or fix cannot complete due to a missing decision, missing dependency, or unresolvable conflict. Surface the blocker with: what's missing, which requirement it blocks, and the smallest action that would unblock it.
- **ABORT:** the plan is fundamentally flawed (a conflict that can't be amended). Discard the branch and return to planning.

## Never

- Skip the post-phase protocol (file conflict check, handoff extraction).
- `git add .` — always stage explicit file paths to exclude unrelated changes.
- Continue past a BLOCKED condition unilaterally.
- Assume CI will pass without running lint/type-check locally first.

## Agent fleet mapping

Agent-agnostic — see Principle 1. The steps dispatch by role. The orchestrator role runs this playbook — it dispatches, tracks, and verifies; it does not implement code.

## Verification checklist

Before declaring DONE:

- [ ] All phases complete (every stream returned its sentinel)
- [ ] No file conflicts from parallel streams
- [ ] All blocking handoffs dispatched and resolved
- [ ] Mandatory review passed (0 P0, 0 P1)
- [ ] Branch created from main (not from another feature branch)
- [ ] Commit(s) staged with explicit file paths (no unrelated changes)
- [ ] PR created with the repo's template
- [ ] All CI checks green (or only pre-existing failures with baseline confirmation)
- [ ] Conditional handoffs either dispatched or explicitly deferred with a reason
- [ ] Non-blocking handoffs either dispatched or listed as follow-up action items