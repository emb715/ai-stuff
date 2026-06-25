---
title: "References Index"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - index
  - references
owner: "@ezequielbenitez"
---

# docs/references/

External research, articles, and reference material that informs work in this repo.

## What belongs here

- External writing that shaped a decision, prompt, or pattern in this repo
- Research that provides grounding for an experiment or validated artifact
- Reference material an agent or human should read to understand the context behind an artifact

## What does not belong here

- Internal standards or ADRs → `docs/standards/`
- Summaries without a source link — link the original
- Paraphrased content without attribution

## Convention

Each topic gets its own subfolder:

```
docs/references/
└── <topic>/
    ├── README.md     ← index of sources for this topic, why they matter
    └── <source>.md  ← captured content or summary with full attribution
```

## Index

| Topic | Sources | Relevant to |
|---|---|---|
| [loop-engineering](loop-engineering/) | Addy Osmani, Forward Future Loop Library | `prompts/loop-prd-readiness/` |
| [commands](commands/) | OpenCode Commands docs, Claude Code Commands docs | prompt/command invocation standards |
