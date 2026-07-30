# Weekly Maintenance

## Trigger

Run weekly, or after any large batch of changes to the repo.

## Preconditions

- You have ~30 minutes
- No in-progress experiments requiring active work this session

## Procedure / Steps

### 1. Audit experiments

Run `_meta/framebook/audit-experiments/` in full.

Quick version when time is short:

```bash
find experiments/ -name "README.md" | sort
```

For each experiment, read `status` and `last_tested`. Classify:

| State | Action |
|---|---|
| `validated`, recent, next step = promote | Promote (step 2) |
| `draft`, active, testable | Note — schedule test |
| `last_tested` > 60 days, no activity | Deprecate or archive (step 3) |
| Ambiguous or missing next step | Add a `## Current state` note, reclassify next week |

### 2. Promote ready artifacts

For each promote-ready experiment, run `_meta/framebook/promote-artifact/`.

Checklist per artifact:
- [ ] Transition is legal (`draft → validated` or `validated → vetted`)
- [ ] Evidence section documents at least one real outcome
- [ ] Failure modes section is not empty
- [ ] `last_tested` updated to today
- [ ] Sanitization passed (no secrets, private IDs, paths)
- [ ] Status field updated
- [ ] Moved to correct destination folder if needed
- [ ] Index links updated (section README + root README)

### 3. Deprecate and archive stale artifacts

For each stale or dead artifact, run `_meta/framebook/deprecate-and-archive/`.

### 4. Check index links

Scan for broken or missing links:

```bash
python scripts/doc_lint.py
```

Fix any DL008 (orphan) failures:
- New artifact not in any index → add to section README and root README
- Removed artifact still linked → remove or mark `(deprecated)`

If linter is broken: manually check root `README.md` and `playbooks/README.md` against the actual folder contents.

Check `USAGE.md` task map against filesystem:
- `ls agents/ prompts/ playbooks/ skills/ tools/`
- Any artifact folder on disk not in the USAGE.md task map → add a row
- Any row in the task map with no matching folder → remove the row
- `USAGE.md` is the LLM's consumption surface — drift here means the LLM misses or invents artifacts

### 5. Write the changelog entry

Open or create `changelog/week-YYYY-WW.md` (use ISO week number).

Minimum entry:

```markdown
## Promotions
- <artifact>: draft → validated / validated → vetted

## Deprecations / Archives
- <artifact>: reason

## Maintenance
- <what was fixed, updated, or noted>

## Blocked / Deferred
- <anything left undone and why>
```

One entry per artifact touched. Keep it short — the log is the goal, not the prose.

## Workflow

```
audit experiments/
  → classify: promote / iterate / deprecate / ambiguous
  → run promote-artifact for each ready item
  → run deprecate-and-archive for each stale item
  → fix orphan links (lint or manual)
  → write changelog entry
```

- Any lint failure blocking promotion → stop that promotion, log it as blocked
- Too many items to process → timebox, log deferred items explicitly

## Rollback / Fallback

If the session gets interrupted: write a partial changelog entry noting where you stopped. An incomplete maintenance run logged is better than a complete run unrecorded.
