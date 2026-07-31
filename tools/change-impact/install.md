Set up the change-impact tool on this repo. change-impact is a GitHub Action + CLI that runs the change-impact-diagram skill on PRs, producing a visual impact block (system map, decision graph, state map, endpoint interaction) and upserting it into the PR description. It's LLM-agnostic — it auto-detects whatever LLM provider is available.

## What change-impact is

- **Skill:** a prompt (`SKILL.md`) that instructs an LLM to read a git diff, classify the impact (composes / extends / adds / removes), and produce a marker-delimited block with mermaid diagrams
- **Tool:** a runner that loads the skill as the system prompt, sends the diff as the user prompt, calls the LLM, parses the output, and upserts the block into a PR
- **Output:** a `<!-- change-impact:start --> ... <!-- change-impact:end -->` block in the PR description with shields badges, a collapsible details section, and four diagram types

## Steps

### 1. Detect the source

The tool source lives in a sibling repo. Check these locations in order:

- `tools/change-impact/` — local path (if running inside the ai-stuff repo)
- A git clone if the above doesn't exist: `git clone https://github.com/emb715/ai-stuff /tmp/ai-stuff && ls /tmp/ai-stuff/tools/change-impact/`

Report which path you found. If neither works, stop and tell the user the tool source is unavailable.

### 2. Install the Action as a local composite action

```bash
mkdir -p .github/actions/change-impact
cp <source>/action.yml .github/actions/change-impact/
cp -r <source>/dist/action .github/actions/change-impact/dist
```

Where `<source>` is the path you found in step 1.

### 3. Install the skill (optional but recommended)

```bash
mkdir -p skills/change-impact-diagram
cp <source>/../../skills/change-impact-diagram/SKILL.md skills/change-impact-diagram/
```

If you skip this, the tool uses a bundled fallback copy of the skill. Installing the real file means the skill can be updated independently.

### 4. Create the workflow

Create `.github/workflows/change-impact.yml`:

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

### 5. Detect and configure the LLM provider

Check which API keys are available in this repo's secrets:

```bash
gh secret list --repo <this-repo>
```

The tool auto-detects in priority order:
1. `ANTHROPIC_API_KEY` — Claude via Anthropic SDK
2. `FUELX_API_KEY` or `FUELIX_API_KEY` — Fuelix AI (OpenAI-compatible)
3. `OMNIROUTE_API_KEY` — Omniroute (OpenAI-compatible)
4. `OPENAI_API_KEY` — OpenAI
5. `OPENAI_API_KEY` + `OPENAI_BASE_URL` — any OpenAI-compatible endpoint
6. `claude` CLI in PATH — shells out to `claude --print`
7. Ollama on localhost:11434 — local LLM via raw HTTP
8. None — posts a comment with a prompt bundle for manual use

If the repo has no LLM secret set, ask the user: "Which LLM provider do you want to use? I can set the secret now." Then:

```bash
gh secret set ANTHROPIC_API_KEY --repo <this-repo> --body "<key>"
```

If the user has no API key, set `llm: none` in the workflow and skip the `api-key` input. The Action will post a comment with the prompt bundle instead of calling an LLM.

### 6. Optionally install the CLI locally

```bash
cd <source>
npm link
```

This makes `change-impact` available as a global command:

```bash
change-impact --llm auto --base main --output block.md
change-impact --pr <pr-number> --repo <this-repo> --llm auto
change-impact --llm none --base main --output prompt-bundle.md
change-impact  # interactive mode
```

### 7. Verify

1. Confirm the files exist:
   - `.github/actions/change-impact/action.yml`
   - `.github/actions/change-impact/dist/index.js`
   - `.github/workflows/change-impact.yml`
   - `skills/change-impact-diagram/SKILL.md` (if installed)

2. Open a PR. The Action should run and upsert the block into the PR description.

3. Check the Action run logs for progress messages:
   - `loading skill...`
   - `getting diff (main...HEAD)...`
   - `detecting LLM provider...`
   - `calling <provider>...`
   - `parsing output...`
   - `updated change-impact block on PR #N` or `added change-impact block to PR #N`

4. Verify the PR body has the markers:
   ```bash
   gh pr view <pr-number> --json body --jq '.body' | grep "change-impact:"
   ```

### 8. Report

After setup, report:
- Which source path was used
- Whether the skill was installed or using fallback
- Which LLM provider was configured (or "none — prompt bundle mode")
- Whether the CLI was linked locally
- The workflow file path
- Any issues encountered