---
title: "prompt-factory"
status: validated
confidence: medium
last_tested: 2026-06-25
scope: personal
tooling:
  - "opencode/claude-sonnet-4-6"
tags:
  - skill
  - prompts
  - workflow
owner: "@emb715"
---

# Purpose

Reusable skill for generating ready-to-paste prompts. Guides the user through plan-source confirmation, type selection, and style selection (where applicable) before generating output. Supports shorthand arguments to skip menus when the user already knows what they want.

# When to use

- You need to resume or transfer implementation work to a fresh session.
- You have a plan doc path in the current message, arguments, or session context.
- You want deterministic mode selection and pre-flight checks before prompt generation.

For `plan-refine` specifically: the factory generates a customized loop prompt with the plan's context, status, and blockers inlined. If you want a generic plan-refinement loop without running the factory, there is a static copy-paste version of the same prompt in this repo's `prompts/` folder.

# Inputs

All inputs are guided interactively. Optional shorthand arguments:

- `{{PLAN_DOC_PATH}}` (optional) — skip plan source gate
- `{{TYPE}}` (optional) — skip type menu
- `{{STYLE}}` (optional) — `balanced|compressed`, implementation only; defaults to `balanced`

# Skill

Use [`SKILL.md`](SKILL.md).

# Command install / usage

Command file:
- `skills/prompt-factory/commands/prompt-factory.md`

To use as a slash command in OpenCode, add or symlink this command into `.opencode/commands/`.

Symlink example (single command):

```bash
mkdir -p .opencode/commands
ln -sf ../../skills/prompt-factory/commands/prompt-factory.md .opencode/commands/prompt-factory.md
```

Then run:

```text
# full guided flow
/prompt-factory

# provide plan path, get type menu
/prompt-factory path/to/plan.md

# skip type menu, go to style gate (implementation) then generate
/prompt-factory implementation path/to/plan.md

# skip all menus, generate directly
/prompt-factory handoff path/to/plan.md
```

Notes:
- No arguments → full interactive flow (plan → type → style if applicable).
- Type shorthand as `$1` skips the type menu.
- For repo-wide command setup patterns, see `_meta/install.md`.

Canonical command name: `/prompt-factory`.

# Evidence

Validation evidence summary:
- Core implementation prompt generation path is validated from prior prompt-factory runs.
- Additional prompt-type contracts (`handoff`, `review`, `debug`, `plan-refine`) are defined and structured for iterative validation.

# Failure Modes / Boundaries

- If type is omitted and user does not choose an option, generation must not proceed.
- If explicit plan path is missing/unreadable, output must stop with missing-context checklist.
- If multiple conflicting plans exist and no explicit plan is selected, output quality degrades; command must gate for selection.
- Non-implementation type contracts are newly defined and may require additional empirical validation.

# Related artifacts

- `skills/prompt-factory/commands/prompt-factory.md`
- `skills/prompt-factory/templates/default.md`
- `skills/prompt-factory/templates/strict.md`
- `skills/prompt-factory/templates/fast.md`
- `skills/prompt-factory/templates/types/implementation.md`
- `skills/prompt-factory/templates/types/handoff.md`
- `skills/prompt-factory/templates/types/review.md`
- `skills/prompt-factory/templates/types/debug.md`
- `skills/prompt-factory/templates/types/plan-refine.md`

## V2 skeleton status

Prompt-factory v2 type-system skeletons exist for:
- `implementation`
- `handoff`
- `review`
- `debug`
- `plan-refine`

These are structure placeholders only. Type gates and full per-type contracts are pending definition.
