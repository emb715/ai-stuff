---
title: "Promote an Artifact"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - promotion
owner: "@emb715"
---

# Promote an Artifact

Playbook for moving an artifact through lifecycle transitions.

## Context / Problem

Without strict promotion rules, low-quality artifacts get labeled as trusted guidance and degrade repo reliability.

## Scope

Governs lifecycle transitions and required checks for promotion and deprecation.
Applies to prompts, tools, playbooks, and other reusable artifacts.

## Trigger

An artifact has been tested and you want to promote it (`draft -> validated` or `validated -> vetted`), or an artifact needs to be retired (`deprecated`).

## Outputs

- Artifact status transitioned legally, or explicitly blocked with documented reason.
- Required index links and changelog entries updated.
- Lint and rubric checks recorded as evidence.

## Verification

- `python scripts/doc_lint.py` passes.
- Status field updated correctly.
- All indexes updated.
- Changelog entry added.

## Evidence / Results

Observed in this repo: enforcing legal transitions plus lint/rubric checks blocked invalid promotions and preserved lifecycle integrity.

## Failure Modes / Boundaries

- A valid transition can still fail due to missing linkage or sanitization issues — run lint before closing.
- Rubric pass does not imply universal applicability; scope still matters.
- If artifact fails the rubric: leave at `validated`, note the failing axes, do not force `vetted`.

## Related Links

- `docs/standards/vetting-rubric.md` — scored rubric (12/14 threshold)
- `docs/standards/doc-lint-spec.md` — lint rules
- `changelog/week-YYYY-WW.md` — weekly log template
