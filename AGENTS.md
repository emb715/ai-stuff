# AGENTS.md

## Session start (run this every time)

At the start of every session in this repo, before responding to any request:

1. **Orient** — read `README.md` for the directory map and lifecycle rules
2. **Identify the session type** — classify the request (new artifact / research / continue experiment / audit / patch)
3. **Find the right procedure** — read `_meta/framebook/README.md` and follow the matching framebook procedure
4. **Check for prior work** — before building anything new, scan `experiments/`, `prompts/`, `skills/`, `agents/` for related artifacts and report what exists
5. **Enforce structure** — any artifact with a consumable form uses the three-file folder. See `docs/standards/artifact-structure.md`. Never create a flat file for a prompt, skill, agent, or tool.

If the user's intent is unclear after the first message, ask: "Is this a new artifact, continuing an experiment, or a research session?" Do not proceed without knowing.

---

## Purpose

This repository is a **curated AI operating knowledge base**.

It stores reusable, tested, and sanitized artifacts from real work:
- agents (session-wide system prompts)
- prompts (conversational, command-triggered, one-shot)
- playbooks (user's own recurring procedures)
- skills and tools
- experiments and outcomes
- standards and proven practices

This is **not** a scratchpad and not a random notes dump.

---

## Primary objective for LLM agents

When using this repo, optimize for:
1. **reusability**
2. **evidence-backed guidance**
3. **clear lifecycle state** (`draft/validated/vetted/deprecated`)
4. **sanitization** (no secrets, private IDs, sensitive data)

Do not invent certainty. If evidence is missing, mark lower confidence.

---

## Repository map

### User content

- `agents/` — session-wide system prompts. Load at session start to shape LLM behavior for the entire session.
- `prompts/` — conversational, one-shot, or command-triggered instruction text. Scoped to a task or a few turns.
- `playbooks/` — user's own recurring procedures. Starts empty. Filled over time.
- `skills/` — skill knowledge and capability documentation
- `tools/` — deployable technical artifacts: MCP servers, CLIs, integrations
- `experiments/` — exploratory work, hypotheses, trial logs. Everything real starts here.
- `changelog/` — weekly learnings and process changes
- `archive/` — deprecated/superseded material

### Framework

- `_meta/framebook/` — framework procedures for operating the vault. Read the index to discover available procedures.
- `_meta/commands/` — OpenCode commands that operate the vault
- `docs/standards/` — binding governance rules, vetting rubric, lint spec, artifact taxonomy
- `templates/` — canonical templates for new artifacts

Everything not in `experiments/` is the real deal — validated or vetted, sanitized, and ready to reuse.

---

## Framework procedures

Before executing any vault operation, read `_meta/framebook/README.md` to discover available procedures.

Common tasks and their procedures:

| Task | Procedure |
|---|---|
| Starting a session | `_meta/framebook/start-session/` |
| Saving an artifact from another project | `_meta/framebook/save-artifact/` |
| Promoting an artifact | `_meta/framebook/promote-artifact/` |
| Auditing experiments | `_meta/framebook/audit-experiments/` |
| Weekly maintenance | `_meta/framebook/weekly-maintenance/` |
| Classifying an artifact | `_meta/framebook/classify-artifact/` |
| Deprecating or archiving | `_meta/framebook/deprecate-and-archive/` |
| Fixing compliance failures | `_meta/framebook/fix-compliance-failures/` |

Do not improvise these operations. The framebook exists to make them deterministic and repeatable.

---

## Commands

OpenCode slash commands that operate this vault are in `_meta/commands/`. To install them, follow `_meta/install.md`.

| Command | When to use |
|---|---|
| `/vault-start` | Beginning of any OpenCode session — routes to correct framebook procedure |
| `/vault-lint` | After editing any structured doc — runs lint and surfaces failures |
| `/vault-save` | Importing an artifact from another project — interactive intake walkthrough |
| `/vault-promote` | Promoting or deprecating an artifact — interactive lifecycle transition |
| `/vault-audit` | Experiment triage — lists and classifies all experiments |
| `/vault-weekly` | Weekly maintenance — full cadence sequence |

For non-OpenCode tools (Claude.ai, Cursor, etc.): copy and paste `_meta/commands/init/command.md` as your first message instead.

---

## Artifact taxonomy

| Primary value | Destination |
|---|---|
| Session-wide LLM behavior config | `agents/` |
| Reusable instruction text (copy/paste, one-shot) | `prompts/` |
| Recurring operational procedure | `playbooks/` |
| Capability/behavior package | `skills/` |
| Deployable technical artifact (MCP, CLI) | `tools/` |
| Conceptual standards, policy, references | `docs/` |
| Untested/uncertain/early work | `experiments/` |

Routing rule: if unsure, `experiments/` first. Reclassify after real use.

---

## How LLMs should read this repo

1. Start with `README.md` for lifecycle and quality rules.
2. Read `_meta/framebook/README.md` before executing any vault operation.
3. Use `CONTRIBUTING.md` before creating or promoting artifacts.
4. Treat `docs/standards/vetting-rubric.md` as the promotion gate.
5. If only experimental evidence exists, explicitly say so.

Priority order for trust:
`vetted` > `validated` > `draft`

---

## Authoring rules for LLMs

When creating/updating docs:

- Use templates from `templates/`
- Include required frontmatter metadata:
  - `title`
  - `status`
  - `confidence`
  - `last_tested`
  - `scope`
  - `tooling`
  - `tags`
  - `owner`
- Add clear sections for:
  - problem/context
  - scope
  - procedure
  - evidence
  - failure modes/boundaries

**Artifact folder structure (required for prompts, agents, tools, skills, playbooks):**

Any artifact with a standalone consumable form uses a three-file folder. See `docs/standards/artifact-structure.md`.

```
<artifact-name>/
├── README.md       ← repo record (frontmatter + all required sections)
├── <thing>.md      ← the artifact in pure form (no frontmatter, no prose — copy-paste clean)
└── humans.md       ← maintenance context, design decisions, origin (no frontmatter)
```

Named consumable files by type:
- `prompt.md` for prompts
- `system-prompt.md` for agents
- `playbook.md` for playbooks
- `SKILL.md` for skills
- `command.md` for commands

Document-only artifacts (standards, ADRs, references) remain single files.

**Agents are added by hand — they bypass the standard promotion playbook.**
Copy the system prompt, create the three-file folder under `agents/`, set status correctly, link from `agents/README.md`. No framebook procedure required.

Reject content that is:
- unverifiable
- unsanitized
- duplicate without meaningful delta
- mislabeled as "best practice" without proof

---

## Hard enforcement gates (blocking)

Treat these as **must-pass** checks. If any check fails, the artifact is blocked.

### Gate 1 — Metadata completeness

For files in `experiments/`, `playbooks/`, `prompts/`, `tools/`, `docs/`, `agents/`:

- Must include YAML frontmatter
- Must include keys: `title`, `status`, `confidence`, `last_tested`, `scope`, `tooling`, `tags`, `owner`
- `status` must be one of: `draft|validated|vetted|deprecated`
- `confidence` must be one of: `low|medium|high`

Note: for three-file artifact folders, frontmatter is required on `README.md` only. `<thing>.md` and `humans.md` have no frontmatter by design.

If missing/invalid: **fail**.

### Gate 2 — Structural completeness

Artifact must include, at minimum:
- context/problem
- scope
- procedure/steps
- evidence/results
- failure modes/boundaries

If any section is missing: **fail**.

### Gate 3 — Evidence threshold

Any recommendation phrased as reusable guidance or best practice must include at least one:
- measurable outcome
- before/after comparison
- reproducible example with observed result

If claim is prescriptive without evidence: **fail**.

### Gate 4 — Sanitization

Block immediately if content includes:
- secrets/tokens/credentials
- private client identifiers
- sensitive personal data
- confidential internal endpoints/hosts not intended to be public

If violation found: **fail + redact**.

### Gate 5 — Lifecycle integrity

- `draft -> vetted` is forbidden
- Promotion to `vetted` requires passing `docs/standards/vetting-rubric.md`
- Deprecated artifacts must include reason and replacement path (if any)

If transition is invalid: **fail**.

### Gate 6 — Index linkage

New artifacts must be discoverable:
- linked from root `README.md` or section index
- not orphaned in nested directories

If orphaned: **fail**.

---

## Failure behavior (required)

When a gate fails, agents must:

1. Stop promotion/publication action.
2. Return explicit `BLOCKED` status.
3. List each failed gate and exact missing/violating fields.
4. Provide minimal fix list (no fluff).
5. Re-run checks only after edits.

Do not silently downgrade standards to "advisory".

---

## Required response format for compliance checks

When validating or reviewing artifacts, respond in this structure:

```text
COMPLIANCE: PASS|BLOCKED
FAILED_GATES: [Gate X, Gate Y]
EVIDENCE:
- <file>: <finding>
FIXES_REQUIRED:
- <exact action>
PROMOTION_DECISION: <allowed|not allowed>
```

Use this format every time to make review deterministic.

---

## Promotion policy

Allowed transitions:
- `draft -> validated`
- `validated -> vetted`
- any status -> `deprecated`

Disallowed transition:
- `draft -> vetted` (must include validation evidence first)

---

## Sanitization policy (mandatory)

Never store:
- API keys, tokens, credentials, secrets
- client-private identifiers
- confidential internal URLs/hostnames unless intentionally public
- sensitive logs with personal data

If an example is useful but sensitive, rewrite with synthetic values.

---

## Response behavior expected from LLMs using this repo

When asked for guidance based on repo content:

1. Cite artifact path(s) used.
2. State artifact status and confidence.
3. Distinguish evidence from opinion.
4. Flag stale artifacts (`last_tested` too old) before recommending.
5. If guidance conflicts across files, prefer newer vetted artifacts and call out conflict.

---

## Maintenance expectations

Weekly:
- promote strong validated artifacts
- deprecate stale/broken ones
- update index links
- record key learnings in `changelog/`

LLMs should preserve this operating model when proposing changes.
