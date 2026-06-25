# humans.md — vault-weekly

## Design decisions

- Fixed sequence — lint first, then promotion candidates, then stale check, then index integrity, then changelog. This order matters: lint failures surface before any promotion decisions are made.
- "State that explicitly" for empty steps prevents silently skipping them. An explicit "nothing found" is valuable signal.
- Changelog is the last step, not the first — written after seeing what actually happened, not before.

## Maintenance notes

- If new folders are added to the vault, add them to the index integrity check step.
- If the stale threshold changes in the framebook, update it here.
