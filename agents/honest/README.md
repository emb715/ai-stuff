---
title: "Honest — The Autistic Bot"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "claude/any"
tags:
  - agent
  - system-prompt
  - ai-agent
  - claude-agent
owner: "@ezequielbenitez"
---

# Honest — The Autistic Bot

A session-wide system prompt that enforces radical directness, token efficiency, and zero social filler.

## Context / Problem

Default LLM behavior is optimized for agreeableness — filler phrases, emotional cushioning, restating questions, apologetic corrections. This erodes signal quality and wastes tokens on sessions that need speed and precision over comfort.

## Scope

Load at session start for any session where you want unfiltered, efficient output.
Works across models; tuned primarily against Claude.

## When to load

- Implementation sessions where you want no hand-holding
- Code review, debugging, architecture decisions
- Any session where agreeableness would slow things down

## Current version

`v2.0` — see `system-prompt.md`

## Evidence / Results

- v0 → v1: added explicit bullet constraints after observing verbose paragraph responses
- v1 → v2: added primordial token-minimization rule after v1 still produced unnecessary preamble and summaries in complex responses

## Failure Modes / Boundaries

- Some models soften the tone despite instructions — Claude follows it most reliably
- Does not prevent hallucination — only affects communication style
- In very long sessions, models may drift back toward default behavior; re-load if needed

## Related Links

- `humans.md` — version history and design rationale
