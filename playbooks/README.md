---
title: "Playbooks Index"
status: validated
confidence: high
last_tested: 2026-07-13
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - playbook
  - index
owner: "@emb715"
---

# playbooks/

Your own recurring procedures. This folder starts empty and fills over time.

## What belongs here

A procedure belongs in `playbooks/` when all are true:

1. It is recurring — you will run it more than once
2. It has an explicit trigger — a clear "when X happens, run this"
3. It has ordered steps with decision points
4. It has defined outputs
5. It has failure/rollback paths

## What does not belong here

- Framework vault operations → `_meta/framebook/`
- One-off notes or brainstorms → `experiments/`
- Reusable instruction text → `prompts/`
- Policy or standards → `docs/standards/`

## Structure

Each playbook is a three-file folder:

```
playbooks/<name>/
├── README.md     ← frontmatter + record, context, scope, evidence
├── playbook.md   ← clean, executable procedure (no frontmatter)
└── humans.md     ← origin, design decisions, maintenance notes
```

Use `templates/playbook-template.md` to start. Follow `_meta/framebook/save-artifact/` for intake.

## Index

| Playbook | Purpose | Status |
|---|---|---|
| [brainstorming](brainstorming/) | Facilitate interactive brainstorming sessions using 61 techniques across 10 categories; standalone, no framework dependencies | validated |
| [product-brief](product-brief/) | Turn brainstorm output or a rough idea into a structured product brief; fills the brainstorm→plan gap | validated |
| [adversarial-code-review](adversarial-code-review/) | Adversarial code review on git changes; cross-references claims vs reality, minimum 3 findings, fix menu | validated |
| [quick-spec](quick-spec/) | Create implementation-ready specs through discovery + code investigation; enforces 6-criterion Ready-for-Dev standard | validated |
| [issue-to-ready-specs](issue-to-ready-specs/) | Turn a GitHub issue into a complete implementation-ready spec suite; chains product-brief + quick-spec with research, architecture, handoff resolution, and a readiness audit | draft |
| [raa](raa/) | Research, Analyze, Assess a feature request against a codebase; produces a validated, file-scoped, implementation-ready plan (not code) for implementation-orchestration to consume | draft |
| [implementation-orchestration](implementation-orchestration/) | Execute a validated implementation plan across a fleet of build agents; phases, file-level scope, handoff ledger, mandatory review, CI fix loop → committed/reviewed/CI-green branch | draft |
| [build-to-release](build-to-release/) | Take an idea from proof-of-concept to release-ready implementation through a 13-phase gated pipeline; chains product-brief + quick-spec + the readiness and review prompts with proof, implementation, handoff resolution, fix loop, and adversarial proving | draft |
| [retrospective](retrospective/) | Run a retrospective on completed work; lessons, follow-through check, readiness assessment, SMART action items | draft |
| [agent-installer](agent-installer/) | Build a multi-platform agent installer with a `@clack/prompts` TUI — agnostic engine, registry-driven platforms, idempotent routing, temp-dir tests | draft |
| [decision-making](decision-making/) | Take N options and produce a ranked shortlist with rationale using multi-criteria decision analysis; fills the brainstorming → product-brief convergence gap | draft |
| [request-triage](request-triage/) | Route a raw request to the correct planning artifact (spec paradigm vs plan paradigm) based on execution model and scope; does not execute, only routes | draft |
| [issue-to-pr](issue-to-pr/) | Chain a GitHub issue to a merged PR through issue-to-ready-specs → raa → implementation-orchestration; two modes: gated (human review at each phase) and continuous (end-to-end) | draft |
| [readiness-cycle](readiness-cycle/) | Take an existing artifact from "is it ready to share/release?" to verified-ready or blocked with a fix plan; chains raa → implementation-orchestration → review-release-candidate | draft |
