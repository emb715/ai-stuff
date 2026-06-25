# /vault-audit

OpenCode command. Scans and classifies all experiments, surfaces promotion/deprecation candidates.

## When to use

Weekly cadence, or any time you want to know the state of `experiments/`.

## What it does

Lists all experiments, classifies each (promote / iterate / deprecate / archive), runs lint, presents summary with recommended actions.

## Invocation

```
/vault-audit
```

## Related

- `_meta/framebook/audit-experiments/` — the underlying procedure
- `/vault-promote` — to act on promotion candidates found during audit
