---
title: "Prompts Index"
status: validated
confidence: high
last_tested: 2026-06-25
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - prompts
  - index
owner: "@ezequielbenitez"
---

# prompts/

Reusable prompts — tested, sanitized, and ready to invoke in real sessions.

## Invocation modes

Prompts in this repo are intended to be used in two ways:

1. **Copy/paste** `prompt.md` directly into a session.
2. **Slash command** wrapper (`/name`) that injects a prompt template and arguments.

Rule: prompt content must remain usable as plain copy/paste even when a command wrapper exists.

## What belongs here

A prompt that:
- Has a clear, bounded purpose (one job)
- Has been used at least once with a documented outcome
- Is sanitized (no project-specific identifiers, no secrets)
- Is written to be copy-paste reusable with minimal or no modification

## What does not belong here

- Prompts under active iteration → `experiments/`
- Prompt *patterns* or *meta-guidance* about writing prompts → `docs/` or `skills/`
- One-off prompts that aren't reusable

## Lifecycle

`draft (experiments/) → validated → vetted (prompts/)`

A prompt lands here only when validated. Early drafts go in `experiments/`.

## Structure

Each prompt gets its own folder:

```
prompts/
└── <name>/
    ├── README.md    ← frontmatter + full artifact record (purpose, evidence, failure modes)
    ├── prompt.md    ← standalone copy-paste body only
    └── humans.md   ← maintenance notes, design decisions, context for humans
```

Use the template: `templates/prompt-template.md`

Optional command wrapper (when needed):

```
prompts/
└── <name>/
    └── commands/
        └── <command-name>.md
```

If a command wrapper exists, keep it in the same prompt folder so runtime behavior and prompt body evolve together.

## Index

| Prompt | Tags | Status |
|---|---|---|
| [loop-prd-readiness](loop-prd-readiness/) | loop, planning, implementation-readiness | validated |
| [loop-implementation-readiness](loop-implementation-readiness/) | loop, validation, implementation-readiness, codebase-review | draft |
| [knowledge-extraction](knowledge-extraction/) | one-shot, extraction, knowledge-management, post-session | validated |
