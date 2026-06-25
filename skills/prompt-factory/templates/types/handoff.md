# type: handoff

Generate a transfer prompt so a fresh session can continue work without re-investigation.

Output contract (inside one fenced markdown code block):

1. **Objective + phase**
   - What the receiving session is taking over
   - Current phase (planning/implementation/verification/etc.)

2. **Status snapshot**
   - Done
   - In progress
   - Not started

3. **Canonical references**
   - Plan/spec path(s)
   - Key files/modules
   - Related decisions (ADR/notes)

4. **Locked decisions**
   - Decision list with short rationale
   - Explicit “do not re-open unless required” markers

5. **Open blockers / assumptions**
   - Blocking items
   - Unknowns that require user decision

6. **Next executable step**
   - First concrete action to run immediately

7. **Validation expectations**
   - Required checks/tests before done claim

8. **Return/report contract**
   - What to report back (diff summary, checks, outcome, remaining risks)

Constraint:
- Handoff packages continuity; it does not invent a new product direction.
