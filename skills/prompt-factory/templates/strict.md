# strict — commit-by-commit checkpoint prompt

Shape: phased execution, one phase at a time, hard stop + report after each, no proceeding past a failure.

## What to include

**Opening line:** one action sentence — implement X with checkpointed delivery.

**Canonical docs block:** plan file + ADR/source of truth. Paths from selected plan source + session context. Label it "must follow."

**Context resume:** current verdict + known blockers as a flat list. No history. Do not re-derive.

**Non-negotiable constraints block:** hard rules — one phase at a time, stop and report after each, no done claim without tests for that phase, no destructive actions without asking, no unrelated refactors.

**Phase plan:** each phase gets:
- name and scope (one line)
- concrete actions to implement
- minimum tests required
- checkpoint output required (diff summary, tests run + result, risks)
- commit message

Phase 0 is always: read docs, print current state, map files to requirements. No code changes.
