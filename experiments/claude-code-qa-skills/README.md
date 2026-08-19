---
title: "Claude Code QA Skills Starter Pack"
status: draft
confidence: medium
last_tested: 2026-08-19
scope: personal
tooling:
  - "claude-code"
tags:
  - experiment
  - qa
  - skills
owner: "@emb715"
---

# Claude Code QA Skills Starter Pack

4 production-ready QA skills for Claude Code (and any Agent Skills compatible agent: Cursor, Copilot, Windsurf, Codex, and 30+ more). From QASkills.sh, the open registry of 400+ QA skills.

## What's inside

| Skill | What it teaches your agent |
|---|---|
| playwright-e2e | Resilient Playwright E2E tests: role-based locators, fixtures, POM, auto-waiting |
| unit-test-generation | High-signal unit tests: boundaries, error paths, mocking discipline, mutation-tested quality |
| pr-test-coverage-review | Review PRs for missing tests: map the diff to required test classes, catch untested branches |
| jira-qa-workflows | Run QA in Jira: bug templates, JQL for testers, triage, quality dashboards |

## How to install

Each folder holds one SKILL.md. Drop the folders into your agent's skills directory:

- Claude Code: `.claude/skills/` (project) or `~/.claude/skills/` (global)
- Universal: `.agents/skills/`

Or install any of 400+ skills directly with the CLI:

```
npx qaskills add playwright-e2e
npx qaskills search llm
```

## More

Full catalog, docs, and 800+ QA guides: https://qaskills.sh
