# /vault-lint

OpenCode command. Runs doc_lint.py and surfaces failures in the standard compliance format.

## When to use

After authoring or editing any structured doc. Before promoting any artifact.

## What it does

Runs `python scripts/doc_lint.py` and reports COMPLIANCE: PASS or BLOCKED with exact findings and required fixes.

## Invocation

```
/vault-lint
```

## Related

- `docs/standards/doc-lint-spec.md` — lint rules DL001–DL010
- `_meta/framebook/fix-compliance-failures/` — how to resolve BLOCKED results
