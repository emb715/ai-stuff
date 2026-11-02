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

## Commit messages

Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
type(scope): subject

optional body: what changed and why

optional footer, e.g. BREAKING CHANGE: ...
```

- **type** (required), one of:

  | Type | Use for |
  |---|---|
  | `feat` | a new artifact, or new capability in an existing one |
  | `fix` | a correction to wrong behavior or content |
  | `docs` | prose-only changes: READMEs, standards, notes, decisions |
  | `refactor` | restructuring with no change in behavior (moves, renames, splits) |
  | `test` | evals, test cases, eval results |
  | `ci` | `.github/workflows/`, git hooks |
  | `build` | the site build, dependencies |
  | `perf` | making something faster or cheaper (tokens, runtime) |
  | `style` | formatting only |
  | `chore` | maintenance that fits nothing above (deprecations, cleanup) |
  | `revert` | undoing an earlier commit |

- **scope** (optional): the artifact or area touched, in lowercase kebab-case, usually its folder name (`issues-to-roadmap`, `doc-lint`, `site`). Leave it out when a change spans many areas.
- **`!`** after the type or scope marks a breaking change, e.g. a renamed artifact other files link to: `refactor(router)!: rename artifact-router entries`.
- **subject**: imperative mood ("add", not "added"), no trailing period, whole header at most 72 characters.

Examples:

```
feat(issues-to-roadmap): carry the whole plan in the tracker
fix(site): build pages for archived artifacts
test(taste-loop): add judge check and round 3
chore(taste-loop): deprecate experiment
```

PRs are squash-merged, so the **PR title becomes the commit on `main`** and must follow the same format; GitHub appends ` (#N)`, which does not count toward the limit.

Checked by `scripts/commit_lint.py`:

```bash
python3 scripts/commit_lint.py --title "feat(x): add y"     # one header
python3 scripts/commit_lint.py --range origin/main..HEAD    # your branch's commits
```

CI runs it on every PR (`.github/workflows/commit-lint.yml`, PR title and each non-merge commit), and the `commit-msg` git hook runs it locally (see below). Messages git writes itself (`Merge ...`, `Revert "..."`, `fixup!`) are skipped.

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

This activates two hooks:

- `.githooks/commit-msg` runs `python3 scripts/commit_lint.py` and rejects a commit whose
  header is not a Conventional Commit (see [Commit messages](#commit-messages)).
- `.githooks/pre-push` runs the same documentation lint as CI
  (`python3 scripts/doc_lint.py`) and blocks `git push` if it reports `COMPLIANCE: BLOCKED`.

See `.githooks/README.md` for details.

## Review rubric

Reviewers should reject content that is:
- opinion-only with no evidence
- structurally misplaced (wrong lifecycle folder)
- missing metadata
- missing boundaries/failure cases
- duplicated without clear delta vs existing docs
