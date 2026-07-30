# change-impact CLI + GitHub Action

## Description

A tool that runs the `change-impact-diagram` skill automatically on any PR or branch, producing the marker-delimited impact block and upserting it into a PR description. Shares one core (diff → LLM → block) across two delivery modes: a GitHub Action for automatic PR runs, and a CLI for local/manual use. The hosted service is deferred.

## Requirements

- **LLM-agnostic detection** — detect and use whatever LLM is available, in priority order: `ANTHROPIC_API_KEY` env → `OPENAI_API_KEY` env → `claude` CLI → `copilot` CLI → `codex` CLI → `ollama` (localhost:11434) → fallback: print a self-contained prompt bundle for manual use
- **GitHub Action** — triggers on `pull_request` (opened, synchronize), runs the core, upserts the block into the PR description via `gh pr edit` using the existing marker-splice logic
- **CLI** — `npx change-impact` with flags: `--pr <n>`, `--repo <org/repo>`, `--output <file>`, `--llm <auto|claude|openai|ollama|none>`, `--base <ref>`. Defaults to current branch vs `main`
- **Shared core** — one module that both the Action and CLI import: get diff, assemble prompt (skill content + diff + repo context), call LLM, parse output for marker-delimited block
- **Prompt fallback** — when no LLM is available, output a markdown file containing the assembled prompt + diff + instructions to paste into any LLM session. The human is the runner
- **Interactive mode (CLI)** — when run without `--pr` and without CI env vars, use `@clack/prompts` to ask the user: which LLM, which base branch, output to file or upsert
- **Token budget management** — for large diffs, truncate to `--stat` + changed file headers + key file diffs (heuristic: files with >50 line changes get full diff, rest get stat only). Configurable via `--max-tokens`
- **Existing skill as the prompt** — the core loads `skills/change-impact-diagram/SKILL.md` as the system prompt. The skill is not duplicated; the tool calls it
- **Marker-delimited output** — the block uses `<!-- change-impact:start -->` / `<!-- change-impact:end -->` markers, the `### Change impact` heading, shields badges line, and `<details>` wrapper per the skill's block format spec

## User Story

As a repo owner, I want to install a GitHub Action that automatically generates a visual impact block on every PR, and as a developer I want to run the same tool locally on my branch before pushing, so that every change is visually assessed for system impact without manual prompting.

## Constraints

- **Must use `@clack/prompts`** for the CLI interactive mode
- **No bundled LLM** — the tool detects and calls what's available; it doesn't ship a model
- **Hosted service deferred** — no auth, billing, or key management in this build
- **Core must be framework-agnostic** — not tied to Node-only; but first build is Node/TypeScript
- **Action runs on `ubuntu-latest`** — standard GitHub runner, no self-hosted requirement
- **The skill is a dependency** — `skills/change-impact-diagram/` must exist in the repo or be fetchable

## Environment

- **Language:** TypeScript
- **Runtime:** Node.js (Action via `@actions/core` + `@actions/github`; CLI via `npx`)
- **CLI framework:** `@clack/prompts`
- **LLM providers:** Anthropic SDK, OpenAI SDK, Ollama HTTP, CLI shelling (claude/copilot/codex)
- **GitHub integration:** `gh` CLI (for upsert) or `@actions/github` (for Action mode)
- **Deployment targets:** GitHub Actions marketplace, npm registry (for `npx change-impact`)