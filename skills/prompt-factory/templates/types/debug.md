# type: debug

Generate a prompt focused on confirmed root-cause diagnosis and fix verification.

Output contract (inside one fenced markdown code block):

1. **Problem statement**
   - Symptom
   - Expected vs actual
   - Known error traces/logs

2. **Reproduction plan**
   - Repro steps and environment assumptions
   - Minimal reproducible path first

3. **Evidence-first diagnosis**
   - What data/logs/tests to inspect before code changes

4. **Hypothesis policy**
   - Rank candidate causes
   - Falsify quickly
   - No fix-before-cause confirmation

5. **Fix plan**
   - Tie change directly to confirmed cause
   - Smallest safe change first

6. **Verification**
   - Exact validation commands/tests
   - Regression guard checks

7. **Final report**
   - Confirmed root cause
   - Fix summary
   - Verification evidence
   - Residual risks

Constraint:
- Diagnose first; implementation follows only after cause confirmation.
