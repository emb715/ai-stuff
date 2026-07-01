# _meta/install.md

How vault commands are registered for this repo.

## How it works

Commands live in `.opencode/commands/` as `.md` files with a `description` frontmatter field. OpenCode discovers them automatically when you open a session in this directory.

The `.opencode/commands/` files are the source of truth for the TUI. The `_meta/commands/*/command.md` files are the repo-documented versions — keep them in sync when updating commands.

## Available commands

| Command | What it does |
|---|---|
| `/vault-start` | Classifies session intent and routes to correct framebook procedure |
| `/vault-lint` | Runs doc lint and surfaces failures |
| `/vault-save` | Interactive artifact intake walkthrough |
| `/vault-promote` | Interactive lifecycle transition |
| `/vault-audit` | Experiment triage |
| `/vault-weekly` | Full weekly maintenance sequence |

## Verify

Open an OpenCode session in this repo and run:

```
/vault-start
```

If it responds with a session classification prompt, everything is working.

## Init prompt (non-OpenCode tools)

For Claude.ai, Cursor, or any other tool that does not read `opencode.json`:

Copy the contents of `_meta/commands/init/command.md` and paste it as your first message.

## Notes

- `AGENTS.md` is loaded automatically via `opencode.json` `instructions` field — no manual loading needed
- Command templates in `opencode.json` and `_meta/commands/*/command.md` should stay in sync
- Do not move `_meta/framebook/` without updating the command templates in `opencode.json`
