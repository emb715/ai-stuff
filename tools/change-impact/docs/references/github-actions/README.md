# GitHub Actions Toolkit — Reference

| Resource | URL |
|---|---|
| Official docs | https://docs.github.com/en/actions |
| Actions toolkit core | https://github.com/actions/toolkit/tree/main/packages/core |
| Actions toolkit github | https://github.com/actions/toolkit/tree/main/packages/github |
| Create JS action tutorial | https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action |
| Metadata syntax | https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax |

## Scaffolding

```bash
bun add @actions/core @actions/github
```

## action.yml format

```yaml
name: change-impact
description: Generate a visual impact block on PRs
inputs:
  llm:
    description: LLM provider (auto, claude, openai, ollama, none)
    required: false
    default: auto
  api-key:
    description: LLM API key (if not in env)
    required: false
  skill-path:
    description: Path to change-impact-diagram SKILL.md
    required: false
    default: skills/change-impact-diagram/SKILL.md
runs:
  using: node20
  main: dist/index.js
```

## Core API (from Context7)

```ts
import * as core from '@actions/core';
import * as github from '@actions/github';

// Read input
const llm = core.getInput('llm') || 'auto';

// Set output
core.setOutput('block', blockContent);

// Get PR context
const prNumber = github.context.payload.pull_request?.number;
const baseRef = github.context.payload.pull_request?.base?.ref;
const headRef = github.context.payload.pull_request?.head?.ref;

// Fail
core.setFailed(error.message);
```

## Build requirement

Actions run from `dist/index.js` — must bundle with `@vercel/ncc` or `tsup`:

```bash
npx @vercel/ncc build src/index.ts -o dist --license licenses.txt
```