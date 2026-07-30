---
title: "Sanitize Before Publish"
status: draft
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - sanitization
  - security
owner: "@emb715"
---

# Sanitize Before Publish

Dedicated redaction and sanitization workflow before promoting or publishing any artifact.

## Context / Problem

AGENTS.md Gate 4 enforces sanitization as a blocking check, but there is no procedural playbook for executing it. "Check for secrets" is not a procedure — it doesn't tell you what to look for, how to look, or what to do when you find something. This playbook fills that gap.

## Scope

Applies to any artifact before: promotion to `validated` or `vetted`, publication to a shared repo or external context, or saving an import from another project. Covers secrets, private identifiers, sensitive data, and confidential internal references.

## Trigger

Before any promotion step. Before saving or publishing any artifact that originated from a real project session.

## Outputs

- Artifact is confirmed clean or redacted to clean state
- A sanitization pass is recorded (can be a one-line note in the artifact's Evidence or humans.md)
- Gate 4 check is explicitly cleared

## Verification

- No pattern from the check list below remains in the artifact
- Any redacted value has been replaced with a synthetic equivalent, not just deleted
- The artifact still makes sense and is usable after redaction

## Evidence / Results

Drafted 2026-06-24 based on Gate 4 enforcement in AGENTS.md. No run history yet — status `draft` until first real execution is logged.

## Failure Modes / Boundaries

- Automated search (grep) will miss secrets embedded in prose or encoded strings — manual read is required for high-sensitivity content
- Redaction by deletion often breaks examples; replace with synthetic values instead
- Some values look like secrets but are public (e.g., example API key patterns in docs) — use judgment, err toward redaction

## Related Links

- `AGENTS.md` Gate 4 — the enforcement rule this playbook executes
- `_meta/framebook/promote-artifact/` — calls this playbook as a precondition
- `_meta/framebook/save-artifact/` — calls this playbook as a precondition
