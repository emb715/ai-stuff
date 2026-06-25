# Audit Experiments

## Trigger

Weekly cadence, or any time you want to know: what is in `experiments/`, what is ready to promote, what is stale or dead.

## Preconditions

None. This is a read-first workflow.

## Procedure / Steps

### 1. List everything in experiments

```bash
find experiments/ -name "README.md" | sort
```

For each experiment, read:
- `status` — draft / validated
- `last_tested` — how old is the evidence
- `# Next step` section — what was the intended path forward

### 2. Classify each experiment

| State | Criteria | Action |
|---|---|---|
| Ready to promote | `validated`, recent `last_tested`, next step says promote | Run `_meta/framebook/promote-artifact/` |
| Needs one more test | `draft`, clear hypothesis, setup documented | Schedule a test session |
| Stale | `last_tested` > 60 days, no activity | Mark `deprecated` or archive |
| Blocked | Missing decision or dependency noted in README | Surface the blocker, decide or archive |
| Unclear | No hypothesis, no next step, no evidence | Rewrite or archive |

### 3. For each "ready to promote" experiment

Run `_meta/framebook/promote-artifact/`.

### 4. For each stale or unclear experiment

Pick one:
- **Revive**: update README with current state, re-test, update `last_tested`
- **Deprecate**: set `status: deprecated`, add reason, move to `archive/` if needed
- **Archive**: move to `archive/<name>/` with a note — content preserved but not indexed

Do not leave stale experiments without a decision. They erode trust in the folder.

### 5. Check for orphaned artifacts

```bash
python scripts/doc_lint.py
```

Any file failing DL008 (discoverability) is an orphan — either link it or archive it.

### 6. Log the audit

In `changelog/week-YYYY-WW.md`:
- List what was promoted
- List what was deprecated or archived
- Note anything blocked and why

## Workflow

```
enumerate experiments/
  → classify each (promote / iterate / deprecate / archive)
  → route promote-ready to _meta/framebook/promote-artifact/
  → resolve stale/unclear items
  → run lint (DL008 check)
  → log all decisions in changelog
```

- Ambiguous state → force explicit current-state note before ending audit
- Missing docs in experiment → rewrite pass first, then reclassify

## Rollback / Fallback

If an experiment is too ambiguous to classify: add a `## Current state` section to its README with the honest situation. That alone is progress — ambiguity documented is better than ambiguity hidden.
