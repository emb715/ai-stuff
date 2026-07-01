---
description: Full weekly maintenance sequence — lint, promote, stale check, index integrity, changelog
---

Read `_meta/framebook/weekly-maintenance/playbook.md` fully before proceeding.

Run the weekly maintenance sequence:

**1. Lint**
```bash
python scripts/doc_lint.py
```
Report results. If BLOCKED, list failures and ask whether to fix now or log as a known issue.

**2. Experiment audit**
List all experiments with `status: validated` and `last_tested` within 30 days.
These are promotion candidates — surface them and ask which to promote.

**3. Stale check**
List all artifacts with `last_tested` older than 60 days across all folders.
For each: recommend deprecate, retest, or leave with an explicit note.

**4. Index integrity**
Check that all artifacts in `agents/`, `prompts/`, `playbooks/`, `skills/`, `tools/` are linked from their section README.
Surface any that are not.

**5. Changelog**
Ask: "What happened this week? Any wins, failures, or process changes?"
Write a `changelog/week-YYYY-WW.md` entry using the template at `changelog/week-YYYY-WW.md`.

**6. Summary**
Report:
- Artifacts promoted
- Artifacts deprecated
- Lint status
- Orphans found
- Changelog written (yes/no)

Do not skip steps. If a step produces no findings, state that explicitly.
