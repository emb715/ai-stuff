---
title: "Loop Engineering — References"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - loop-engineering
owner: "@ezequielbenitez"
---

# Loop Engineering — References

Research and external writing on loop prompt engineering. Grounds the `prompts/loop-prd-readiness/` prompt and any future loop prompts.

## Sources

| Source | Author | Date | File |
|---|---|---|---|
| Loop Engineering | Addy Osmani | Jun 7, 2026 | [addy-osmani-loop-engineering.md](addy-osmani-loop-engineering.md) |
| How Agent Loops Work (Loop Library) | Forward Future | 2026 | [forward-future-loop-library.md](forward-future-loop-library.md) |

## Key takeaways for this repo

**From Addy Osmani:**
- Loop engineering = designing the system that prompts the agent, not prompting it yourself
- Five primitives: automations, worktrees, skills, plugins/connectors, sub-agents + a state file
- Maker/checker split is the most valuable structural decision in a loop — the agent that wrote the code must not grade its own homework
- The loop changes the work, it does not delete you from it; verification, comprehension, and judgment remain human

**From Forward Future Loop Library:**
- An agent loop is a task with a check — do work, check result, continue or stop
- Four properties of a useful loop: clear measurable goal, small bounded actions, fixed stable check, explicit stop conditions
- Stop conditions need four states: success, no-op (nothing to do), ask for approval, blocked/out of budget
- Loop prompt structure: trigger → inspect → action criteria → change → acceptance check → state file → stop conditions

## Why it matters here

Loop prompts like `loop-prd-readiness` are a distinct category from one-shot prompts. They need explicit stop signals, escalation conditions, and a no-progress no-op state. These references define the conventions this repo follows for that category.
