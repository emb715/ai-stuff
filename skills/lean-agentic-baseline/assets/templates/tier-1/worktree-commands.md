One worktree per agent session — parallel sessions work on separate short-lived branches without stepping on each other's files.

```bash
git worktree add ../app-invoice-api \
  -b feat/invoice-api origin/main

# work, open the PR, merge, then:
git worktree remove ../app-invoice-api
```
