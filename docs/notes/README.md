---
title: "Notes Index"
status: validated
confidence: high
last_tested: 2026-07-31
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - index
  - notes
owner: "@emb715"
---

# docs/notes/

Opinionated, evidence-backed guidance on AI workflows, tooling, and techniques.

Notes are **not** binding standards (see `docs/standards/`) and **not** neutral reference material (see `docs/references/`). They are prescriptive guidance grounded in measurable evidence — what worked, what didn't, with numbers.

## Acceptance criteria

Every note must include:
- **Problem/context** — what situation the note addresses
- **Guidance** — the opinionated recommendation
- **Evidence** — measurable outcome: token count before/after, cost delta, reproducible example with observed result
- **Failure modes** — when the guidance does not apply or backfires

Notes without evidence are opinions. They belong in a blog, not here.

## Notes

| Note | Summary | Status |
|---|---|---|
| [token-efficiency.md](token-efficiency.md) | Techniques for reducing token consumption across long sessions; quantified savings per technique | validated |