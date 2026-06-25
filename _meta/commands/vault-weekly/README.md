# /vault-weekly

OpenCode command. Runs the full weekly maintenance sequence.

## When to use

Once a week, or after any large batch of changes to the vault.

## What it does

Lint → promotion candidates → stale check → index integrity → changelog entry.

## Invocation

```
/vault-weekly
```

## Related

- `_meta/framebook/weekly-maintenance/` — the underlying procedure
- `/vault-audit` — experiment triage (run separately or as part of weekly)
- `/vault-lint` — lint only (run separately when needed mid-week)
