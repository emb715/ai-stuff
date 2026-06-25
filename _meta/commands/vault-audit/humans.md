# humans.md — vault-audit

## Design decisions

- Read-only scan first, action second. No changes happen without explicit user confirmation.
- Classification table is deterministic — every experiment gets a label, no ambiguous "maybe."
- 60-day staleness threshold matches the framebook procedure. Keep them in sync.
- Summary table before asking for action — gives full picture before committing to any change.

## Maintenance notes

- If the staleness threshold changes in the framebook, update it here too.
- If new experiment states are added, update the classification table.
