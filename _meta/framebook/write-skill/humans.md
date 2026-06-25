# humans.md — Write a Skill

## Origin

Created 2026-06-24. `skills/skill-authoring/SKILL.md` is a 271-line reference document — detailed and accurate, but not operational. It describes what to do; it doesn't sequence the steps into an executable procedure. This playbook is the execution wrapper for that reference.

## Design decisions

- This playbook is intentionally thinner than the `skill-authoring` reference. It gives you the execution path, not all the reasoning behind each step. For the reasoning, read `skills/skill-authoring/SKILL.md`.
- Evaluation (step 8) is non-negotiable and placed second-to-last, after writing but before publishing. The skill-authoring reference puts this at step 8 of 10 for the same reason — evaluation without a complete skill is premature; publishing without evaluation is a guess.
- "One footgun" is strict. The temptation is to add every antipattern you find. The skill-authoring reference is explicit: one in SKILL.md, the rest in refs/. This playbook mirrors that constraint.
- The trigger description step (step 6) is separate and explicit. It's the most commonly skipped step and the one that determines whether the skill loads at the right time.

## Maintenance notes

- If the 10-step process in `skills/skill-authoring/SKILL.md` changes, review this playbook for alignment. The key steps that need to stay in sync: footgun rules, evaluation criteria, SKILL.md vs humans.md content split, and routing table pattern.
- When this playbook has been run at least once with documented results, promote to `validated` and update `last_tested`.
