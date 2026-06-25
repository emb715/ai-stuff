---
description: Generate a ready-to-paste prompt from a plan source. Guided interactive flow: select type and shape in one reply. Usage: /prompt-factory [plan-doc-path] or /prompt-factory [type-shape]
skill: ../README.md
---

Use skill behavior from `skills/prompt-factory/SKILL.md` as the source of truth.

Parse `$ARGUMENTS`:
- Empty → full guided flow (plan gate → combined type+shape menu → generate)
- `$1` is a file path → use as plan, then show combined menu
- `$1` is a shorthand (`implementation-default`, `implementation-fast`, `handoff`, etc.) → skip menu, generate
- `$1` is a shorthand + `$2` is a file path → use both, skip menu, generate

Valid shorthands: `implementation-default`, `implementation-fast`, `implementation-strict`, `handoff`, `review`, `debug`, `readiness-check`

Delegate all flow logic to the linked skill.
