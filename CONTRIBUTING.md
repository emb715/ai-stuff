# Contributing Standard

This repo optimizes for **reliable reuse**, not note volume.

If your contribution is vague, untested, or non-reproducible, it will be treated as draft-only.

## Non-negotiable rules

1. Put content in the correct directory based on lifecycle and intent
2. Include required frontmatter metadata
3. Link new docs from an index (`README.md` or local section README)
4. Back claims with evidence (results, logs, examples, comparisons)
5. Never include secrets or private identifiers

## Folder rules

### User content folders

- `experiments/` → everything starts here; hypotheses, trials, observations
- `agents/` → session-wide system prompts; three-file folder (`README.md` + `system-prompt.md` + `humans.md`); added by hand, no promotion playbook
- `prompts/` → validated prompts with documented outcomes; three-file folder
- `playbooks/` → your own recurring procedures; three-file folder
- `skills/` → skill knowledge and capability documentation
- `tools/` → deployable technical artifacts only: MCP servers, CLIs, integrations
- `docs/references/` → external research and reference material
- `archive/` → retired content with deprecation reason and replacement path

### Framework folders (do not put user content here)

- `_meta/framebook/` → framework procedures for operating the vault
- `_meta/commands/` → OpenCode commands; framework infrastructure
- `docs/standards/` → binding governance rules

When in doubt: `experiments/` first.

## Artifact structure

Any artifact with a standalone consumable form (prompt, skill, command, tool) uses the three-file folder:

```
<name>/
├── README.md    ← frontmatter + full artifact record
├── <thing>.md   ← copy-paste clean artifact, no frontmatter
└── humans.md    ← maintenance notes, no frontmatter
```

Document-only artifacts (standards, ADRs, references) stay as single files.

See `docs/standards/artifact-structure.md` for the full convention.

## Required frontmatter

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

Frontmatter is required on `README.md` only for three-file folders. `<thing>.md` and `humans.md` carry no frontmatter.

## Promotion policy

Allowed transitions:
- `draft -> validated`
- `validated -> vetted`
- any status -> `deprecated`

Disallowed transition:
- `draft -> vetted` (without validation evidence)

See `_meta/framebook/promote-artifact/` for the full promotion procedure.

**Exception — agents**: added by hand. Copy system prompt, create three-file folder under `agents/`, set status, link from `agents/README.md`. No framebook procedure needed.

## Vetting checklist (must pass all)

- [ ] Problem statement is explicit
- [ ] Scope and assumptions are explicit
- [ ] Repro steps are complete
- [ ] Inputs/outputs are defined
- [ ] Outcome is measurable
- [ ] At least one failure mode is documented
- [ ] Sanitization check passed (no secrets/PII/confidential IDs)
- [ ] Tool/model/version context is recorded
- [ ] Last tested date is current

## PR / commit hygiene

- Small, focused changes over large mixed commits
- One topic per commit when possible
- Update related indexes in same change
- If deprecating content, state replacement path

## Linting (required)

Run locally before commit:

```bash
python scripts/doc_lint.py
```

CI enforcement:
- `.github/workflows/doc-lint.yml` runs the same check on PRs and pushes to `main`
- Any failure is blocking

## Git hooks (guardrails)

Enable the local pre-push guardrail once after cloning:

```bash
git config core.hooksPath .githooks
```

This activates `.githooks/pre-push`, which runs the same documentation lint as CI
(`python3 scripts/doc_lint.py`) and blocks `git push` if it reports `COMPLIANCE: BLOCKED`.
See `.githooks/README.md` for details.

## Review rubric

Reviewers should reject content that is:
- opinion-only with no evidence
- structurally misplaced (wrong lifecycle folder)
- missing metadata
- missing boundaries/failure cases
- duplicated without clear delta vs existing docs
