# humans.md — vault-lint

## Design decisions

- Outputs the exact compliance format defined in AGENTS.md — consistent, machine-readable, auditable.
- Does not attempt to auto-fix failures — surfaces them for human decision.
- Re-run requirement before closing is explicit to prevent false resolution.

## Maintenance notes

- If the lint script path changes, update command.md.
- If new output fields are added to doc_lint.py, update the expected format in command.md.
