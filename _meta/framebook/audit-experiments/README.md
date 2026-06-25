---
title: "Audit Experiments"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - audit
owner: "@ezequielbenitez"
---

# Audit Experiments

Playbook for reviewing the `experiments/` backlog and deciding what to do with each item.

## Context / Problem

Unreviewed experiment backlogs become stale quickly and hide reusable insights. Ambiguity left unresolved erodes trust in the whole folder.

## Scope

Covers recurring review and triage of `experiments/` to decide: promote, iterate, deprecate, or archive.
Does not execute promotion — routes to `_meta/framebook/promote-artifact/` when ready.

## Trigger

Weekly cadence, or when you want to know: what is in experiments, what is ready to promote, what is stale or dead.

## Outputs

- Every experiment has a clear decision state.
- Promotion and deprecation candidates are explicitly routed.
- Weekly audit outcome captured in `changelog/`.

## Verification

- Every experiment has a clear status and a next step.
- Nothing in `experiments/` is older than 60 days without a deliberate decision.
- `doc_lint.py` passes.

## Evidence / Results

Observed in this repo: explicit weekly audit criteria surfaced stale items and created deterministic promote/deprecate decisions rather than passive backlog accumulation.

## Failure Modes / Boundaries

- Age-only criteria can flag still-relevant work as stale — assess value, not just recency.
- If experiment docs are incomplete, classification confidence is low and may require a rewrite pass before triage.

## Related Links

- `_meta/framebook/promote-artifact/` — how to promote
- `docs/standards/vetting-rubric.md` — what vetted requires
- `changelog/week-YYYY-WW.md` — weekly log template
