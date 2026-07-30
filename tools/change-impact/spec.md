# change-impact CLI + GitHub Action — Technical Specification

## Problem

The `change-impact-diagram` skill produces visual impact blocks on PRs, but running it requires manually loading the skill into an agent session and asking it to produce a block. Teams want this automatically on every PR, and developers want to run it locally before pushing. The skill is the prompt; the runner is missing.

## Scope

**In:** shared core (diff → LLM → block), LLM-agnostic detection layer (first-class: anthropic, openai, ollama, claude CLI; fallback: prompt bundle), GitHub Action wrapper, CLI wrapper with `@clack/prompts` interactive mode, token budget truncation for large diffs.

**Out:** hosted service (deferred), billing/auth/key management, auto-discovery of `primitives.yaml` drift check (the tool loads the skill prompt which handles this; the tool itself doesn't implement drift checking), `copilot`/`codex` CLI shelling (stubbed for future — claude + ollama are the first-class CLI paths in this build).

## Context

### Existing artifacts

- `skills/change-impact-diagram/SKILL.md` — the skill (system prompt). The tool loads this as the LLM's system prompt. Not duplicated.
- `skills/change-impact-diagram/scripts/upsert-impact-block.mjs` — existing 50-line splice script. The tool's upsert logic ports this into a shared module (not shells out to the script).
- `experiments/change-impact-tool/docs/references/` — source docs for all external deps (clack, github-actions, anthropic, openai, ollama).

### External dependencies

- `@clack/prompts` — CLI interactive prompts (user requirement)
- `@actions/core` + `@actions/github` — GitHub Action toolkit
- `@anthropic-ai/sdk` — Anthropic LLM (priority 1)
- `openai` — OpenAI LLM (priority 2)
- Ollama HTTP — local LLM (priority 6), no SDK needed, raw `fetch`
- `@vercel/ncc` — bundle Action to `dist/index.js`

### Conventions

- TypeScript, ESM (`"type": "module"`)
- Node 20+ (Action runtime; CLI via `npx` auto-fetches)
- The Action metadata specifies `using: node20` (the Node runtime). Consumers specify `runs-on: ubuntu-latest` in their workflow YAML. These are different layers.
- The block format (markers, heading, badges, `<details>`) is defined by the skill, not the tool. The tool produces whatever the LLM returns between the markers.

## Acceptance Criteria

AC1: Given a PR with `ANTHROPIC_API_KEY` in repo secrets, When the Action runs on `pull_request` opened, Then the PR description contains a change-impact block with valid markers within 60 seconds.

AC2: Given a PR with no LLM API key configured, When the Action runs, Then it posts a comment containing a self-contained prompt bundle (SKILL.md + diff + instructions) instead of failing.

AC3: Given a developer on a local branch, When they run `npx change-impact`, Then `@clack/prompts` asks: which LLM, which base branch, output to file or stdout, and produces the block accordingly.

AC4: Given a PR with an existing change-impact block, When the Action re-runs on `synchronize`, Then the block is replaced (not duplicated) — exactly 1 start marker after re-run.

AC5: Given a diff exceeding 100k tokens, When the core assembles the prompt, Then the diff is truncated to `--stat` + file headers + files with >50 line changes, and a note is included in the prompt saying truncation occurred.

AC6: Given `OPENAI_API_KEY` is set but `ANTHROPIC_API_KEY` is not, When auto-detect runs, Then OpenAI is selected and used.

AC7: Given no API keys and no local LLM, When the user runs `npx change-impact --llm none`, Then a markdown file `change-impact-prompt.md` is written containing the assembled prompt + diff + "paste this into any LLM session" instructions.

AC8: Given a PR on a repo without `skills/change-impact-diagram/SKILL.md`, When the Action runs with `skill-path` input pointing to a remote URL or embedded fallback, Then the block is still produced (the skill content is bundled as a fallback string in the tool).

## Tasks

### 1. Project scaffold

1. `experiments/change-impact-tool/`: init `package.json` with `"type": "module"`, TypeScript, deps: `@clack/prompts`, `@actions/core`, `@actions/github`, `@anthropic-ai/sdk`, `openai`, devDeps: `typescript`, `@vercel/ncc`, `@types/node`
2. `tsconfig.json`: target `ES2022`, module `ESNext`, moduleResolution `bundler`, strict
3. `src/` directory structure:
   ```
   src/
   ├── core/
   │   ├── diff.ts          ← get diff via git or GitHub API
   │   ├── prompt.ts        ← assemble system prompt (skill) + user prompt (diff)
   │   ├── llm.ts           ← agnostic detection + call
   │   ├── parse.ts         ← extract marker-delimited block from LLM output
   │   └── upsert.ts        ← splice block into PR body (ported from upsert-impact-block.mjs)
   ├── providers/
   │   ├── anthropic.ts     ← Anthropic SDK call
   │   ├── openai.ts         ← OpenAI SDK call
   │   ├── ollama.ts         ← HTTP fetch to localhost:11434
   │   ├── cli.ts            ← shell out to claude CLI
   │   └── fallback.ts       ← write prompt bundle to file
   ├── action/
   │   └── index.ts          ← GitHub Action entry point
   ├── cli/
   │   └── index.ts          ← CLI entry point with @clack/prompts
   └── skill-fallback.ts     ← bundled SKILL.md content as string (when skill file not found)
   ```

### 2. Core modules

4. `src/core/diff.ts`: `getDiff(opts): Promise<{ stat: string, full: string, truncated: boolean }>` — runs `git diff <base>...HEAD --stat` and `git diff <base>...HEAD`; truncates if `full.length > maxTokens * 4` (rough char→token ratio), keeping stat + headers + files with >50 changed lines
5. `src/core/prompt.ts`: `assemblePrompt(skillContent, diff, repoContext): { system: string, user: string }` — system = SKILL.md content; user = diff stat + diff (truncated if needed) + "produce the change-impact block per the skill's block format spec"
6. `src/core/llm.ts`: `detectLLM(opts): Promise<LLMProvider | null>` — priority order: ANTHROPIC_API_KEY → OPENAI_API_KEY → claude CLI → ollama localhost → null. Returns a provider object with a `call(system, user): Promise<string>` method
7. `src/core/parse.ts`: `extractBlock(text): string | null` — finds `<!-- change-impact:start -->` ... `<!-- change-impact:end -->` in LLM output, returns the block (with markers) or null
8. `src/core/upsert.ts`: `upsertBlock(prNumber, block, opts): Promise<void>` — ports the existing splice logic: fetch PR body via `gh pr view` (CLI mode) or `@actions/github` (Action mode), find markers, replace or append, write back via `gh pr edit` (CLI) or GitHub API (Action)

### 3. Providers

9. `src/providers/anthropic.ts`: `callAnthropic(system, user, model?): Promise<string>` — uses `@anthropic-ai/sdk`, model defaults to `claude-sonnet-4-20250514`, max_tokens 4096
10. `src/providers/openai.ts`: `callOpenAI(system, user, model?): Promise<string>` — uses `openai` SDK, model defaults to `gpt-4o-mini`, max_tokens 4096
11. `src/providers/ollama.ts`: `callOllama(system, user, model?): Promise<string>` — raw `fetch` to `localhost:11434/api/chat`, model defaults to `gemma3`, `stream: false`
12. `src/providers/cli.ts`: `callCli(command, prompt): Promise<string>` — `execFileSync(command, ['--print', prompt])` for `claude` CLI
13. `src/providers/fallback.ts`: `writePromptBundle(system, user, outputPath): Promise<void>` — writes a markdown file with instructions: "Paste the system prompt into your LLM session, then paste the user prompt. Run the skill manually."

### 4. GitHub Action

14. `action.yml`: inputs `llm` (default `auto`), `api-key`, `skill-path` (default `skills/change-impact-diagram/SKILL.md`), `max-tokens` (default `50000`); runs `using: node20`, `main: dist/index.js`
15. `src/action/index.ts`: reads inputs via `@actions/core`, gets PR number + base/head from `github.context.payload`, calls core modules, upserts via GitHub API (`@actions/github` Octokit `pulls.update`), or falls back to `gh pr edit` if API token lacks scope. Posts comment with prompt bundle if no LLM.
16. Build step: `npx @vercel/ncc build src/action/index.ts -o dist --license licenses.txt`

### 5. CLI

17. `src/cli/index.ts`: parses args (`--pr`, `--repo`, `--output`, `--llm`, `--base`, `--max-tokens`). If no `--pr` and not in CI, launches `@clack/prompts` interactive flow: intro → select LLM → text base branch → confirm upsert or output to file → run → outro
18. `bin/change-impact`: `#!/usr/bin/env node` shim that imports `src/cli/index.ts`
19. `package.json` `bin` field: `{ "change-impact": "./dist/cli.js" }`

### 6. Skill fallback

20. `src/skill-fallback.ts`: exports `SKILL_FALLBACK` — the full content of `skills/change-impact-diagram/SKILL.md` as a string constant. Used when the skill file isn't found at the expected path. Must be updated when the skill changes (build step can automate this).

### 7. Tests

21. `test/parse.test.ts`: test `extractBlock` with valid block, no markers, multiple markers, partial markers
22. `test/diff.test.ts`: test truncation logic — small diff (no truncation), large diff (stat + headers only), diff with mixed file sizes
23. `test/upsert.test.ts`: test splice logic — no existing block (append), existing block (replace), block at start, block at end, empty PR body

## Test Plan

- **AC1:** Create a test PR on a repo with `ANTHROPIC_API_KEY` secret, install the Action, verify block appears in PR description within 60s. Check markers present, badges present, `<details>` present.
- **AC2:** Create a test PR with no API key secret, verify a comment is posted with the prompt bundle (not a failure).
- **AC3:** Run `npx change-impact` in a local repo, walk through the `@clack/prompts` flow, verify block output to stdout or file.
- **AC4:** Run the Action twice on the same PR (open + synchronize), verify exactly 1 start marker after second run.
- **AC5:** Create a PR with >100k token diff (large generated files), verify the LLM receives truncated diff + truncation note.
- **AC6:** Set only `OPENAI_API_KEY`, run auto-detect, verify OpenAI provider selected.
- **AC7:** Run `npx change-impact --llm none`, verify `change-impact-prompt.md` written with correct content.
- **AC8:** Remove `skills/change-impact-diagram/SKILL.md` from the repo, run the Action, verify block still produced using fallback.
- **Unit tests:** `bun test` for parse, diff truncation, upsert splice.