---
title: "Start a Working Session"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - session
owner: "@ezequielbenitez"
---

# Start a Working Session

Playbook for opening this repo to do any kind of work.

## Context / Problem

Session starts are where quality degrades: wrong routing, duplicate artifacts, missing links, skipped standards.

## Scope

Defines how to start a work session and route to the correct follow-up playbook.
Does not cover artifact creation or promotion steps — those have their own playbooks.

## Trigger

Opening this repo to do work — creating something new, researching a topic, continuing an experiment, or reviewing what exists.

## Outputs

- Correct playbook selected for the current task.
- New or updated artifact placed in the correct folder.
- Index links and changelog updated when applicable.

## Verification

- No orphaned files (everything linked).
- `doc_lint.py` passes if you touched structured docs.
- `experiments/` README updated if state changed.

## Evidence / Results

Observed in this repo: using this routing sequence avoided duplicate artifacts and forced linkage/lint checks before close-out.

## Failure Modes / Boundaries

- If session intent is unclear, stop and classify before writing files.
- For one-line edits to an existing artifact, full orientation may be unnecessary.

## Related Links

- `_meta/framebook/save-artifact/` — intake workflow
- `_meta/framebook/promote-artifact/` — promotion workflow
- `_meta/framebook/audit-experiments/` — audit workflow
- `docs/standards/artifact-classification.md` — routing rules
- `docs/standards/artifact-structure.md` — three-file folder convention
