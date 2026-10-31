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

> **Overlap note (2026-10-31).** [`skills/test-authoring/`](../../skills/test-authoring/) now covers writing unit and end-to-end tests from a spec, and [`tools/e2e-web/`](../../tools/e2e-web/) runs Playwright with a criteria ledger. Prefer those for that work. `deepeval-llm-evaluation` and `jira-qa-workflows` have no vault counterpart, and `deepeval-llm-evaluation` is the test source for `skills/skill-authoring/`'s evaluation, so this experiment stays.

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
