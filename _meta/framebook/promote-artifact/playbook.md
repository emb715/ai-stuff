# Promote an Artifact

## Trigger

An artifact has been tested and you want to move it to a higher lifecycle state, or retire it.

## Preconditions

- The artifact exists and has documented evidence of at least one real use.
- You have the session available to make the edit and run lint.

## Procedure / Steps

### 1. Confirm the transition is legal

| From | To | Allowed |
|---|---|---|
| `draft` | `validated` | Yes — needs one documented outcome |
| `validated` | `vetted` | Yes — must pass vetting rubric |
| `draft` | `vetted` | **No — blocked** |
| any | `deprecated` | Yes — needs reason + replacement path if any |

### 2. `draft → validated`

Requirements:
- At least one real use with a documented outcome in the Evidence section.
- Failure modes section is not empty.
- Sanitization passed — no private identifiers, paths, or credentials.

Steps:
1. Edit the artifact's `README.md`
2. Update `status: validated`
3. Update `last_tested` to today
4. Fill or update the Evidence section with the real outcome
5. Confirm Failure Modes section has at least one entry
6. Run `python scripts/doc_lint.py`

### 3. `validated → vetted`

Requirements:
- Score ≥ 12/14 on `docs/standards/vetting-rubric.md`.
- No axis scores 0.
- Sanitization passed.

Steps:
1. Score the artifact against the rubric — record each axis score
2. If threshold met, move the artifact to its permanent home:
   - Prompts → `prompts/`
   - Tools → `tools/`
   - Playbooks → `playbooks/`
   - Other → `vetted/`
3. Update `status: vetted` in `README.md`
4. Update `last_tested`
5. Update all index links (section README + root README)
6. Run `python scripts/doc_lint.py`

### 4. Any → deprecated

Steps:
1. Update `status: deprecated`
2. Add a `# Deprecation` section with:
   - Reason
   - Replacement path (if any) — link to what supersedes it
3. Move file to `archive/` if it should not appear in active indexes
4. Update any index that linked to it — add `(deprecated)` label or remove

### 5. Log it

Add an entry to `changelog/week-YYYY-WW.md` under Promotions or Deprecations.

## Workflow

```
identify candidate
  → confirm legal transition
  → run required checks (lint / rubric)
  → update status and location
  → update all index links
  → log outcome in changelog
```

- Any gate failure → stop, keep current status, document reason
- Rubric fail → leave at `validated`, note failing axes

## Rollback / Fallback

If the artifact fails the rubric: note the failing axes in the Evidence or Notes section of the README and leave at `validated`. Do not set `vetted` until the rubric passes.
