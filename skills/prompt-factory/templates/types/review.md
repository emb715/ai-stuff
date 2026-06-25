# type: review

Generate a prompt for structured quality review on existing changes/artifacts.

Output contract (inside one fenced markdown code block):

1. **Review scope**
   - Target: diff, files, docs, or PR context
   - Boundaries: what is explicitly in/out

2. **Review criteria**
   - Correctness
   - Scope adherence
   - Maintainability/clarity
   - Risk/safety

3. **Evidence requirements**
   - Every finding cites file path + line(s) where possible
   - No unsupported claims

4. **Severity model**
   - P0 critical
   - P1 high
   - P2 medium
   - P3 low

5. **Required output format**
   - Finding
   - Severity
   - Evidence
   - Why it matters
   - Proposed fix

6. **Decision rule**
   - Pass only when no P0/P1 findings remain
   - Otherwise blocked with prioritized fix list

Constraint:
- Review is read-first and evidence-driven; no speculative architecture rewrites.
