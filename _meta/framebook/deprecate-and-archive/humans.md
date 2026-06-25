# humans.md — Deprecate and Archive

## Origin

Created 2026-06-24. The `promote-artifact` playbook handled deprecation as a short afterthought. During repo planning it became clear deprecation has its own decisions: reason classification, backlink handling, and the distinction between archive-worthy vs status-change-only retirements.

## Design decisions

- Four-reason taxonomy (dead / superseded / stale / negative result) forces an explicit decision. Without it people either skip the reason or use vague labels.
- The `archive/` vs status-change distinction matters: moving to archive removes from active indexes; status change leaves it in place for potential revival. Both are valid; the choice depends on whether you might ever want this back.
- Evidence preservation for failed experiments is intentional. A failed experiment with documented results is a research artifact. One without results is garbage. The playbook forces the evidence before archiving.
- Backlink search via `grep` is manual because the linter doesn't catch all link types yet. When the linter improves, this step can be delegated.

## Maintenance notes

- If new top-level folders are added, the archive destination (`archive/`) stays the same — physical retirement always goes to one place.
- When the linter is fixed and handles backlink checking, replace the manual grep step with a lint command.
- "Negative result" experiments are the most common case. Make sure the results section requirement is clear to anyone running this for the first time.
