---
name: create-pr
description: Open a pull request that follows the repo's PR template. Use when the user asks to open, create or submit a PR.
---

1. Run `pnpm validate`. Stop and report if it fails.
2. Diff against `origin/main`. Classify the impact: docs, ui, api, schema, security, infra.
3. Fill every section of `.github/pull_request_template.md`. Link the issue and any ADR the change touches.
4. Confirm the commit history follows Conventional Commits.
5. `gh pr create --title "<conventional title>" --body-file <filled template>`
6. Add the impact label so the right review bots run.
