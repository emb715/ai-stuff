# Arch Design Pipeline

## Trigger

A work item that might involve architectural decisions beyond single-session scope: new capability requiring design choices, cross-cutting system change, interface/contract definition, or a feature where the "how" is consequential and non-obvious. If unsure, enter the pipeline — Step 1 will gate.

## Preconditions

1. A feature request or work item has been logged and classified as non-trivial by the caller (not the pipeline — the decision to consider this pipeline is made BEFORE entering it)
2. A team context exists — at least 2 people (author + reviewer). This pipeline requires independent review at each checkpoint; single-operator self-review defeats the gates
3. An output directory `{{OUTPUT_DIR}}` has been chosen by the caller (e.g., `docs/architecture/`, `docs/adr/`, `design-docs/`, or any project-specific location). The playbook does not assume a path — the caller decides where design docs land.
4. No existing design doc set for the same feature slug. If one exists: resume the existing set (pick up at the last incomplete stage) or slug-suffix the new effort (e.g., `<feature>-v2`) if the prior set is deprecated or abandoned

## Procedure / Steps

- **Step 1 — Entry triage (YAGNI gate).** Assess whether the work item warrants the full pipeline. If trivial (bugfix, single-file change, cosmetic) → exit pipeline, hand directly to `request-triage`. If architectural → proceed to step 2.
- **Step 2 — Create design folder.** Create `{{OUTPUT_DIR}}/<feature-slug>/` with slug in kebab-case. If `{{OUTPUT_DIR}}` does not exist, create it. Register the new feature slug in `{{OUTPUT_DIR}}/README.md` (create the index if it does not exist).
- **Step 3 — Author PRD.** Copy `templates/prd-template.md` → `{{OUTPUT_DIR}}/<feature-slug>/prd.md`. Fill using the feature request as input. Optionally use `prompts/loop-prd-readiness/` for refinement. Set status `draft`.
  - **Checkpoint 1 (human review):** PRD reviewed and approved. On sign-off: transition PRD to `validated` (evidence = reviewer sign-off). Does not advance until validated.
- **Step 4 — Author RFD.** Copy `templates/rfd-template.md` → `{{OUTPUT_DIR}}/<feature-slug>/rfd.md`. Fill using the approved PRD as input. Must reference the PRD. Set status `draft`.
  - **Checkpoint 2 (human review):** RFD reviewed. On sign-off: transition RFD to `validated`. If rejected → revert RFD to `draft`, loop back to PRD scope adjustment or redo RFD.
- **Step 5 — Author NRFD.** Copy `templates/nrfd-template.md` → `{{OUTPUT_DIR}}/<feature-slug>/nrfd.md`. Fill using the approved RFD as input. Must reference the RFD. Set status `draft`.
  - **Checkpoint 3 (human review):** NRFD reviewed. On sign-off: transition NRFD to `validated`. If targets unachievable → revert NRFD to `draft`, loop back to RFD.
- **Step 6 — Author Tech Spec.** Copy `templates/tech-spec-template.md` → `{{OUTPUT_DIR}}/<feature-slug>/tech-spec.md`. Fill using the approved RFD + NRFD as input. Must reference both. Define contract version. Set status `draft`.
  - **Checkpoint 4 (human review):** Spec reviewed. On sign-off: transition Tech Spec to `validated`. If contracts don't satisfy RFD/NRFD → revert Spec to `draft`, loop back.
- **Step 7 — Set coherence review.** Review the complete design doc set (PRD+RFD+NRFD+Spec) as a coherent whole. Confirm cross-references resolve, quality targets from NRFD are achievable under RFD's architecture, and Tech Spec contracts satisfy both. Record the review outcome in each doc's Evidence section. On approval: update `last_tested` on all four docs to the review date. On rejection: identify which doc is the root cause, revert it to `draft`, and loop back to its stage.
- **Step 8 — Hand off to request-triage.** If the complete set reached `validated` (all four docs passed their checkpoints + Step 7 coherence review confirmed): pass the design doc set path (`{{OUTPUT_DIR}}/<feature-slug>/`) to `request-triage`. Triage selects execution paradigm (spec or plan) using the Tech Spec as input. The pipeline terminates here. If the pipeline was abandoned mid-flow (Rollback): do not hand off — the pipeline terminated without producing consumable output.

## Workflow

```
                    ┌─ trivial? ──▶ request-triage (bypass)
trigger ─▶ entry triage ┤
                    └─ architectural? ──▶ create folder ─▶ PRD ─▶ [review] ─▶ RFD ─▶ [review] ─▶ NRFD ─▶ [review] ─▶ Spec ─▶ [review] ─▶ set coherence review ─▶ request-triage
                                                              │              │              │             │
                                                              └─ rejected ────┴── loop back ─┘
```

## Rollback / Fallback

- **Stage-level:** a rejected doc reverts to `draft` for revision. Upstream docs that the rejection loops back to also revert to `draft` (see Loop-back state contract). Other docs that were already `validated` at their checkpoint remain `validated` — they are not affected unless the loop-back reaches them.
- **Pipeline-level:** if abandoned, deprecate all docs in the folder with reason "pipeline abandoned" + pointer if revived later. The folder is retained as a record.

## Loop-back state contract

When a checkpoint rejects a doc and loops back to an upstream doc:

1. The rejected doc reverts to `draft` (it was `validated` at its checkpoint; rejection means the validation was wrong)
2. The upstream doc being looped back to reverts to `draft` (it needs revision)
3. The upstream doc's checkpoint re-fires after revision
4. All downstream docs that depend on the revised upstream doc become stale — they revert to `draft` and must be re-authored or re-reviewed against the revised upstream
5. The stale downstream doc is NOT discarded — its content is a starting point for re-authoring, but it must be re-validated against the revised dependency

Example: NRFD checkpoint rejects (targets unachievable) → loop back to RFD. RFD reverts to `draft`, NRFD reverts to `draft`. RFD is revised, passes Checkpoint 2 again. NRFD is re-authored against the revised RFD, passes Checkpoint 3 again. Tech Spec (if already authored) is stale and reverts to `draft` — it must be re-validated against the revised RFD.