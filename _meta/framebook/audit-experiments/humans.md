# humans.md — Audit Experiments

## Origin

Created during initial repo scaffolding session (2026-06-24) to prevent experiment backlog rot and ensure insights surface on a regular cadence.

## Design decisions

- Read-first, no preconditions. Anyone can run an audit at any time without setup.
- 60-day threshold for staleness is a practical default — adjust in the playbook if cadence changes.
- Routing to `_meta/framebook/promote-artifact/` instead of inlining promotion steps keeps each playbook single-responsibility.
- Changelog logging is mandatory. Without it, the audit leaves no trace and cannot be reviewed.

## Maintenance notes

- If `experiments/` subfolders grow, add a step to group by subdirectory for easier scanning.
- Keep playbook.md clean and copy-paste ready — no frontmatter, no meta-commentary.
