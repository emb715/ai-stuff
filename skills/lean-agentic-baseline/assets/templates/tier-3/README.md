---
title: "Lean Agentic Tier 3 template index"
status: validated
confidence: medium
last_tested: 2026-10-06
scope: personal
tooling: ["guide/v3.2", "github-actions", "claude-code"]
tags: [templates, agentic-engineering, scale]
owner: "@emb715"
---

# Context / Problem

Examples for delegated work, impact review, shared specs, deployment and upkeep.

## Scope / Workflow

Pure consumable templates retain their v3.2 origin. Assess authority and maintenance cost through the parent [skill](../../../SKILL.md) before adopting.

- [Domain agent](api-agent.md), [spec issue](spec-issue-template.md).
- [Review](bot-review.yml), [impact workflow](label-impact.yml), [label config](labeler.yml), [owners](CODEOWNERS).
- [Deploy](deploy.yml), [drift schedule](drift-workflow.yml), [legacy check report](baseline-check-output.md), [dependency bot](renovate.json).

## Evidence / Results

The parent record documents adoption/drift tests. No live production approval, kill-switch rehearsal or team outcome study is implied.

## Failure Modes / Boundaries

The check-report example retains the old four-state vocabulary; current inventory uses schema v2. Hosting approval and bypass settings are outside these examples. Authorize rehearsals and protect control definitions independently.
