# type: review

Generate a prompt for adversarial code review on git changes. Cross-references git reality against claims, validates implementation, and produces categorized findings with a fix menu.

Output contract (inside one fenced markdown code block):

1. **Discover changes**
   - Run `git status --porcelain`, `git diff --name-only`, `git diff --cached --name-only`
   - Compile complete changed-file list
   - Exclude: node_modules/, dist/, build/, IDE config folders
   - If a task list or AC list was provided, note it for claim validation

2. **Build attack plan — four tracks**
   - **Claim validation** (if claims provided): verify each claimed-done item against actual code; mark IMPLEMENTED / PARTIAL / MISSING
   - **Git-vs-claims discrepancy**: files in git not in claims, files claimed but no git evidence
   - **Code quality**: security, performance, error handling, maintainability — per changed file
   - **Test quality**: real assertions vs placeholders, edge cases, coverage of changed behavior

3. **Execute the review — adversarial**
   - Assume the code is lying. Treat every completed task as unproven.
   - Every finding cites file:line. No vague findings.
   - Minimum 3 findings. If fewer found, re-examine: edge cases, null handling, architecture violations, missing tests, integration issues.
   - For each claimed-done item: search for evidence. MISSING or PARTIAL → P1.
   - Files claimed changed but no git evidence → P1. Files changed but undocumented → P2.

4. **Severity model**
   - P0 — critical, block immediately (tasks marked done but not implemented, security vulnerabilities)
   - P1 — must fix before merge (missing AC implementation, false claims, measurable performance problems)
   - P2 — should fix (documentation gaps, poor test quality, maintainability)
   - P3 — low, nice to fix (style, naming, minor structure)

5. **Required output format**

   ```
   CODE REVIEW FINDINGS

   Changes reviewed: [N files]
   Git-vs-claim discrepancies: [N]
   Issues: [X] P0, [Y] P1, [Z] P2, [W] P3

   ## P0
   [finding — file:line — why — suggested fix]

   ## P1
   [finding — file:line — why — suggested fix]

   ## P2
   [finding — file:line — why]

   ## P3
   [finding — file:line]
   ```

6. **Fix menu**

   After findings, present:
   ```
   1. Fix them — update code and tests for all P0 and P1 issues
   2. Create action items — list as tasks for later
   3. Deep dive — details on a specific issue
   ```

7. **Decision rule**
   - Pass when no P0/P1 findings remain
   - Otherwise blocked with prioritized fix list
   - P0/P1 every finding must have a suggested fix

Constraint:
- Read first, review second. No findings before the full diff is read.
- Evidence required for every finding. No speculative architecture rewrites.
- If fewer than 3 findings after full review: re-examine before declaring clean. State explicitly what was checked.
