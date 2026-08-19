---
title: "Arch Design Pipeline"
status: draft
confidence: medium
last_tested: 2026-08-12
scope: universal
tooling:
  - agnostic/any-LLM
tags:
  - playbook
  - operations
  - architecture
  - design
  - pipeline
owner: "@emb715"
---

# Arch Design Pipeline

## Context / Problem

Connecting business intent to technical execution is a known failure point. A feature request carries assumptions about feasibility, cost, and risk that are invisible until implementation begins — by which point correction is expensive. This playbook exists to surface those assumptions through a document-driven architectural design pipeline before a single line of code is written.

The pipeline produces four sequential design documents (PRD → RFD → NRFD → Tech Spec) connected by a strict dependency chain. Each document answers a question the next depends on, and each is gated by a human review checkpoint. The output is a validated design doc set that downstream execution paradigms (via `request-triage`) consume as implementation input.

This pipeline is designed for software product teams building production systems with multiple stakeholders, SLAs, and compliance obligations. It was originally placed in the vault's `playbooks/` but relocated to `experiments/` because the vault is a personal knowledge base — the pipeline's templates and review gates require a team context that doesn't exist here. It remains available for use on external software projects where its assumptions hold.

## Scope

**Covers:** architectural design for non-trivial features in software product systems — new capabilities requiring design choices, cross-cutting system changes, interface/contract definitions. Designed for team contexts with multiple reviewers.

**Does not cover:** knowledge-base curation, prompt authoring, or single-operator workflows. Implementation execution is out of scope — the pipeline terminates at hand-off to `request-triage`, which selects the execution paradigm (spec or plan). Implementation is handled by downstream playbooks (`quick-spec`, `raa`, `implementation-orchestration`).

## Trigger

A work item that might involve architectural decisions beyond single-session scope: new capability requiring design choices, cross-cutting system change, interface/contract definition, or a feature where the "how" is consequential and non-obvious. If unsure, enter the pipeline — Step 1 will gate.

## Inputs

`{{OUTPUT_DIR}}` — the output directory for design docs, chosen by the caller.

## Outputs

A design doc set at `{{OUTPUT_DIR}}/<feature-slug>/` containing:

- `prd.md` — Product Requirements Document
- `rfd.md` — Request for Design (architecture)
- `nrfd.md` — Non-Functional Requirements Document
- `tech-spec.md` — Technical Specification (contracts)

Each doc transitions to `validated` at its own checkpoint (Steps 3-6). Step 7 confirms the set is internally coherent and updates `last_tested`. The set is handed off to `request-triage` for execution paradigm selection.

## Playbook

See [playbook.md](playbook.md).

## Verification

The pipeline ran correctly if and only if:

1. All four design docs exist in `{{OUTPUT_DIR}}/<feature-slug>/`.
2. Each doc references the prior (RFD→PRD, NRFD→RFD, Spec→RFD+NRFD).
3. Each doc transitioned `draft → validated` at its own checkpoint, with reviewer sign-off recorded in its Evidence section.
4. `last_tested` on each doc reflects the Step 7 set coherence review date.
5. `request-triage` received the hand-off (design doc set path).

## Evidence / Results

To be filled after pilot run.

## Failure Modes / Boundaries

- **Pipeline abandoned mid-flow:** deprecate the folder's docs with reason "pipeline abandoned" + pointer if revived. Folder retained as a record.
- **Checkpoint rejected:** the rejected doc reverts to `draft`; if the rejection loops back to an upstream doc, that upstream doc also reverts to `draft` and its checkpoint re-fires after revision. Downstream docs become stale and must be re-validated against the revised dependency (see Loop-back state contract in `playbook.md`).
- **Trivial work bypassed:** direct to `request-triage` — the pipeline is overhead for bugfixes, single-file changes, and cosmetic work.
- **Design drift:** implementation diverges from design → update the design doc to reflect the divergence, or document the deviation in the design doc's Evidence section. Silent divergence is the failure mode.

## Related artifacts

- [templates/prd-template.md](templates/prd-template.md) — PRD template
- [templates/rfd-template.md](templates/rfd-template.md) — RFD template
- [templates/nrfd-template.md](templates/nrfd-template.md) — NRFD template
- [templates/tech-spec-template.md](templates/tech-spec-template.md) — Tech Spec template
- [prompts/loop-prd-readiness/](../../prompts/loop-prd-readiness/) — optional PRD refinement
- [playbooks/quick-spec/](../../playbooks/quick-spec/) — downstream spec paradigm
- [playbooks/request-triage/](../../playbooks/request-triage/) — paradigm router (hand-off target)