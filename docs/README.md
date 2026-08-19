---
title: "Docs Index"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - index
  - docs
owner: "@emb715"
---

# docs/

Standards, architecture decisions, principles, and reference material.

## standards/

Binding rules for this repo. All artifacts must pass these.

| File | Purpose |
|---|---|
| [vetting-rubric.md](standards/vetting-rubric.md) | Scored rubric for promoting artifacts to `vetted/` |
| [doc-lint-spec.md](standards/doc-lint-spec.md) | Machine-checkable lint rules (DL001–DL008) |
| [artifact-structure.md](standards/artifact-structure.md) | Three-file folder convention for prompts, tools, skills, commands |

## references/

External research and reference material that grounds work in this repo.

| Topic | Sources |
|---|---|
| [loop-engineering](references/loop-engineering/) | Addy Osmani, Forward Future Loop Library |
| [astro](references/astro/) | Astro SSG source URLs, scaffolding, architecture decisions for the vault publishing site |

## notes/

Opinionated, evidence-backed guidance on AI workflows, tooling, and techniques. Not binding standards, not neutral reference — prescriptive guidance with measurable evidence.

| Note | Summary | Status |
|---|---|---|
| [token-efficiency.md](notes/token-efficiency.md) | Techniques for reducing token consumption; quantified savings per technique | validated |
| [testing-discipline.md](notes/testing-discipline.md) | Unit test case selection, quality gates, mocking discipline, PR test review obligation table | draft |
| [bug-reporting.md](notes/bug-reporting.md) | Severity definitions, reproduction discipline, QA dashboard principle for bug reporting | draft |


