# AI Knowledge Base

Operational knowledge base for AI workflows, patterns, prompts, skills, and practices that are tested, reproducible, and reusable.

## What this repo is for

This repo is **not** a random notes dump.

It exists to capture:
- Proven AI workflows
- Reusable skills, prompts, and agent patterns
- Documented experiments with outcomes
- Standards and playbooks that can be reapplied

If it hasn't been tested and documented, it goes in `experiments/` first.

## Directory map

### User content

- `agents/` — session-wide system prompts. Load at session start to shape LLM behavior.
- `prompts/` — conversational, one-shot, or command-triggered instruction text
- `playbooks/` — your own recurring procedures (starts empty, fills over time)
- `skills/` — skill knowledge and capability documentation
- `tools/` — deployable technical artifacts: MCP servers, CLIs, integrations
- `experiments/` — exploratory work and trial logs. Everything starts here.
- `changelog/` — weekly learnings and process changes
- `archive/` — deprecated material

### Framework

- `_meta/framebook/` — framework procedures for operating this vault
- `_meta/commands/` — OpenCode commands that operate the vault
- `docs/standards/` — vetting rubric, lint spec, artifact structure and classification
- `docs/references/` — external research and reference material
- `templates/` — canonical templates for new artifacts

## Commands (OpenCode)

Install: follow `_meta/install.md`.

| Command | When to use |
|---|---|
| `/vault-start` | Beginning of any session |
| `/vault-lint` | After editing any structured doc |
| `/vault-save` | Importing an artifact from another project |
| `/vault-promote` | Promoting or deprecating an artifact |
| `/vault-audit` | Experiment triage |
| `/vault-weekly` | Weekly maintenance cadence |

Non-OpenCode: paste `_meta/commands/init/command.md` as your first message.

## How to work in this repo

Read `_meta/framebook/README.md` to discover all available procedures.

| Goal | Procedure |
|---|---|
| Start any session | `_meta/framebook/start-session/` |
| Save something from another project | `_meta/framebook/save-artifact/` |
| Promote an artifact | `_meta/framebook/promote-artifact/` |
| Audit experiments | `_meta/framebook/audit-experiments/` |
| Weekly cadence | `_meta/framebook/weekly-maintenance/` |
| Classify a new artifact | `_meta/framebook/classify-artifact/` |
| Deprecate or retire | `_meta/framebook/deprecate-and-archive/` |
| Fix a BLOCKED lint failure | `_meta/framebook/fix-compliance-failures/` |

## Lifecycle

`experiments/ → validated → prompts/ | tools/ | playbooks/ | agents/`

### Status definitions

- `draft` — early idea; incomplete
- `validated` — tested at least once with documented result
- `vetted` — repeatable, bounded, sanitized, approved for reuse
- `deprecated` — no longer recommended

## Metadata standard (required frontmatter)

All docs in `experiments/`, `playbooks/`, `prompts/`, `tools/`, `agents/` must include:

```yaml
---
title: "<title>"
status: draft # draft | validated | vetted | deprecated
confidence: low # low | medium | high
last_tested: YYYY-MM-DD
scope: personal # personal | team | global
tooling:
  - "model/version/platform"
tags:
  - ai
owner: "@username"
---
```

## Contribution rules

Read `CONTRIBUTING.md` before adding or promoting any artifact.
Enforcement and blocking rules in:
- `AGENTS.md`
- `docs/standards/vetting-rubric.md`
- `docs/standards/doc-lint-spec.md`
- `docs/standards/artifact-classification.md`

Fast rule set:
- No orphan docs
- No unverifiable claims
- No "best practice" labels without evidence
- No direct promotion from draft to vetted

## Artifact inventory

Update this table when you add or promote artifacts.

### Agents

| Agent | Purpose | Status |
|---|---|---|
| [honest](agents/honest/) | Radical directness, token efficiency, zero filler | validated |

### Prompts

| Prompt | Purpose | Status |
|---|---|---|
| [loop-prd-readiness](prompts/loop-prd-readiness/) | Drive planning docs to implementation readiness via iterative loop | validated |
| [knowledge-extraction](prompts/knowledge-extraction/) | Mine a completed session and propose durable knowledge writes; user approves before write | validated |

### Playbooks

| Playbook | Purpose | Status |
|---|---|---|
| [brainstorming](playbooks/brainstorming/) | Facilitate interactive brainstorming sessions using 61 techniques across 10 categories; standalone, no framework dependencies | validated |
| [product-brief](playbooks/product-brief/) | Turn brainstorm output or a rough idea into a structured product brief; fills the brainstorm→plan gap | validated |
| [adversarial-code-review](playbooks/adversarial-code-review/) | Adversarial code review on git changes; cross-references claims vs reality, minimum 3 findings, fix menu | validated |
| [quick-spec](playbooks/quick-spec/) | Create implementation-ready specs through discovery + code investigation; enforces 5-criterion Ready-for-Dev standard | validated |
| [retrospective](playbooks/retrospective/) | Run a retrospective on completed work; lessons, follow-through check, readiness assessment, SMART action items | validated |

### Skills

| Skill | Purpose | Status |
|---|---|---|
| [prompt-factory](skills/prompt-factory/) | Generate deterministic implementation prompts from explicit plan docs or session context with mode/pre-flight gating (`default`, `fast`, `auto`; `strict` pending) | validated |

### Tools

| Tool | Purpose | Status |
|---|---|---|
| — | _empty_ | — |

### Experiments

| Experiment | Purpose | Status |
|---|---|---|
| [workflow-engine](experiments/workflow-engine/) | Web-based workflow engine for multi-session AI dev cycles: MCP state, prompt-factory integration, composable UI modules | draft |

## Operating cadence (weekly)

Follow `_meta/framebook/weekly-maintenance/`.
