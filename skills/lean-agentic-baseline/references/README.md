---
title: "Lean Agentic reference index"
status: validated
confidence: medium
last_tested: 2026-10-08
scope: personal
tooling: ["python/3.10+", "agnostic/any-LLM"]
tags: [agentic-engineering, references, assessment]
owner: "@emb715"
---

# Context / Problem

Templates need both source context and an assessment of whether they solve the target project's problem.

## Scope

The four tier captures retain their v3.2 origin. The assessment matrix follows the 26-topic inventory reviewed at repository revision `23d61dbe16dd38d38169a0f0b472f5bbc0da0235`; its tests and tradeoffs are proposals, not field-proven outcomes.

## Workflow

- [Assessment and acceptance matrix](assessment.md): fit, authority, ownership, verification and outcomes.
- [Decision-card examples](output-examples.md): synthetic investigation, no-change and unsafe-probe responses; not observed project evidence.
- [Tier 0](tier-0-groundwork.md): groundwork.
- [Tier 1](tier-1-guardrails.md): guardrails.
- [Tier 2](tier-2-memory-context.md): memory and context.
- [Tier 3](tier-3-scale.md): scale.

Read only what the requested pillar needs. History manifests and content snapshots live in `version-history/`; hash-only legacy manifests do not retain original text.

## Evidence / Results

The 2026-10-06 fixture exposed false-positive configuration passes and adaptation-hash misclassification. Regression checks are documented in the parent skill record; pillar outcome measures remain proposed until observed in a target project.

## Failure Modes / Boundaries

Configuration presence, numeric proxies and tool names do not demonstrate effective controls. The matrix needs project context and authorized behavioral testing.
