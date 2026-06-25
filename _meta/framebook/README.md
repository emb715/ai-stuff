---
title: "Framebook Index"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - framebook
  - index
owner: "@ezequielbenitez"
---

# _meta/framebook/

Framework procedures for operating this vault. Each procedure is a three-file folder:

```
<procedure-name>/
├── README.md     ← frontmatter + record, context, scope, evidence
├── playbook.md   ← clean, executable procedure (no frontmatter, copy-paste ready)
└── humans.md     ← origin, design decisions, maintenance notes
```

## Context / Problem

Without standard, discoverable procedures, vault operations become ad-hoc and quality drifts. This framebook makes recurring operations deterministic and repeatable.

## Scope

Framework procedures only — operations that maintain or use the vault itself.
User's own recurring procedures belong in `playbooks/` at root.

## How to use

1. Identify your task trigger from the index below.
2. Open the matching procedure folder.
3. Read `playbook.md` and execute steps in order.
4. Verify outputs and update indexes/changelog.

## Framebook Index

| Procedure | Trigger |
|---|---|
| [start-session/](start-session/) | Opening the repo to do any type of work |
| [save-artifact/](save-artifact/) | Saving a prompt, skill, tool, or pattern from another project |
| [promote-artifact/](promote-artifact/) | Promoting lifecycle state (`draft -> validated -> vetted`) |
| [audit-experiments/](audit-experiments/) | Reviewing experiments and deciding promote/iterate/archive |
| [weekly-maintenance/](weekly-maintenance/) | Weekly cadence: promote, deprecate, relink, changelog |
| [classify-artifact/](classify-artifact/) | Fast decision flow for where a new artifact belongs |
| [deprecate-and-archive/](deprecate-and-archive/) | Retiring an artifact (dead, superseded, or stale) |
| [sanitize-before-publish/](sanitize-before-publish/) | Redaction and sanitization before promotion or publishing |
| [fix-compliance-failures/](fix-compliance-failures/) | Procedural response to BLOCKED gate failures |
| [write-skill/](write-skill/) | Step-by-step execution of the skill-authoring process |

## Evidence / Results

Actively referenced by `AGENTS.md` session rules. Used as default routing for all vault operations.

## Failure Modes / Boundaries

- If a procedure conflicts with `docs/standards/`, standards win.
- User recurring procedures do not belong here — use `playbooks/` at root.
