---
title: "Lean Agentic Tier 0 template index"
status: validated
confidence: medium
last_tested: 2026-10-06
scope: personal
tooling: ["guide/v3.2", "claude-code", "bash"]
tags: [templates, agentic-engineering, groundwork]
owner: "@emb715"
---

# Context / Problem

Starting points for steering, gates, conventions, hooks and permissions; no copy is a verified control by itself.

## Scope / Workflow

These pure consumable templates retain the v3.2 source examples. Use the parent [skill](../../../SKILL.md) to assess fit, adapt stack/paths/identities, test safely and record adoption.

- [Steering](AGENTS.md), [permissions](PERMISSIONS.md).
- [Validation](validate.sh), [package scripts](package.json).
- [Hooks](settings.json), [permission rules](settings-permissions.json), [managed settings](managed-settings.json).
- [Environment block](block-env.sh), [Stop validation](stop-validate.sh).
- [Commit configuration](commitlint.config.mjs), [git hooks](lefthook.yml).
- [Release drafter](release-drafter.yml), [release workflow](release-drafter-workflow.yml).

## Evidence / Results

The parent record documents extraction and 2026-10-06 regression checks for inventory/adoption tooling. Templates are starting points, not field-validated configurations for arbitrary installed tool versions.

## Failure Modes / Boundaries

Replace placeholders and consult installed-version documentation. A local permission file is not an independently owned security boundary.
