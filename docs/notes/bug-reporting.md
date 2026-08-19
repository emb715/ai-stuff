---
title: "Bug Reporting Discipline"
status: draft
confidence: high
last_tested: 2026-08-04
scope: universal
tooling:
  - "any-issue-tracker"
tags:
  - qa
  - bug-reporting
  - testing
  - guidance
owner: "@emb715"
---

# Bug Reporting Discipline

See `templates/bug-report-template.md` for the copy-paste scaffold.

## Context / Problem

A bug is a communication artifact. Its job is to get fixed fast; the form is optimized for the developer's first 60 seconds of reading. Bugs reported as "doesn't work" with no environment, no reproduction, and no evidence burn triage time, duplicate work, and silent fixes that miss the real cause. A standard template removes that variance: every reporter produces the same shape, every developer starts from the same inputs, and metrics across bugs become comparable rather than fictional.

## Scope

Covers:
- Severity vs priority definitions (impact vs fix order, set by different people)
- Reproduction discipline (one defect per issue, reproduction rate stated, logs as text not images)
- Generalized bug lifecycle states (concept-level, not tracker-specific)
- QA metrics principle: dashboards answer questions, every gadget maps to a decision

Does not cover:
- Triage process (cadence, roles, routing) — tracker- and team-specific
- Tracker-specific automation (REST APIs, webhooks, vendor SDKs)
- Hardcoded workflow state names — those belong to the tracker, not the standard

## Procedure / Steps

### Severity vs Priority

Severity and priority are independent axes. Severity is impact; priority is fix order. A cosmetic bug on the homepage during launch week is S4 severity but may be High priority. Conflating them produces metrics that measure noise.

| Severity | Impact | Examples |
|---|---|---|
| S1 | Data loss, security breach, total outage, unrecoverable state | Payment charged with no order; auth bypass; prod database writeable by anonymous |
| S2 | Major function broken, no workaround, blocks release | Checkout fails for all users; search returns no results; cannot create account |
| S3 | Function broken with workaround, or non-critical path impaired | Sort resets to default on page 2; export to CSV drops a column; one locale shows raw keys |
| S4 | Cosmetic, spelling, layout, polish | Misaligned badge; typo in empty state; color contrast below WCAG on one button |

Priority (fix order) is set in triage, against severity plus release context plus customer impact. The reporter does not set priority. Defining S1-S4 in writing and triaging against the written definition is what keeps severity honest; without it, severity tracks reporter volume.

### Reproduction discipline

1. **One defect per issue.** A bug with three failures cannot be triaged, assigned, or closed independently. Split it.
2. **State the reproduction rate.** `3/3`, `2/5 flaky`, `1/1`. "Sometimes" or "intermittent" without a denominator is not a rate. Flaky bugs need the rate even more than deterministic ones — the rate is the signal for whether the fix is working.
3. **Logs as attachments or code blocks, never screenshots of text.** Text in an image cannot be searched, copied, or diffed. A screenshot of a log entry is an anti-pattern. Paste the log as a code block or attach the file.
4. **Severity is set by the reporter, confirmed in triage.** Priority is set in triage only. A loud reporter does not raise severity; the definition does.
5. **"Cannot Reproduce" requires an environment comparison.** Before closing as cannot-reproduce, capture the reporter's environment and compare it to the reproducer's. Different OS, build, or account is the most common cause of false cannot-reproduce.

### Bug lifecycle states (concept, not tracker-specific)

A bug moves through a lifecycle. The state names belong to the tracker; the concepts are universal:

- **Reported** — the bug exists in the tracker with the template fields filled.
- **Triaged** — severity and priority set, owner assigned, duplicates linked.
- **In progress** — someone is working the fix.
- **Ready for verification** — fix is on a deployed build, not just in a branch.
- **Verified** — a second party reproduced the original, confirmed the fix, confirmed no regression.
- **Closed** — done. If closed without verification, a resolution is required: duplicate, cannot-reproduce, or won't-fix. Resolutions are tracked for metrics.
- **Reopened** — verification failed or the bug recurred. Reopen requires a comment with new evidence.

The rule that keeps the lifecycle honest: only the verifier moves a bug to verified, on a deployed build. Code review is not verification. Reopened counts as a fix-quality signal, not a fresh bug.

### QA metrics principle — dashboards that earn their space

Every metric on a QA dashboard maps to a decision someone makes weekly. A gadget that does not feed a decision is decoration. Boards manage flow; dashboards answer trend questions. They are not the same surface.

The test for any gadget: name the decision it feeds, and name who makes it. If neither answers, remove the gadget.

Decisions a QA dashboard should support, independent of tracker:

| Decision | Metric behind it |
|---|---|
| Is triage keeping up? | Open bugs by severity, age of untriaged bugs |
| Are we sinking or draining? | Bugs created vs resolved, rolling 30 days |
| Go/no-go on a release | Unresolved S1/S2 against the release, by fix version |
| Is fix quality improving? | Reopened bugs in last 30 days |
| Where are the testing gaps? | Escape rate — bugs found in prod vs found before, per quarter |
| What needs unblocking this week | Bugs in progress untouched > 14 days |

Metrics on states that teams use inconsistently are fiction. If "in review" means three different things to three teams, no metric that touches "in review" is trustworthy. Fix workflow semantics before trusting numbers derived from them.

## Evidence / Results

Extracted from thetestingacademy jira-qa-workflows skill (MIT, v1.0.0). The source skill encodes professional QA practice for Jira; the template, severity definitions, reproduction rules, and dashboard principle were assessed as accurate against QA practice on 2026-08-04 and generalized from Jira-specific to tool-agnostic. No JQL, REST API, or Jira workflow state names were carried over — they are vendor-locked and rot fast.

## Failure Modes / Boundaries

- **Security vulnerabilities need CVSS, not S1-S4.** A security issue has a scoring system (CVSS) that captures exploitability, impact, and complexity. S1-S4 captures user impact only. Use the security process, not this template, for vulnerabilities.
- **Feature requests are not bugs.** A missing feature is a request, not a defect. Filing it as a bug inflates escape rates and corrupts the bug dashboard. Route it to the product request process.
- **Crash reports from production monitoring have different evidence needs.** A stack trace, a session ID, and a correlation ID are the evidence, not a reproduction script. The template's "Steps to Reproduce" may be replaced by "Trigger: <event or cohort>" for server-side crashes with no user-facing repro.
- **Flaky tests are bugs but need a rate and a failure signature.** A flaky test bug without the reproduction rate and the failing assertion text cannot be triaged against other flaky tests. Require both.
- **The template does not define triage.** Triage cadence, roles, and routing are team-specific. This standard defines what a bug looks like when it enters triage, not how triage runs.
- **Severity drifts without a written definition.** If S1-S4 are not written down and enforced in triage, severity tracks reporter volume, not impact. The table above is the definition; reference it in triage.

## Sources

Extracted and adapted from thetestingacademy jira-qa-workflows skill (MIT, v1.0.0). Generalized from Jira-specific to tool-agnostic.