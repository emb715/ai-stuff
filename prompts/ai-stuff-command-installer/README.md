---
title: "ai-stuff-command-installer"
status: validated
confidence: medium
last_tested: 2026-07-30
scope: global
tooling:
  - "agnostic/any-LLM"
tags:
  - prompt
  - installer
  - command
  - external
  - slash-command
owner: "@emb715"
---

# ai-stuff-command-installer

## Purpose

A one-shot installer prompt. Paste it into any LLM session to register a `/ai-stuff` command in that LLM's harness. The command loads the vault's USAGE.md browsing flow so the user can discover and consume artifacts from outside the repo.

## When to use

- A user wants `/ai-stuff` as a slash command in their tool (OpenCode, Claude Code, Cursor, other)
- A user wants to consume vault artifacts from an external project without cloning the vault

Not for: operating the vault itself (use the `vault-*` commands in `_meta/commands/`). Not for installing other commands or skills.

## Inputs

- `{{SOURCE}}` — optional. `remote` (default, fetch from GitHub) or `local` (read from a clone). If omitted, the prompt asks the user.

## Artifact

See [`prompt.md`](prompt.md) — paste-ready, no frontmatter.

## Evidence

Remote raw URL verified reachable: `https://raw.githubusercontent.com/emb715/ai-stuff/main/USAGE.md` returns 200. USAGE.md contains the full browsing flow (Step 0 resolve root → Step 1 verify inventory → Step 2 menu → Step 3 wait → Step 4 deliver).

Tested end-to-end in OpenCode (2026-07-30): the installer prompt registered `/ai-stuff` as a slash command, fetched USAGE.md from the remote URL at invocation, and produced the expected artifact menu. Confirmed working.

## Failure Modes / Boundaries

- **Harness without custom-command support.** Some tools (Claude.ai web, basic chat UIs) have no command mechanism. The prompt falls back to instructing the user to paste USAGE.md manually. The fallback is documented in the prompt, not handled silently.
- **Remote fetch blocked.** If GitHub raw is unreachable (firewall, rate limit), the prompt falls back to local clone. If no local clone exists either, install fails with a clear message.
- **Stale USAGE.md on disk.** If the harness caches the command body rather than fetching USAGE.md at invocation time, the menu drifts from the actual repo. The command body instructs the harness to fetch USAGE.md fresh each invocation to avoid this — but enforcement depends on the harness honoring that instruction.
- **Cross-harness syntax varies.** The prompt names the registration mechanism per known harness (OpenCode, Claude Code, Cursor) but cannot cover every tool. Unknown harnesses require the user to map the command body to their tool's mechanism manually.

## Related artifacts

- [`USAGE.md`](../../USAGE.md) — the document the registered command loads at invocation time
- [`_meta/commands/init/`](../../_meta/commands/init/) — the vault's own orientation command (internal, not external)