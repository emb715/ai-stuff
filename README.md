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

## How to use this repo (for LLMs)

Paste [`USAGE.md`](USAGE.md) into a fresh session. It drives inventory verification, a grouped menu, and consumption of the correct artifact file. Do not improvise the flow — follow USAGE.md exactly.

Want `/ai-stuff` as a permanent command in your harness instead of pasting each time? Run the [installer prompt](prompts/ai-stuff-command-installer/prompt.md) — it registers the command (remote or local source) so a single `/ai-stuff` loads the browsing flow.

New to the vault? Read [`EXPLAIN.md`](EXPLAIN.md) — a tour of what's inside, what each artifact does, and how they connect.

## Artifact inventory

This table is a snapshot. The filesystem is authoritative — `ls` the content dirs (`agents/ prompts/ playbooks/ skills/ tools/`) to confirm what exists. If the table drifts, it is wrong; fix it.

### Agents

| Agent | Purpose | Status |
|---|---|---|
| [honest](agents/honest/) | Radical directness, token efficiency, zero filler | validated |

### Prompts

| Prompt | Purpose | Status |
|---|---|---|
| [loop-prd-readiness](prompts/loop-prd-readiness/) | Drive planning docs to implementation readiness via iterative loop | validated |
| [loop-implementation-readiness](prompts/loop-implementation-readiness/) | Verify a codebase implements a planning doc; tri-state verdict, one highest-risk gap per round | validated |
| [knowledge-extraction](prompts/knowledge-extraction/) | Mine a completed session and propose durable knowledge writes; user approves before write | validated |
| [repo-primitive-audit](prompts/repo-primitive-audit/) | Map a repo's primitives from source, break down each section, then run an adversarial review playbook against the map | validated |
| [review-release-candidate](prompts/review-release-candidate/) | Build a release-candidate review harness: inventory user-facing surfaces vs acceptance criteria, triage by root cause, gate fix batches with regression tests | draft |
| [ai-stuff-command-installer](prompts/ai-stuff-command-installer/) | Register a `/ai-stuff` command in an external LLM harness to browse and consume vault artifacts; remote or local source | validated |

### Playbooks

| Playbook | Purpose | Status |
|---|---|---|
| [brainstorming](playbooks/brainstorming/) | Facilitate interactive brainstorming sessions using 61 techniques across 10 categories; standalone, no framework dependencies | validated |
| [product-brief](playbooks/product-brief/) | Turn brainstorm output or a rough idea into a structured product brief; fills the brainstorm→plan gap | validated |
| [adversarial-code-review](playbooks/adversarial-code-review/) | Adversarial code review on git changes; cross-references claims vs reality, minimum 3 findings, fix menu | draft |
| [quick-spec](playbooks/quick-spec/) | Create implementation-ready specs through discovery + code investigation; enforces 5-criterion Ready-for-Dev standard | validated |
| [retrospective](playbooks/retrospective/) | Run a retrospective on completed work; lessons, follow-through check, readiness assessment, SMART action items | draft |
| [issue-to-ready-specs](playbooks/issue-to-ready-specs/) | Drive issues from raw idea to implementation-ready specs | draft |
| [agent-installer](playbooks/agent-installer/) | Build a multi-platform agent installer with polished TUI; agnostic, reusable, structurally correct | draft |
| [build-to-release](playbooks/build-to-release/) | Take an idea from proof-of-concept to release-ready implementation through a 13-phase gated pipeline | draft |
| [decision-making](playbooks/decision-making/) | Converge N options into a ranked shortlist via multi-criteria decision analysis; fills brainstorming→product-brief gap | draft |
| [implementation-orchestration](playbooks/implementation-orchestration/) | Execute a validated implementation plan across a fleet of build agents; plan→committed, CI-green branch | draft |
| [issue-to-pr](playbooks/issue-to-pr/) | Chain issue-to-ready-specs → raa → implementation-orchestration into a full-cycle issue→merged PR flow | draft |
| [raa](playbooks/raa/) | Research, Analyze, Assess: turn a feature/change request into a validated file-scoped implementation-ready plan | draft |
| [readiness-cycle](playbooks/readiness-cycle/) | Cycle an artifact from "ready to share?" to verified-ready or blocked-with-fix-plan; loops until ship | draft |
| [request-triage](playbooks/request-triage/) | Route a raw request to the correct planning artifact (spec vs plan paradigm); does not execute | draft |

### Skills

| Skill | Purpose | Status |
|---|---|---|
| [prompt-factory](skills/prompt-factory/) | Generate deterministic implementation prompts from explicit plan docs or session context with mode/pre-flight gating (`default`, `fast`, `auto`; `strict` pending) | validated |
| [skill-authoring](skills/skill-authoring/) | Create and maintain agent skills for libraries/frameworks/tools; structure, token efficiency, coverage | draft |
| [change-impact-diagram](skills/change-impact-diagram/) | Diagram how a code change impacts the system and its primitives; four mermaid diagram types, three output modes | validated |
| [liteparse](skills/liteparse/) | Parse PDFs and other documents locally with lit — fast spatial text parsing with bounding boxes, OCR (Tesseract bundled), page screenshots, text/markdown/JSON output | validated |

### Tools

| Tool | Purpose | Status |
|---|---|---|
| [change-impact](tools/change-impact/) | Run change-impact-diagram skill automatically on PRs or locally; LLM-agnostic, marker-delimited PR upsert | validated |

### Experiments

Experiments are not part of the curated inventory. See `experiments/` for in-progress work; do not rely on it for reuse.

## Lifecycle

`experiments/ → validated → prompts/ | tools/ | playbooks/ | agents/`

### Status definitions

- `draft` — early idea; incomplete
- `validated` — tested at least once with documented result
- `vetted` — repeatable, bounded, sanitized, approved for reuse
- `deprecated` — no longer recommended

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
- `_meta/site/` — Astro static site that renders the vault as a browsable catalog (read from source, no duplication)
- `docs/standards/` — vetting rubric, lint spec, artifact structure and classification
- `docs/references/` — external research and reference material
- `docs/notes/` — opinionated, evidence-backed guidance on AI workflows and techniques
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

## Operating cadence (weekly)

Follow `_meta/framebook/weekly-maintenance/`.