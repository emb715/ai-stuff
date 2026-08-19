# humans.md — skill-authoring

## What this is

A meta-skill: a process for authoring other skills. Walks the full lifecycle from raw library documentation to a maintainable skill package (`SKILL.md` + `references/` + `humans.md`). The output is itself a skill that follows the conventions this skill teaches — it is self-applying.

## Why it works

Four structural choices carry most of the value:

**Source-of-truth priority order.** Official docs → changelog → type definitions → source. Each layer is more accurate but more expensive to read. Starting at docs and falling through only when needed keeps authoring time down and catches version drift early via the changelog.

**One footgun per skill.** Most libraries have one pattern that looks harmless but causes catastrophic or subtle failure. Documenting more than one dilutes the signal. The constraint forces ranking by severity, which is the judgment call that makes the skill useful. A fake footgun is worse than none — the inclusion test (non-obvious + severe + natural) exists to prevent fabrication.

**SKILL.md vs `references/` split by concern, not by API.** A `references/imports.md` file makes sense; a `references/useEffect.md` file does not. Concerns are stable across API changes; individual APIs are not. This split keeps the skill maintainable when the library releases a new version.

**Step 8 evaluation as the quality gate.** A skill that closes gaps in task 1 but adds noise to an unrelated task 3 is wrong. The three-task evaluation (without-skill → with-skill → cross-task) catches both under- and over-triggering. Without it, you are shipping on faith.

## Structure decisions

- `docs/` holds reference material the skill is grounded in: the Agent Skills specification, Claude platform overview, Claude best practices, and an ADR for this skill's own conventions. These are sources, not runtime context — `SKILL.md` does not route to them.
- No `references/` directory. The skill's depth lives inline in `SKILL.md` because the process itself is the content; there is no library API surface to break out by concern.
- `humans.md` (this file) explains the structure rationale, the design decisions, and the known gaps — none of which belong in `SKILL.md` because they do not change what code the model writes next.

## Known gaps

- No documented run evidence. The process encodes lessons from authoring multiple skills, but no individual authoring run has been captured in this repo with the Step 8 evaluation results. Status is `draft` until at least one run is documented.
- The 100–180 line SKILL.md target is a heuristic. No measurement validates this specific range versus, say, 80–150 or 120–200. Treat as a strong guideline, not a verified optimum.
- Step 2 (find the one footgun) is the highest-judgment step and the hardest to validate. The inclusion test helps, but "natural" and "non-obvious" are still subjective. Reviewer judgment is required.
- The skill does not address skill *deprecation* — what to do when a library's API changes enough that the existing skill is wrong. A maintenance procedure belongs here eventually.

## Origin

The skill was authored to encode a repeatable process for skill creation. The structure conventions (SKILL.md + references/ + humans.md, no-orphan rule, routing table pattern) draw from the Agent Skills specification and Claude platform best practices, both captured in `docs/`. ADR-001 records the structural decisions for this skill itself.

## Maintenance

- When the Agent Skills specification changes (tracked in `docs/specification.md`), re-audit `SKILL.md` against the new spec. The format spec is the upstream source of truth for structure.
- When Claude or another platform publishes new skill best practices, capture in `docs/` and check whether `SKILL.md` needs an updated step or checklist item.
- After a real authoring run: record outcomes in `README.md` Evidence section, reassess confidence, and consider promotion to `validated` after one run or `vetted` after 2–3 runs across different library shapes (web framework, CLI tool, data library).
- If a new step is added to the process, update the Step 8 evaluation to cover it — a step that is not evaluated is a step that will drift.

## Decision log

**2026-08-12: Changed `refs/` to `references/` across all skills.** The official Agent Skills spec uses `references/`. The shortened `refs/` was a vault convention that created divergence from the standard. Aligned to the spec.

**2026-08-12: Reverted SKILL.md to original content.** The task-skill track, "Skill or playbook?" routing section, and `[ ]` checklist convention were added this session as scope creep. The original Steps 1-10 are general enough for both library and task skills — "gather source of truth" works for a library OR a procedure, "find the footgun" works for an API misuse OR a procedural mistake. The routing decision belongs in `docs/standards/artifact-classification.md` (where it already exists), not in a skill that teaches authoring. Only the `refs/` → `references/` rename was kept (aligned with the official Agent Skills spec).