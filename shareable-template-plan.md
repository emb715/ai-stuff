---
title: "Plan: Create Shareable AI Vault Template"
status: draft
confidence: high
last_tested: 2026-06-24
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

This repo is a personal AI knowledge vault. The meta-framework (governance, lint, framebook, standards, templates) is generic and reusable. The personal artifacts (experiments, prompts, skills, references, agents) are not. A shareable template should contain only the framework — clean, identity-neutral, and ready for any adopter to initialize their own vault.

## Scope

- **In scope**: creating a new standalone project at a separate path containing only the meta-framework
- **Out of scope**: publishing, hosting decisions, README branding, any modification to the source repo

The source repo (`ai-stuff/`) is not touched. The new project is built from scratch by copying and transforming the right files.

---

## Folder Structure (new project)

```
ai-vault-template/
├── _meta/                        ← framework internals (skipped by lint)
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
├── vetted/                       ← REMOVED (absorbed by status field)
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
Framework internals — commands, framebook, install instructions. Prefixed with `_` to signal "do not put user content here." Skipped entirely by lint.

### `framebook/` inside `_meta/`
All current playbooks move here. They operate the vault, not user work. Renamed from `playbooks/` to `framebook/` to eliminate naming collision with the user-facing `playbooks/` folder.

### `playbooks/` at root (empty)
User's own recurring procedures. Starts empty. Filled over time through normal artifact lifecycle.

### `commands/` inside `_meta/`
OpenCode `/commands` that operate the vault (start session, run lint, save artifact, etc.) plus the init prompt. These are framework infrastructure, not user artifacts.

### `vetted/` removed
Absorbed by `status: vetted` frontmatter field. A folder is not needed when the status field already signals trust level. Artifacts promote into their type-specific folder (`prompts/`, `tools/`, `playbooks/`, `agents/`) with `status: vetted`.

### `agents/` at root (empty)
User's session-wide system prompts. Empty on init.

### `tools/` at root (empty)
Deployable technical artifacts only: MCP servers, CLIs, integrations. Not commands.

---

## What Gets Copied and Transformed

### Root files
- `AGENTS.md` — updated: reference `_meta/framebook/` for discovery, strip personal identifiers
- `README.md` — rewritten for template context
- `CONTRIBUTING.md` — stripped of personal identifiers

### Automation
- `.github/workflows/doc-lint.yml`
- `scripts/doc_lint.py` — hardcoded paths externalised to `.doc-lint.json`, `_meta/` added to skip list

### Docs / standards (all copied as-is, identifiers cleaned)
- `docs/standards/vetting-rubric.md`
- `docs/standards/doc-lint-spec.md`
- `docs/standards/artifact-classification.md`
- `docs/standards/artifact-structure.md`
- `docs/README.md`

### Framebook (all current playbooks → `_meta/framebook/`)
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
- `changelog/week-YYYY-WW.md`

---

## What Gets Stripped (personal artifacts — none ships in template)

| Path | Reason |
|---|---|
| `experiments/prompt-factory/` | Personal experiment |
| `prompts/loop-prd-readiness/` | Personal validated prompt |
| `skills/skill-authoring/` | Personal skill knowledge |
| `docs/references/loop-engineering/` | Personal reference captures |
| `agents/honest/` | Personal agent |
| `shareable-template-plan.md` | This planning file |

---

## New Files to Create

| File | Purpose |
|---|---|
| `SETUP.md` | Step-by-step onboarding for a new adopter |
| `_meta/install.md` | How to wire `_meta/commands/` into local OpenCode |
| `_meta/commands/init/README.md` | Init prompt record |
| `_meta/commands/init/prompt.md` | Copy-paste prompt to start any session |
| `_meta/commands/init/humans.md` | Design decisions |
| `_meta/commands/vault-start/` | OpenCode command: orient + route session |
| `_meta/commands/vault-lint/` | OpenCode command: run doc lint |
| `_meta/commands/vault-save/` | OpenCode command: interactive save-artifact |
| `_meta/commands/vault-promote/` | OpenCode command: interactive promote-artifact |
| `_meta/commands/vault-audit/` | OpenCode command: experiment triage |
| `_meta/commands/vault-weekly/` | OpenCode command: weekly maintenance |
| `_meta/framebook/README.md` | Framebook index |
| `playbooks/README.md` | User playbooks index (empty, explains purpose) |
| `prompts/README.md` | User prompts index (empty, explains purpose) |
| `agents/README.md` | User agents index (empty, explains purpose) |
| `tools/README.md` | User tools index (explains scope: MCP, CLIs only) |
| `LICENSE` | MIT |
| `.gitignore` | OS files, editor configs, no secrets |
| `.doc-lint.json` | Externalised linter exemptions config |

---

## Identity Cleanup

| From | To |
|---|---|
| `@ezequielbenitez` | `your-username` |
| `last_tested: 2026-06-24` | `last_tested: YYYY-MM-DD` |
| `scope: personal` | keep as-is (correct for a personal vault) |

---

## Linter Changes

### Add `_meta/` to skip list
`_meta/` is framework internals. No lint applied — not even sanitization scans.

### Externalise hardcoded paths to `.doc-lint.json`
Current hardcoded in `doc_lint.py`:
- `NO_FRONTMATTER_DIRS`
- `OPENCODE_COMMAND_FILES`
- `REFERENCE_CAPTURE_DIRS`

Move all to `.doc-lint.json`. Script reads at startup, falls back to empty config if missing.

Schema:
```json
{
  "skip_dirs": ["_meta"],
  "no_frontmatter_dirs": [],
  "no_frontmatter_files": [],
  "reference_capture_dirs": []
}
```

---

## AGENTS.md Changes

- **Session start** updated: step 3 now says "read `_meta/framebook/README.md` and follow the matching procedure" instead of referencing individual playbook paths
- **Framework procedures section** added: explicit routing table of common tasks → framebook paths, plus the rule "do not improvise these operations"
- **Repository map** split into two sections: user content (`agents/`, `prompts/`, `playbooks/`, etc.) and framework (`_meta/framebook/`, `_meta/commands/`, `docs/standards/`, `templates/`)
- **Artifact taxonomy** updated: `agents/` = session-wide system prompts, `playbooks/` = user's recurring procedures, `vetted/` removed
- **Authoring rules** updated: named consumable files by type (`system-prompt.md` for agents, `playbook.md` for playbooks)
- **Gate 1** updated: `vetted/` removed from scoped folders list
- Personal artifact references removed (`prompts/loop-prd-readiness/`, `skills/skill-authoring/`, `docs/references/loop-engineering/`, `vetted/`)

---

## SETUP.md Outline

1. **What this is** — one paragraph
2. **Prerequisites** — Python 3.x, Git, OpenCode (optional)
3. **Initialize your vault** — clone, replace `your-username`, commit
4. **Wire up commands** — follow `_meta/install.md`
5. **Run lint for the first time** — `python scripts/doc_lint.py`
6. **Start your first session** — use init prompt from `_meta/commands/init/prompt.md`
7. **Add your first artifact** — follow `_meta/framebook/save-artifact/`

---

## Delivery Order

1. Create new project directory
2. Copy and transform meta-framework files (docs, standards, templates, changelog)
3. Move all playbooks → `_meta/framebook/` with internal path references updated
4. Create empty scaffold dirs with `.gitkeep`
5. Externalise linter config → `.doc-lint.json`, update `doc_lint.py`
6. Create `_meta/commands/` — all vault commands + init prompt
7. Create `_meta/install.md`
8. Create `SETUP.md`
9. Update `AGENTS.md`
10. Create section index READMEs (`playbooks/`, `prompts/`, `agents/`, `tools/`)
11. Create `LICENSE` + `.gitignore`
12. Run lint — confirm `COMPLIANCE: PASS`
13. Done

---

## Acceptance Criteria

- [ ] New project contains zero personal artifacts
- [ ] No instances of `@ezequielbenitez` remain
- [ ] `_meta/` exists and contains `commands/`, `framebook/`, `install.md`
- [ ] `playbooks/` at root is empty with a README explaining its purpose
- [ ] `python scripts/doc_lint.py` passes
- [ ] `_meta/` is fully skipped by lint
- [ ] Linter exemptions in `.doc-lint.json`, not hardcoded in script
- [ ] `SETUP.md` covers full onboarding
- [ ] Init prompt exists at `_meta/commands/init/prompt.md`, copy-paste ready
- [ ] All vault commands exist under `_meta/commands/`
- [ ] `LICENSE` exists
- [ ] `.gitignore` exists
- [ ] All empty scaffold dirs have `.gitkeep`
- [ ] `vetted/` does not exist (absorbed by status field)
