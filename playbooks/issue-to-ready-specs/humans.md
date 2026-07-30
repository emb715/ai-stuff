# humans.md — issue-to-ready-specs

## What this is

A playbook that chains the full path from GitHub issue to implementation-ready spec suite. It composes product-brief and quick-spec with the surrounding phases they don't cover: issue fetching, parallel codebase research, architecture decisions, story breakdown, handoff resolution, and a readiness audit. Designed to be usable by any agent or human, not just a specific fleet.

## Why it works

Three structural choices carry most of the value:

**The readiness loop is the quality gate.** Spec writing is mechanical once research is done. The architecture is high-leverage but happens once. The readiness loop is where errors are caught — it traced every PRD requirement to code evidence, found 3 blockers sharing one root cause, and caught a stale test plan that per-section validation missed. Without the loop, specs ship with unverified assumptions.

**Handoffs are routing events, not prose.** Spec writers surface decision points they couldn't resolve in isolation. Treating these as "dispatch + resolve + amend + re-verify" instead of "read + forget" is what makes parallel spec writing safe. The handoff resolution step exists because parallel writers can't cross-validate.

**The shared-assumption check catches the most common parallel failure.** Three specs written in parallel all assumed `User.orgId` existed. It didn't. They made the same wrong guess because the wrong assumption was the "obvious" one. The check verifies shared assumptions against the schema, not against other specs — consensus is not verification.

## Design decisions

- **Composes existing playbooks, doesn't replace them.** product-brief handles Step 3, quick-spec handles Step 6. This playbook provides the scaffolding around them. If those playbooks improve, this workflow improves automatically.
- **Fleet-agnostic.** The sequence works with parallel agents (dispatch N investigations simultaneously) or sequentially (one at a time, dependency order). The gotchas section notes where parallel execution introduces risks that sequential execution avoids.
- **Readiness loop uses a bounded budget.** "Stop when no progress" prevents over-iteration. After 3 rounds with no classification improvement, the loop stops and surfaces the remaining blockers.
- **Shared-assumption check is a separate step, not folded into the readiness loop.** The loop is per-requirement; the shared-assumption check is cross-spec. They catch different failure modes. Folding them together would lose the cross-spec view.
- **Gotchas from the validating session are inlined.** The playbook's Gotchas section is not generic advice — each item is a specific failure that happened in the session that produced this playbook.

## Origin

Extracted from a real session (2026-07-13) that turned GitHub issue #1696 (AI usage and billing) into a PRD + 9 implementation specs. The session used the ndv fleet (ndv-research, ndv-architect, ndv-explain, ndv-diagnose, ndv-refactor, ndv-review) but the workflow is fleet-agnostic — the sequence is what matters, not the agents.

The session produced 9 specs totaling ~7000 lines, all passing the Ready-for-Development standard. 4 handoffs were resolved. The readiness audit found 3 blockers (all the same root cause: `User.orgId` doesn't exist), fixed them, re-audited, found 1 stale test plan, fixed that, and reached READY.

## Maintenance

- **If the readiness loop consistently returns READY_WITH_CONDITIONS**, the PRD may be underspecified. Check whether the PRD has decision points that should have been resolved in Step 2 (Architect) rather than deferred to the loop.
- **If the shared-assumption check finds nothing**, either you're writing specs sequentially (lower risk) or the specs don't share codebase entities (uncommon for a single feature). The check is cheap; keep running it.
- **If handoffs pile up unresolved**, the spec investigation (Step 5) was too shallow. More upfront investigation means fewer handoffs during writing.
- **If the session is too long**, reduce the number of specs. 9 specs was excessive — 3-4 broader specs would have been faster with the same coverage. The implementer can split during implementation.
- **Promote to `status: validated`** after 2-3 real runs with documented outcomes. Current state: one validating session, fleet-specific. Needs at least one run without the ndv fleet to confirm fleet-agnosticism.