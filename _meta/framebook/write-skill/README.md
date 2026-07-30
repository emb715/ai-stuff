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

Step-by-step operational playbook for producing a SKILL.md from any library or framework.

## Context / Problem

`skills/skill-authoring/SKILL.md` contains a deep 10-step reference process for building skills, but it is reference material — not an operational procedure. There is no step-by-step flow that takes you from "I want to skill this library" to "the skill is ready to ship." The knowledge exists; the execution path doesn't.

## Scope

Applies to any new skill being authored from an external library, framework, tool, or internal pattern. Covers: gathering sources, structuring the skill, writing SKILL.md and humans.md, evaluating before ship. Does not cover maintaining or updating an existing skill (read `skill-authoring/SKILL.md` Step 4 for that).

## Trigger

You want to package knowledge about a library, framework, or pattern into a reusable SKILL.md that an agent can load as context.

## Outputs

- `skills/<library-name>/SKILL.md` — model-facing skill (100–180 lines)
- `skills/<library-name>/humans.md` — maintenance companion
- `skills/<library-name>/refs/` — depth files if needed (each 60–100 lines)
- Entry in root `README.md` artifact inventory

## Verification

- SKILL.md is 100–180 lines
- One footgun with correct alternative shown
- Every `refs/` file has a routing link in SKILL.md
- Evaluated against 3 tasks: without skill, with skill, different task
- `humans.md` exists and documents source of truth, footgun rationale, known gaps

## Evidence / Results

Drafted 2026-06-24 based on the 10-step process in `skills/skill-authoring/SKILL.md`, which was itself built through real skill authoring sessions. Playbook form not yet run as a standalone procedure — status `draft`.

## Failure Modes / Boundaries

- If official docs don't exist: use TypeScript types + source code, but mark confidence lower
- If you find more than one footgun: include only the worst in SKILL.md; the rest go in `refs/antipatterns.md`
- If evaluation (step 8 of skill-authoring) reveals the skill helps task 1 but adds noise to task 3: narrow the trigger description and remove the over-triggering section
- A skill with no evaluation is a guess, not a skill

## Related Links

- `skills/skill-authoring/SKILL.md` — the full reference process this playbook operationalizes
- `docs/standards/artifact-structure.md` — structure for skill folders
- `_meta/framebook/classify-artifact/` — confirms skill vs playbook vs prompt placement
