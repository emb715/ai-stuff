# humans.md — implementation-orchestration

## What this is

A playbook that turns a validated implementation plan into a committed, reviewed, CI-green branch. The plan is the input — it must already be phased, file-scoped, dependency-ordered, and risk-named. The playbook parses it, dispatches build agents across phases, tracks handoffs in a ledger, gates merge on a mandatory review, and runs a CI fix loop until DONE. It is agent-agnostic: the structure (research → review → architect → build → test → optimize → refactor → review) is what matters, not the fleet names.

It does not plan. Planning is upstream — RAA, an architect agent, a PRD, a sprint story, or a human. The plan may come from any of those; the source doesn't matter. What matters is that the plan has the four required shape properties (phases with ordered dependencies, file-level scope per phase, named risks, a handoff list). If any are missing, this playbook stops and sends you back to planning.

## Why it works

Six structural choices carry most of the value:

**File ownership as the parallelism boundary.** Parallel dispatch is authorized only when two streams' file sets are disjoint. File ownership — not task ownership, not module ownership — is the boundary because file conflicts are the only failure mode that silently corrupts parallel work. Two agents writing the same file produce a merge that looks clean but isn't: one clobbers the other's change, and the post-phase conflict check is the only thing that catches it. Task-level parallelism hides this; module-level parallelism hides it. File-level ownership exposes it before it ships.

**One phase at a time.** Phases are serialized because each depends on the prior phase's output — types → queries → components → integration. Parallelizing phases that depend on each other produces agents working against stale assumptions (a component built against a type signature that the prior phase hasn't finalized yet). A phase is complete only when all its streams return; partial completion blocks.

**Mandatory review gates merge.** The review agent must pass the branch with zero P0/P1 before DONE is declared. CI is not sufficient as a gate. CI catches mechanical failures — types, tests, lint — but not architectural drift: an implementation that compiles and passes tests but doesn't match the plan's intent. Review catches intent drift; CI doesn't. Gating on both is what makes the branch merge-ready rather than just green.

**Handoff ledger, classified by dispatch trigger.** Every build-agent handoff (to a tester, optimizer, refactorer) is recorded with its trigger: blocking (dispatch before next phase), conditional (dispatch only if a risk materializes), or non-blocking (batch after all phases). The classification is what prevents two failure modes: handoffs lost because no one extracted them from a stream's return, and handoffs dispatched eagerly when they should have been conditional. The post-phase protocol extracts handoffs; the ledger tracks them; the classification decides when they fire.

**Minimal diff per agent.** Each build agent receives a brief with exact files, exact changes, what NOT to touch, and a verification command. The exclusion list is the guardrail against scope creep — the thing that breaks parallelism. An agent that touches a file outside its scope collides with the stream that owns that file.

**Stop conditions stated separately.** DONE, BLOCKED, and ABORT are explicit and distinct. DONE is a checklist (phases complete, no conflicts, handoffs resolved, review passed, branch from main, CI green). BLOCKED surfaces a specific blocker with the smallest unblocking action. ABORT discards the branch and returns to planning — used when the plan is fundamentally flawed.

## Design decisions

**File ownership, not task or module ownership (decision 1).** Task ownership fails because two tasks can touch the same file without the orchestrator noticing. Module ownership fails because "module" is fuzzy — two files in the same module may be edited independently, or two files in different modules may share an import graph that makes them effectively coupled. File ownership is the only boundary that is both precise (a file is a file) and sufficient (file conflicts are the only silent-corruption failure mode). The cost is that the orchestrator must build a file-overlap matrix in Step 1 — but that matrix is what makes parallel dispatch safe, so the cost is the point.

**Phases serialized (decision 2).** Each phase depends on the prior phase's output. Parallelizing dependent phases produces stale-assumption work. The rare exception is cross-phase parallelism (Step 3): a stream from a later phase can run in parallel with an incomplete stream from an earlier phase if their file sets are disjoint and the later phase's data dependencies are already satisfied. In practice this is rare after Phase 1 — most phases depend on the prior phase's output, so the condition "data dependencies already satisfied" usually fails. The rarity is why the note is short: most of the time, phases are strictly sequential.

**Review gates merge, not just CI (decision 3).** CI catches mechanical failures. Review catches intent drift — an implementation that satisfies the letter of the plan but misses the architectural intent (a batched query that's actually an N+1, a type guard that exists but is wrong, a test that asserts nothing). The review brief includes the plan's architectural decisions and risk register specifically so the reviewer can check intent, not just correctness. Without the review gate, a branch could be green and wrong.

**Review non-convergence escalates to ABORT (decision 4).** If the review loops ≥3 times on the same finding class, the playbook escalates to ABORT rather than looping again. The reasoning: a review that won't converge signals an underspecified plan — the plan doesn't tell the builder what "done" means for that finding class, so the builder keeps producing something the reviewer keeps rejecting. Looping forever wastes effort on both sides. ABORT returns the work to planning, where the gap can be specified. This was added in a prior pass after observing that unconvergent reviews were always a planning defect, not an implementation defect.

**Pre-existing CI failure baseline (decision 5).** Step 8's CI fix loop allows "only pre-existing failures" as a DONE condition — but only if the failure is baselined. The baseline procedure: checkout `main`, run the same check; if it fails there, it's pre-existing; record it and exclude from this PR's scope. Without the baseline, claiming a failure is "pre-existing" is uncheckable — any failing check could be hand-waved as "not ours." The baseline makes the claim falsifiable. This was added in a prior pass to close the loophole where CI red is declared someone else's problem without proof.

**Agent fleet mapping reduced to one line (decision 6).** An earlier version had a full 8-row table mapping each role (research, review, architect, build, test, optimize, refactor, orchestrate) to its ndv equivalent. It was cut to one line. Why: each step's dispatch rules already specify which role does what (Step 2 dispatches build agents, Step 5 dispatches a review agent, Step 4 dispatches handoffs by role). The table duplicated that specification. The one-line pointer preserves the ndv reference mapping for users who want it, without the duplication. The agent-agnostic principle (Principle 1) is what makes this safe — the structure is the artifact, the names are a convenience.

**"Never" list trimmed (decision 7).** An earlier version had 9 "Never" items. A prior pass trimmed to 5; the directive conversion trimmed to 4. Items that restated Principles were cut (a Principle and a Never that say the same thing is redundancy). The 4 that remain are operational prohibitions, not principle restatements: don't skip the post-phase protocol (the file-conflict check is the parallelism safety net), don't `git add .` (stages unrelated changes), don't continue past BLOCKED unilaterally (BLOCKED exists to be surfaced), don't assume CI will pass without running lint/type-check locally (local-first catches failures before the round-trip).

**Project-agnostic examples (decision 8).** An earlier version had framework-specific examples: "highlight" (a React-specific concept), "re-renders" (React-specific), Biome as the primary linter. A prior pass deprojectized them: "highlight" → "naming normalization," "re-renders" → "recomputation or re-renders" (React-agnostic), Biome demoted from primary linter to an example in the CI fix loop's lint classification. Why: a generic playbook with framework-specific examples breaks the agent-agnostic principle. A user running this against a Python repo or a Go repo would read "highlight" and "re-renders" as noise. The examples now illustrate the structure without binding it to a stack.

**What was intentionally left out.** No config file, no per-project customization layer, no continuation/resume logic. The playbook is stateless within a run — orchestration state is built in Step 1 and updated through the phases, but there's no persistent state to resume. If a run is interrupted, you re-parse the plan and re-dispatch from the current phase. This is the right tradeoff for a playbook: persistence adds complexity without value, because the plan (the input) is the source of truth, not the orchestration state.

## Origin

This playbook was created to execute the plans produced by RAA. RAA produces a validated, file-scoped plan; implementation-orchestration turns that plan into a committed, reviewed, CI-green branch. The two are a pair: RAA is the planning phase, this is the execution phase.

It was authored in this repo (ai-stuff). Lifecycle:
- First version: a 222-line single file mixing directive and rationale.
- Trimmed to 201 lines (cut redundancy, theater, principle restatements).
- Converted to pure directive form at 198 lines by an ndv-refactor pass that moved all rationale to this file.
- Split into the three-file structure (`README.md`, `playbook.md`, `humans.md`) per the artifact-structure standard.

The rationale removed in the directive conversion is captured here (in "Why it works" and "Design decisions"), not lost. Specific items moved:
- The plan-source-agnosticism note ("the plan may come from an architect agent, a PRD, a sprint story, or a human — the source doesn't matter") — now in "What this is."
- The illustrative examples for blocking, conditional, and non-blocking handoffs (e.g., "a refactor that extracts a shared component the review needs to see," "performance optimization only if a query is slow," "test coverage for new code, documentation updates") — the classification scheme is documented in "Why it works"; the examples were illustrative and not load-bearing.
- The rarity note on cross-phase parallelism ("in practice, this is rare after Phase 1") — now in "Design decisions," decision 2, with the reasoning (most phases depend on the prior phase's output).

## Maintenance

- **The playbook is the primary maintenance surface.** Structural changes (new steps, changed dispatch rules, new stop conditions) go in `playbook.md`. This file captures the why; if you change the what, update the corresponding design decision here so the rationale doesn't drift from the directive.
- **When the artifact ages, check three things.** (1) Does the review focus list in Step 5 still match what your review agent actually checks? If your fleet's review agent has new capabilities (e.g., a security pass that wasn't there before), add it. (2) Does the CI fix loop's failure classification (lint, type-check, tests, build) still cover the failures you actually hit? If you hit a new class (e.g., a deployment step in CI), add it. (3) Does the "Never" list still cover the operational prohibitions you've actually violated in practice? If a new violation pattern emerged, add it — but only if it's operational, not a Principle restatement.
- **To extend it.** Add a step, not a layer. The playbook is a flat sequence (parse → phase 1 → phases → handoffs → review → commit → PR → CI). If you need a new concern (e.g., a pre-deploy step, a post-merge verification), add it as Step 9, not as a parallel track. Parallel tracks break the one-phase-at-a-time serialization that makes the playbook safe.
- **Promote to `vetted`.** Currently `draft` — not yet tested in real use. Promotion to `vetted` requires at least one documented run in `README.md`'s Evidence section (which plan, how many phases/streams, fleet used, parallel groups dispatched, review loops to PASS, CI failures hit and fixed, time to DONE) and passing the vetting rubric. The playbook stays in `playbooks/` — `vetted` is a frontmatter status, not a folder move.
- **If the file-overlap matrix is consistently wrong** (shared files missed, conflicts in post-phase check), the problem is Step 1's parsing, not the parallel dispatch. Strengthen the file-scope extraction in Step 1, not the conflict resolution in the post-phase protocol — catching it earlier is cheaper than resolving it later.

## Known gaps

- **No documented run yet.** The Evidence section in `README.md` is a placeholder. Until at least one real run is recorded, the playbook's status is `draft` and confidence is `medium`. The structure is reasoned from the problem (parallel build-agent orchestration), not yet from observed outcomes.
- **Solo-execution path is implicit, not explicit.** The playbook says "agent fleet (or solo execution)" in the preconditions, but the steps are written assuming a fleet — dispatch, parallel streams, handoff ledger. A solo developer running this without a fleet has to mentally collapse "dispatch a build agent" into "do the work yourself." A future revision could add a solo-execution note per step, or a companion mode. Not covered because the fleet case is the harder case and the solo case reduces to "do each step yourself, no parallelism."
- **No guidance on partial-phase completion.** The playbook says partial completion blocks, but doesn't specify what to do with the streams that did return. If 3 of 5 streams in a phase return success and 2 block, are the 3 committed? Held? The current answer is implicit: the phase isn't complete, so nothing commits until the phase is complete. An explicit note would remove ambiguity. Not covered because the common case is all-success or all-blocked; the partial case is rare and the implicit rule (nothing commits until the phase completes) is reasonable.
- **Review loop budget is fixed at ≥3.** The ≥3-loops-then-ABORT rule is a heuristic, not a tuned threshold. It may be too aggressive (some legitimate fix cycles need 4-5 loops) or too lenient (some plans are so underspecified that 2 loops is already evidence). No data yet to tune it. Revisit after documented runs.
- **No multi-PR strategy.** The playbook produces one branch, one PR. For plans large enough that the PR is unreviewable (hundreds of files), a multi-PR strategy (one PR per phase, or per stream) would be better. Not covered because multi-PR introduces its own coordination cost (merge order, inter-PR dependencies) and the single-PR case is the default that works for most plans.

**Handoff → ndv-diagnose (root cause):** none currently. If a documented run reveals a structural failure (e.g., the file-overlap matrix consistently misses a class of shared file, or the review non-convergence threshold is wrong), log it here and route the root-cause investigation to ndv-diagnose.

## Fleet role mapping (reference)

This playbook was authored under the ndv fleet. The role names in the steps (Builder, Reviewer, Tester, Optimizer, Refactorer, Orchestrator) are functions, not fleet members; the steps dispatch by role. If you are wiring a concrete fleet, this is the role→agent mapping for the originating fleet — construct the equivalent for yours.

| Role | ndv agent |
|------|-----------|
| Research | ndv-research |
| Review | ndv-review |
| Architect | ndv-architect |
| Build | ndv-build |
| Test | ndv-tester |
| Optimize | ndv-optimize |
| Refactor | ndv-refactor |
| Orchestrate | ndv-flow |

The Orchestrator role runs this playbook — it dispatches, tracks, and verifies; it does not implement code. Solo mode needs no mapping: one agent or human performs each role as the steps require, sequentially (no parallelism, since there is one worker).
