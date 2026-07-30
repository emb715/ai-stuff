Take an idea from proof-of-concept to release-ready implementation through a gated pipeline. Each phase gates the next — no skipping. The pipeline is: proof → brief → specs → readiness → implement → handoffs → review → fix-loop → release.

## Trigger

User says "build this feature", "take this idea to release", or you have an idea that spans the full path from technical-risk verification through shipped, adversarially-proven implementation.

## Preconditions

- A rough idea or problem statement
- Access to the codebase (indexed or searchable)
- The user is available for confirmation at the brief, breakdown, and readiness verdict stages
- The [`product-brief`](../product-brief/) and [`quick-spec`](../quick-spec/) playbooks available for sub-steps
- The [`loop-implementation-readiness`](../../prompts/loop-implementation-readiness/) and [`review-release-candidate`](../../prompts/review-release-candidate/) prompts available for gates

## The Pipeline (phases)

### Phase 0 — Proof of Concept (gate)

Verify the core technical risk before investing in specs. The proof is the smallest possible program that exercises the riskiest assumption in the architecture — typically a 50-line script that proves the stack works end-to-end. If the proof fails, the architecture changes; do not spec on unproven foundations.

What counts as "the riskiest assumption" depends on the project. Examples: a new SQLite extension loads and its SQL functions return correctly; a third-party API accepts the auth shape you expect; a native build produces a working binary on the target platform. If you cannot name the riskiest assumption, the proof is "make the stack say hello" — set it up, get a round-trip through the riskiest component, and confirm the contract.

The proof is throwaway code. It does not go in the repo. Its only output is a verdict: the assumption holds, or it doesn't. If it doesn't, stop and re-architect before continuing.

**Gate:** the proof passes. If it fails, the architecture changes — return to the idea and revise.

### Phase 1 — Product Brief (gate)

Run the [`product-brief`](../product-brief/) playbook. Skip Step 2 (research) if research was done upstream in Phase 0 or a prior step — the proof-of-concept often doubles as the research step.

The brief has four required sections: problem, users, success, scope. Constraints fold into scope unless non-obvious. One correction round, then confirm. Two rounds at most.

**Gate:** the user confirms the brief in one or two rounds. An empty out-list is not acceptable — scope without exclusions is a wish.

### Phase 2 — Story Breakdown

Decompose the confirmed brief into implementation stories. Order by dependency: data layer first (schema, storage), then logic (API, enforcement), then presentation (UI, CLI), then integration (plugins, hooks). Merge by domain proximity — per the [`issue-to-ready-specs`](../issue-to-ready-specs/) guidance: "prefer broader specs." API + its CRUD is one spec, not two. Admin UI + advisor UI is one spec, not two. The implementer is better positioned to split than the spec writer.

Identify parallel-safe groups: stories with no file overlap can be implemented simultaneously. Record the file ownership map — which spec touches which files — for use in Phase 7 (Implementation) and Phase 8 (Handoff Resolution).

Present the breakdown to the user for confirmation. Name the spec count, the dependency order, and the parallel-safe groups.

**Gate:** the user confirms the breakdown. No gate beyond confirmation — but if the spec count is excessive (>6), push back and ask whether any two stories can be merged.

### Phase 3 — Spec Writing (parallel)

Write one [`quick-spec`](../quick-spec/) per story. Each spec passes the 6-criterion Ready-for-Development standard: Actionable, Logical, Testable, Complete, Self-contained, Consistent. Validate each criterion explicitly before declaring a spec ready.

**Required: verify every schema field referenced in a Task's code block exists on the model.** This is the single largest source of spec rework. Do not assume `User.orgId` exists — check the schema. A spec that references nonexistent fields fails the Self-contained criterion: a fresh agent would hit a compile error.

If parallel agents are available, dispatch one per spec — but run Phase 6 (Shared-Assumption Check) after. Parallel writers cannot cross-validate shared assumptions; the check is what makes parallelism safe.

**Gate:** every spec passes the 6-criterion standard. A spec that fails any criterion is not handed off — fix it before proceeding.

### Phase 4 — Handoff Resolution (gate)

Specs surface decision points they couldn't resolve in isolation — phrased as "Handoff → [specialist]: [question]". These are not prose to read and forget. They are routing events.

1. Parse every handoff line from all specs.
2. Deduplicate: multiple specs surfacing the same question → one resolution.
3. Classify:
   - **Blocking** — unresolved decision that affects multiple specs or blocks implementation.
   - **Non-blocking** — verification or future improvement that doesn't block.
4. Resolve blocking handoffs:
   - If specialist agents are available, dispatch to the named specialist.
   - If working alone, investigate the question directly in the codebase.
5. Apply resolutions as spec amendments.
6. **Re-verify amendment propagation**: check that the amendment propagated to ALL sections of the spec — Tasks, Test Plan, Edge Cases, Known Issues, and any code blocks. **Stale test mocks after a Task amendment are the most common blind spot.** The amendment fixes the implementation description but leaves the verification description describing the old code. Grep the spec body for the old form after writing the reconciliation note — the note is not the fix, the body is.

**Gate:** no handoff remains unresolved (status "pending" = failure). All blocking handoffs have status "resolved" and their amendments propagated to all sections.

### Phase 5 — Readiness Loop (gate)

Run the [`loop-implementation-readiness`](../../prompts/loop-implementation-readiness/) prompt with:
- `{{DOC}}` = the product brief file path
- `{{CODEBASE}}` = the spec files (the implementation artifacts being validated — the specs ARE the implementation artifacts at this stage; production code comes later)
- `{{BUDGET}}` = N rounds (1 round per 2 specs as a floor; 8 minimum)

The prompt handles: Round 0 requirement extraction (structured, from specific brief sections — every "In MVP" bullet → one requirement, every Constraints line → one requirement, every explicit decision → one requirement), shared-root-cause detection after Round 0 classification, per-round classification with evidence anchors, post-amendment propagation checks, and the tri-state verdict.

Extract requirements from the brief sections, not free-form: every "In MVP" bullet → one requirement, every "Out of MVP" bullet → one requirement (negative coverage check), every Constraints line → one requirement, every explicit decision → one requirement, every Acceptance Criterion → one requirement.

Classify each requirement: covered | partial | missing | conflict. Record the evidence anchor (file + symbol/line/test name) — no anchor means missing.

Stop the loop when:
- **READY** — every requirement is evidence-backed AND no P0/P1 unknowns remain. Proceed to Phase 6.
- **READY_WITH_CONDITIONS** — all P0 requirements are covered; remaining items are P1 unknowns, each paired with the exact user decision it needs. Proceed to Phase 6 if the conditions don't block the shared-assumption check. Document the P1s.
- **NOT_READY** — progress stopped or budget exhausted with unresolved P0/P1. Surface, per blocker: the exact missing decision, the requirement ID it blocks, and the smallest action that would unblock it. Do not proceed.

**Gate:** the loop returns READY or READY_WITH_CONDITIONS. If NOT_READY, surface blockers to the user and do not proceed.

### Phase 6 — Shared-Assumption Check (gate, if 3+ parallel specs)

If 3+ specs were written in parallel and reference the same codebase entities (models, schemas, function signatures, constants):

1. Extract every schema field, model name, function signature, and constant referenced in any spec.
2. Identify shared assumptions — entities referenced by 2+ specs.
3. Verify each against the actual schema (not against other specs — consensus is not verification). The canonical source is wherever the entity is actually defined: the schema migration, the model file, the canonical spec (often SPEC-1).
4. If any shared assumption is wrong, amend ALL affected specs in one pass. Re-verify amendment propagation — bodies, not just reconciliation notes.

This catches the most common parallel-spec failure mode: 3 specs independently guessing the same wrong schema field. Without it, the readiness loop catches it one spec at a time, costing N amendments + N re-audits.

If working sequentially, this check is lower-risk but not zero — still run it.

**Gate:** all shared assumptions verified against the canonical source. All amendments propagated to all sections of all affected specs.

### Phase 7 — Implementation (parallel)

Implement specs in dependency order. SPEC-1 (foundation) first; then SPEC-2/3/4 in parallel if no file overlap (consult the file ownership map from Phase 2).

Each implementation:
1. Read the full spec — including the reconciliation sections (the R-sections / S-sections are authoritative and supersede the original body where they conflict).
2. Read the reference files the spec points to.
3. Create the files the spec describes.
4. Run the verification commands the spec's Test Plan specifies.
5. Fix import errors and surface-level breakage.
6. Report: files created, tests run, pass/fail counts, any handoffs surfaced during implementation.

If a spec cannot be implemented as written (the spec is wrong, not the implementation), stop. Surface the discrepancy. Do not silently improvise — that's how spec drift becomes implementation drift.

**Gate:** each spec has a working implementation with its Test Plan passing. Handoffs surfaced during implementation are collected for Phase 8.

### Phase 8 — Post-Implementation Handoff Resolution (gate)

Parse ALL handoffs from ALL implementation tasks. Implementation surfaces its own handoffs — "this spec assumed X, but the actual codebase does Y" — that weren't visible at spec time.

1. Classify: Blocking vs Non-blocking (same definitions as Phase 4).
2. Batch by agent: multiple handoffs to the same agent → one dispatch with all context inlined.
3. Dispatch blocking handoffs in parallel (no file overlap). Apply code fixes.
4. Do NOT proceed to Phase 9 until all blocking handoffs have status "resolved".

Non-blocking handoffs (verification, future improvement, code smell) are logged but do not block the review. They become candidates for the release scorecard's "Open Defects" table.

**Gate:** all blocking handoffs resolved. Non-blocking handoffs logged.

### Phase 9 — Release Candidate Review (gate)

Run the [`review-release-candidate`](../../prompts/review-release-candidate/) prompt. Build a release scorecard:

1. Inventory every Acceptance Criterion from every spec against its implementation.
2. Capture concrete evidence for each: test name, file:line, runtime verification step, manual check. No evidence anchor = not verified.
3. Triage findings by severity:
   - **P0** — rollout-blocking. Must be fixed before release.
   - **P1** — high. Must be fixed or explicitly deferred with owner.
   - **P2** — medium. Can ship with documented residual risk.
   - **P3** — low. Code-smell level; follow-up cleanup.
4. Write the release scorecard: pass/fail per AC, open defects (severity + root cause + owner + status), cross-file patterns, ADR compliance, residual risk with owner + justification.
5. Record a verdict: **READY** / **READY_WITH_CONDITIONS** / **NOT_READY**.

**Gate:** the review returns READY or READY_WITH_CONDITIONS with all P0/P1 defects either fixed or documented with an owner. If NOT_READY, surface blockers — do not proceed to the fix loop until the blockers are understood.

### Phase 10 — Fix Loop (until green)

Take all P0/P1/P2 defects from the review. (P3s are logged but do not enter the loop — they're follow-up cleanup.)

1. Batch defects by file overlap: defects touching disjoint files → parallel dispatch. Defects touching the same file → serial.
2. Dispatch fixes. Each fix: root cause, code change, re-run the affected tests.
3. Re-run the review (Phase 9) on the changed surface.
4. Repeat until:
   - All P0/P1 pass.
   - No unowned blockers remain (every open defect has an owner).
   - Residual risk is signed off or explicitly deferred.
5. **Stop the release and escalate** on any blocker that can't be cleared within the candidate window. Do not ship with unowned blockers.

The loop is bounded by the defect count, not a fixed budget — but if a round produces no progress (no defect's classification improved), stop and escalate. Idling is not progress.

**Gate:** all P0/P1 pass; P2 either fixed or signed off; no unowned blockers.

### Phase 11 — Adversarial Proving (gate)

Run adversarial testing on every user-facing surface. For the memory-bank project, this was: 8 MCP tools, 7 CLI commands, 3 dashboard routes, 3 plugin events. For your project, enumerate the equivalent surfaces.

For each surface:
1. **Happy path** — the documented normal use. Does it return the documented result?
2. **Edge cases** — empty input, null, missing fields, boundary values, oversized input.
3. **Adversarial inputs** — injection attempts (prompt injection if LLM-touching, SQL injection if DB-touching, path traversal if file-touching), concurrent calls, malformed JSON, truncated payloads.

Every test must pass. No untested assumptions ship. A surface that is only verified by mocked tests (not exercised against the real runtime) is "BLOCKED" in the scorecard — flag it as a residual risk with an owner, do not mark it as pass.

**Gate:** every user-facing surface tested against happy path + edge cases + adversarial inputs. All pass, or all BLOCKED surfaces have a documented residual risk with an owner.

### Phase 12 — Release

All gates passed:
- Phase 0 proof held.
- Phase 1 brief confirmed.
- Phase 2 breakdown confirmed.
- Phase 3 specs pass the 6-criterion standard.
- Phase 4 all blocking handoffs resolved, amendments propagated.
- Phase 5 readiness loop returned READY or READY_WITH_CONDITIONS.
- Phase 6 shared assumptions verified against canonical source.
- Phase 7 each spec implemented, Test Plan passing.
- Phase 8 post-implementation blocking handoffs resolved.
- Phase 9 release scorecard written with evidence per AC.
- Phase 10 fix loop closed all P0/P1, P2 signed off.
- Phase 11 adversarial proving passed on every user-facing surface.

Ship. The release scorecard is the artifact of record — it documents what was verified, what was deferred, and what residual risk remains.

## Verification

The pipeline ran correctly if and only if:

- Every phase gate passed (no gate was skipped or rubber-stamped).
- The release scorecard has an evidence anchor for every AC (test name, file:line, or runtime check). No anchor = not verified.
- No P0/P1 defect ships. P2/P3 defects are documented with an owner.
- Every user-facing surface was adversarially tested or marked BLOCKED with a residual risk owner.
- The product brief's "In MVP" list is fully covered by spec anchors in the readiness report.
- No handoff remains with status "pending" — all are "resolved" or documented as non-blocking.

## Rollback / Fallback

- **Phase 0 fails (proof doesn't hold)** → the architecture changes. Return to the idea, revise, re-architect. Do not spec on the failed assumption.
- **Phase 1 stalls (user can't name what's out of scope)** → ask: "If you had to cut half the features right now, what goes first?" An empty out-list is not acceptable.
- **Phase 4 handoffs pile up unresolved** → the spec investigation (Phase 3) was too shallow. More upfront investigation means fewer handoffs during writing.
- **Phase 5 returns NOT_READY** → surface the exact blockers and required decisions. Do not ship partial specs. Re-run the loop after the user resolves the blockers.
- **Phase 6 finds a wrong shared assumption** → amend all affected specs in one pass. Re-verify amendment propagation (bodies, not just notes). If the assumption is foundational (a core model field), re-run Phase 5 on the amended specs.
- **Phase 7 implementation can't match the spec** → stop. Surface the discrepancy. Do not improvise silently — that's how spec drift becomes implementation drift. Either amend the spec or fix the codebase to match, but make the choice explicit.
- **Phase 9 returns NOT_READY** → the fix loop (Phase 10) runs on the P0/P1 defects. If a blocker can't be cleared, stop the release and escalate.
- **Phase 10 can't close a blocker** → stop the release. Escalate. Do not ship with unowned P0/P1.
- **Phase 11 finds a surface that fails adversarial input** → it's a defect. Route to Phase 10's fix loop. Do not ship a surface that fails adversarial testing.
- **The project is too large for one pipeline run** → split into phases. Run the pipeline on phase 1, ship it, then run it again on phase 2. Do not run a 12-spec pipeline in one session — scope to what's actually shippable.