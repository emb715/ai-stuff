---
title: "Write a Skill"
status: draft
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - skills
  - authoring
owner: "@emb715"
---

# Write a Skill

Vault integration procedure for creating or revising a library, framework, or tool skill using the canonical skill-authoring method.

## Context / Problem

Authoring rules and vault integration were duplicated, causing drift in warning quotas, line targets, reference naming, and evaluation sequencing. This wrapper delegates authoring to the canonical skill and adds vault structure, linkage, lint, and lifecycle checks.

## Scope

Applies to creation and revision of library, framework, and tool skills. Covers verified claims, runtime resources, repository records, separate authoring/behavior/discovery evidence, and vault integration. It does not replace artifact classification or authorize automatic promotion.

## Trigger

You want to package knowledge about a library, framework, or pattern into a reusable SKILL.md that an agent can load as context.

## Outputs

- `skills/<skill-name>/README.md` — lifecycle record, evidence, and boundaries
- `skills/<skill-name>/SKILL.md` — model-facing skill with common paths and essential safeguards
- `skills/<library-name>/humans.md` — maintenance companion
- `skills/<skill-name>/references/` — conditionally loaded depth resources when useful
- Entry in root `README.md` artifact inventory

## Verification

- Claims match versioned sources; contradictory precedence and unsupported instructions are resolved
- Common-path safeguards are retained without a warning-count quota
- Runtime resources are discoverable and actually delivered to installed consumers
- Finalize the body and description before matched task comparisons and separate discovery tests; report missing measurements as untested
- `humans.md` exists and documents source of truth, footgun rationale, known gaps

## Evidence / Results

Drafted 2026-06-24 based on the 10-step process in `skills/skill-authoring/SKILL.md`, which was itself built through real skill authoring sessions. Playbook form not yet run as a standalone procedure — status `draft`.

Revised 2026-10-07 to delegate rather than duplicate authoring rules and to align creation/revision scope, `references/`, safeguards, and evaluation dimensions. This wrapper has not been executed as a standalone lifecycle/promotion procedure; its existing `last_tested` remains unchanged.

## Failure Modes / Boundaries

- If docs are absent or stale, use the appropriate definitions/help, implementation, or observations; omit operational instructions that remain unverified
- Do not hide essential safeguards merely to reduce warning count or length
- Forced loading cannot establish activation precision; narrow triggers and retest actual discovery when inappropriate activation is observed
- A skill with static checks only may remain draft, but cannot claim validated effectiveness

## Related Links

- `skills/skill-authoring/SKILL.md` — the full reference process this playbook operationalizes
- `docs/standards/artifact-structure.md` — structure for skill folders
- `_meta/framebook/classify-artifact/` — confirms skill vs playbook vs prompt placement
