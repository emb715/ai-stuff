# Web adapter — test-authoring

Maps the four layers in `SKILL.md` onto concrete web tooling. Load only after the behavior list and layer assignment exist.

## Layer → tool

| Layer | Tool | Location |
|---|---|---|
| `unit` | Vitest (or Jest) | `src/**/*.test.ts` beside the source |
| `component` | React Testing Library + Vitest, jsdom | `src/**/*.test.tsx` beside the component |
| `flow` | Playwright | `e2e/*.spec.ts` |
| `contract` | Vitest + MSW, or schema assertion | `src/**/*.contract.test.ts` |

Detect what the repo already uses before introducing anything. Check `package.json` scripts and devDependencies, and look for `vitest.config.*`, `jest.config.*`, `playwright.config.*`. **Match the existing choice even if you would have picked differently.** Introducing a second runner is a bigger cost than any API preference.

## Component layer — React Testing Library

Query priority, highest to lowest. Go down only when the level above genuinely does not apply:

1. `getByRole(role, { name })` — how assistive tech and users find controls
2. `getByLabelText` — form fields
3. `getByPlaceholderText`, `getByText`, `getByDisplayValue`
4. `getByTestId` — last resort, and a signal the markup lacks an accessible name

Using role + accessible name means an a11y regression breaks the test. That coupling is desirable — keep it.

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// B3: the Save button is disabled while the save is in flight
test('disables Save while the save is in flight', async () => {
  const user = userEvent.setup()
  render(<ProfileForm onSave={() => new Promise(() => {})} />)

  await user.click(screen.getByRole('button', { name: /save/i }))

  expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
})
```

Rules specific to this layer:

- Use `userEvent`, not `fireEvent`. `fireEvent` dispatches a single synthetic event; `userEvent` reproduces the full sequence a real interaction generates (pointer, focus, keyboard), which is what the component actually receives in production.
- `findBy*` for anything asynchronous. Never `waitFor` around a fixed delay.
- Assert absence with `queryBy*` + `toBeNull()`. `getBy*` throws before your assertion runs.
- Render the real component with real children. Mock only what crosses a process boundary — network, time, randomness, storage.
- Do not assert on props passed to a mocked child. That tests your wiring of the mock.

## Contract layer — MSW

Mock at the network boundary, not at the module boundary. Mocking `fetch` or your API client module means a change to the real request shape leaves the tests green.

```ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.post('/api/profile', async ({ request }) => {
    const body = await request.json()
    // B7: the client sends the trimmed display name
    expect(body).toMatchObject({ displayName: 'Ada Lovelace' })
    return HttpResponse.json({ ok: true })
  }),
)
```

Assert on the outgoing request shape, not only the response handling. Half of every contract is what you send.

## Flow layer — Playwright

Reserve for journeys that no cheaper layer can falsify. Each flow test needs a named risk in the flow budget.

```ts
import { test, expect } from '@playwright/test'

// B12: a signed-in user can complete checkout from a populated cart
test('completes checkout from a populated cart', async ({ page }) => {
  await page.goto('/cart')
  await page.getByRole('button', { name: 'Checkout' }).click()
  await page.getByLabel('Card number').fill('4242424242424242')
  await page.getByRole('button', { name: 'Pay' }).click()

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
})
```

- Same query priority as RTL — `getByRole` first. Playwright's locators are auto-waiting, so `expect(locator).toBeVisible()` retries; never add a manual sleep.
- One journey per test. Do not chain unrelated journeys to "save setup time" — a failure in step 1 then hides steps 2–5.
- Authenticate via `storageState` set up once, not by driving the login form in every test. Drive the login form only in the test whose behavior *is* logging in.
- Keep flow tests independent of each other's data. Seed per test or use unique identifiers.

### Environment note

Claude Code web sessions ship Chromium already installed with `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` and `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`. Do **not** run `playwright install` there. If the project pins a Playwright version whose bundled browser differs, launch with `executablePath: '/opt/pw-browsers/chromium'` rather than downloading.

## Accessibility

Once flow tests exist, a11y assertions are nearly free and produce objective, anchorable findings.

```ts
import AxeBuilder from '@axe-core/playwright'

test('checkout page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/checkout')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')).toEqual([])
})
```

Gate on `serious` and `critical` only. Gating on every violation makes the suite unpassable on a real codebase and the gate gets disabled within a week — a disabled gate is worth less than a narrow one.

## Visual

Build last, or not at all. `expect(page).toHaveScreenshot()` is high-maintenance and generates false positives on font rendering and animation. If adopted: pin the browser version, disable animations (`animations: 'disabled'`), mask dynamic regions, and scope to a component rather than a full page.

## Mutation check (Step 4) on web

Fast breaks that should turn exactly one test red:

- Invert a boolean guard (`disabled={isSaving}` → `disabled={!isSaving}`)
- Change a user-visible string the spec pins
- Remove an `await` before an assertion-relevant action
- Return `[]` from the data hook to check the empty state test
- Drop a required field from the outgoing request body to check the contract test
