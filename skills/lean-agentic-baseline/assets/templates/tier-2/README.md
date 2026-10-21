---
title: "Lean Agentic Tier 2 template index"
status: validated
confidence: medium
last_tested: 2026-10-06
scope: personal
tooling: ["guide/v3.2", "agnostic/any-LLM"]
tags: [templates, agentic-engineering, context]
owner: "@emb715"
---

# Context / Problem

Examples for decisions, handoffs, scoped retrieval and dependency review.

## Scope / Workflow

Pure consumable templates retain the v3.2 source. Use the parent [skill](../../../SKILL.md) to select an authoritative fact home, adapt and verify retrieval.

- [ADR index](INDEX.md), [ADR record](adr-template.md), [handoff](handoff-template.md).
- [Large-read nudge](nudge-large-read.sh), [dependency review](dependency-review.yml).

## Evidence / Results

The parent record documents ADR/ticket fixtures and adoption regression tests. These do not demonstrate that a target session retrieves the right decision or that a nudge improves task outcomes.

## Failure Modes / Boundaries

Test a fresh session and index freshness; do not infer success from template presence. A dependency-review workflow does not cover all untrusted-input and egress risks.
