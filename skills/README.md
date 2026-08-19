---
title: "Skills Index"
status: validated
confidence: high
last_tested: 2026-07-30
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - skills
  - index
owner: "@emb715"
---

# skills/

Reusable agent skills — capability/behavior packages that activate on specific triggers to shape model output for a library, framework, or task domain.

## What belongs here

A skill that:
- Has a clear, bounded trigger (one job, one activation condition)
- Has been used at least once with a documented outcome
- Is sanitized (no project-specific identifiers, no secrets)
- Is written to be loaded as model context, not read by humans (SKILL.md is for the model; humans.md is for maintainers)

## What does not belong here

- Skills under active iteration → `experiments/`
- Session-wide behavior config → `agents/`
- One-shot instruction text → `prompts/`
- Recurring operational procedures → `playbooks/`

## Lifecycle

`draft (experiments/) → validated → vetted (skills/)`

A skill lands here only when validated. Early drafts go in `experiments/`.

## Structure

Each skill gets its own folder:

```
skills/
└── <name>/
    ├── SKILL.md      ← model-facing: trigger, identity, patterns, footgun, routes
    ├── README.md     ← frontmatter + full artifact record (purpose, evidence, failure modes)
    └── humans.md    ← maintenance notes, design decisions, context for humans
```

Optional subdirectories (`references/`, `docs/`, `scripts/`, `commands/`) are allowed when the skill needs them.

## Index

| Skill | Tags | Status |
|---|---|---|
| [skill-authoring](skill-authoring/) | skill, meta, authoring, documentation, process | draft |
| [prompt-factory](prompt-factory/) | skill, prompts, generation, factory | validated |
| [change-impact-diagram](change-impact-diagram/) | skill, impact-analysis, mermaid, diagrams, primitives | validated |
| [liteparse](liteparse/) | skill, pdf, parsing, ocr, liteparse, document-processing | draft |