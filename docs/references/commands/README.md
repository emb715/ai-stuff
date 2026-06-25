---
title: "Commands References"
status: validated
confidence: high
last_tested: 2026-06-25
scope: personal
tooling:
  - "opencode/docs"
  - "claude-code/docs"
tags:
  - references
  - commands
  - opencode
  - claude-code
owner: "@ezequielbenitez"
---

# docs/references/commands/

Captured reference notes for slash-command systems used by this repo's tooling.

## Sources

- [OpenCode Commands docs](https://opencode.ai/docs/commands/)
- [Claude Code Commands docs](https://code.claude.com/docs/en/commands)

## Key takeaways

### OpenCode

- Custom commands can be declared in config (`command` object) or markdown files.
- Command file locations:
  - Global: `~/.config/opencode/commands/`
  - Per-project: `.opencode/commands/`
- Markdown command frontmatter supports: `description`, `agent`, `model`.
- Prompt template features include:
  - `$ARGUMENTS`, positional args (`$1`, `$2`, ...)
  - Shell output interpolation via `!\`cmd\``
  - File injection via `@path/to/file`

### Claude Code

- Commands are session control + bundled skill/workflow entry points.
- The commands docs explicitly route custom command creation to Skills.
- Command arguments are passed after the command name; docs use `<arg>` (required) and `[arg]` (optional) notation.

## Why this matters for this repo

- Prompt artifacts should support both invocation modes: copy/paste and command.
- Command wrappers should live with their canonical artifact folder to avoid drift.
- Runtime command behavior must be self-contained outside `experiments/`.

## Evidence / Results

References fetched and summarized on 2026-06-25 for command-system alignment work across prompts and skills.

## Failure Modes / Boundaries

- Claude Code docs page is broad and mixes built-ins with bundled skills/workflows; custom command implementation details are intentionally delegated to Skills docs.
- OpenCode command behavior may evolve; verify placeholders/options against latest docs before encoding hard constraints in lint.
