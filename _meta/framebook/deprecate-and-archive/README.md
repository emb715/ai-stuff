---
title: "Deprecate and Archive"
status: draft
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - deprecation
  - lifecycle
owner: "@ezequielbenitez"
---

# Deprecate and Archive

Standard retirement path for artifacts that are dead, superseded, stale, or failed experiments.

## Context / Problem

`promote-artifact` covers `any → deprecated` in one paragraph but doesn't address the decisions involved: is this dead, superseded, or just stale? Does it go to `archive/` or just a status change? What happens to things that link to it? Without a dedicated playbook, retirement is ad-hoc and leaves broken links and unresolved references behind.

## Scope

Applies to any artifact in any state: experiments, prompts, playbooks, tools, skills, vetted assets. Covers both status-only changes and physical moves to `archive/`. Includes the `close-experiment` case (experiment outcome was "this didn't work").

## Trigger

- An artifact has not been touched in > 60 days and shows no evidence of use
- A newer artifact supersedes this one
- An experiment concluded with a negative result ("this didn't work")
- A prompt, tool, or skill is broken and not worth fixing

## Outputs

- Artifact status set to `deprecated`
- Reason and replacement path documented
- Backlinks updated or removed
- Artifact moved to `archive/` if it should not appear in active indexes
- Changelog entry written

## Verification

- `status: deprecated` in frontmatter
- `# Deprecation` section present with reason + replacement (if any)
- No active index links pointing to the deprecated artifact (or links marked `(deprecated)`)
- Changelog entry exists

## Evidence / Results

Drafted 2026-06-24 based on gap identified in repo audit. `promote-artifact` handles deprecation as a secondary path; this playbook makes it a first-class operation. No run history yet — status `draft` until first real execution.

## Failure Modes / Boundaries

- If something links to the deprecated artifact and the replacement isn't clear yet, mark the link `(deprecated — no replacement)` rather than removing it silently
- Experiments that "didn't work" still have evidence value — preserve the `# Observations` and `# Results` sections before archiving
- Do not delete — always move to `archive/` or leave in place with deprecated status; deletion destroys history

## Related Links

- `_meta/framebook/promote-artifact/` — the promote path (complement to this playbook)
- `_meta/framebook/weekly-maintenance/` — where this playbook is called from
- `archive/` — destination for physically retired artifacts
