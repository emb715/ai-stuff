---
description: Interactive lifecycle transition — promote or deprecate an artifact
---

Read `_meta/framebook/promote-artifact/playbook.md` fully before proceeding.

Ask: "Which artifact do you want to promote, and what transition? (draft→validated / validated→vetted / deprecate)"

Then verify the transition is legal:

| From | To | Allowed |
|---|---|---|
| `draft` | `validated` | Yes — needs one documented outcome |
| `validated` | `vetted` | Yes — must pass vetting rubric |
| `draft` | `vetted` | No — blocked |
| any | `deprecated` | Yes — needs reason + replacement path |

If blocked: state why and stop.

For `draft → validated`:
1. Confirm Evidence section exists and contains a real outcome
2. Confirm Failure Modes section has at least one entry
3. Confirm sanitization passed
4. Update `status: validated` and `last_tested` to today
5. Run `python scripts/doc_lint.py`

For `validated → vetted`:
1. Score the artifact against `docs/standards/vetting-rubric.md` — show each axis score
2. If score ≥ 12/14 and no axis is 0: update `status: vetted`, update `last_tested`
3. If below threshold: list failing axes, leave at `validated`, stop
4. Update all index links
5. Run `python scripts/doc_lint.py`

For deprecation:
1. Update `status: deprecated`
2. Add `# Deprecation` section with reason and replacement path
3. Move to `archive/` if it should not appear in active indexes
4. Update any index that linked to it

Always: log the outcome in `changelog/week-YYYY-WW.md`.
