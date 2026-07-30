---
title: "Adversarial Code Review"
status: validated
confidence: low
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - code-review
  - quality
  - adversarial
owner: "@emb715"
---

# Purpose

Performs an adversarial code review on git changes. Cross-references git reality against task/AC claims, validates implementation, checks code and test quality, and presents categorized findings with a fix menu. Forces thoroughness with a minimum-3-findings rule. No lazy "looks good" reviews.

# When to use

When the user says "run code review" or "review this code", or when you have a git diff or set of changed files that need quality validation before merge. Works on any git repository — uncommitted changes, staged changes, or branch diffs.

Not for: reviewing entire codebases (scope to a diff), reviewing config/tooling files, or rubber-stamping changes.

Dual role: when used inside [implementation-orchestration](../implementation-orchestration/), the orchestration playbook invokes this as its review phase. Run standalone when reviewing code implemented outside this vault (hand-written, another tool, a prior session).

# Preconditions

- A git repository with changes to review
- Optionally: a task description or acceptance criteria list to validate against
- Changes are in application source code

# Inputs

None — copy and run as-is. The agent reads git state to discover what changed. If the user provides a task list or AC list, the agent cross-references claims against actual code.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

**Status note:** `validated` reflects that the source workflow was used in production in an external framework. This standalone rewrite has not been run as a playbook in this repo. `confidence: low` is the honest signal. The four-track review plan, git-vs-claims mechanic, and minimum-findings rule are structurally sound but untested in this form.

_TODO: Document at least one real standalone run — what was reviewed, how many findings, severity distribution, whether findings were accurate, what was fixed vs flagged. Quantitative preferred (e.g. "reviewed 12-file diff, found 2 P0, 4 P2, 3 P3; 1 false claim caught, 5 issues fixed"). Replace this block when done._

# Failure Modes / Boundaries

- The minimum-3-findings rule can force manufactured issues on genuinely clean code. If the code is clean after thorough review, the playbook says to state that explicitly with evidence — but weaker models may still invent problems. Review findings critically before acting.
- Git-vs-claims discrepancy requires a claim list (task list, PR description, AC list). Without one, that track is skipped and the review relies on code quality and test quality alone.
- Large diffs may exceed the agent's context window. The playbook suggests scoping to critical files, but the agent may not always identify the right critical files without guidance.
- Test quality assessment only works if tests are in the diff. If tests are in a separate commit or not written, test quality can't be validated — flag this as a finding itself.
- The fix menu auto-fixes P0 and P1 issues. Review the proposed fixes before accepting — automated fixes can introduce new issues.

# Related artifacts

- [`docs/references/change-impact-checklist.md`](../../docs/references/change-impact-checklist.md) — use when review findings reveal a need for project-level change assessment
- [`playbooks/quick-spec/`](../quick-spec/) — pair with code review to ensure specs are implementation-ready before development starts
