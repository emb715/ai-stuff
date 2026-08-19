<!--
  Bug Report Template — copy and fill.
  Copy the scaffold block below into your issue tracker and fill every field.
  A field that cannot be filled is itself information — state why it is missing
  rather than omitting it silently.
  See docs/notes/bug-reporting.md for severity definitions, reproduction
  discipline, and QA dashboard principles.
-->

# Bug Report

```text
Summary: [Area] specific behavior + condition
         Area + what happens + under what condition. Searchable.
         No "doesn't work", no "is broken". Name the component and the failure.

Environment: prod / staging build <version> / browser + OS / test account
             Be specific enough that a second person can match the exact runtime.

Steps to Reproduce:
  1. <ordered, atomic, no assumptions about prior state>
  2. <include data values, account IDs, exact inputs>
  3. <end on the action that triggers the failure>

Expected: <what should have happened, stated against the spec or accepted behavior>
Actual:   <what did happen, including timing, error text, and side effects like duplicate charges>
Evidence: screenshots, HAR file, console errors, video for timing issues, logs
Severity: S1 | S2 | S3 | S4  (see table below — set by reporter, confirmed in triage)
Priority: set in triage, not by the reporter
Reproduction: 3/3 | 2/5 flaky | 1/1  (state the rate; "sometimes" is not a rate)
Links: blocks / is-blocked-by, duplicate-of, relates-to the story or PR it broke or fixes
```

## Severity quick reference

| Severity | Impact | Examples |
|---|---|---|
| S1 | Data loss, security breach, total outage, unrecoverable state | Payment charged with no order; auth bypass; prod database writeable by anonymous |
| S2 | Major function broken, no workaround, blocks release | Checkout fails for all users; search returns no results; cannot create account |
| S3 | Function broken with workaround, or non-critical path impaired | Sort resets to default on page 2; export to CSV drops a column; one locale shows raw keys |
| S4 | Cosmetic, spelling, layout, polish | Misaligned badge; typo in empty state; color contrast below WCAG on one button |

<!-- See docs/notes/bug-reporting.md for severity definitions, reproduction discipline, and QA dashboard principles -->