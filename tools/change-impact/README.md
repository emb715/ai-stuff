---
title: "change-impact"
status: validated
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "node/20"
  - "github-actions"
  - "anthropic-sdk"
  - "openai-sdk"
  - "ollama"
tags:
  - tool
  - cli
  - github-action
  - impact-analysis
  - mermaid
  - llm
owner: "@emb715"
---

# Purpose

Runs the `change-impact-diagram` skill automatically on PRs or locally. Produces a marker-delimited visual impact block (system map, decision graph, state map, endpoint interaction) and upserts it into a PR description. LLM-agnostic: detects and uses whatever LLM is available — Anthropic, OpenAI, Fuelix, Omniroute, Ollama, claude CLI, or a self-contained prompt bundle fallback.

# When to use

- Install the GitHub Action on a repo to automatically generate an impact block on every PR.
- Run the CLI locally on a branch before pushing to preview the impact block.
- Run with `--llm none` to produce a prompt bundle for manual use when no LLM is available.

# Usage

## Option A — GitHub Action (automatic on every PR)

### Install as a local composite action

1. Copy the Action bundle and skill into your repo:

```bash
mkdir -p .github/actions/change-impact
cp action.yml .github/actions/change-impact/
cp -r dist/action .github/actions/change-impact/dist

mkdir -p skills/change-impact-diagram
cp SKILL.md skills/change-impact-diagram/  # optional — tool has a bundled fallback
```

2. Create `.github/workflows/change-impact.yml`:

```yaml
name: change-impact
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  pull-requests: write
  contents: read
jobs:
  change-impact:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Generate change-impact block
        uses: ./.github/actions/change-impact
        with:
          llm: auto
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          skill-path: skills/change-impact-diagram/SKILL.md
          max-tokens: '50000'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

3. Add an LLM API key to repo secrets:

```bash
gh secret set ANTHROPIC_API_KEY --repo your-org/your-repo --body "sk-ant-..."
```

If no API key is set, the Action posts a comment with a self-contained prompt bundle instead of calling an LLM. The reviewer can paste it into any chat session manually.

4. Open a PR. The Action upserts a marker-delimited impact block into the PR description with:
   - `### Change impact` heading + shields badges (risk level + operation type)
   - Collapsible `<details>` with system map, decision graph, state map, endpoint interaction
   - Real git SHAs for base and head
   - Idempotent re-runs (block is replaced, not duplicated on `synchronize`)

### Install from a published Action (when available)

```yaml
- uses: your-org/change-impact@v1
  with:
    llm: auto
    api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Option B — CLI (local run on any branch)

```bash
# Auto-detect LLM, diff current branch vs main, write to file
npx change-impact --llm auto --base main --output block.md

# Use a specific provider
npx change-impact --llm anthropic --base main --output block.md

# Upsert directly to a PR (requires gh CLI auth)
npx change-impact --pr 123 --repo your-org/your-repo --llm auto --base main

# No LLM available — produce a prompt bundle for manual use
npx change-impact --llm none --base main --output prompt-bundle.md

# Interactive mode (no flags) — @clack/prompts walks you through it
npx change-impact
```

Progress messages go to stderr; the block goes to the file or stdout. The tool prints a startup line immediately (`change-impact — non-interactive mode, LLM: auto-detect, diff: main...HEAD`) so you know it's running.

## Option C — Fallback (no LLM, no API key)

When no LLM provider is detected, the tool writes a self-contained prompt bundle to `change-impact-prompt.md`. The bundle contains:
- The full SKILL.md as the system prompt
- The diff + instructions as the user prompt
- Steps to paste into any LLM session (Claude, ChatGPT, Gemini, etc.)

The human is the runner. The skill still executes — just manually.

```bash
npx change-impact --llm none --base main
# → writes change-impact-prompt.md
# → paste the two sections into any chat, copy the block back into your PR
```

# Inputs

## GitHub Action

| Input | Description | Default |
|---|---|---|
| `llm` | Provider: auto, anthropic, claude, openai, fuelix, omniroute, ollama, none | `auto` |
| `api-key` | LLM API key (if not in env/secrets) | — |
| `skill-path` | Path to SKILL.md | `skills/change-impact-diagram/SKILL.md` |
| `max-tokens` | Max token budget for diff truncation | `50000` |

Requires `GITHUB_TOKEN` (auto-provided by Actions) for PR body upsert.

## CLI

```bash
npx change-impact [--pr <n>] [--repo <org/repo>] [--output <file>] [--llm <auto|anthropic|claude|openai|fuelix|omniroute|ollama|none>] [--base <ref>] [--head <ref>] [--max-tokens <n>]
```

Interactive mode (no flags, no CI env): `@clack/prompts` walks through LLM selection, base branch, and output destination.

# How the skill is found

The tool loads `skills/change-impact-diagram/SKILL.md` as the LLM system prompt. Resolution order:
1. The `skill-path` input (Action) or `--skill-path` flag (CLI) — explicit path
2. `skills/change-impact-diagram/SKILL.md` relative to `process.cwd()` — default
3. A bundled copy (`SKILL_FALLBACK` in `src/skill-fallback.ts`) — used when neither file is found

The bundled copy is byte-identical to the skill at promotion time. If the skill evolves, the fallback should be regenerated (a build step can automate this). The skill is the prompt; the tool is the runner.

# LLM provider detection

Priority order when `llm: auto`:

| Priority | Provider | Env var(s) | How it calls |
|---|---|---|---|
| 1 | Anthropic | `ANTHROPIC_API_KEY` | `@anthropic-ai/sdk` (Messages API) |
| 2 | Fuelix | `FUELX_API_KEY` or `FUELIX_API_KEY` | OpenAI SDK with `baseURL: https://api.fuelix.ai/v1` |
| 3 | Omniroute | `OMNIROUTE_API_KEY` | OpenAI SDK with `baseURL: https://api.omniroute.ai/v1` |
| 4 | OpenAI | `OPENAI_API_KEY` | OpenAI SDK |
| 5 | OpenAI custom | `OPENAI_API_KEY` + `OPENAI_BASE_URL` | OpenAI SDK with custom baseURL |
| 6 | claude CLI | `claude` in PATH | shell out: `claude --print <prompt>` |
| 7 | Ollama | server on localhost:11434 | raw HTTP `fetch` to `/api/chat` |
| 8 | Fallback | none | writes prompt bundle to file for manual use |

# Behavior per entry point

## GitHub Action (`action.yml`)

1. Triggers on `pull_request` (opened, synchronize)
2. Gets PR context from event payload (number, base.ref, head.ref)
3. Sets API key env var from `api-key` input if provided
4. Gets diff via `git diff base...head` (with truncation for large diffs)
5. Loads skill content, assembles system + user prompt
6. Detects LLM provider (or uses forced `llm` input)
7. If LLM available: calls provider (55s timeout), extracts marker block, upserts into PR body via Octokit `pulls.update` (replaces existing block, never duplicates)
8. If no LLM: posts a comment with the prompt bundle via `issues.createComment`
9. Sets `block` output to the block content (empty if fallback)

## CLI (`npx change-impact`)

1. Parses args. If no flags and not in CI → interactive @clack/prompts flow
2. Gets diff via `git diff base...head` (with truncation)
3. Loads skill content, assembles prompt
4. Detects LLM or uses `--llm` flag
5. If LLM available: calls provider, extracts block
6. If `--llm none` or no provider: writes prompt bundle to `change-impact-prompt.md`
7. Delivers block: upsert to PR (via `gh pr edit`), write to file (`--output`), or stdout

# Evidence

Tested end-to-end with Fuelix AI (OpenAI-compatible):
- CLI `--llm fuelix --base main --output file.md` → produced a valid block with real git SHAs, markers, shields badges, `<details>` wrapper
- CLI `--llm auto` → auto-detected `FUELIX_API_KEY` and routed to fuelix provider
- CLI `--llm none` → produced a self-contained prompt bundle with skill + diff + instructions
- 46 unit tests (parse, diff truncation, upsert splice) — all passing
- Security: `execFileSync` with array args + `validateRef`/`validateRepo` (no command injection)
- Action splice: idempotent re-run (replaces, never duplicates — tested in unit tests)

# Failure Modes / Boundaries

- **No LLM and no fallback wanted.** If no provider is detected and `--llm` is not `none`, the tool writes a prompt bundle. This is by design — the skill still runs, the human is the runner.
- **Large diffs.** Diffs exceeding `max-tokens * 4` chars are truncated to `--stat` + files with >50 changed lines. A truncation note is included in the prompt.
- **LLM doesn't produce markers.** If the LLM output doesn't contain `<!-- change-impact:start -->` / `<!-- change-impact:end -->`, the tool reports the error and prints the raw output. The skill prompt instructs the LLM to produce markers, but some models may not follow instructions.
- **Skill file not found.** Falls back to a bundled copy of SKILL.md. The bundled copy may be stale if the skill was updated after the tool was built.
- **Ollama not running.** Detection times out after 2s and falls through to the next provider or null.
- **GitHub Action without `GITHUB_TOKEN`.** Fails with a clear error. The token is auto-provided by Actions but may need explicit `github-token` input if using a custom token.
- **Env var naming.** Fuelix supports both `FUELX_API_KEY` and `FUELIX_API_KEY` (with/without the I). Other providers use their standard env var names.

# Related artifacts

- [`skills/change-impact-diagram/`](../../skills/change-impact-diagram/) — the skill that this tool runs. The skill is the prompt; this tool is the runner.
- [`prompts/repo-primitive-audit/`](../../prompts/repo-primitive-audit/) — the skill routes to this for primitive map verification when no `primitives.yaml` exists.
- [`docs/references/change-impact-checklist.md`](../../docs/references/change-impact-checklist.md) — complementary pre-change decision framework.