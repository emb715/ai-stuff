# humans.md — Start a Working Session

## Origin

Created during initial repo scaffolding session (2026-06-24) to enforce consistent session routing and prevent ad-hoc work that bypasses governance.

## Design decisions

- Routing-first approach: identify intent before touching files, prevents misplaced artifacts.
- Orientation step is ordered: stop reading as soon as you have enough context — not meant to be read in full every session.
- Fallback to `experiments/` is intentional and always safe. Reclassification later is cheap; bad placement is not.

## Maintenance notes

- Update session types when new playbooks are added.
- If `prompts/`, `tools/`, or other folders are added as active destinations, add them to the "check what exists" scan list.
- Keep playbook.md clean and copy-paste ready — no frontmatter, no prose rationale.
