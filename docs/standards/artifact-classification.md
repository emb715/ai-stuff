---
title: "Artifact Classification Standard"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - standards
  - taxonomy
  - routing
owner: "@emb715"
---

# Artifact Classification Standard

## Context / Problem

Most repo drift comes from wrong artifact placement: procedures stored as prompts, prompts stored as docs, and mixed assets with no lifecycle clarity.

## Scope

Defines how to route new artifacts into `agents/`, `prompts/`, `skills/`, `playbooks/`, `tools/`, `docs/`, or `experiments/`.
Applies to all new artifacts and imports from external projects.

## Canonical Taxonomy

- **Playbook**: reusable step-by-step procedure for recurring work (artifact in `playbooks/`)
- **Workflow**: sequence/decision logic inside a playbook (section/diagram), not a folder
- **Process**: governance/policy layer (`docs/standards/`)
- **Runbook**: incident/ops subtype of playbook (tag: `runbook`)
- **SOP**: strict mandatory subtype of playbook (tag: `sop`)

Hard repository rule:
- Keep top-level `playbooks/`
- Do not create top-level `workflows/`, `runbooks/`, `sops/`, or `processes/`

## Procedure / Steps

1. Identify the artifact's primary value.
2. Apply the routing table below.
3. If still ambiguous, default to `experiments/` and document uncertainty.
4. Split mixed artifacts into separate assets when needed (prompt + playbook, skill + playbook, etc.).

## Routing Rules

| Primary value | Destination | Why |
|---|---|---|
| Session-wide LLM behavior config | `agents/` | Shapes the entire session, not one task |
| Reusable instruction text to copy/paste | `prompts/` | Prompt is the product |
| Reusable capability/behavior package | `skills/` (knowledge) or `tools/` (deployable) | Behavior packaging is the product |
| Recurring operational procedure with triggers/steps/outputs | `playbooks/` | Process execution is the product |
| Conceptual standards, ADRs, references | `docs/` | Policy/reference is the product |
| Early/uncertain/untested work | `experiments/` | Lifecycle safety buffer |

Note: `vetted/` folder does not exist. Trust level is signaled by `status: vetted` in frontmatter. Vetted artifacts stay in their type folder (`prompts/`, `agents/`, `playbooks/`, etc.).

## Playbook Acceptance Criteria

An artifact belongs in `playbooks/` only if all are true:

1. It is recurring.
2. It has an explicit trigger.
3. It has ordered steps and/or decision points.
4. It has defined outputs.
5. It has failure paths.

Do not place in `playbooks/`:
- one-off notes
- theory/reference-only docs
- raw prompt dumps
- prescriptive claims without evidence

## Classifier Tests

Use these yes/no checks:

1. If it shapes LLM behavior for an entire session, it is an **agent**.
2. If removing the procedure steps destroys value, it is a **playbook**.
3. If removing the exact wording destroys value, it is a **prompt**.
4. If value is in reusable packaged behavior/tooling, it is a **skill/tool**.
5. If value is explanatory policy without execution steps, it is **docs**.

## Agents — special intake rule

Agents bypass the standard promotion playbook. Add by hand:
1. Copy the system prompt
2. Create `agents/<name>/` with three files: `README.md` + `system-prompt.md` + `humans.md`
3. Set `status` correctly in `README.md` frontmatter
4. Link from `agents/README.md`
5. Run lint

No framebook procedure needed. Version history and design decisions go in `humans.md`.

## External Artifacts

Some artifacts have their canonical consumable form living outside this repo — external agent fleets, published prompts, third-party skills. Copying the consumable here would create a stale duplicate that drifts from the source.

External artifacts use a **modified two-file structure**:

```
<artifact-name>/
├── README.md     ← frontmatter (with `external` tag) + documentation + link to source
└── humans.md     ← maintenance context (same as standard artifacts)
```

No consumable file (`system-prompt.md`, `prompt.md`, `SKILL.md`, etc.). The README links to the external source where the consumable lives.

Rules:
- The `tags` array MUST include `external` as the first tag.
- The README must include all standard sections (Context, Scope, When to use, Evidence, Failure Modes).
- The Evidence section must document real usage, same as any validated artifact.
- The link to the external source must be prominent in the README (not buried in a footer).
- Status can be `validated` or `vetted` based on real usage evidence, same as internal artifacts.

## Mixed Artifact Rule

If one document contains both reusable prompt text and operating procedure:

- split prompt into `prompts/<name>/...`
- keep procedure in `playbooks/<name>.md`
- cross-link both

## Evidence / Results

Applying these rules in this repository reduced playbook/prompt confusion and improved artifact discoverability and lifecycle routing.

## Failure Modes / Boundaries

- Some assets are genuinely hybrid; forcing a split can add overhead.
- Early classification can be wrong; reclassify after first real usage evidence.
- Folder placement does not replace quality gates; lint/rubric still required.
