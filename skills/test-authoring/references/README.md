---
title: "test-authoring reference index"
status: draft
confidence: low
last_tested: 2026-07-31
scope: personal
tooling: ["agnostic/any-LLM", "vitest|jest", "testing-library/react", "testing-library/react-native", "playwright", "maestro"]
tags: [skill, qa, testing, references]
owner: "@emb715"
---

# Context / Problem

`SKILL.md` assigns each behavior to a test layer (`unit`, `component`, `flow`, `contract`) without naming tools. These adapters map those layers onto a concrete stack.

## Scope

Two adapters: web and React Native. Neither replaces the repo's existing runner; both say to match what is already installed.

## Procedure / Steps

- [Web adapter](web.md): Vitest or Jest, React Testing Library, Playwright, axe.
- [React Native adapter](react-native.md): React Native Testing Library, Maestro.

Load an adapter only after the behavior list and layer assignment exist, and only the one for the target platform.

## Evidence / Results

No runs yet. Authored 2026-07-31 alongside `SKILL.md`; see its README for status.

## Failure Modes / Boundaries

- Tool APIs drift. Check each adapter against the installed versions before relying on a specific call.
- No adapter for other stacks (Vue, Svelte, native iOS/Android). Use `SKILL.md`'s layer rules and the repo's own runner.
