---
title: "Classify an Artifact"
status: draft
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - classification
  - routing
owner: "@emb715"
---

# Classify an Artifact

Fast decision flow for determining where a new artifact belongs in the repo.

## Context / Problem

Most repo drift comes from wrong placement: procedures stored as prompts, prompts stored as docs, mixed assets with no lifecycle clarity. `docs/standards/artifact-classification.md` defines the taxonomy but is a reference document — not an executable decision flow. People still get confused mid-session about where something goes.

## Scope

Applies to any new artifact or import from an external project. Runs before creation or placement of any artifact. Complements `artifact-classification.md` (the reference standard) by turning it into a 4-question executable flow.

## Trigger

You have something to add to the repo and aren't sure where it goes, or you're saving something from another project and need a placement decision.

## Outputs

- A single destination folder: `prompts/`, `tools/`, `skills/`, `playbooks/`, `docs/`, `experiments/`, or `vetted/`
- A decision note if the artifact is hybrid (needs splitting)
- `experiments/` as default when uncertain

## Verification

- Artifact is placed in exactly one primary folder
- If hybrid, both parts exist with cross-links
- No orphan — artifact is linked from its section README and root README

## Evidence / Results

Drafted 2026-06-24. Based on `docs/standards/artifact-classification.md` which was applied during initial repo build to reduce placement ambiguity. Playbook form not yet tested in a live session — status `draft`.

## Failure Modes / Boundaries

- If you spend more than 5 minutes on this decision, default to `experiments/` and reclassify later
- Hybrid artifacts (prompt + procedure in one doc) should be split; if splitting feels too costly now, place in `experiments/` with a note
- Classification does not replace quality gates — a correctly placed artifact still needs lint and rubric

## Related Links

- `docs/standards/artifact-classification.md` — full reference taxonomy
- `docs/standards/artifact-structure.md` — three-file structure for consumable artifacts
- `_meta/framebook/save-artifact/` — next step after classification when importing from another project
