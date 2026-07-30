---
title: "skill-authoring"
status: draft
confidence: medium
last_tested: 2026-07-26
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - skill
  - meta
  - authoring
  - documentation
  - process
owner: "@emb715"
---

# Purpose

Process for turning any library, framework, or tool into a well-structured agent skill: gather the source of truth, find the one footgun, decide structure, write affirmatively for a model reader, evaluate before shipping. Covers the full lifecycle from raw docs to a maintainable `SKILL.md` + `refs/` + `humans.md` package.

# When to use

- The task is to write a `SKILL.md` for a library, framework, or tool that does not have one yet.
- The task is to improve an existing skill's structure, token efficiency, or coverage.
- The task is to generate a skill from official documentation.

Not for: writing agent system prompts (use `agents/`), one-shot prompts (use `prompts/`), or multi-step operational procedures (use `playbooks/`).

# Inputs

- Target library/framework/tool name and version
- Access to official documentation (preferred), changelog, type definitions, or source code
- For rewrites: the existing `SKILL.md` and any `refs/` files to audit

# Skill

Use [`SKILL.md`](SKILL.md) — the authoring process, quality checklist, output structure, and routing conventions.

# Reference docs

- [`docs/specification.md`](docs/specification.md) — Agent Skills format specification (agentskills.io)
- [`docs/claude-overview.md`](docs/claude-overview.md) — Claude platform skill overview
- [`docs/claude-best-practices.md`](docs/claude-best-practices.md) — Claude skill authoring best practices
- [`docs/adr-001-skill-structure.md`](docs/adr-001-skill-structure.md) — ADR for this skill's own structure conventions

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome before promotion to validated. -->
<!-- No run evidence captured yet. The process itself encodes lessons from authoring multiple skills, -->
<!-- but no individual run has been documented in this repo. Fill before relying on this section. -->

_TODO: Document at least one real run — target library, skill produced, lines saved vs. naive docs dump, evaluation results (task-without-skill vs. with-skill vs. cross-task noise check from Step 8)._

# Failure Modes / Boundaries

- The process assumes official documentation exists and is reasonably maintained. For private or internal-only libraries with no docs, source code becomes the source of truth — expect longer authoring time and lower confidence claims.
- Step 2 (find the one footgun) is the highest-judgment step. If you cannot identify a real footgun after reading the docs, do not invent one — leave the section empty rather than fabricate. A fake footgun is worse than none.
- Step 3 (antipatterns) is optional and conditional. Only include antipatterns the model would plausibly produce from reasonable API reasoning. Antipatterns that require ignorance of the API belong in examples, not antipatterns.
- The 100–180 line SKILL.md target is a heuristic, not a hard limit. Going over signals either too much in SKILL.md (move to `refs/`) or too large a library (consider splitting by subpath).
- The `humans.md` companion is required by this skill's own conventions. A skill without it is incomplete by its own standard.
- Step 8 evaluation (run-without-skill vs. with-skill vs. cross-task) is the quality gate. Skipping it ships skills that may add noise without closing real gaps.

# Related artifacts

- [`skills/prompt-factory/`](../prompt-factory/) — uses skills as runtime context; the quality of skills produced here directly affects prompt-factory output
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows