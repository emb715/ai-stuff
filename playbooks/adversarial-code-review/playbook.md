Perform an adversarial code review. Find what's wrong or missing. Challenge every claim. No lazy "looks good" reviews — find a minimum of 3 specific issues per review.

## Trigger

User says "run code review", "review this code", or you have a git diff or set of changed files that need quality validation before merge.

## Preconditions

- A git repository with changes to review (uncommitted, staged, or a branch diff)
- Optionally: a task description or acceptance criteria list to validate against
- The changes are in application source code, not config/tooling (exclude node_modules, dist, build, IDE config folders)

## Principles

- **Adversarial by default.** Assume the code is lying. Treat every completed task as unproven. Your job is to find problems, not confirm that things work.
- **Evidence required.** Every finding cites a specific file and line. No vague "this could be better" — say what, where, and why.
- **Minimum 3 findings.** If you found fewer than 3 issues, you didn't look hard enough. Re-examine: edge cases, null handling, architecture violations, missing tests, integration issues.
- **Git reality over claims.** If a task list or PR description says something is done, verify against the actual code. Claims ≠ implementation.
- **Fix or flag.** Present findings with a clear menu: fix them, create action items, or deep-dive into specifics.

## Step 1 — Discover changes

Identify what changed:

```
git status --porcelain     # uncommitted changes
git diff --name-only        # modified files
git diff --cached --name-only  # staged files
git diff <base>..<head> --name-only  # branch diff
```

Compile the complete list of changed files. If the user provided a task list, acceptance criteria, or PR description, note any file claims to cross-reference.

Exclude from review: `node_modules/`, `dist/`, `build/`, IDE config (`.cursor/`, `.vscode/`, `.claude/`), lock files.

## Step 2 — Build the attack plan

Create a review plan with four tracks:

1. **Claim validation** — if a task list or AC list was provided, verify each claimed-done item against actual code. Mark: IMPLEMENTED / PARTIAL / MISSING.
2. **Git-vs-claims discrepancy** — files in git but not in any claim list (undocumented changes), files claimed but no git changes (false claims).
3. **Code quality** — for each changed file: security (injection, missing validation, auth), performance (N+1, inefficient loops, missing caching), error handling (missing catch, poor messages), maintainability (complexity, magic numbers, naming).
4. **Test quality** — real assertions vs placeholder tests. Are edge cases covered? Do tests actually test the changed behavior?

## Step 3 — Execute the review

### Claim validation

For each task or acceptance criterion claimed as done:
1. Read the requirement
2. Search implementation files for evidence
3. Determine: IMPLEMENTED, PARTIAL, or MISSING
4. If MISSING or PARTIAL → **P1 finding**

### Git-vs-claims discrepancy

- Files changed in git but not documented → **P2** (incomplete documentation)
- Files claimed changed but no git evidence → **P1** (false claims)
- Uncommitted changes not documented → **P2** (transparency issue)

### Code quality deep dive

For each file in the review list:
1. **Security** — injection risks, missing input validation, auth bypass, exposed secrets
2. **Performance** — N+1 queries, inefficient loops, missing indexes, unnecessary re-renders
3. **Error handling** — missing try/catch, swallowed errors, poor error messages, missing edge cases
4. **Code quality** — high cyclomatic complexity, magic numbers, poor naming, dead code
5. **Test quality** — are tests real assertions or placeholders? Do they cover the happy path AND edge cases?

### Minimum findings check

If total issues found < 3, re-examine:
- Edge cases and null/undefined handling
- Architecture violations (layer leaks, circular deps)
- Documentation gaps
- Integration issues
- Dependency problems

Find at least 3 more specific, actionable issues.

## Step 4 — Present findings

```
CODE REVIEW FINDINGS

Changes reviewed: [N files]
Git-vs-claim discrepancies: [N]
Issues found: [X] P0, [Y] P1, [Z] P2, [W] P3

## P0 — critical (block immediately)
- [Tasks marked done but not implemented]
- [Acceptance criteria not implemented]
- [Security vulnerabilities]

## P1 — high (must fix before merge)
- [Files claimed but no git evidence]
- [Missing AC implementation]
- [Performance problems with measurable impact]

## P2 — medium (should fix)
- [Files changed but not documented]
- [Poor test coverage/quality]
- [Code maintainability issues]

## P3 — low (nice to fix)
- [Code style improvements]
- [Documentation gaps]
- [Minor naming or structure issues]
```

Each finding includes: file:line, what's wrong, why it matters, suggested fix.

Pass when no P0/P1 findings remain. Otherwise blocked.

## Step 5 — Fix menu

```
What should I do with these issues?

1. Fix them — I'll update the code and tests for all P0 and P1 issues
2. Create action items — I'll list them as tasks for later
3. Deep dive — show me details on a specific issue
```

### If fix

- Fix all P0 and P1 issues
- Add/update tests as needed
- Note: P2/P3 issues are reported but not auto-fixed unless user asks

### If action items

- Format each as: `[SEVERITY] Description [file:line]`

### If deep dive

- Show detailed explanation with code examples and the specific problem
- Return to fix decision after

## Verification

- Every finding has a file:line reference
- Every P0 and P1 finding has a suggested fix
- Pass verdict stated explicitly (no P0/P1 = pass; any P0/P1 = blocked)
- Minimum 3 issues found (or explicit statement that the code is genuinely clean after thorough review)
- Claim validation completed (if claims were provided)
- Test quality assessed, not just code quality
- No "looks good" without evidence

## Rollback / Fallback

- If no changes detected in git → ask user to clarify what to review (specific files, a PR URL, a commit range)
- If changes are too large for a single review → scope to the most critical files first, note that full review requires multiple passes
- If the code is genuinely clean after thorough review → state that explicitly with evidence of what was checked, rather than manufacturing issues to meet the minimum
- If claim list is not provided → skip claim validation, focus on code quality and test quality tracks

## References

- Based on adversarial code review workflow — rewritten standalone, no framework dependencies
- Pair with `docs/references/change-impact-checklist.md` when review findings require project-level change assessment
