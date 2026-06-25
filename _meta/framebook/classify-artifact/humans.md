# humans.md — Classify an Artifact

## Origin

Created 2026-06-24. `docs/standards/artifact-classification.md` exists as a reference standard but isn't executable — it defines the taxonomy without giving you a decision flow. People still get stuck. This playbook turns that reference into 4 yes/no questions.

## Design decisions

- "Default to experiments/" is the safety valve at every question. The cost of wrong placement in experiments is near-zero; the cost of wrong placement in prompts/ or playbooks/ is trust erosion.
- The primary-value question (Q2) is the core. Everything else is confirmation. If Q2 is clear, the rest is a checklist.
- Hybrid artifact handling is explicit rather than "use your judgment." Judgment leads to mixed files that serve no reader well.
- The 3-file structure question is a separate step because people forget it. Asking it directly prevents the "flat file in prompts/" mistake.
- Linking is the last step, not optional. An unlinked artifact is effectively invisible.

## Maintenance notes

- If new top-level folders are added (e.g., `agents/`), add them to the Q2 routing table and Q3 criteria.
- The placement criteria in Q3 mirror `artifact-classification.md` — when that standard changes, update Q3 to match.
