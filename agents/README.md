---
title: "Agents Index"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - index
  - agents
owner: "@emb715"
---

# agents/

Session-wide system prompts. Load at session start to shape LLM behavior for the entire session.

## Structure

Each agent is a three-file folder:

```
agents/<name>/
├── README.md          ← frontmatter + record: what it is, when to load, scope, evidence
├── system-prompt.md   ← the system prompt itself, copy-paste clean, no frontmatter
└── humans.md          ← version history, design decisions, maintenance notes
```

## How to use

Copy `system-prompt.md` and paste it as the system prompt for your session.
No modification needed unless noted in `README.md`.

## Index

| Agent | Purpose | Status |
|---|---|---|
| [honest/](honest/) | Radical directness, token efficiency, zero filler | validated |
