---
title: "Tools Index"
status: validated
confidence: high
last_tested: 2026-06-25
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - tools
  - index
owner: "@emb715"
---

# tools/

Deployable AI tool artifacts: OpenCode commands, skills, and agent configs that are ready for use in real projects.

## What belongs here

Artifacts that are:
- Deployable directly into a project (copy-paste or symlink)
- Validated — tested in at least one real session with documented outcome
- Distinct from the *knowledge about* building such tools (that lives in `skills/` or `docs/`)

## What does not belong here

- Experiments under active development → `experiments/`
- Knowledge artifacts explaining how tools work → `skills/` or `docs/`
- One-off scripts or throwaway configs

## Convention

Each tool gets its own subfolder:

```
tools/
└── <tool-name>/
    ├── README.md        ← what it does, how to deploy, validated evidence
    └── <files>          ← the deployable artifact(s)
```

Frontmatter required on the tool README (same standard as all artifacts):
- `title`, `status`, `confidence`, `last_tested`, `scope`, `tooling`, `tags`, `owner`
- Status must be `validated` or `vetted` — nothing lands in `tools/` at `draft`

## Current tools

_Empty._
