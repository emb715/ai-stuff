---
title: "Save Artifact from Another Project"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - intake
owner: "@emb715"
---

# Save Artifact from Another Project

Playbook for importing a working asset from another project into this repo.

## Context / Problem

Without a standard intake path, useful assets get copied in inconsistent formats, wrong folders, or unsanitized form.

## Scope

Covers intake, classification, sanitization, structure, and linkage of external artifacts.
Does not cover final promotion quality scoring — that is `_meta/framebook/promote-artifact/`.

## Trigger

You have something from another project — a working skill, a prompt that ran well, a pattern, a research finding — and want to save it here for reuse.

## Outputs

- Artifact stored in the correct destination.
- Metadata complete and status set correctly.
- Discoverability links added.
- `doc_lint.py` passes.

## Verification

- `python scripts/doc_lint.py` passes with no BLOCKED findings.
- Artifact is linked from at least one index.
- No sensitive content remains.

## Evidence / Results

Observed in this repo: explicit classification reduced misfiled assets and avoided treating prompt text as procedure docs.

## Failure Modes / Boundaries

- Borderline assets that combine prompt text and procedure: split into a prompt artifact plus a playbook wrapper, cross-linked.
- If no real use exists yet, force `draft` in `experiments/`.
- If classification is uncertain at any stage, route to `experiments/` as `draft`.

## Related Links

- `docs/standards/artifact-classification.md` — routing taxonomy
- `docs/standards/artifact-structure.md` — three-file folder convention
- `docs/standards/vetting-rubric.md` — promotion gate
- `templates/` — all available templates
