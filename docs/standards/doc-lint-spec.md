---
title: "Documentation Lint Specification"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "markdown/yaml"
tags:
  - standards
  - lint
  - quality-gates
owner: "@emb715"
---

# Documentation Lint Specification

Machine-checkable rule set for documentation quality and lifecycle enforcement.

## Context / Problem

Policy-only standards drift. This specification converts policy into deterministic checks.

## Scope

Defines blocking documentation quality rules for this repository's lifecycle content.
Does not lint application source code.

## Procedure / Steps

1. Discover target markdown files by include/exclude patterns.
2. Parse frontmatter and validate required metadata.
3. Validate structural sections and evidence constraints.
4. Run sanitization scans.
5. Validate lifecycle transitions and discoverability linkage.
6. Emit compliance report using the required output contract.

## Target files

Apply rules to:
- `agents/**/*.md`
- `docs/**/*.md`
- `experiments/**/*.md`
- `playbooks/**/*.md`
- `prompts/**/*.md`
- `skills/**/*.md`
- `tools/**/*.md`
- `vetted/**/*.md`

Exclude:
- `templates/**/*.md`
- `archive/**/*.md`
- root operational files (`README.md`, `CONTRIBUTING.md`, `AGENTS.md`) unless explicitly enabled

**Three-file artifact folder exception:** For artifacts following the three-file structure (`README.md` + `<thing>.md` + `humans.md`), apply frontmatter and structural rules to `README.md` only. `<thing>.md` and `humans.md` are exempt from DL001–DL004 by design — they carry no frontmatter. See `docs/standards/artifact-structure.md`.

## Rule set

### DL001 — Required frontmatter exists

Check: file starts with YAML frontmatter block.

Failure: BLOCKED.

### DL002 — Required frontmatter fields

Required keys:
- `title`
- `status`
- `confidence`
- `last_tested`
- `scope`
- `tooling`
- `tags`
- `owner`

Failure: BLOCKED.

### DL003 — Enumerated value validation

Rules:
- `status in {draft, validated, vetted, deprecated}`
- `confidence in {low, medium, high}`
- `last_tested` must match `YYYY-MM-DD`

Failure: BLOCKED.

### DL004 — Structural sections present

At least one heading matching each intent:
- context/problem
- scope
- procedure/steps
- evidence/results
- failure modes/boundaries

Matching is case-insensitive and supports synonyms.

Failure: BLOCKED.

### DL005 — Evidence required for prescriptive claims

Trigger if document includes phrases like:
- "best practice"
- "recommended"
- "always"
- "never"

Then require at least one evidence signal:
- numeric metric
- before/after block
- reproducible example with observed output

Failure: BLOCKED.

### DL006 — Sanitization scan

Block on likely sensitive patterns:
- API key/token formats
- private hostnames/endpoints
- credential-like assignments
- PII patterns (email + full name pairs, phone numbers in logs, etc.)

Applies to **every markdown file in the repo**, regardless of lint exclusion status. Excluded files are still public on GitHub — sanitization is not optional.

Exception: directories in `SANITIZATION_PII_SKIP_DIRS` (book OCR extracts, scraped source material) skip the email+phone PII heuristic only. Credential and key patterns still apply.

Failure: BLOCKED + redact required.

### DL007 — Lifecycle transition validity

If status changed in a PR/commit:
- block `draft -> vetted`
- allow `draft -> validated`
- allow `validated -> vetted`
- allow `* -> deprecated`

Failure: BLOCKED.

### DL008 — Discoverability linkage

New artifact must be linked from:
- root `README.md`, or
- relevant section index (`docs/README.md`, `playbooks/README.md`, `prompts/README.md`, etc.)

Failure: BLOCKED.

### DL012 — Owner value matches repo owner

The `owner` frontmatter field must equal `EXPECTED_OWNER` (defined in `scripts/doc_lint.py`, currently `@emb715`). Prevents drift to the OS username, git config user, or any other value an agent might default to. The expected value is defined once in the linter, not in prose, so enforcement is a single source of truth.

Applies to: all files with required frontmatter (see DL001).

Failure: BLOCKED.

### DL011 — Non-experiment runtime self-containment

Applies to runtime-consumable artifacts outside `experiments/`.

Check:
- Block if runtime artifact content references `experiments/` paths as execution dependencies.

Allowed:
- Provenance/evidence mentions in human-facing docs (`README.md`, `humans.md`) when not required for runtime execution.

Failure: BLOCKED.

### DL013 — No absolute or machine-specific paths

Catches leaked filesystem paths that betray a specific machine or user. Blocks:
- macOS absolute home paths (e.g., `/Users/<username>/...`)
- Linux absolute home paths (e.g., `/home/<username>/...`)
- Windows absolute paths (e.g., `C:\...`)

All paths in artifacts must be repo-relative. `/tmp/` paths are allowed when used as ephemeral clone targets in install instructions.

Applies to **every markdown file in the repo**, regardless of lint exclusion status.

Failure: BLOCKED.

## Output contract for lint/compliance runs

Use exact response structure:

```text
COMPLIANCE: PASS|BLOCKED
FAILED_GATES: [Gate X, Gate Y]
EVIDENCE:
- <file>: <finding>
FIXES_REQUIRED:
- <exact action>
PROMOTION_DECISION: <allowed|not allowed>
```

## Severity

All DL001–DL008, DL011, DL012, and DL013 are **blocking** in this repository.

## Evidence / Results

Initial execution of `scripts/doc_lint.py` in this repo produced `COMPLIANCE: BLOCKED` and correctly identified missing structural sections, confirming rules are enforced.

## Failure Modes / Boundaries

- Pattern-based sanitization can produce false positives/negatives.
- Evidence detection is heuristic (keyword/format based), not semantic proof.
- Linkage check depends on explicit path references in index files.
- Three-file folder exception requires the linter to detect folder structure before applying rules — a flat file scan will incorrectly flag `<thing>.md` and `humans.md` for missing frontmatter.
