# Strip Attribution Hook — maintenance notes

## Why this exists

Claude Code sessions in claude.ai projects are told by the harness to start every PR body with an attribution comment and a "Requested by" line, and to end PRs and comments with a "Generated with Claude Code" footer. The owner does not want those on GitHub. Asking the model to skip them conflicts with the harness instruction, so the fix happens outside the model: a hook rewrites the tool call after the model writes it.

## Origin

Built first in the neurodiveragents repo as a project-level Bash hook (closed PR emb715/neurodiveragents#32). That version missed the main path: cloud sessions create PRs with the GitHub MCP tools, not `gh`. Moved to ai-stuff so one script can be installed globally, locally and in cloud environments.

## Design decisions

- `updatedInput` without `permissionDecision`. Returning `allow` would auto-approve every `gh` and GitHub MCP call; the hook only edits.
- Fail open. A broken hook should never block a PR.
- `--body-file` gets a temp copy instead of editing the user's file in place.
- The MCP side cleans every string field named `body`, at any depth, so review tools that nest comment bodies are covered without listing tool names.
- Matcher `Bash|mcp__.*[Gg]it[Hh]ub.*` keeps the hook off every other tool call. MCP server names differ between setups (`mcp__github__`, plugin-scoped names, connectors named `GitHub`), hence the loose match. Matchers are case-sensitive regexes, so both cases are spelled out.
- `gh api` and `curl` to `api.github.com` are covered because sessions that can't use `gh pr create` fall back to the REST API. Body files that are JSON are parsed and cleaned field by field so the payload stays valid.
- Two install paths because plugins are the clean local install, but a cloud setup script can only write files; `install.sh` writes user settings directly and serves both.

## Maintenance

- When the harness changes the attribution wording, update `PATTERNS` in `hook.mjs` and add a test case.
- If Claude Code changes the PreToolUse output contract, check `updatedInput` in the hooks docs first.

## Known gaps

- REST calls from scripts (Python, Node) and GitHub Enterprise hosts are not handled.
- The footer the GitHub MCP server adds on `create_pull_request` is removed only when Claude follows the PostToolUse context.
- Environments without the setup line have no hook at all. This was the likely cause of a footer reported on 2026-11-27 from a session in another project.

Promoted from `experiments/` to `tools/` on 2026-11-25 after one local plugin run and one cloud environment run both produced clean bodies.
