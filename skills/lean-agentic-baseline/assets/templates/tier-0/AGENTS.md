# AGENTS.md

## Commands
- Install: `pnpm install`
- Validate before any PR: `pnpm validate`
- Dev server: `pnpm dev`

## Layout
- `src/api/` routes → `src/services/` → `src/repos/`
- `docs/decisions/INDEX.md` lists every ADR. Load the full file when you touch a governed path.
- `docs/PERMISSIONS.md` says what this agent may do unattended. Reading it is not the control; `.claude/settings.json` is.

## Rules (only what a hook can't enforce)
- Reuse helpers in `src/lib/` before writing new ones.
- Migrations must be reversible.
- Comments explain why, never what. No ticket IDs in code.

## Workflow
- Specs live in the issue tracker. Work from the issue, not from local notes.
- Commit with the `create-commit` skill. Open PRs with the `create-pr` skill.
- Ending a session mid-task: write a handoff using `docs/handoff-template.md`.
