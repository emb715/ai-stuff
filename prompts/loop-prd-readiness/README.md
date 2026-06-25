---
title: "Loop PRD Readiness"
status: validated
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "opencode/claude-sonnet-4-6"
tags:
  - prompt
  - loop
  - planning
  - implementation-readiness
owner: "@ezequielbenitez"
---

# Purpose

Drives a planning document (PRD, spec, ADR, or similar) to implementation readiness through iterative rounds. Each round resolves the highest-risk gap with the smallest doc change. Stops only when two independent reviews materially agree and no P0/P1 unknowns remain.

# When to use

You have a planning doc that needs to be code-ready — atomic requirements traceable to source, with acceptance criteria and test cases. The doc has known gaps, conflicts, or partial sections. You want the agent to work through them without forking the product unilaterally.

Not for docs already implementation-ready. Not for one-shot review.

# Inputs

`{{DOC}}` — path to the target document, or confirm it is present in the current session.

The doc can be a file path or in-session context. If not explicitly referenced, the agent should surface that as a blocker before starting.

# Prompt

See [`prompt.md`](prompt.md) — standalone copy-paste body.

# Stop signal

Both independent reviews materially agree **and** no P0/P1 unknowns remain **and** every requirement is testable.

Otherwise: stop blocked, surfacing the exact user decision needed. Do not continue past a block unilaterally.

# Evidence

Tested once against a planning document with known conflicts and partial requirements. The agent:
- Correctly identified the highest-risk gap each round without prompting
- Logged contradictions explicitly rather than resolving them silently
- Surfaced one product fork decision for user input before proceeding
- Ran two distinguishable independent reviews (not paraphrases of each other)
- Stopped with a clear blocked state when one P1 remained unresolved

Output was usable as a handoff to an implementation session.

# Failure Modes / Boundaries

- If `{{DOC}}` is vague or not in session, the agent may hallucinate doc structure rather than asking. Always provide an explicit path or confirm visibility before running.
- With large or multi-file doc sets, cross-doc consistency tracking degrades after several rounds. Scope to one primary doc per run; reference secondaries explicitly.
- The two independent reviews may converge prematurely if the agent lacks context separation. Signs: identical phrasing, same gaps listed in both. Re-run with an explicit instruction to treat each as a distinct perspective.
- Does not replace human product decisions — it surfaces them. If the user is unavailable to resolve forks, the loop blocks correctly but cannot proceed.

# Related prompts

- [`experiments/prompt-factory/`](../../experiments/prompt-factory/README.md) — generate implementation execution prompts once readiness is achieved
