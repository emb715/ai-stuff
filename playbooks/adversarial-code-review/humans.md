# humans.md — adversarial-code-review

## What this is

A standalone playbook for adversarial code review on git changes. Finds problems, validates claims against reality, and presents categorized findings with a fix menu. Forces thoroughness with a minimum-findings rule. Rewritten from a framework-specific workflow with all framework dependencies removed.

## Why it works

Four structural choices carry most of the value:

**Adversarial framing.** The reviewer assumes the code is lying. Every completed task is unproven. Every claim is verified against actual implementation. This is the opposite of a "looks good" rubber-stamp review — it's designed to find what's wrong, not confirm what's right.

**Git reality vs claims.** The review cross-references what git says changed against what the developer claims changed. Files in git but not documented, files claimed but not actually changed — these discrepancies catch both incomplete documentation and false claims. This is the most unique mechanic in the playbook.

**Minimum 3 findings.** Without a floor, reviews devolve into "looks good" when the reviewer doesn't look hard enough. The minimum forces thoroughness. The escape hatch is explicit: if the code is genuinely clean after thorough review, state that with evidence rather than manufacturing issues.

**Four-track review plan.** Claim validation, git-vs-claims, code quality, test quality. Each track catches different classes of problems. Skipping any track leaves a blind spot — test quality in particular is often skipped in informal reviews.

## Design decisions

- **No story-file dependency.** The original workflow parsed a specific story file format to extract tasks, ACs, and file lists. The standalone version accepts any claim list (task list, PR description, AC list) or none. Without a claim list, claim validation is skipped and the review focuses on code and test quality.
- **No sprint-status syncing.** The original updated a sprint-status.yaml file based on review outcome. Standalone version has no tracking system. The review produces findings; what happens next is the user's decision.
- **No workflow.xml engine.** The original used an XML-based workflow execution engine with step tags and check conditions. The playbook is plain markdown — the agent reads it and executes it.
- **Severity taxonomy: P0/P1/P2/P3.** P0 (critical, block immediately) for tasks marked done but not implemented and security vulnerabilities. P1 (must fix before merge) for missing AC implementation, false claims, performance problems with measurable impact. P2 (should fix) for documentation gaps, poor tests, maintainability issues. P3 (nice to fix) for style and minor naming issues. Pass when no P0/P1 remain — matching the prompt-factory review template's standard. This is the repo-wide severity model.
- **Auto-fix limited to P0 and P1.** P2/P3 are reported but not auto-fixed. This prevents the review from making stylistic changes the user didn't ask for while still fixing what matters.

## Origin

Rewritten from a code review workflow. The original was a 227-line XML file using a workflow execution engine, coupled to story files, sprint-status tracking, and project context loading. The rewrite is ~100 lines of plain markdown with no framework dependencies.

Kept: the adversarial framing, git-vs-claims discrepancy detection, claim validation (IMPLEMENTED/PARTIAL/MISSING), four-track review plan, minimum-findings rule, fix menu. Cut: story file parsing, sprint-status syncing, workflow.xml engine, config loading, file-list-from-story extraction. Severity model aligned to P0/P1/P2/P3 to match the repo-wide standard used in the prompt-factory review template.

## Maintenance

- **If the minimum-findings rule produces false positives** on clean code, the model is manufacturing issues. Strengthen the escape hatch in the session: "If the code is genuinely clean after checking all four tracks, state that explicitly with evidence of what was reviewed."
- **If claim validation is skipped frequently** because no claim list is provided, consider requiring a task description or PR description as a precondition for full review. Without claims, the review loses its most powerful track.
- **If test quality findings are rare**, the agent may not be reading test files. Ensure tests in the diff are included in the review file list. If no tests are in the diff, that itself is a finding.
- **Promote to `status: vetted`** only after 2-3 real runs with documented outcomes in the README Evidence section and passing the vetting rubric. The artifact stays in `playbooks/` — `vetted` is a frontmatter status, not a folder. Current state: based on externally-validated workflow, standalone rewrite not yet tested in this repo.
