# humans.md — skill-authoring

## What this is

A meta-skill for authoring library, framework, and tool skills. It verifies claims, scopes common tasks, preserves essential safeguards, checks resource delivery, and distinguishes authored quality from measured usefulness. It remains one capability rather than a general orchestration framework.

## Design rationale (provisional)

Four structural choices carry most of the value:

**Verification depends on the claim.** Official docs establish intended usage; definitions/help establish signatures; implementation and observations establish behavior. These sources do not form a universally increasing accuracy ladder. The claim ledger makes conflicts and uncertainty reviewable.

**Safeguards follow consequence, not quota.** Severity, likelihood, and plausible misuse determine placement. Multiple essential warnings are appropriate for a tool that both deletes local data and sends records remotely. A fixed single-warning rule can hide common-path risks. A fabricated warning remains worse than none.

**SKILL.md vs `references/` split by concern, not by API.** A `references/imports.md` file makes sense; a `references/useEffect.md` file does not. Concerns are stable across API changes; individual APIs are not. This split keeps the skill maintainable when the library releases a new version.

**Separate evidence dimensions.** Static authoring checks, matched task behavior, actual harness discovery, and context cost answer different questions. Forcing a skill into a task does not test activation. One successful run does not establish reliability, and line count does not measure loaded context cost.

## Structure decisions

- `docs/` holds reference material the skill is grounded in: the Agent Skills specification, Claude platform overview, Claude best practices, and an ADR for this skill's own conventions. These are sources, not runtime context — `SKILL.md` does not route to them.
- No runtime `references/` directory currently. The procedure fits inline without a useful conditional loading boundary; this is not a prohibition on extracting depth later.
- `evals/` contains fictional source fixtures, identical paired task prompts, and grading expectations. These are testing resources, not required authoring context.
- `humans.md` (this file) holds maintenance rationale and historical decisions. Brief decision-relevant rationale is allowed in the runtime skill, but this file is never loaded by it.
- The framebook delegates authoring to the canonical skill rather than maintaining another copy of the same rules. The ADR and specification comparison table are aligned with the revision.

## Known gaps

- The README contains two historical authoring observations; neither is a controlled comparison isolating the skill's benefit. The earlier statement that no run evidence existed was stale.
- The revision's controlled fixtures are synthetic and deliberately exercise the reported failure modes. Results cannot establish broad generalization or downstream skill runtime correctness.
- No evidence establishes an optimal line range, warning count, or reference-link count. Those former constraints were removed rather than promoted to best practices.
- Failure-mode prioritization still needs reviewer judgment. A matched comparison may be non-discriminating when baseline models already handle the fixture well.
- Actual harness discovery, downstream package execution, repeat-run variability, and end-to-end token cost are separate outstanding checks unless explicitly measured in the README.
- The initial revised candidate and original both passed 17/17 formal assertions on the three fictional fixtures. These assertions did not discriminate; explicit fixture requirements may have supplied what either authoring procedure omitted. No behavioral superiority is established.
- Two runs disclosed additional mandatory repository reads, and exact executor model/context parity was not verified. The comparison is exploratory; a clean no-skill baseline, harder cases, and human review are still needed.
- Post-comparison review corrected step order and record drift. Final static checks do not stand in for rerunning behavioral comparisons on that exact final snapshot; hashes and limits are recorded in `evals/comparison.json`.
- The skill does not address skill *deprecation* — what to do when a library's API changes enough that the existing skill is wrong. A maintenance procedure belongs here eventually.

## Origin

The skill was authored to encode a repeatable process for skill creation. The structure conventions (SKILL.md + references/ + humans.md, no-orphan rule, routing table pattern) draw from the Agent Skills specification and Claude platform best practices, both captured in `docs/`. ADR-001 records the structural decisions for this skill itself.

## Maintenance

- When the Agent Skills specification changes (tracked in `docs/specification.md`), re-audit `SKILL.md` against the new spec. The format spec is the upstream source of truth for structure.
- When Claude or another platform publishes new skill best practices, capture in `docs/` and check whether `SKILL.md` needs an updated step or checklist item.
- After an authoring run: record actual outputs, settings, comparisons, and limitations in `README.md` Evidence. Change `last_tested` only after an observed test; lifecycle transitions use the vault promotion procedure and vetting rubric, not an automatic run-count threshold.
- When changing a rule, add or revise representative assertions. Keep executor prompts constant across configurations and distinguish observed results from proposed tests. Evaluation is now Step 10, after body compression and the description; freeze the candidate and rerun affected checks after substantive changes.
- Generated consumers must be updated at templates/generators/installers and checked after relocation. Resource delivery cannot be inferred from links alone.

## Decision log

**2026-08-12: Changed `refs/` to `references/` across all skills.** The official Agent Skills spec uses `references/`. The shortened `refs/` was a vault convention that created divergence from the standard. Aligned to the spec.

**2026-08-12: Reverted SKILL.md to original content.** The task-skill track, "Skill or playbook?" routing section, and `[ ]` checklist convention were added this session as scope creep. The original Steps 1-10 are general enough for both library and task skills — "gather source of truth" works for a library OR a procedure, "find the footgun" works for an API misuse OR a procedural mistake. The routing decision belongs in `docs/standards/artifact-classification.md` (where it already exists), not in a skill that teaches authoring. Only the `refs/` → `references/` rename was kept (aligned with the official Agent Skills spec).

**2026-10-07: Replaced arbitrary quotas with evidence-specific checks.** The user approved revision of skill-authoring, not the SnapBerry skills. The executable now permits cohesive multi-step capabilities and multiple essential safeguards, retains useful rationale, and separates source verification, behavioral comparison, discovery, and cost. The before/after authoring example stays in this meta-skill rather than being required in every produced domain skill. Existing name and draft/medium lifecycle are preserved. The historical ADR decisions are superseded where explicitly marked; changes are not proof of effectiveness.

**2026-10-07: Made standalone execution explicit.** At the user's request, removed the optional reference to another authoring skill and embedded the grading/reporting requirements directly. Repository lifecycle and metadata rules are conditional on the consuming project's supplied constraints, not prerequisites for using this skill. Research captures, evidence files, and the vault framebook remain maintainer/integration resources, not runtime dependencies. Static portability checks do not establish behavioral benefit.
