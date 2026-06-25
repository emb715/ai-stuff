# humans.md — Save Artifact from Another Project

## Origin

Created during initial repo scaffolding session (2026-06-24) to standardize how external assets enter the repo and prevent unsanitized or misclassified content from landing in the wrong lifecycle state.

## Design decisions

- Classification step comes first, before writing anything. Prevents writing toward the wrong structure.
- Routing distinction (prompt vs skill vs playbook) is strict by design. Ambiguous assets go to `experiments/` — not a forced classification.
- Sanitization is step 3, not step 7. Doing it late risks accidentally persisting sensitive data in git history.
- Three-file folder required for anything consumable. Single-file allowed only for pure reference docs.

## Maintenance notes

- If new artifact types are added (e.g., `agents/`, `templates/`), update the routing table in step 1.
- Keep playbook.md clean and copy-paste ready — no frontmatter, no meta-commentary.
