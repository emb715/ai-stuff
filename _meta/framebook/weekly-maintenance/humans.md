# humans.md — Weekly Maintenance

## Origin

Created 2026-06-24 during repo planning session. The root README described a weekly cadence but no playbook existed to execute it. Without a concrete procedure, the cadence was aspirational only.

## Design decisions

- Steps are ordered by dependency: audit first, then promote, then deprecate, then relink. You can't fix links for things you haven't promoted yet.
- The changelog entry is the last step, not a note at the end — it is a required output, not optional documentation.
- "Timebox to 3 experiments" is a deliberate constraint. A maintenance run that takes 3 hours won't happen consistently.
- Kept the quick-version audit path for time-constrained weeks. The full audit-experiments playbook is the right tool; the quick inline version is a fallback, not a replacement.

## Maintenance notes

- If new top-level artifact folders are added (e.g., `agents/`), add them to the index check in step 4.
- If the linter is fixed and expanded, replace the manual check fallback with the lint command only.
- Once this playbook has been run at least twice and the evidence is documented, promote to `validated` and update `last_tested`.
