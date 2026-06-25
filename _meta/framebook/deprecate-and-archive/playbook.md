# Deprecate and Archive

## Trigger

An artifact is dead, superseded, stale, or an experiment concluded with a negative result.

## Preconditions

- You have identified the artifact to retire
- You have a reason (dead / superseded / stale / negative result)

## Procedure / Steps

### 1. Classify the retirement reason

| Reason | Definition | Archive? |
|---|---|---|
| **Dead** | No use case, never validated, no evidence | Yes — move to `archive/` |
| **Superseded** | A newer artifact replaces it | Status change only; link to replacement |
| **Stale** | Not tested in > 60 days, may still be valid | Status change; note revalidation path |
| **Negative result** | Experiment concluded: this approach didn't work | Yes — move to `archive/` with results preserved |

### 2. Document the deprecation

In the artifact's `README.md`, add a `# Deprecation` section immediately after the title:

```markdown
# Deprecation

**Reason**: <dead / superseded / stale / negative result>
**Date**: YYYY-MM-DD
**Replacement**: <link to replacement artifact, or "none">
**Notes**: <one sentence on why — enough context for future reference>
```

Update the frontmatter:

```yaml
status: deprecated
last_tested: YYYY-MM-DD  # today
```

### 3. Preserve evidence (experiments only)

Before archiving an experiment, verify these sections are present and non-empty:
- `# Observations` — what was actually tried
- `# Results` — what happened (even if the result is "inconclusive" or "failed")
- `# Conclusion` — explicit statement of outcome

If sections are empty, fill them from memory or notes before archiving. An archived experiment with empty results is worthless; one with "tried X, failed because Y" has future reference value.

### 4. Update all backlinks

Find everything that links to this artifact:

```bash
grep -r "<artifact-name>" --include="*.md" .
```

For each link found:
- Active index (README, playbooks/README, etc.) → remove the entry or append `(deprecated)`
- Cross-reference in another artifact → add a note: `(deprecated — see <replacement> or none)`
- Do not silently remove links without updating the linking file

### 5. Move to archive (if applicable)

If the artifact is dead or a failed experiment:

```bash
mv <source-path>/ archive/<artifact-name>/
```

If the artifact is superseded or stale but may be revalidated:
- Leave in place with `status: deprecated`
- Do not move to `archive/` — it may be revived

### 6. Log it

In `changelog/week-YYYY-WW.md` under Deprecations / Archives:

```markdown
## Deprecations / Archives
- <artifact-name>: <reason> — <replacement or "no replacement">
```

## Workflow

```
classify reason (dead / superseded / stale / negative)
  → add # Deprecation section + update frontmatter
  → preserve evidence sections (experiments)
  → find and update all backlinks
  → move to archive/ if dead or negative result
  → log in changelog
```

- If replacement is not yet clear → mark `(deprecated — replacement TBD)` and revisit next week
- If backlinks are many → update them before moving the file to avoid confusion

## Rollback / Fallback

If you deprecated something in error: revert the status field, restore the original `# Deprecation` section removal, and log the revert in changelog. Git history preserves the full record.
