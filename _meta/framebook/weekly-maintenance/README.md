---
title: "Weekly Maintenance"
status: draft
confidence: medium
last_tested: 2026-06-24
scope: personal
tooling:
  - "any"
tags:
  - playbook
  - maintenance
  - cadence
owner: "@emb715"
---

# Weekly Maintenance

Recurring operational heartbeat for the AI knowledge base.

## Context / Problem

The root README promises a weekly cadence — promote, deprecate, relink, changelog — but without a playbook this either doesn't happen or happens inconsistently. The repo decays: stale experiments stay, valid work goes unpromoted, indexes drift.

## Scope

Covers the full weekly maintenance cycle: audit experiments, promote ready artifacts, retire stale ones, repair broken index links, and write the changelog entry. Applies to this repo only. Run once per week or after any large batch of changes.

## Trigger

Weekly cadence, or when `experiments/` has grown visibly, when README links feel stale, or when you've done significant work and haven't logged it.

## Outputs

- `experiments/` classified: nothing left in ambiguous state
- 0–3 artifacts promoted or deprecated
- All index links current
- `changelog/week-YYYY-WW.md` entry written

## Verification

- `python scripts/doc_lint.py` passes with no DL008 (orphan) errors
- Every artifact changed has an updated `last_tested` date
- Changelog entry exists for this week

## Evidence / Results

Playbook drafted based on the cadence described in root README and the gaps identified during repo audit on 2026-06-24. No run history yet — status `draft` until first real execution is logged.

## Failure Modes / Boundaries

- If more than 5 experiments need decisions, timebox to 3 and defer the rest explicitly
- If lint is broken, note it and proceed with manual checks — do not skip the maintenance cycle
- Changelog entry can be short; 3 bullet points is enough — the point is the log exists

## Related Links

- `_meta/framebook/audit-experiments/` — step 1 of this playbook
- `_meta/framebook/promote-artifact/` — step 2
- `_meta/framebook/deprecate-and-archive/` — step 3
- `docs/standards/vetting-rubric.md` — used in promotion decisions
- `changelog/week-YYYY-WW.md` — output target
