---
description: Run doc lint and surface failures in standard compliance format
---

Run the documentation linter:

```bash
python scripts/doc_lint.py
```

Read the output and report results using this structure:

```
COMPLIANCE: PASS|BLOCKED
FAILED_GATES: [Gate X, Gate Y]
EVIDENCE:
- <file>: <finding>
FIXES_REQUIRED:
- <exact action>
PROMOTION_DECISION: <allowed|not allowed>
```

If BLOCKED:
- List each failing file and the exact rule violated
- For each failure, state the minimal fix required
- Do not mark anything as resolved until the fix is applied and lint re-run

If PASS:
- Confirm all target files passed
- State that promotion is allowed
