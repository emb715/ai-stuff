# type: readiness-check

Generate a prompt that evaluates whether a plan/spec is implementation-ready.

Output contract (inside one fenced markdown code block):

1. **Scope + source docs**
   - Primary document
   - Supporting references

2. **Completeness checks**
   - Requirements are atomic and testable
   - Acceptance criteria exist
   - Test approach exists

3. **Ambiguity/conflict checks**
   - Missing definitions
   - Contradictions across sections/docs
   - Unresolved product forks

4. **Risk/blocker classification**
   - P0/P1/P2 unknowns
   - Dependency/ownership blockers

5. **Decision outcome**
   - Ready
   - Blocked
   - Needs revision

6. **Unblock path**
   - Minimal required edits/questions to reach ready
   - Explicit user decisions needed

Constraint:
- Do not invent missing requirements; surface gaps explicitly.
