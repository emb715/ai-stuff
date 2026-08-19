# Git hooks

Native git hooks tracked in this repo (no npm/husky — this vault has no root `package.json`).

## Enable (one time per clone)

```bash
git config core.hooksPath .githooks
```

## Hooks

- `pre-push` — runs `python3 scripts/doc_lint.py` before every push and blocks the push if it
  reports `COMPLIANCE: BLOCKED` (non-zero exit). Mirrors the CI check in
  `.github/workflows/doc-lint.yml`, so failures are caught locally before reaching CI/main.
