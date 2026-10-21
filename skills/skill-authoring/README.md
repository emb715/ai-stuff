---
title: "skill-authoring"
status: draft
confidence: medium
last_tested: 2026-10-07
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "OpenCode/general-subagent (executor model not reported)"
tags:
  - skill
  - meta
  - authoring
  - documentation
  - process
owner: "@emb715"
---

# Purpose

Process for turning verified library, framework, or tool knowledge into a cohesive agent skill: track versioned claims, prioritize essential safeguards, conditionally load installed resources, and evaluate authoring quality separately from behavioral effectiveness. Covers creation and revision without warning quotas or arbitrary length gates.

The executable `SKILL.md` is standalone: it does not require another authoring skill, these repository records, or a vault policy document. The surrounding records and framebook provide optional vault integration; supplied project rules remain additional constraints where applicable.

# When to use

- The task is to write a `SKILL.md` for a library, framework, or tool that does not have one yet.
- The task is to improve an existing skill's structure, token efficiency, or coverage.
- The task is to generate a skill from official documentation.

Not for: ordinary library usage, agent system prompts, one-shot prompts, or standalone operational playbooks. A skill may contain multiple steps when they serve its declared capability; artifact classification still follows vault standards.

# Inputs

- Target library/framework/tool name and version
- Access to official documentation (preferred), changelog, type definitions, or source code
- For revisions: the existing `SKILL.md`, runtime resources, and any template/generator/installer paths
- Target harness, intended tasks, prerequisites, and available evaluation tools

# Skill

Use [`SKILL.md`](SKILL.md) — the authoring process, quality checklist, output structure, and routing conventions.

# Procedure

1. Record version/date and verify operational claims against appropriate sources.
2. Select intended tasks; rank failure modes and retain essential safeguards.
3. Draft a cohesive core with domain examples and conditional, deliverable resources.
4. Run static authoring checks, matched behavioral comparisons, and separate discovery checks.
5. Record results and untested dimensions; follow vault policy for any lifecycle transition.

# Evaluation resources

- [`evals/evals.json`](evals/evals.json) — three reproducible fictional authoring tasks; fixtures are bundled under `evals/fixtures/`.
- [`evals/trigger-evals.json`](evals/trigger-evals.json) — six positive and six adjacent negative discovery prompts, prepared but not executed.
- [`evals/comparison.json`](evals/comparison.json) — observed old/candidate grades, selected evidence, snapshot hashes, and limitations.
- These fixtures test small-library accuracy, destructive CLI safeguards, and generated multi-harness resource delivery. They do not execute real packages or establish actual harness discovery, cost savings, or general reliability.

# Reference docs

- [`docs/specification.md`](docs/specification.md) — Agent Skills format specification (agentskills.io)
- [`docs/claude-overview.md`](docs/claude-overview.md) — Claude platform skill overview
- [`docs/claude-best-practices.md`](docs/claude-best-practices.md) — Claude skill authoring best practices
- [`docs/adr-001-skill-structure.md`](docs/adr-001-skill-structure.md) — ADR for this skill's own structure conventions

# Evidence

## Historical authoring evidence (2026-08-04)

The original record documents two authoring runs against the earlier Steps 1–10. The results below are historical observations, not a fresh source/API audit or proof of the revised skill's effectiveness. Their line-count outcomes demonstrate feasible compression, not an optimal length threshold.

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

Both historical runs met the earlier line target and moved depth into references. Those observations do not isolate the effect of the authoring skill, establish complete coverage, or demonstrate lower end-to-end token cost. No matched with/without authoring comparison is documented for them. Confidence remains medium and status remains draft.

## Revision evidence (2026-10-07)

The revision replaces warning/link/length quotas, clarifies source-specific verification, adds a claim ledger and generated-delivery checks, and separates static review, behavior, discovery, and cost evidence.

**Before/after comparison:** six separate authoring runs compared the original skill with an immutable initial revision using identical per-pair fictional fixtures. Separate graders inspected the produced packages and reports without reading the authoring procedures.

| Fixture | Original | Initial revision |
|---|---|---|
| Small library | 5/5 assertions | 5/5 assertions |
| Destructive CLI | 6/6 assertions | 6/6 assertions |
| Generated multi-harness delivery | 6/6 assertions | 6/6 assertions |
| Total | 17/17 | 17/17 |

**Observed result:** no regression on the formal checks for the tested candidate, but no demonstrated improvement. Every formal assertion passed in both configurations, making this set non-discriminating. Fixture prompts themselves supply important safety/delivery requirements and may mask differences between procedures.

**Limits:** one run per case/configuration, fictional inputs, no no-skill baseline, and no real harness discovery or downstream package/installer execution. Two executors disclosed extra required repository reads; exact ambient context/model parity was not independently verified. Executor transcripts are authored summaries rather than independently captured tool logs. Timing and token metrics were not supplied, so no efficiency claim is made. A human output review remains outstanding.

After that comparison, static review prompted evaluation to move after body/description finalization, added a candidate-freeze/retest rule, clarified the installed-package tree, and aligned supporting records. The exact tested and final snapshot hashes are recorded in `evals/comparison.json`; the final corrections received static checks but not a repeated authoring comparison. `last_tested` records this observed testing/review date, not a validated-effectiveness claim. Status remains **draft**, confidence **medium**, with promotion deferred.

A subsequent standalone-use correction removed the optional external-skill workflow pointer, stated grading/reporting instructions directly, and made project lifecycle metadata/policy conditional. This portability correction was statically checked, not behaviorally benchmarked; the earlier 17/17 comparison does not validate the current executable.

# Failure Modes / Boundaries

- The process needs verifiable sources for operational claims. When docs are absent or stale, definitions/help, implementation, and observations may supply the evidence; unresolved instructions are omitted rather than invented.
- Failure-mode prioritization is judgment-sensitive. Do not invent warnings, and do not move an essential safeguard out of the common path merely to reduce warning count.
- Step 3 (antipatterns) is optional and conditional. Only include antipatterns the model would plausibly produce from reasonable API reasoning. Antipatterns that require ignorance of the API belong in examples, not antipatterns.
- Length and file counts are diagnostics, not evidence of effectiveness. Moving content into always-loaded references does not necessarily save tokens.
- Vault artifacts require the three-file record structure; external installation requirements depend on the target harness. Maintainer-only files are never runtime dependencies.
- Step 10 distinguishes static checks from controlled behavior and actual discovery after the candidate body and description are finalized. Forced loading cannot establish trigger precision, and a missing measurement remains untested.
- The revised procedure's recommendations are provisional. Synthetic comparisons cannot establish real-world runtime correctness or reliability across models; promotion requires the separate vault process.

# Related artifacts

- [`skills/prompt-factory/`](../prompt-factory/) — uses skills as runtime context; the quality of skills produced here directly affects prompt-factory output
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows
