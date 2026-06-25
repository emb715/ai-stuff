# /vault-promote

OpenCode command. Interactive lifecycle transition for promoting or deprecating an artifact.

## When to use

When promoting `draft → validated`, `validated → vetted`, or deprecating any artifact.

## What it does

Confirms legal transition, runs required checks, updates status and links, logs outcome.

## Invocation

```
/vault-promote
```

## Related

- `_meta/framebook/promote-artifact/` — the underlying procedure
- `docs/standards/vetting-rubric.md` — rubric for vetted promotion
