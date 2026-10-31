---
title: "Playwright References Index"
status: validated
confidence: medium
last_tested: 2026-07-31
scope: personal
tooling:
  - "repo-process/v1"
  - "playwright"
tags:
  - references
  - playwright
  - qa
  - testing
owner: "@emb715"
---

# Playwright References

Canonical source URLs for Playwright and the web testing stack. Satisfies the pre-flight gate in `docs/standards/artifact-structure.md` ("Experiment dependency rule") for [`tools/e2e-web/`](../../../tools/e2e-web/), and grounds the web adapter in [`skills/test-authoring/`](../../../skills/test-authoring/).

## Sources

| Resource | URL |
|---|---|
| Official repo | https://github.com/microsoft/playwright |
| SDK repo | https://github.com/microsoft/playwright (`@playwright/test` is published from this repo) |
| Specification | n/a — no external spec; the test runner API is the contract |
| Docs | https://playwright.dev |
| Quickstart | https://playwright.dev/docs/intro |
| Test API | https://playwright.dev/docs/api/class-test |
| Locators | https://playwright.dev/docs/locators |
| Reporters (JSON output) | https://playwright.dev/docs/test-reporters |
| CI guidance | https://playwright.dev/docs/ci |
| Auth / storageState | https://playwright.dev/docs/auth |

### Supporting packages

| Resource | URL |
|---|---|
| axe accessibility integration | https://github.com/dequelabs/axe-core-npm |
| React Testing Library | https://github.com/testing-library/react-testing-library |
| React Native Testing Library | https://github.com/callstack/react-native-testing-library |
| MSW (network mocking) | https://mswjs.io |
| MSW repo | https://github.com/mswjs/msw |

## Scaffolding reference

```bash
# new project scaffold (interactive)
npm init playwright@latest

# add to an existing project
npm i -D @playwright/test
npx playwright install chromium      # skip if a browser is pre-installed — see below

# run
npx playwright test
npx playwright test --reporter=json
```

Accessibility add-on:

```bash
npm i -D @axe-core/playwright
```

## Verified versions

Resolved from the npm registry on 2026-07-31 (the registry is reachable from this environment; `playwright.dev` and `github.com` are not — see Verification status):

| Package | Version | Homepage | Repository |
|---|---|---|---|
| `playwright` | 1.62.1 | https://playwright.dev | github.com/microsoft/playwright |
| `@playwright/test` | 1.62.1 | https://playwright.dev | github.com/microsoft/playwright |
| `@axe-core/playwright` | 4.12.1 | github.com/dequelabs/axe-core-npm | github.com/dequelabs/axe-core-npm |
| `@testing-library/react` | 16.3.2 | — | github.com/testing-library/react-testing-library |
| `@testing-library/react-native` | 14.0.1 | https://oss.callstack.com/react-native-testing-library | github.com/callstack/react-native-testing-library |
| `msw` | 2.15.0 | https://mswjs.io | github.com/mswjs/msw |

## Environment note — pre-installed browsers

Some environments ship Chromium pre-installed and Playwright pre-configured:

- `PLAYWRIGHT_BROWSERS_PATH=<path to the browsers>`
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`

**Do not run `playwright install` in such an environment.** If a project pins a Playwright version whose bundled browser build differs from the pre-installed one, launch with `executablePath` pointing at the pre-installed Chromium rather than downloading.

Where this holds, [`tools/e2e-web/`](../../../tools/e2e-web/) runs with no install step, which is the main reason the web QA line is cheaper to stand up than the React Native one.

## Verification status

Package names, versions, homepages, and repository URLs in the table above were resolved directly from the npm registry on 2026-07-31 and are authoritative.

The documentation URLs (`playwright.dev/*`, `github.com/*`) were **not** verified when this was written. They are recorded from prior knowledge and follow Playwright's stable, long-lived docs URL scheme. Spot-check them from an unrestricted network before relying on a deep link; the root (`https://playwright.dev`) is confirmed by the registry `homepage` field.
