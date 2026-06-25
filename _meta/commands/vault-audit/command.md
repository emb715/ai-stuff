Read `_meta/framebook/audit-experiments/playbook.md` fully before proceeding.

Execute the audit:

1. List all experiments:
```bash
find experiments/ -name "README.md" | sort
```

2. For each experiment, read and report:
   - `title` and `status`
   - `last_tested` date
   - `# Next step` section content

3. Classify each experiment into one of:

| State | Criteria | Recommended action |
|---|---|---|
| Ready to promote | `validated`, recent `last_tested`, next step says promote | Offer to run `/vault-promote` |
| Needs one more test | `draft`, clear hypothesis, setup documented | Flag for next session |
| Stale | `last_tested` > 60 days, no activity | Offer to deprecate or archive |
| Blocked | Missing decision or dependency | Surface the blocker explicitly |
| Unclear | No hypothesis, no next step, no evidence | Offer to rewrite or archive |

4. Run lint to surface orphaned artifacts:
```bash
python scripts/doc_lint.py
```

5. Present a summary table of all experiments with their state and recommended action.

6. Ask: "Which of these do you want to act on now?"

Do not take any action without confirmation.
