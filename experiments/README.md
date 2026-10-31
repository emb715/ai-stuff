---
title: "Experiments Index"
status: validated
confidence: high
last_tested: 2026-08-18
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - experiments
  - index
owner: "@emb715"
---

# experiments/

Exploratory work, hypotheses, and trial logs. Everything in here is in-progress or unvalidated — do not rely on it for reuse. Promote to a canonical folder (prompts/, skills/, playbooks/, tools/, agents/) only after validation evidence is captured.

## Index

| Experiment | Purpose | Status |
|---|---|---|
| [arch-design-pipeline](arch-design-pipeline/) | Document-driven design pipeline (PRD → RFD → NRFD → Tech Spec) with gated review checkpoints for non-trivial features. | draft |
| [claude-code-qa-skills](claude-code-qa-skills/) | 5 third-party QA skills for Claude Code and compatible agents: Playwright E2E, LLM evals, unit tests, PR review, Jira. For tests written from a spec, use [`skills/test-authoring/`](../skills/test-authoring/); the LLM-eval and Jira skills here have no vault counterpart. | draft |
| [design-skill](design-skill/) | 98 evidence-backed design laws from 9 canonical books for UI/UX review, critique, and principled interface building. | draft |
| [primitive-contract-docs](primitive-contract-docs/) | Hypothesis: per-primitive contract files document intent/obligations that rot slower than mechanism-level generated docs. | draft |
| [workflow-engine](workflow-engine/) | MCP server + workflow schema sequencing prompt-factory phases, tracking state across sessions to cut coordination overhead. | draft |

## Lifecycle

`experiments/ → validated → prompts/ | skills/ | playbooks/ | tools/ | agents/`

See `_meta/framebook/audit-experiments/` for the experiment triage procedure.
