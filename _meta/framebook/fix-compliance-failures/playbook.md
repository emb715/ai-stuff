# Fix Compliance Failures

## Trigger

An artifact returns `COMPLIANCE: BLOCKED`, or `doc_lint.py` returns failures.

## Preconditions

- You have the BLOCKED report or lint output in front of you
- You have access to the artifact file(s)

## Procedure / Steps

### 1. Read the full failure report

Do not start fixing until you've read the complete report. Map every failing gate and every lint code to its meaning.

Gate reference:
| Gate | What it checks |
|---|---|
| Gate 1 | Frontmatter completeness (all required keys, valid values) |
| Gate 2 | Structural completeness (all required sections present) |
| Gate 3 | Evidence threshold (prescriptive claims have measurable outcomes) |
| Gate 4 | Sanitization (no secrets, private IDs, sensitive data) |
| Gate 5 | Lifecycle integrity (legal status transitions only) |
| Gate 6 | Index linkage (artifact is discoverable from an index) |

Common lint codes:
| Code | Meaning |
|---|---|
| DL001 | Missing frontmatter |
| DL002 | Missing required frontmatter key |
| DL003 | Invalid status value |
| DL004 | Missing required section |
| DL005 | Evidence section empty |
| DL006 | Failure modes section empty |
| DL007 | Sanitization issue |
| DL008 | Not linked from any index (orphan) |

### 2. Order the fixes

Fix gates in this order to avoid re-work:
1. Gate 4 (sanitization) — must be clean before anything else is evaluated
2. Gate 1 (frontmatter) — structural prerequisite for all other checks
3. Gate 2 (required sections) — can't assess evidence if the section doesn't exist
4. Gate 6 (index linkage) — link the artifact before claiming it passes
5. Gate 3 (evidence) — requires content changes that may need a real test
6. Gate 5 (lifecycle) — transition validity; fix last to avoid locking in bad state

### 3. Fix each gate

**Gate 1 — Frontmatter**

Add all missing keys. Valid values:
```yaml
status: draft | validated | vetted | deprecated
confidence: low | medium | high
```
All 8 required keys must be present: `title`, `status`, `confidence`, `last_tested`, `scope`, `tooling`, `tags`, `owner`.

**Gate 2 — Required sections**

Add any missing sections. Minimum required:
- Context / Problem
- Scope
- Procedure / Steps (or equivalent)
- Evidence / Results
- Failure Modes / Boundaries

Sections may be sparse if evidence is genuinely not yet available — but they must exist and not be empty.

**Gate 3 — Evidence threshold**

If a section makes a prescriptive claim ("use X, it's better than Y") without evidence, either:
- Add the evidence (tested outcome, before/after, reproducible example)
- Soften the claim ("based on limited testing, X appeared to perform better than Y")
- Move the artifact back to `draft` until evidence exists

Do not fabricate evidence. If real evidence doesn't exist yet, the artifact is not ready for promotion.

**Gate 4 — Sanitization**

Run `_meta/framebook/sanitize-before-publish/` for a full sanitization pass.

**Gate 5 — Lifecycle integrity**

If transition is illegal (`draft → vetted`):
- Set `status: validated` if the evidence supports validated
- Do not skip to vetted
- Note: missing intermediate evidence means the artifact cannot be promoted past `validated` until it exists

If a deprecated artifact is missing its reason/replacement:
- Add `# Deprecation` section with reason and replacement link (or "none")

**Gate 6 — Index linkage**

Find the correct section index for this artifact type and add an entry:
- Prompts → `prompts/README.md` index table + root `README.md` artifact inventory
- Playbooks → `playbooks/README.md` index table + root `README.md` How to work table
- Tools → `tools/README.md` current tools section + root `README.md`
- Skills → root `README.md` artifact inventory

### 4. Re-run checks

After fixing all gates:

```bash
python scripts/doc_lint.py
```

If lint still fails: address remaining failures before proceeding. Do not declare it fixed until the check passes.

If the linter doesn't cover all gates (it currently doesn't cover Gate 3 or Gate 5 fully): manually verify those gates after lint passes.

### 5. Document the resolution

Update the artifact's `humans.md` or Evidence section:

```
Compliance fix: YYYY-MM-DD — resolved Gate X, Y, Z failures. <brief note on what was changed>.
```

If any gate was accepted-with-reason rather than fixed:

```
Gate 3 accepted: no real test evidence yet — artifact marked draft, will promote after first live run.
```

## Workflow

```
read full failure report
  → map each FAILED_GATE to its definition
  → order fixes: Gate 4 → 1 → 2 → 6 → 3 → 5
  → fix each gate
  → re-run doc_lint.py
  → manually verify gates not covered by linter
  → document resolution in humans.md or Evidence
```

- Multiple interacting failures → fix one at a time, re-run after each
- Gate 3 requires real evidence → do not fake it; leave as draft
- Any accepted-with-reason gate → must be documented explicitly

## Rollback / Fallback

If a fix introduces a new failure: revert that specific change and fix it differently. If unsure what caused a new failure, diff the artifact against the pre-fix version. Git history preserves the pre-fix state.
