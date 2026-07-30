---
title: "Artifact Folder Structure"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - standards
  - structure
owner: "@emb715"
---

# Artifact Folder Structure

## Context / Problem

Single-file artifacts mix three distinct concerns into one document: the machine-consumable artifact (the thing itself), the human maintenance record (why it was built, how it works, what to watch), and the repo metadata record (frontmatter, evidence, failure modes). These serve different readers and different use cases. Combining them bloats every file and makes the copy-paste artifact unusable without editing out the metadata.

## Scope

Applies to any artifact that has a standalone consumable form — prompts, tools, skills, commands. Does not apply to standards, ADRs, references, or templates, which are document-only artifacts without a separable consumable.

## Procedure / Steps

Every artifact folder contains exactly three files:

```
<artifact-name>/
├── README.md     ← repo record
├── <thing>.md    ← the artifact itself
└── humans.md     ← maintenance context
```

### README.md — the repo record

Required frontmatter (standard fields: `title`, `status`, `confidence`, `last_tested`, `scope`, `tooling`, `tags`, `owner`).

Required sections:
- **Purpose** — what it does, one or two sentences
- **When to use** — specific trigger conditions
- **Inputs** — what must be supplied, with `{{VARIABLE}}` notation
- **[Artifact]** — a pointer to the artifact file, not the content itself
- **Stop signal** (loop prompts only) — the condition that ends the loop, stated separately from the artifact body
- **Evidence** — documented outcome from at least one real use
- **Failure Modes / Boundaries** — when it breaks or produces poor output
- **Related artifacts** — links to what precedes or follows this artifact

### `<thing>.md` — the artifact

The consumable in its pure form. No frontmatter. No repo metadata. No surrounding prose.

Named for what it is:
- `prompt.md` for prompts
- `SKILL.md` for skills
- `command.md` for commands
- `tool.md` or the tool's natural filename for tools

The rule: a user should be able to copy this file or its contents and use it immediately, without editing anything except declared `{{VARIABLES}}`.

### humans.md — maintenance context

No frontmatter. Written in prose. Never loaded as agent context.

Contains:
- Why this structure — decisions behind what's in the artifact and what isn't
- Origin — where it came from, what session or problem produced it
- Design decisions — tradeoffs, alternatives considered, what was intentionally left out
- Maintenance notes — what to check when the artifact ages, how to extend it
- Known gaps — what's not yet covered and why

The rule: a person who has never seen this artifact before can read `humans.md` and understand it well enough to extend, audit, or deprecate it.

### Self-contained runtime rule (non-experiment artifacts)

Artifacts outside `experiments/` that are intended for reuse (`prompts/`, `skills/`, `tools/`, `playbooks/`, `agents/`) must be runtime self-contained:

- No required runtime dependency on files under `experiments/`.
- Any required templates, commands, or support files must live inside the artifact folder (or another non-experimental canonical location).
- Experiment links are allowed only as provenance/evidence references in human-facing docs; they cannot be required for execution.
- **No `humans.md` references in the executable artifact.** The consumable file (`prompt.md`, `playbook.md`, `SKILL.md`, `command.md`, `tool.md`) must not mention or link to `humans.md`. `humans.md` is never loaded as agent context — a reference from the executable artifact either produces dead text (the agent ignores it) or induces the agent to read a file it is told never to read. Both violate the standard. A maintainer who needs maintainer context finds `humans.md` by convention (it is the maintenance file in the three-file folder); no pointer from the executable is needed.

Interpretation:
- Minimum structure is three files (`README.md`, consumable file, `humans.md`).
- Additional files/folders are allowed when needed (for example `commands/`, `templates/`, `refs/`, assets).

### Experiment dependency rule (build-ready standard)

Any experiment that involves building a tool, MCP server, CLI, or any coded artifact must include the following **before writing code**:

- **Source docs** — for every external dependency, capture canonical URLs in `docs/references/<dependency>/README.md`. Required entries: official repo, SDK repo, specification, official docs, quickstart. URLs first — working notes are secondary and optional.
- **Scaffolding reference** — capture the canonical CLI scaffold command(s) alongside the source URLs in the same reference folder.
- **Dependency artifacts** — any skill, prompt, or tool the experiment depends on must exist as a canonical artifact in this repo (not just referenced by name).

Source URL format (in reference README.md):

```md
| Resource | URL |
|---|---|
| Official repo | https://github.com/... |
| SDK repo | https://github.com/... |
| Specification | https://... |
| Docs | https://... |
| Quickstart | https://... |
```

These are not optional. They are the pre-flight gate before the Build step of any experiment.

Rationale: building without grounded source URLs produces hallucinated APIs, incorrect scaffolding, and wasted sessions. Canonical URLs are the only reliable source — summarized notes decay, the source does not.

## Evidence / Results

Applied in `prompts/loop-prd-readiness/` — three-file structure produced a prompt that is copy-paste ready (`prompt.md`), fully documented for agents and reviewers (`README.md`), and maintainable without re-reading the prompt body (`humans.md`). Observed: no need to edit the prompt file to remove metadata before use.

## Failure Modes / Boundaries

- If `humans.md` is skipped, maintenance context lives nowhere and decays silently.
- If the artifact file contains frontmatter or prose, it is no longer copy-paste clean — the convention is violated.
- Does not apply to single-document artifacts (standards, ADRs, references). Forcing the three-file structure onto a document-only artifact adds friction without value.
- Folder name should match the artifact's working name exactly — divergence breaks discoverability.
