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

## External fleets

Fleets that live in separate repos. Not stored here — install from source.

| Fleet | What it is | Install |
|---|---|---|
| [neurodiveragents](https://github.com/emb715/neurodiveragents) | 18 neurotype-based specialist agents (review, diagnose, secure, optimize, architect, test, refactor, design, accessibility, more). Auto-routing table written into your project config on install. Works with Claude Code, OpenCode, Cursor, GitHub Copilot. | `npx neurodiveragents install claude` (or `opencode`, `cursor`, `copilot`). Add `--global` for all projects. |

### Using ndv-flow as orchestrator

Beyond their domain-specific capabilities, the fleet's orchestrator (`ndv-flow`) can be used as the primary entry point in OpenCode, or via `/ndv-flow {prompt}` in Claude Code. Flow only orchestrates — it decomposes the work, delegates to subagents tailored for each task, and they report back with status, relevant info, or handoffs.

This keeps the main context window clean. By breaking down prompts and keeping individual conversation histories brief, input token counts stay low. Even with prompt caching in place, this architectural strategy remains highly effective as a token-saving approach.
