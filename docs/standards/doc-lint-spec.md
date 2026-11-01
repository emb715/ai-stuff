---
title: "Documentation Lint Specification"
status: validated
confidence: high
last_tested: 2026-11-01
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
- `skills/*/docs/**/*.md`, `tools/*/docs/**/*.md` — captured reference material
- `skills/*/evals/**/*.md`, `prompts/*/evals/**/*.md` — evaluation plans and raw run output. The vault record of an eval is the artifact README's Evidence section; these are the working files behind it
- root operational files (`README.md`, `CONTRIBUTING.md`, `AGENTS.md`) unless explicitly enabled

**Three-file artifact folder exception:** For artifacts following the three-file structure (`README.md` + `<thing>.md` + `humans.md`), apply frontmatter and structural rules to `README.md` only. `<thing>.md` and `humans.md` are exempt from DL001–DL004 by design — they carry no frontmatter. See `docs/standards/artifact-structure.md`.

**Artifact asset subdirectory exception:** Markdown under `<section>/<artifact>/{templates,assets,commands}/**` is a consumable body (an issue template, a command body, a prompt fragment), not a repo record, and is exempt from DL001–DL004. A `README.md` in such a directory is still checked, so an asset directory may carry its own index. This is a pattern rule in `scripts/doc_lint.py` (`is_artifact_asset`); do not add hardcoded per-artifact paths.

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

### DL009 — Playbook structural completeness

Applies to: every non-`README.md` markdown file under `playbooks/`.

A playbook is a procedure someone else executes, so it needs more than the generic sections DL004 checks. Required:

- a trigger heading — when to run it
- a procedure/steps/workflow/process heading
- an ordered step sequence (`## 1.` headings, or a numbered list)
- a workflow heading
- an outputs heading
- a verification heading
- a failure, rollback or fallback heading
- `playbook` in the README's `tags`

Failure: BLOCKED. The message names each missing element.

### DL010 — Agent folder completeness

Applies to: `agents/<name>/README.md`, excluding the `agents/README.md` index.

Every agent folder must contain a sibling `system-prompt.md`. Exemption: an agent tagged `external` in its README frontmatter uses the two-file variant, because the consumable lives outside this repo.

Failure: BLOCKED.

DL015 generalizes this check to the other artifact sections; DL010 remains the agent-specific form.

### DL016 — Executable/human-file separation

Enforces AGENTS.md Gate 7. A consumable file must not reference `humans.md`.

Applies to: `prompt.md`, `playbook.md`, `SKILL.md`, `command.md`, `tool.md`, `system-prompt.md`, and markdown under an artifact's `commands/` directory.

`humans.md` is never loaded as agent context. A pointer to it from the executable either produces dead text the agent ignores, or induces the agent to read a file the standard tells it not to read. Maintainers find `humans.md` by convention — it is the maintenance file in the three-file folder — so no pointer is needed.

Failure: BLOCKED. Fix: delete the reference. If the executable genuinely needs the information, the information belongs in the executable.

### DL012 — Owner value matches repo owner

The `owner` frontmatter field must equal `EXPECTED_OWNER` (defined in `scripts/doc_lint.py`, currently `@emb715`). Prevents drift to the OS username, git config user, or any other value an agent might default to. The expected value is defined once in the linter, not in prose, so enforcement is a single source of truth.

Applies to: all files with required frontmatter (see DL001).

Failure: BLOCKED.

### DL011 — Non-experiment runtime self-containment

Applies to runtime-consumable artifacts outside `experiments/`.

Check (per line, so the report names the offending line number):
- Block if a runtime artifact line references an `experiments/` path as an execution dependency.

Allowed:
- Provenance/evidence mentions in human-facing docs (`README.md`, `humans.md`) when not required for runtime execution.
- **Lines that forbid `experiments/` rather than depend on it.** A line carrying a prohibition marker — `never`, `not`, `no`, `n't`, `exclude`, `forbid`, `decline`, `must not`, `do not`, `out of scope`, `non-routable`, `rather than`, `instead of` — is declaring the opposite of a dependency and passes.

The allowance exists because a routing artifact must be able to say "never route into `experiments/`". Before 2026-10-27 this rule was a bare substring check, so stating that prohibition failed the rule whose intent it served; the only workaround was to avoid writing the path.

Failure: BLOCKED.

### DL017 — Index status matches the artifact

Applies to artifact `README.md` files in `agents/`, `prompts/`, `playbooks/`, `skills/`, `tools/`.

DL008 checks that an artifact is *linked* from an index. DL017 checks that the linked row tells the truth about its lifecycle state.

Check:
- For each markdown table row in the root `README.md` or the section `README.md` that links the artifact's folder, compare the row's last cell against the artifact's frontmatter `status`.
- Block on any mismatch.

Only rows whose last cell is a known lifecycle value (`draft|validated|vetted|deprecated`) are considered, so prose links and tables without a status column are ignored rather than guessed at.

Rationale: index rows drift silently, and this is the same failure class as manifest drift — cheap to catch, invisible otherwise. Two instances existed when the rule was added: `skills/README.md` carried `liteparse` as `draft` against a `validated` artifact, and the root `README.md` carried `adversarial-code-review` as `draft` against a `validated` artifact. The second had survived a manual status audit, because that audit compared the router's manifest to the artifacts and never looked at the root index.

Failure: BLOCKED.

### DL018 — No links to deprecated artifacts

Gate 5 (lifecycle integrity). Applies to all lint target files, including bare consumables (`playbook.md`, `SKILL.md`, `humans.md`).

A deprecated artifact stays in place for readers who still need it, but live guidance must not send readers there. Deprecated artifacts are found from their folder `README.md` frontmatter (`status: deprecated`) under `agents/`, `prompts/`, `playbooks/`, `skills/` and `tools/`; nothing is hardcoded.

Check:
- For each line, resolve every markdown link `](target)` against the file's directory (ignoring `#fragment`, `http(s)`, `mailto` and in-page targets).
- Block when the resolved path falls inside a deprecated artifact's folder and the line carries no deprecation note.

Allowed:
- **Lines with a deprecation or fallback note.** A line containing `deprecated`, `superseded`, `fallback`, `fall back` or `replaced by` (case-insensitive) passes. This matches the cross-reference convention in `_meta/framebook/deprecate-and-archive/`.
- Files inside the deprecated artifact's own folder.
- Files whose own frontmatter says `status: deprecated`.
- Out-of-scope locations: `changelog/`, `skills/*/evals/**`, `archive/`, `_meta/` and root files are not lint targets.

Failure: BLOCKED. Fix: retarget the link to the replacement, or keep the link and add the note on the same line.

Boundary: only markdown links are checked; a backtick path mention is not. The marker test is per line, so a long single-line paragraph that says `deprecated` anywhere passes, the same leniency as DL011.

### DL013 — No absolute or machine-specific paths

Catches leaked filesystem paths that betray a specific machine or user. Blocks:
- macOS absolute home paths (e.g., `/Users/<username>/...`)
- Linux absolute home paths (e.g., `/home/<username>/...`)
- Windows absolute paths (e.g., `C:\...`)

All paths in artifacts must be repo-relative. `/tmp/` paths are allowed when used as ephemeral clone targets in install instructions.

Applies to **every markdown file in the repo**, regardless of lint exclusion status.

Failure: BLOCKED.

### DL014 — `last_tested` freshness

The `last_tested` date must be within the staleness threshold (default 180 days, configurable via `DL014_MAX_AGE_DAYS` env var).

Applies to: all files with required frontmatter (see DL001) where `status` is `validated` or `vetted`. Does NOT apply to:
- `experiments/` (experimental work, not yet validated)
- `status: draft` (in-progress, freshness enforced after validation)
- `status: deprecated` (awaiting archival, expected to be stale)
- Index/navigation READMEs (section indexes, not evidence-bearing artifacts)

Failure: BLOCKED. Fix: re-verify the artifact and bump `last_tested` to today, or mark `deprecated` if no longer relevant.

### DL015 — Artifact folder completeness

A file-by-file linter cannot see a file that does not exist. DL001–DL014 validate the files present in a folder; they say nothing about a folder that is missing its record or its maintenance file. DL015 walks the artifact folders themselves.

Applies to: direct subdirectories of `agents/`, `prompts/`, `playbooks/`, `skills/`, `tools/`. Not `experiments/`, where loose structure is allowed by design.

Required in every artifact folder:
- `README.md`
- `humans.md`
- the section's consumable file — `agents/` → `system-prompt.md`, `prompts/` → `prompt.md`, `playbooks/` → `playbook.md`, `skills/` → `SKILL.md`

`tools/` has no required consumable name: `artifact-structure.md` permits a tool's natural filename, so only `README.md` and `humans.md` are checked there.

Exemption: an artifact carrying the `external` tag in its README frontmatter uses the two-file variant (README + humans, consumable lives outside the repo) and is not required to have a consumable file. This mirrors the DL010 exemption for agents.

Failure: BLOCKED. Fix: add the missing files, or tag the artifact `external` if its consumable genuinely lives elsewhere.

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

All of DL001–DL018 are **blocking** in this repository.

Every gate declared in `AGENTS.md` must have at least one rule mapped to it in `GATE_LABELS` (`scripts/doc_lint.py`). `DL000` enforces that mapping: a gate declared in prose with no rule behind it is a gate nobody checks. Gate 7 sat unenforced that way until 2026-10-09.

## Evidence / Results

Initial execution of `scripts/doc_lint.py` in this repo produced `COMPLIANCE: BLOCKED` and correctly identified missing structural sections, confirming rules are enforced.

## Failure Modes / Boundaries

- Pattern-based sanitization can produce false positives/negatives.
- Evidence detection is heuristic (keyword/format based), not semantic proof.
- Linkage check depends on explicit path references in index files.
- DL018's deprecation-note test is per line, so a long single-line paragraph can pass on an unrelated marker word; it also does not skip fenced code blocks.
- Three-file folder exception requires the linter to detect folder structure before applying rules — a flat file scan will incorrectly flag `<thing>.md` and `humans.md` for missing frontmatter.
