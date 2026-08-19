# humans.md — arch-design-pipeline

## Decision log — 2026-08-12

- **Relocated from playbooks/ to experiments/.** The pipeline was designed for software product teams (SLAs, compliance, cross-team review, production systems). The vault is a personal knowledge base with one owner. The pipeline has never run here. Relocating to experiments/ makes it available for real use on external software projects while being honest about its status.
- **Templates moved into the experiment folder.** The 4 templates (prd/rfd/nrfd/tech-spec) are inputs to this pipeline. They now live at `experiments/arch-design-pipeline/templates/` so the experiment is self-contained and portable.
- **Preconditions fixed.** Precondition 1 was circular (required Step 1's output as a precondition). Precondition 2 was tautological (owner check in a one-owner repo). Precondition 3 had no resolution path. All three rewritten.
- **Status model fixed.** Checkpoints now promote individual docs to `validated` at sign-off. Step 7 is a set-level coherence check, not the sole validation moment. The "draft with review note" phantom state is eliminated.
- **Loop-back state contract added.** "Loop back" was undefined as a state transition. Now specifies: which docs revert to draft, which checkpoints re-fire, which downstream docs become stale.
- **Step 7 renamed from "cross-team review" to "set coherence review."** The original name assumed a team context. The coherence check is valuable regardless of team size — it verifies the set is internally consistent. The cross-team review (if a team exists) happens at each checkpoint, not at Step 7.
- **Step 8 branched.** Now distinguishes "validated set → hand off" from "abandoned → don't hand off."
- **Replaced hardcoded `docs/design/` with `{{OUTPUT_DIR}}` placeholder.** The playbook is portable — the output directory is chosen by the caller, not assumed by the playbook. "design" was also the wrong word for architectural decision documents; the caller can use `docs/architecture/`, `docs/adr/`, or any path that matches their project's conventions.

## What this is

The pipeline is a playbook (recurring procedure) that orchestrates four sequential design documents through a strict dependency chain with human review checkpoints, terminating at request-triage. It is not a prompt (it has ordered steps, failure paths, and defined outputs), not a one-off document (it recurs for every non-trivial feature), and not an implementation tool (it produces architectural input, not code).

## Why it works

Two structural constraints do the work:

1. **Strict chain, no skipping.** Each document answers a question the next depends on. RFD without PRD designs a solution to an undefined problem. NRFD without RFD assesses quality of an undefined architecture. Tech Spec without RFD+NRFD produces contracts blind to function and quality targets. Skipping a stage produces a document that looks complete but has no foundation.

2. **Human checkpoints.** Design decisions are consequential and expensive to reverse once implemented. Each checkpoint is a gate, not a rubber stamp — a rejected doc loops back, it does not advance with caveats. This is the difference between a pipeline that catches architectural errors at design time (cheap) and one that lets them reach implementation (expensive).

## Design decisions

- **Why playbook not prompt:** the pipeline has ordered steps, defined outputs, and failure paths. Per the artifact classifier, that is a playbook, not a prompt. A prompt is copy-paste instruction text scoped to a task or a few turns; this is a recurring procedure with a lifecycle.

- **Why strict chain (no skipping):** RFD without PRD designs a solution to an undefined problem; NRFD without RFD assesses quality of undefined architecture; Spec without RFD+NRFD produces contracts blind to function and quality targets. Allowing skipping would produce documents that look complete but have no foundation — the failure mode the pipeline exists to prevent.

- **Why DL014 resolution via deprecation:** completed designs are historical records, not active guidance. A design doc set that shipped and was implemented will go stale — the system it describes evolves, the doc does not. Deprecation is the principled escape from perpetual freshness failures (DL014 fires on `validated`/`vetted` docs older than 180 days). Deprecating a completed design doc set with a pointer to the implementation is correct lifecycle behavior, not a failure.

- **Why separation from quick-spec:** quick-spec answers "how to implement in code this session"; this pipeline's Tech Spec answers "what contracts the system must satisfy." Different layers, different consumers. quick-spec consumes the Tech Spec as input when implementation begins. Conflating them would either bloat quick-spec with architectural concerns it is not equipped to resolve, or strip the pipeline's Tech Spec of contract-level detail that implementation depends on.

- **Why only Tech Spec has explicit versioning:** the Tech Spec is the contract layer. Contracts must be independently versionable because they have consumers (implementers, tests, client SDKs) that depend on a specific contract version. PRD/RFD/NRFD are design rationale — they are consumed once (to produce the next document) and then serve as historical record. Versioning them adds ceremony without value (YAGNI). Git history is sufficient for design rationale; explicit versioning is required for contracts.

- **Why terminate at request-triage:** the pipeline produces architectural input, not implementation. Triage selects the right execution paradigm (spec for single-agent single-session, plan for fleet execution) using the Tech Spec as input. Embedding execution in the pipeline would couple architectural design to a specific execution model — the wrong coupling, because the architecture is independent of how it gets implemented.

## Origin

User requested a document-driven architectural design system (PRD→RFD→NRFD→Spec) to ensure LLMs produce sound, consistent plans when working on system features. The four-document structure and the strict dependency chain reflect the user's mental model of how architectural decisions should be sequenced: problem before solution, function before quality, quality before contracts.

## Maintenance

- After pilot run, update the Evidence section in `README.md` with observed outcomes (time per stage, checkpoint rejection rate, whether downstream execution consumed the Tech Spec cleanly). Consider promoting to `validated` if the pilot produces positive evidence.
- Review checkpoint friction after 3-5 runs. If a specific checkpoint is rejected disproportionately, the template for that stage may be producing low-quality drafts — adjust the template, not the pipeline.
- If the pipeline is run on a feature that turns out to be trivial mid-flow (discovered at RFD or NRFD stage), abort and deprecate the docs with reason "reclassified as trivial." Do not force a trivial feature through the full pipeline.
- If design drift is observed in implementation (the built system diverges from the Tech Spec), that is a signal to either update the Tech Spec or document the deviation. Repeated drift on the same feature indicates the spec was incomplete — review the NRFD and RFD, not just the Spec.