# prompt-factory — humans

## Why this exists

Early validation proved partial value (`default` and `fast` pass), but behavior was spread across notes and command text. This skill consolidates the deterministic behavior contract so command wrappers stay thin.

## Structure decisions

- `SKILL.md` contains only executable behavior rules and exact response contracts.
- Runtime templates live in `skills/prompt-factory/templates/` so the skill is self-contained.
- Experiment artifacts remain evidence-only and are not runtime dependencies.
- This artifact is `validated` for all three implementation shapes (`default`, `fast`, `strict`).

## Command relationship

- `/prompt-factory` is the canonical invocation surface.
- The skill drives an interactive guided flow: plan source → type menu → style gate (if applicable) → generate.
- Shorthand arguments allow skipping menus for experienced users.
- Command delegates all flow logic to `SKILL.md`; no business logic in the command wrapper.
- Canonical command path: `skills/prompt-factory/commands/prompt-factory.md`.

## Known gaps

- Per-type empirical validation is incomplete outside implementation path.
- No explicit parser spec yet for paths with spaces/quoted args.
- No benchmark yet for type-selection accuracy when users provide ambiguous intent.

## Maintenance notes

- Keep omission/invalid-mode responses exact and stable; they are part of deterministic UX.
- After per-type validation evidence is added, reassess confidence and promotion readiness for full type set.

## Origin

Derived from validated prompt-generation trials and iterative gate hardening in this session (mode required, numbered options, plan-doc-first source selection).
