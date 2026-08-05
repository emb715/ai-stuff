Turn a GitHub issue into a complete, implementation-ready spec suite in one session. The output is a PRD plus N implementation specs, all passing a Ready-for-Development standard, with all decision points resolved.

## Trigger

User says "spec this issue", "break down issue #N into specs", or you have a GitHub issue that needs to become implementable work items.

## Preconditions

- A GitHub issue with enough context to scope the feature (can be rough)
- Access to the codebase (indexed or searchable)
- The user is available for brief confirmation and preference decisions (e.g., cron vs lazy evaluation, units, hierarchy resolution)
- The [`product-brief`](../product-brief/) and [`quick-spec`](../quick-spec/) playbooks available for sub-steps

## Sequence

### 1. Fetch and research (parallel)

- Fetch the issue: `gh issue view <N> --repo <org/repo> --json title,body,labels,assignees,state,comments`
- If a codebase index tool is available, run a session-start query to confirm the repo is indexed
- Research the codebase areas the issue touches. Dispatch one investigation per domain area (schema, API, UI, infra, existing feature integration). Each investigation returns: file paths, existing patterns, integration points, gotchas

If no parallel agent fleet is available, do these investigations sequentially — one area at a time, record findings, move to the next.

### 2. Architect (sequential, depends on research)

- Synthesize the research into architecture decisions: schema design, enforcement flow, hierarchy resolution, API surface, migration strategy
- If an architect agent is available, dispatch with research inlined. If not, draft the decisions yourself from the research
- Present decisions to the user for confirmation. Key decisions that need user input: units (credits vs tokens), reset mechanism (cron vs lazy), hierarchy resolution (lowest-wins vs additive), feature flags

### 3. Brief (sequential, depends on architect)

- Run the [`product-brief`](../product-brief/) playbook, but **skip Step 2 (Research)** — it was done in Step 1
- Pre-fill Scope/Constraints from the architecture decisions — do not re-derive
- Present the brief with the one correction question: "What's wrong, what's missing, what needs to change?"
- Apply corrections, confirm

### 4. Story breakdown (sequential, depends on brief)

- Decompose the confirmed brief into implementation stories. Each story is one outcome with clear dependencies
- Order by dependency: data layer first (schema), then logic (API, enforcement), then presentation (UI)
- Identify parallel-safe groups: stories with no file overlap can be implemented simultaneously

**Merge-by-domain-proximity check (before finalizing the count):**
After drafting the breakdown, before presenting it, check: can two adjacent stories be one broader spec that the implementer splits during implementation? API + its CRUD is one spec, not two. Admin UI + advisor UI is one spec, not two. The implementer is better positioned to split than the spec writer — they have the codebase in front of them. Signal to merge: domain proximity + shared codebase patterns, not a count. No hard ceiling — epics legitimately need more specs than single features.

**Brief ↔ breakdown coverage check (before presenting):**
Build a mapping table: every brief MVP item → story(ies) that cover it. If any MVP item has no story, either add a story or explain how an existing story covers it. This catches the most common breakdown defect: a user overrides an architect decision during Step 2 (e.g., "cron, not lazy eval"), the brief incorporates the override (Step 3), but the breakdown still reflects the original architect decision because the override didn't propagate forward.

| Brief MVP item | Story(ies) | Covered? |
|---|---|---|
| [MVP item 1] | [Story N] | ✓ |
| [MVP item 2] | [Story N, Story M] | ✓ |
| [MVP item 3] | — | ✗ add a story |

Present the breakdown AND the coverage table to the user for confirmation.

### 5. Spec investigation (parallel, depends on breakdown)

- For each story, investigate the specific files/patterns it touches. One investigation per story
- Inline prior research (from Step 1) so no re-investigation of already-mapped areas
- Each investigation returns: exact file paths, line numbers, existing patterns to follow, insertion points for new code

If working sequentially, do these in dependency order — schema stories first, then downstream stories can reference the schema spec.

### 6. Spec writing (parallel, depends on investigation)

- Write one spec per story following the [`quick-spec`](../quick-spec/) playbook structure: Problem, Scope, Context, Acceptance Criteria (Given/When/Then), Tasks (file paths + specific actions), Test Plan
- Each spec must pass the six-criterion Ready-for-Development standard: Actionable, Logical, Testable, Complete, Self-contained, Consistent
- **Required: verify every schema field referenced in a Task's code block exists on the model.** This is the single largest source of spec rework. Do not assume `User.orgId` exists — check the schema

If writing specs in parallel (multiple agents), see Handoff Resolution below — parallel writers cannot cross-validate shared assumptions.

### 7. Handoff resolution (sequential, depends on specs)

Specs often surface decision points they couldn't resolve in isolation — phrased as "Handoff → [specialist]: [question]". These are not prose to read and forget. They are routing events.

1. Parse every handoff line from all specs
2. Deduplicate: multiple specs surfacing the same question → one resolution
3. Classify:
   - **Blocking** — unresolved decision that affects multiple specs or blocks implementation
   - **Non-blocking** — verification or future improvement that doesn't block
4. Resolve blocking handoffs:
   - If you have specialist agents, dispatch to the named specialist
   - If working alone, investigate the question directly in the codebase
5. Apply resolutions as spec amendments
6. **Re-verify amendment propagation**: run the `Consistent` check from [`quick-spec`](../quick-spec/) Step 4 on each amended spec — read Tasks, Test Plan, Edge Cases, and Known Issues together; do they reference the same model names, query shapes, and API contracts? The common blind spot: after amending a Task, the Test Plan still mocks the old query. The `Consistent` criterion is the structural check for this; do not re-describe it in prose — invoke it

### 8. Readiness loop (sequential, depends on amended specs)

Audit whether the spec suite is ready for implementation by tracing every requirement from the PRD to code evidence in the specs.

Run the [`loop-implementation-readiness`](../../prompts/loop-implementation-readiness/) prompt with:
- `{{DOC}}` = the PRD file path
- `{{CODEBASE}}` = the spec files (the implementation artifacts being validated)
- `{{BUDGET}}` = 12 rounds (adjust based on spec count — 1 round per 2 specs as a floor)

The prompt handles: Round 0 requirement extraction (structured, from specific PRD sections), shared-root-cause detection after Round 0 classification, per-round classification with evidence anchors, post-amendment propagation checks, and the tri-state verdict (READY / READY_WITH_CONDITIONS / NOT_READY).

**What the playbook adds on top of the prompt:**

1. **Scope the codebase to the specs, not the production code.** The loop validates that the specs cover the PRD requirements — the specs ARE the implementation artifacts at this stage. Production code comes later.

2. **Treat spec amendments as the loop's actions.** When the loop classifies an item as `partial` or `missing`, the smallest action is usually a spec amendment (not a code change). Apply amendments via the same handoff-resolution pattern from Step 7.

3. **After the loop returns a verdict:**
   - **READY** → proceed to Step 9 (shared-assumption check)
   - **READY_WITH_CONDITIONS** → document the P1 unknowns and their required user decisions; proceed to Step 9 if the conditions don't block the shared-assumption check
   - **NOT_READY** → surface blockers to the user; do not proceed to Step 9 until P0s are resolved

### 9. Shared-assumption check (before declaring READY)

If 3+ specs were written in parallel and reference the same codebase entities (User, Organization, Team, Member):

1. Extract every schema field and model name referenced in any spec's Tasks or code blocks
2. Identify shared assumptions — fields/models referenced by 2+ specs
3. Verify each against the actual schema (not against other specs — consensus is not verification)
4. If any shared assumption is wrong, amend ALL affected specs in one pass

This catches the most common parallel-spec failure mode: 3 specs independently guessing the same wrong schema field.

## Stop conditions

- **READY** — ship to implementation
- **READY_WITH_CONDITIONS** — ship with the conditions documented; each P1 unknown has a named user decision
- **NOT_READY** — surface blockers, do not ship

## Gotchas

- **Parallel spec writers share wrong assumptions.** Three specs written in parallel all assumed `User.orgId` existed. It didn't — membership is via a `Member` join table. The shared-assumption check (Step 9) catches this. Without it, the readiness loop catches it one spec at a time, costing 3 amendments + 1 re-audit
- **Amendments don't propagate to test plans.** After amending a Task's query, the Test Plan still mocked the old query. The Consistent criterion (from quick-spec) catches this. Without it, tests written from the spec would throw against the amended implementation
- **The product-brief research phase is redundant if research was done upstream.** Skip it. The brief's value is the Scope/Constraints section, not re-researching
- **The readiness loop is the highest-value phase.** It caught 3 blockers, 1 stale test plan, and confirmed all P0s. Do not skip it or short-circuit it
- **The brief ↔ breakdown coverage check catches decision-override drift.** If the user overrides an architect decision in Step 2 (e.g., "cron, not lazy eval"), the brief incorporates the override but the breakdown can still reflect the original decision. The coverage table in Step 4 makes this visible before dispatch

## Verification

- Every spec passes the six-criterion Ready-for-Development standard
- Every PRD requirement has a code anchor in at least one spec
- Every brief MVP item maps to at least one story in the breakdown (Step 4 coverage table)
- No handoff remains unresolved (status "pending" = failure)
- Shared assumptions across parallel specs are verified against the schema
- The `Consistent` criterion was re-run on every amended spec after handoff resolution (Step 7.6)
- The user confirmed: the brief, the story breakdown (with coverage table), and the final readiness verdict

## Rollback / Fallback

- If the issue is too large for one session → split into phases, spec one phase at a time
- If research reveals the issue is unclear → go back to the user with specific questions before architecting
- If the readiness loop returns NOT_READY → surface the exact blockers and required decisions; do not ship partial specs
- If parallel agents are not available → run sequentially in dependency order; the workflow still works, just slower