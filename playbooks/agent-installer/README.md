---
title: "Agent Installer"
status: draft
confidence: high
last_tested: 2026-07-27
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "node/@clack-prompts"
tags:
  - playbook
  - installer
  - architecture
  - multi-platform
  - cli
owner: "@emb715"
---

# Purpose

Build a multi-platform agent installer with a polished TUI — agnostic, reusable, structurally correct. The playbook describes the architecture, principles, and ordered build sequence for shipping an installer that copies agents and auxiliary modules into the right directories across multiple AI coding tools (Claude Code, OpenCode, Cursor, Copilot, or anything that follows), with a `@clack/prompts`-style interactive flow that also works non-interactively in CI.

Not tied to any fleet, project, or brand. The installer engine knows nothing about the project it serves — everything project-specific is data: a config object, a templates directory, a targets table.

# When to use

When you need to ship a CLI that:

- Asks the user a few questions (which tool? project or global? which modules?)
- Copies agent definitions into the right place per platform
- Writes a routing file (or injects a block into an existing one) so the host tool knows how to dispatch tasks to your agents
- Optionally installs auxiliary modules (skills, prompts, commands)
- Works interactively (TUI) **and** non-interactively (args, CI)
- Is idempotent — running twice does not duplicate content
- Can be reused across projects by swapping config, not rewriting code

Not for: one-off setup scripts, build tooling, or installers that target a single platform with no interactive flow.

# Preconditions

- A set of agent definition files to distribute (markdown with YAML frontmatter)
- Knowledge of which host tools you target (start with one; the architecture is open/closed — add platforms by adding rows, not branches)
- Node 18+ runtime, willingness to add `@clack/prompts` + `picocolors` as the only runtime deps

# Inputs

None — copy and run as-is. The playbook guides the build from empty directory to tested installer.

# Playbook

See [`playbook.md`](playbook.md) — standalone procedure, 18 sections covering principle, architecture, per-platform specifics, build sequence, and smell detection.

# Outputs

- A working CLI (`bin/<cli>.js`) supporting interactive + non-interactive modes
- A reusable engine (`lib/installer/*`) with no project identity
- A TUI adapter (`bin/prompt.js`) copyable to any future project verbatim
- A templates directory with routing content per platform
- A `node:test` suite validating install, idempotency, global scope, and parity in temp dirs

# Evidence

First run of this playbook: 2026-07-27. Produced the architecture and build sequence from a real installer codebase audit (neurodiveragents `bin/ndv.js`, 837 lines). The audit identified one god file holding four concerns, Open/Closed violations via `if (toolName === ...)` branches, a 67-line routing content literal in code, and skills plumbing inside the installer. The playbook prescribes the extraction that resolves each. Not yet validated end-to-end on a fresh project.