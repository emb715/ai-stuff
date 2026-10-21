---
title: "Lean Agentic Tier 1 template index"
status: validated
confidence: medium
last_tested: 2026-10-06
scope: personal
tooling: ["guide/v3.2", "github-actions", "claude-code"]
tags: [templates, agentic-engineering, guardrails]
owner: "@emb715"
---

# Context / Problem

Examples for CI, small changes, conventions, boundaries and reproducible environments.

## Scope / Workflow

Pure consumable templates retain their v3.2 source. Assess goals, adapt and test through the parent [skill](../../../SKILL.md).

- [CI](ci.yml), [worktree commands](worktree-commands.md), [feature flags](feature-flag-example.md).
- [PR skill](create-pr-SKILL.md), [PR template](pull_request_template.md).
- [Dependency boundaries](dependency-cruiser.js), [Python boundaries](import-linter.toml), [JVM boundaries](ArchUnitExample.java).
- [Devcontainer](devcontainer.json).

## Evidence / Results

Extraction is documented in the parent record. Regression tests cover configuration inventory and adaptation tracking, not effectiveness of every example in a target application.

## Failure Modes / Boundaries

Verify installed tool versions and actual gate wiring. Container presence does not prove network/secret isolation; boundary configuration must reject a forbidden dependency.
