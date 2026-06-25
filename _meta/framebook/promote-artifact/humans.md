# humans.md — Promote an Artifact

## Origin

Created during initial repo scaffolding session (2026-06-24) to enforce lifecycle integrity and prevent premature or invalid promotions degrading repo quality.

## Design decisions

- Transition table is the first step — not an afterthought. Legal/illegal transitions must be checked before any edit is made.
- Deprecation is a first-class transition, not just "deleting files." History and replacement path are preserved.
- Rubric scoring is a hard gate for `vetted`, not advisory. If it fails, do not bypass it.
- Logging the outcome in changelog is mandatory — it is how the weekly audit cadence works.

## Maintenance notes

- If new artifact types are added (e.g., `agents/`), update the promotion destination table in step 3.
- Keep playbook.md clean and copy-paste ready — no frontmatter, no meta-commentary.
