# humans.md — vault-promote

## Design decisions

- Transition table shown upfront — illegal transitions are blocked before any edits happen.
- Rubric scoring is shown axis by axis, not as a binary pass/fail. Transparency matters for trust.
- Deprecation is a first-class path, not an afterthought. History and replacement path are always captured.
- Changelog entry is mandatory — it is how the weekly audit cadence tracks what changed.

## Maintenance notes

- If the vetting rubric scoring changes, update the threshold reference in command.md.
- If new artifact type destinations are added, update the promotion destination table.
