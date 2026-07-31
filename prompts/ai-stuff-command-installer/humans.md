# humans.md — ai-stuff-command-installer

## Why this structure

This is an external-facing installer prompt, not vault infrastructure. It lives in `prompts/` (one-shot instruction text) rather than `_meta/commands/` (vault operations) because:
- `_meta/commands/` is internal framework plumbing — commands that operate the vault itself
- This prompt is consumed by external LLMs to register a command in their own harness, not to operate this vault

The three-file structure applies because the prompt has a standalone consumable form (`prompt.md` — paste into any LLM).

## Origin

Session 2026-07-30. The user noted that USAGE.md, while universal, requires manual pasting into a fresh session. The natural next step was a command (`/ai-stuff`) that loads USAGE.md's flow. Since the target is external consumption (not the vault's own metaframework), the deliverable is an installer prompt that any LLM can run to set up the command in its own harness.

## Design decisions

- **Remote-first, local fallback.** The default source is the public GitHub raw URL. A local clone is offered as an alternative. This matches USAGE.md's own Step 0, which anchors on the repo URL with local as a fallback.
- **The command body fetches USAGE.md fresh at invocation.** This avoids staleness — the registered command is a thin loader, not a copy of USAGE.md's content. The harness is instructed to fetch and follow USAGE.md each time `/ai-stuff` is invoked.
- **The installer does not run the command.** Install registers; the user triggers. Mixing the two would produce a confusing first-session experience.
- **Per-harness registration guidance, not a single mechanism.** OpenCode, Claude Code, and Cursor each have different command-registration mechanisms. The prompt names the known ones and falls back to "paste USAGE.md manually" for unknown harnesses. Trying to cover every harness would bloat the prompt and date it.
- **Prompt lives in `prompts/`, not `tools/`.** This is instruction text consumed by an LLM, not a deployable binary or CLI. `tools/` is for executable artifacts (MCP servers, CLIs). If this later becomes a shell script or npm package, it moves to `tools/`.

## Maintenance notes

- If the repo URL changes (rename, transfer, private fork), update the raw URL in `prompt.md` and the README's Evidence section.
- If USAGE.md's flow changes structurally (new steps, renamed steps), the command body (`Fetch and follow USAGE.md exactly`) does not need updating — it loads USAGE.md fresh. The only update needed is if the fetch URL changes.
- If a new harness becomes common (e.g., a new IDE with command support), add its registration mechanism to prompt.md's Step 3.

## Known gaps

- Tested end-to-end in OpenCode (2026-07-30). Confirmed: installer registers `/ai-stuff`, command fetches USAGE.md from remote at invocation, menu renders correctly.
- Not yet tested in Claude Code or Cursor. The per-harness registration guidance is written from documented mechanisms, not confirmed runs.
- The "fetch fresh each invocation" instruction depends on the harness honoring it. A harness that caches the command body at registration time will serve stale USAGE.md until the command is re-registered. This is documented in Failure Modes but not enforceable from the prompt.
- No verification step that the registered command actually works. The prompt tells the user to type `/ai-stuff` after install, but does not verify the result.