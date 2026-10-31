# React Native adapter — test-authoring

Maps the four layers in `SKILL.md` onto React Native tooling. Load only after the behavior list and layer assignment exist.

## The honest cost model

React Native inverts the web's economics. On web, the `flow` layer is expensive; on React Native it is *expensive and fragile* — it needs a simulator or a device, a built binary, and CI minutes measured in tens of minutes per run.

Consequence for layer assignment: push harder toward `component` than you would on web. A behavior that is borderline `component` / `flow` goes to `component` on React Native. Reserve `flow` for journeys where the failure would cost real money or lock users out — auth, purchase, permissions, data loss.

**Do not attempt broad end-to-end coverage on React Native.** A small, green, trusted flow suite covering four journeys is worth more than thirty flaky ones, because a flaky suite gets ignored and then disabled.

## Layer → tool

| Layer | Tool | Location |
|---|---|---|
| `unit` | Jest | `src/**/*.test.ts` |
| `component` | React Native Testing Library + Jest | `src/**/*.test.tsx` |
| `flow` | Maestro | `.maestro/*.yaml` |
| `contract` | Jest + MSW | `src/**/*.contract.test.ts` |

Check `package.json` and `jest.config.js` for the existing setup — `jest-expo` for Expo projects, `react-native` preset otherwise. Match what is there.

## Component layer — React Native Testing Library

RNTL is the workhorse. It runs in Jest with no simulator, so it works in CI and in a container.

Query priority:

1. `getByRole(role, { name })` — works with `accessibilityRole` + `accessibilityLabel`
2. `getByLabelText` — maps to `accessibilityLabel`
3. `getByText`, `getByPlaceholderText`
4. `getByTestId` — last resort

React Native markup carries less implicit semantics than HTML, so `getByRole` only works if the component sets `accessibilityRole`. When a query forces you down to `testID`, that is usually a real accessibility gap — record it as a spec/quality finding rather than silently reaching for `testID`.

```tsx
import { render, screen, userEvent } from '@testing-library/react-native'

// B4: tapping Retry re-issues the failed request
test('re-issues the failed request when Retry is tapped', async () => {
  const user = userEvent.setup()
  const load = jest.fn().mockRejectedValueOnce(new Error('offline'))
  render(<FeedScreen load={load} />)

  await user.press(await screen.findByRole('button', { name: 'Retry' }))

  expect(load).toHaveBeenCalledTimes(2)
})
```

Rules specific to this layer:

- Use `userEvent` (`press`, `type`) over `fireEvent` where available — same reasoning as web: it reproduces the full gesture sequence.
- `findBy*` for anything after an await boundary. Animations and `InteractionManager` callbacks make fixed delays especially unreliable here.
- Mock native modules at the module boundary with `jest.mock`, and only ones that genuinely cannot run in Jest (camera, biometrics, push). Over-mocking is the dominant failure mode in RN test suites — every mocked module is a place the real app can break with the suite green.
- Navigation: render the screen inside a real navigator with an in-memory state rather than mocking the navigation module. Mocked navigation makes "the user lands on the right screen" untestable, which is usually the behavior you cared about.

## Flow layer — Maestro

Maestro over Detox for a first flow suite: single binary, YAML flows, tolerant selectors that survive minor UI churn, and it works against Expo dev builds. Detox is faster and more precise but its setup and upgrade cost is high, and brittle flows are the specific failure this layer cannot afford.

```yaml
# .maestro/checkout.yaml
# B12: a signed-in user can complete checkout from a populated cart
appId: com.example.app
---
- launchApp:
    clearState: true
- runFlow: ../.maestro/subflows/sign-in.yaml
- tapOn: "Cart"
- tapOn: "Checkout"
- inputText: "4242424242424242"
- tapOn: "Pay"
- assertVisible: "Order confirmed"
```

- Extract shared setup (sign-in, seeding) into `subflows/` and `runFlow` them. Do not copy setup between flows.
- `clearState: true` on launch. A flow that depends on residue from a previous run is not a test.
- Prefer visible text in selectors; fall back to `id` when text is dynamic or localized.
- Keep each flow to one journey and under roughly twenty steps. Longer flows fail in the middle and tell you nothing about the end.
- Run flows against a dev build, not a release build, so the JS bundle matches the commit under test.

Verify the current Maestro command surface against its docs before wiring CI — the CLI moves faster than most tooling in this space. Canonical URLs are in `docs/references/maestro/README.md`.

## Contract layer

Same as web — MSW works under Jest in React Native. Assert the outgoing request shape, not just response handling.

Add one contract test per persisted-storage boundary (`AsyncStorage`, MMKV, SQLite): write, reload, read back. Storage-shape migrations are a top source of RN production breakage and are cheap to gate here.

## Mutation check (Step 4) on React Native

- Invert a boolean guard on a disabled/visible prop
- Change a user-visible string the spec pins
- Return an empty array from the data hook to check the empty state test
- Remove an `accessibilityLabel` to confirm the query is behavior-coupled, not `testID`-coupled
- Point a screen's navigation target at the wrong route to confirm the navigator test catches it

For Maestro flows, run the mutation check once against a locally broken build if feasible. If not, mark it skipped in the output and say why — an unverified flow test is exactly the kind of gate that passes forever.

## What this adapter does not cover

- Native module unit testing (Swift/Kotlin) — out of scope; test at the JS boundary and treat the native side as a contract.
- Device farms and OS-matrix coverage — an infrastructure decision, not a test-authoring one.
- Release-build-only behavior (Hermes optimizations, ProGuard stripping). Flows against a dev build cannot catch these; that risk belongs to the acceptance-verification stage against a real build.
