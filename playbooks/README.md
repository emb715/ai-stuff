---
title: "Playbooks Index"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - playbook
  - index
owner: "@ezequielbenitez"
---

# playbooks/

Your own recurring procedures. This folder starts empty and fills over time.

## What belongs here

A procedure belongs in `playbooks/` when all are true:

1. It is recurring — you will run it more than once
2. It has an explicit trigger — a clear "when X happens, run this"
3. It has ordered steps with decision points
4. It has defined outputs
5. It has failure/rollback paths

## What does not belong here

- Framework vault operations → `_meta/framebook/`
- One-off notes or brainstorms → `experiments/`
- Reusable instruction text → `prompts/`
- Policy or standards → `docs/standards/`

## Structure

Each playbook is a three-file folder:

```
playbooks/<name>/
├── README.md     ← frontmatter + record, context, scope, evidence
├── playbook.md   ← clean, executable procedure (no frontmatter)
└── humans.md     ← origin, design decisions, maintenance notes
```

Use `templates/playbook-template.md` to start. Follow `_meta/framebook/save-artifact/` for intake.

## Index

| Playbook | Purpose | Status |
|---|---|---|
| [brainstorming](brainstorming/) | Facilitate interactive brainstorming sessions using 61 techniques across 10 categories; standalone, no framework dependencies | validated |
| [product-brief](product-brief/) | Turn brainstorm output or a rough idea into a structured product brief; fills the brainstorm→plan gap | validated |
| [adversarial-code-review](adversarial-code-review/) | Adversarial code review on git changes; cross-references claims vs reality, minimum 3 findings, fix menu | validated |
| [quick-spec](quick-spec/) | Create implementation-ready specs through discovery + code investigation; enforces 5-criterion Ready-for-Dev standard | validated |
| [retrospective](retrospective/) | Run a retrospective on completed work; lessons, follow-through check, readiness assessment, SMART action items | draft |
