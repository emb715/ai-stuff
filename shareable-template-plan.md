---
title: "Plan: Create Shareable AI Vault Template"
status: draft
confidence: high
last_tested: 2026-06-29
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - plan
  - template
  - meta
owner: "@ezequielbenitez"
---

# Plan: Create Shareable AI Vault Template

## Context / Problem

This repo is a personal AI knowledge vault. The meta-framework (governance, lint, framebook, standards, templates) is generic and reusable. The personal artifacts (experiments, prompts, skills, references, agents, playbooks) are not. A shareable template should contain only the framework — clean, identity-neutral, and ready for any adopter to initialize their own vault without inheriting someone else's working corpus.

The source repo (`ai-stuff/`) is not touched. The template is built by copying the framework parts of the current state and excluding personal artifacts. Nothing is removed from the source repo.

## Scope

- **In scope**: creating a new standalone project at a separate path containing only the framework and empty user-facing scaffold directories, with identity-neutral framing and no personal artifacts
- **Out of scope**: publishing, hosting decisions, README branding, any modification to the source repo, carrying personal artifacts into the template copy

The source repo (`ai-stuff/`) is not touched. The new project is a framework-only copy built from the current work.

---

## Folder Structure (new project)

```
ai-vault-template/
├── _meta/                        ← framework internals (structural lint skip, sanitization still applies)
│   ├── commands/                 ← OpenCode /commands that operate the vault
│   │   ├── vault-start/
│   │   ├── vault-lint/
│   │   ├── vault-save/
│   │   ├── vault-promote/
│   │   ├── vault-audit/
│   │   ├── vault-weekly/
│   │   └── init/                 ← init prompt (moved here from prompts/)
│   ├── framebook/                ← framework procedures (renamed from playbooks/)
│   │   ├── README.md
│   │   ├── start-session/
│   │   ├── save-artifact/
│   │   ├── promote-artifact/
│   │   ├── audit-experiments/
│   │   ├── weekly-maintenance/
│   │   ├── classify-artifact/
│   │   ├── deprecate-and-archive/
│   │   ├── fix-compliance-failures/
│   │   ├── sanitize-before-publish/
│   │   └── write-skill/
│   └── install.md                ← how to wire _meta into local OpenCode
├── agents/                       ← user's session-wide system prompts (empty)
├── archive/                      ← deprecated material (empty)
├── changelog/
│   └── week-YYYY-WW.md
├── docs/
│   ├── README.md
│   └── standards/
│       ├── artifact-classification.md
│       ├── artifact-structure.md
│       ├── doc-lint-spec.md
│       └── vetting-rubric.md
├── docs/references/              ← optional; excluded from first template cut unless explicitly curated later
├── experiments/                  ← user's exploratory work (empty)
├── playbooks/                    ← user's own recurring procedures (empty)
│   └── README.md
├── prompts/                      ← user's prompts and commands (empty)
│   └── README.md
├── scripts/
│   └── doc_lint.py
├── skills/                       ← user's skill knowledge (empty)
├── templates/
│   ├── artifact-template.md
│   ├── experiment-template.md
│   ├── playbook-template.md
│   └── prompt-template.md
├── tools/                        ← user's deployable tools: MCP, CLIs (empty)
│   └── README.md
├── vetted/                       ← exists but empty in source; remove from template (absorbed by status field)
├── .doc-lint.json
├── .gitignore
├── .github/
│   └── workflows/
│       └── doc-lint.yml
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SETUP.md
```

---

## Key Structural Decisions

### `_meta/` at root
Framework internals — commands, framebook, install instructions. Prefixed with `_` to signal "do not put user content here." Skipped by structural lint (DL001–DL005) but sanitization lint (DL006) still applies — see Linter Changes section.

### `framebook/` inside `_meta/`
All current playbooks move here. They operate the vault, not user work. Renamed from `playbooks/` to `framebook/` to eliminate naming collision with the user-facing `playbooks/` folder.

### `playbooks/` at root (empty)
User's own recurring procedures. Starts empty. Filled over time through normal artifact lifecycle.

### `commands/` inside `_meta/`
OpenCode `/commands` that operate the vault (start session, run lint, save artifact, etc.) plus the init prompt. These are framework infrastructure, not user artifacts.

### `vetted/` removed from template
The source repo still has `vetted/` (empty directory, no content). The template does not carry it — `status: vetted` frontmatter absorbs its purpose. This is a template-only change, not a source repo change.

### `agents/` at root (empty)
User's session-wide system prompts. Empty on init.

### `playbooks/` at root (carries starter examples)
Ships with the 5 currently validated playbooks (brainstorming, product-brief, adversarial-code-review, quick-spec, retrospective) as worked examples of the three-file folder convention. Adopter keeps, replaces, or deletes them.

### `tools/` at root (empty)
Deployable technical artifacts only: MCP servers, CLIs, integrations. Not commands.

---

## Repository State (as of 2026-06-29)

The plan was originally written 2026-06-24. Since then the source repo has had 11 commits that changed the picture. Refresh against actual state:

### Already in place in the source repo (framework pieces to copy as-is)

| Path | Status |
|---|---|
| `_meta/framebook/` (all 10 procedures: start-session, save-artifact, promote-artifact, audit-experiments, weekly-maintenance, classify-artifact, deprecate-and-archive, fix-compliance-failures, sanitize-before-publish, write-skill) | ✅ exists, copy as-is |
| `_meta/framebook/README.md` | ✅ exists |
| `_meta/commands/` (vault-start, vault-lint, vault-save, vault-promote, vault-audit, vault-weekly, init) | ✅ exists, copy as-is |
| `_meta/install.md` | ✅ exists |
| `docs/standards/` (vetting-rubric, doc-lint-spec, artifact-classification, artifact-structure) | ✅ exists, copy as-is |
| `docs/README.md` | ✅ exists |
| `templates/` (artifact, experiment, playbook, prompt) — all 4 | ✅ exists, copy as-is |
| `changelog/` | ✅ exists — use as source for a new seed file, do not carry personal week entries |
| `agents/README.md`, `prompts/README.md`, `playbooks/README.md`, `tools/README.md` | ✅ exists, copy then rewrite framing from current personal/example state to empty-template state |
| `scripts/doc_lint.py` | ✅ exists — copy as-is structurally; modifications per Linter Changes section |
| `.github/workflows/doc-lint.yml` | ✅ exists |
| `.gitignore` | ⚠️ exists but only contains `node_modules/` — augment with OS files, editor configs |

### Missing from the source repo (must be created in the template)

| Path | Action |
|---|---|
| `LICENSE` | Create — MIT |
| `SETUP.md` | Create — adopter onboarding |
| `.doc-lint.json` | Create — externalized linter exemptions |
| `experiments/README.md` | Create — section index (only `prompts/`, `docs/`, `tools/`, `agents/` have one; `experiments/` is missing) |

### Source-repo state to fix in the template copy (not fix in source)

| Item | Source state | Template action |
|---|---|---|
| `vetted/` | Empty directory, exists | Do not create in template (status field absorbs it) |
| `experiments/workflow-engine/server/node_modules/` | Checked in (~80 vendored READMEs) | Irrelevant to template — experiment excluded entirely |
| `shareable-template-plan.md` | This planning file | Do not carry — it documents the build, not the template |

---

## What Gets Copied and Transformed

### Root files
- `AGENTS.md` — updated: reference `_meta/framebook/` for discovery, clean personal identifiers from the framing prose
- `README.md` — rewritten for template context (intro framing, not personal vault intro; preserve repository map and lifecycle rules — they are framework)
- `CONTRIBUTING.md` — cleaned of personal identifiers

### Automation
- `.github/workflows/doc-lint.yml`
- `scripts/doc_lint.py` — hardcoded paths externalized to `.doc-lint.json`, `_meta/` added to skip list per the Linter Changes section below

### Docs / standards (all copied as-is, identifiers cleaned)
- `docs/standards/vetting-rubric.md`
- `docs/standards/doc-lint-spec.md`
- `docs/standards/artifact-classification.md`
- `docs/standards/artifact-structure.md`
- `docs/README.md`

### Docs / references
- Excluded from first template cut. Current `docs/references/` content was captured to support personal work. If needed later, curate a framework-only starter reference pack deliberately instead of copying the entire current set.

### Framebook (all current procedures → already at `_meta/framebook/`, copy as-is)
- `start-session/`
- `save-artifact/`
- `promote-artifact/`
- `audit-experiments/`
- `weekly-maintenance/`
- `classify-artifact/`
- `deprecate-and-archive/`
- `fix-compliance-failures/`
- `sanitize-before-publish/`
- `write-skill/`

### Templates (all)
- `artifact-template.md`
- `experiment-template.md`
- `playbook-template.md`
- `prompt-template.md`

### Changelog seed
- Create one new seed file: `changelog/week-YYYY-WW.md`
- Do not carry `week-2026-25.md` or `week-2026-26.md` — those are personal history, not template content

---

## What Gets Stripped (personal artifacts — none ships in template)

The template is framework-only. Personal artifacts are excluded even if some are generic enough to be useful. A later template version can add intentionally curated sample content, but this first cut does not.

| Path | Reason |
|---|---|
| `agents/honest/` | Personal agent |
| `skills/prompt-factory/` | Personal skill |
| `skills/skill-authoring/` | Personal skill knowledge |
| `prompts/loop-prd-readiness/` | Personal validated prompt |
| `prompts/loop-implementation-readiness/` | Personal draft prompt |
| `prompts/knowledge-extraction/` | Personal validated prompt |
| `playbooks/brainstorming/` | Personal validated playbook |
| `playbooks/product-brief/` | Personal validated playbook |
| `playbooks/adversarial-code-review/` | Personal validated playbook |
| `playbooks/quick-spec/` | Personal validated playbook |
| `playbooks/retrospective/` | Personal validated playbook |
| `experiments/workflow-engine/` | Personal draft experiment |
| `docs/references/loop-engineering/` | Reference captures supporting personal prompt work |
| `docs/references/mcp/` | Reference captures supporting personal experiment work |
| `docs/references/commands/` | Reference captures supporting personal command work |
| `docs/references/change-impact-checklist.md` | Personal reference capture |
| `shareable-template-plan.md` | This planning file |
| `vetted/` | Empty legacy directory; purpose absorbed by `status: vetted` |

---

## New Files to Create (template-only; do not exist in source repo)

| File | Purpose |
|---|---|
| `SETUP.md` | Adopter onboarding — see SETUP.md Outline section |
| `LICENSE` | MIT |
| `.doc-lint.json` | Externalised linter exemptions config (see Linter Changes) |
| `experiments/README.md` | Missing from source — create section index for `experiments/` |
| `docs/references/README.md` | Optional: create empty references index only if `docs/references/` is kept in the template; otherwise omit the folder entirely |

## Files to Copy As-Is then Modify (already exist in source repo)

| File / Folder | Source state | Template action |
|---|---|---|
| `_meta/install.md` | exists | copy as-is |
| `_meta/commands/` (vault-* and init) | exists | copy as-is |
| `_meta/framebook/` | exists with all 10 procedures + `README.md` | copy as-is |
| `_meta/commands/init/` (README, prompt, humans) | exists | copy as-is |
| `_meta/commands/vault-*/` | exist | copy as-is |
| `playbooks/README.md` | exists, currently lists 5 personal playbooks | copy then rewrite to empty-template framing; remove example index entries |
| `prompts/README.md` | exists, currently lists 3 personal prompts | copy then rewrite to empty-template framing; remove example index entries |
| `agents/README.md` | exists, currently lists `honest/` | copy then rewrite to empty-template framing; remove example index entry |
| `tools/README.md` | exists | copy as-is or lightly rewrite if needed |
| `.gitignore` | exists but only `node_modules/` | augment with OS files, editor configs |

Note: the section READMEs in the source repo currently mix empty-template framing with real personal artifact indexes. In the template copy, strip all personal index entries and restore fully empty-start framing. Source repo is NOT modified — these rewrites happen inside the template copy only.

---

## Identity Cleanup

Applied across framework files shipped in the template. Since personal artifacts are stripped, this is a smaller cleanup pass than the previous carry-everything version. The cleanup must still be scan-verified before publish.

| From | To | Notes |
|---|---|---|
| `@ezequielbenitez` | `your-username` | in every `owner:` frontmatter field and any prose reference |
| concrete dates in `last_tested:` on template-shipped docs | `YYYY-MM-DD` where appropriate | use placeholder only for files intended as templates/seeds; preserve dates on framework docs if they document when the framework itself was last reviewed |
| Repo-specific prose ("this repo", "my vault") | Template-neutral phrasing ("the vault", "this template") | only where the prose is identified-as-personal — the framework's own sections are already neutral |
| personal artifact names in index tables (`honest`, `loop-prd-readiness`, etc.) | remove entry | template section indexes start empty |

### `last_tested` handling — narrower decision

Two options:

- **Option A (recommended):** reset template-seed files (`SETUP.md`, `experiments/README.md`, any newly created scaffolds) to `YYYY-MM-DD` where they use `last_tested`.
- **Option B:** preserve original dates on copied framework docs (`docs/standards/*`, `_meta/framebook/*`) because those dates refer to framework review, not adopter work.

Default to: **A for newly created seed files, B for copied framework docs.** Document in `SETUP.md`.

### Scope field

Keep `scope: personal` and `scope: team | global` as frontmatter values — they are correct for a vault framework regardless of identity. The `scope` field describes audience scope, not personal identity.

---

## Linter Changes

### Add `_meta/` to skip list — partially

`_meta/` is framework internals. Structure lint skips it. **Sanitization lint does not skip it.** This split is required — a stray credential in a command file would ship in the template if sanitization were skipped entirely.

Concrete rule in `doc_lint.py`:

| Check | Applies to `_meta/`? | Why |
|---|---|---|
| DL001 (missing frontmatter) | ✗ skip | `_meta/` files are framework, not artifacts with frontmatter |
| DL002–DL005 (metadata, structural, prescriptive) | ✗ skip | same |
| DL006 (sanitization: secrets, tokens, private hosts, PII patterns) | ✓ **apply** | a credential in any file ships in the template — this is the publish-time security gate |
| DL007–DL011 (lifecycle, discoverability, structure-specific) | ✗ skip | structural-only, not applicable |

Implementation: `_meta/` is added to a `skip_dirs_structural` list (new), NOT to a `skip_dirs_sanitize` list. The existing `EXCLUDE_GLOBS` mechanism should be split accordingly. Or, simpler: keep `_meta/**` in `EXCLUDE_GLOBS` for the main loop, but run a single dedicated sanitization scan over `_meta/**` files in a separate pass. Either implementation satisfies the rule.

This rule is non-negotiable. The previous plan state ("skipped entirely by lint — not even sanitization scans") was a security hole and is fixed here.

### Externalise hardcoded paths to `.doc-lint.json`

Currently hardcoded in `doc_lint.py`:
- `NO_FRONTMATTER_DIRS`
- `OPENCODE_COMMAND_FILES`
- `REFERENCE_CAPTURE_DIRS`
- The new `skip_dirs_structural` vs sanitization split (above)

Move all to `.doc-lint.json`. Script reads at startup, falls back to empty config if missing.

Schema (revised to support the split):

```json
{
  "skip_dirs_structural": ["_meta"],
  "skip_dirs_sanitize": [],
  "no_frontmatter_dirs": [],
  "no_frontmatter_files": [],
  "reference_capture_dirs": []
}
```

`_meta` appears in `skip_dirs_structural` only — that's the rule that makes sanitization still run on it.

---

## AGENTS.md Changes

- **Session start** updated: step 3 already references `_meta/framebook/README.md` and follows the matching procedure — already correct in source; copy as-is, no change required
- **Repository map** is already framework-correct — copy as-is, no change required
- **Artifact taxonomy** is already correct — copy as-is, no change required
- **Personal artifacts are NOT removed from AGENTS.md references** — kept as worked examples; the routing rules and lifecycle rules continue to apply to them as they would to any artifact
- **Owner field in AGENTS.md frontmatter** (none — root `AGENTS.md` has no frontmatter; check for inline personal references and clean if any exist)
- **Audit any inline references to specific personal artifacts** (e.g. "see `prompts/loop-prd-readiness`"). Keep any that demonstrate the framework in action; rephrase any that read as personal-vault intro prose.

---

## SETUP.md Outline

1. **What this is** — one paragraph
2. **Prerequisites** — Python 3.x, Git, OpenCode (optional but recommended)
3. **Initialize your vault** — clone, replace `your-username` in framework frontmatter `owner:` fields, confirm no personal artifacts shipped, commit
4. **Wire up commands** — follow `_meta/install.md`
5. **Run lint for the first time** — `python3 scripts/doc_lint.py`
6. **Start your first session** — use init prompt from `_meta/commands/init/prompt.md`
7. **Add your first artifact** — follow `_meta/framebook/save-artifact/`
8. **Recommended first-week cadence** — run `/vault-audit` weekly, write a `changelog/week-YYYY-WW.md` entry each week

Target audience — state explicitly in SETUP.md opening:

This template is for developers running multi-session AI work who need persistent, vetted, reusable artifacts with an enforced quality bar. It is not a starter kit for casual one-off AI sessions — the metadata overhead doesn't pay off if you're not building a corpus.

---

## Delivery Order

Steps already complete in the source repo (verified 2026-06-29):

- ✅ Step 3 (move playbooks → `_meta/framebook/`) — already done
- ✅ Step 6 (create `_meta/commands/`) — already done
- ✅ Step 7 (create `_meta/install.md`) — already done
- ✅ Section index READMEs (`agents/`, `prompts/`, `playbooks/`, `tools/`) — already exist
- ✅ `.github/workflows/doc-lint.yml` — already exists
- ✅ `.gitignore` — exists but incomplete (only `node_modules/`)

Remaining build steps:

1. Create new project directory at separate path
2. Copy framework files as-is from source:
   - `_meta/` wholesale (commands + framebook + install.md)
   - `docs/standards/` and `docs/README.md`
   - `templates/` (all 4)
   - create new `changelog/week-YYYY-WW.md` seed instead of copying personal week entries
   - `scripts/doc_lint.py` (modified per Step 7 below)
   - `.github/workflows/doc-lint.yml`
3. Copy root and section files: `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, `agents/README.md`, `prompts/README.md`, `playbooks/README.md`, `tools/README.md` — apply identity cleanup and remove personal index entries
4. Strip personal artifacts from the copy:
   - remove all `agents/*`, `prompts/*`, `playbooks/*`, `skills/*`, `experiments/*` artifact folders listed in "What Gets Stripped"
   - remove `docs/references/` entirely for first template cut unless explicitly curated later
   - do not create `vetted/`
5. Identity cleanup pass — apply the table in the Identity Cleanup section across every copied file:
   - replace `@ezequielbenitez` → `your-username` in every `owner:` field
   - apply `last_tested` policy (seed files vs copied framework docs)
   - audit prose for any other personal-repo references
6. Create empty scaffold:
   - `archive/` with `.gitkeep`
   - `agents/`, `experiments/`, `playbooks/`, `prompts/`, `skills/`, `tools/` with `.gitkeep` as needed
   - `vetted/` is NOT created
   - `experiments/README.md` — create (missing in source; add as new template artifact)
7. Linter changes (must modify the copied `doc_lint.py`, not the source one):
   - externalize hardcoded paths to `.doc-lint.json` in the template copy
   - implement structural-skip vs sanitization-apply split for `_meta/` (see Linter Changes section)
   - create `.doc-lint.json` with the schema in Linter Changes section
8. Create new files in template:
   - `SETUP.md`
   - `LICENSE` (MIT)
   - Augment `.gitignore` (OS files, editor configs, `node_modules/`)
9. Rewrite `README.md` for template-context intro (not personal vault intro)
10. Run lint: `python3 scripts/doc_lint.py` — confirm `COMPLIANCE: PASS`
11. Optional: run a sanitization-only scan over `_meta/` explicitly to verify no secrets slip through
12. Commit. Do not push until publish decision is made (publish is out of scope per Scope section).

---

## Acceptance Criteria

### Identity
- [ ] No instances of `@ezequielbenitez` remain in any file in the template
- [ ] All shipped framework files' `owner:` frontmatter field set appropriately for the template (`your-username` or other chosen placeholder)
- [ ] `last_tested` policy applied consistently (seed files vs copied framework docs, documented in `SETUP.md`)

### Framework completeness
- [ ] `_meta/` exists and contains `commands/`, `framebook/`, `install.md`
- [ ] All 10 framebook procedure folders present
- [ ] All 6 vault command folders + `init/` present under `_meta/commands/`
- [ ] All 4 templates present in `templates/`
- [ ] All 4 standards docs present in `docs/standards/`
- [ ] `experiments/README.md` exists (new template artifact, source repo missing it)

### No personal artifacts shipped
- [ ] `agents/` contains no personal agent folders
- [ ] `skills/` contains no personal skill folders
- [ ] `prompts/` contains no personal prompt folders
- [ ] `playbooks/` contains no personal playbook folders
- [ ] `experiments/` contains no personal experiment folders
- [ ] `docs/references/` omitted entirely for first template cut, or populated only with explicitly curated framework references

### Linter / security
- [ ] `python3 scripts/doc_lint.py` passes (`COMPLIANCE: PASS`)
- [ ] `_meta/` is skipped by structural checks (DL001–DL005) but sanitization (DL006) still applies — verified by deliberately inserting a test secret pattern in a `_meta/` file and confirming DL006 fires
- [ ] `.doc-lint.json` exists and is the only source of exemption config (no hardcoded paths in `doc_lint.py`)
- [ ] Explicit sanitization-only scan over `_meta/` reports zero hits before publish

### Exclusions
- [ ] `vetted/` does not exist in the template
- [ ] `experiments/workflow-engine/` is not carried
- [ ] `experiments/workflow-engine/server/node_modules/` is not carried
- [ ] `agents/honest/`, `skills/prompt-factory/`, `skills/skill-authoring/`, all current `prompts/*`, and all current `playbooks/*` are not carried
- [ ] `shareable-template-plan.md` (this file) is not carried
- [ ] `node_modules/` is in `.gitignore`

### New files
- [ ] `SETUP.md` covers full onboarding including target-audience disclosure
- [ ] `LICENSE` (MIT) exists
- [ ] `.gitignore` exists with OS files, editor configs, `node_modules/`
- [ ] `.doc-lint.json` exists with the schema defined in Linter Changes

### Source repo integrity
- [ ] Source repo (`ai-stuff/`) is untouched — verified by `git status` showing no modifications from template-build operations
