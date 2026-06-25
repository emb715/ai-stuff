# strict — commit-by-commit checkpoint prompt

Shape: phased execution, one phase at a time, hard stop + report after each, no proceeding past a failure.

## What to include

**Opening line:** one action sentence — implement X with checkpointed delivery.

**Canonical docs block:** plan file + ADR/source of truth. Paths from session context. Label it "must follow."

**Context resume:** current verdict + known blockers as a flat list. No history. Do not re-derive.

**Non-negotiable constraints block:** the hard rules — one phase at a time, stop and report after each, no done claim without tests for that phase, no destructive actions without asking, no unrelated refactors.

**Phase plan:** each phase gets:
- name and scope (one line)
- concrete actions to implement
- minimum tests required (exact file paths where known, or description of what must be covered)
- checkpoint output required (diff summary, tests run + result, risks)
- commit message

Phase 0 is always: read the docs, print current state, map files to requirements. No code changes.

**Required test command list:** exact commands per phase. Smallest scope first, expand if coupling detected. If a path might differ, say so and tell the agent to resolve and state the substitution.

**Reporting format:** after each phase — phase status PASS/FAIL, files changed, tests executed (exact commands), outcome, go/no-go for next phase. If FAIL: root cause + fix plan, do not proceed.

**Closing:** "Start now!" or equivalent — the fresh session should not wait for further instruction.
