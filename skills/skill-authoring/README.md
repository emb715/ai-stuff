---
title: "skill-authoring"
status: draft
confidence: medium
last_tested: 2026-08-04
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

Process for turning any library, framework, or tool into a well-structured agent skill: gather the source of truth, find the one footgun, decide structure, write affirmatively for a model reader, evaluate before shipping. Covers the full lifecycle from raw docs to a maintainable `SKILL.md` + `references/` + `humans.md` package.

# When to use

- The task is to write a `SKILL.md` for a library, framework, or tool that does not have one yet.
- The task is to improve an existing skill's structure, token efficiency, or coverage.
- The task is to generate a skill from official documentation.

Not for: writing agent system prompts (use `agents/`), one-shot prompts (use `prompts/`), or multi-step operational procedures (use `playbooks/`).

# Inputs

- Target library/framework/tool name and version
- Access to official documentation (preferred), changelog, type definitions, or source code
- For rewrites: the existing `SKILL.md` and any `references/` files to audit

# Skill

Use [`SKILL.md`](SKILL.md) — the authoring process, quality checklist, output structure, and routing conventions.

# Reference docs

- [`docs/specification.md`](docs/specification.md) — Agent Skills format specification (agentskills.io)
- [`docs/claude-overview.md`](docs/claude-overview.md) — Claude platform skill overview
- [`docs/claude-best-practices.md`](docs/claude-best-practices.md) — Claude skill authoring best practices
- [`docs/adr-001-skill-structure.md`](docs/adr-001-skill-structure.md) — ADR for this skill's own structure conventions

# Evidence

Two real authoring runs executed against the library-skill track (Steps 1–10) during this session. Both produced `SKILL.md` files within the 100–180 line target prescribed by the process, and both surfaced at least one footgun from the source documentation.

## Authoring run 1: deepeval-llm-evaluation

- **Source:** `experiments/claude-code-qa-skills/deepeval-llm-evaluation/SKILL.md` — 156 lines, flat structure, foreign format (no vault conventions, no `references/` split, no `humans.md`).
- **Process applied:** skill-authoring library-skill track, Steps 1–10.
- **Output:** `skills/deepeval-llm-evaluation/SKILL.md` — 130 lines (within target).
- **Measurable outcomes:**
  - Line count: 156 → 130 (17% reduction) while adding vault structure (`README.md`, `references/`, `humans.md`).
  - Footgun identified: `FaithfulnessMetric` without `retrieval_context` silently passes — the metric returns a passing score with no input to score against, a real failure mode that the source docs did not call out.
  - Progressive disclosure applied: 2 `references/` files created (`ci-gates.md` 71 lines, `datasets.md` 71 lines) — depth moved out of `SKILL.md`, keeping the main file dense.
  - Gate 7 compliance: 0 `humans.md` references in `SKILL.md` (the source had no `humans.md` concept; the vault format enforced the separation).
  - Source attribution: `README.md` Evidence section cites thetestingacademy MIT v1.0.0, assessed 2026-08-04.

## Authoring run 2: liteparse

- **Source:** liteparse GitHub README — fetched web content, ~500 lines (API reference, flags, examples, FAQ).
- **Process applied:** skill-authoring library-skill track, Steps 1–10.
- **Output:** `skills/liteparse/SKILL.md` — 104 lines (within target).
- **Measurable outcomes:**
  - Line count: ~500 lines of source → 104-line `SKILL.md` + 98-line `references/cli-reference.md` — progressive disclosure working as designed; the main file stayed dense while preserving complete coverage.
  - Footgun identified: markdown reconstruction on complex docs is heuristic and fails on dense tables / multi-column layouts — surfaced as an explicit boundary in the skill.
  - CLI facts verified against installed binary (`lit 2.11.0`): every flag documented in `references/cli-reference.md` matches `--help` output. The skill was not shipped on the README alone; it was checked against the real artifact.
  - Gate 7 compliance: 0 `humans.md` references in `SKILL.md`.

## Observation

Both runs produced `SKILL.md` within the 100–180 line target prescribed by the process, confirming the target is achievable for real library skills of varying source sizes (156 lines vs. ~500 lines). The progressive disclosure pattern (`references/` for depth) kept `SKILL.md` dense while preserving complete coverage — the source-to-SKILL.md compression was 17% for the already-compact deepeval source and ~79% for the verbose liteparse README, with depth relocated rather than dropped. Each run also produced at least one footgun sourced from real documentation or binary behavior, not invented.

This is 2 runs. The process is repeatable on these two data points but has not been validated at scale (N=10+). Confidence remains medium.

# Failure Modes / Boundaries

- The process assumes official documentation exists and is reasonably maintained. For private or internal-only libraries with no docs, source code becomes the source of truth — expect longer authoring time and lower confidence claims.
- Step 2 (find the one footgun) is the highest-judgment step. If you cannot identify a real footgun after reading the docs, do not invent one — leave the section empty rather than fabricate. A fake footgun is worse than none.
- Step 3 (antipatterns) is optional and conditional. Only include antipatterns the model would plausibly produce from reasonable API reasoning. Antipatterns that require ignorance of the API belong in examples, not antipatterns.
- The 100–180 line SKILL.md target is a heuristic, not a hard limit. Going over signals either too much in SKILL.md (move to `references/`) or too large a library (consider splitting by subpath).
- The `humans.md` companion is required by this skill's own conventions. A skill without it is incomplete by its own standard.
- Step 8 evaluation (run-without-skill vs. with-skill vs. cross-task) is the quality gate. Skipping it ships skills that may add noise without closing real gaps.

# Related artifacts

- [`skills/prompt-factory/`](../prompt-factory/) — uses skills as runtime context; the quality of skills produced here directly affects prompt-factory output
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows