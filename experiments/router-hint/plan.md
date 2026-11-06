# Router hint, round 2: plan, committed before any run

Round 1 (`README.md`) ran 1 to 2 runs per cell. This round asks two questions: does the hint's effect hold at 3 runs per cell, and what does it cost on prompts written to sit between two routes, where a wrong hint is most likely.

## Conditions

| Condition | Router | Hint hook |
|---|---|---|
| B | `main` at `1089c30`, SKILL.md `6f0efe9d…` (the routing table) | off |
| D | same | on, `hint.mjs` unchanged from round 1 |

Round 1's B and D runs used the same SKILL.md hash and the same `hint.mjs`, so they are reused. Each round 1 cell is topped up to 3 runs per condition (activation cells get 1 more run, the rest 2 more). Constants as round 1: headless `claude -p`, one fresh process per run, auto-memory off, activation read from stream-json tool calls.

## New cells: between two routes

Ground truth from each target's README. Suffix: the router evals' `shared_prompt_suffix`.

| # | Prompt | Truth | The likely wrong route |
|---|---|---|---|
| N2 | "Here's the diff for my PR and the spec it implements. The preview deploy is up. I want to know if what's running actually matches the spec before I merge." | `acceptance-verification` (When to use: "CI-green and about to merge, and the acceptance criteria need checking against real behavior") | `adversarial-code-review` |
| N3 | "Our PRD for team billing is half-written and some of it is already partly built in the codebase. Get the doc to where a developer could implement the rest from it." | `loop-prd-readiness` (a planning doc with known gaps) | `loop-implementation-readiness` |
| N4 | "The release candidate is tagged and deployed to staging. This round I only want each acceptance criterion exercised on staging and a ship or no-ship call. No fixes yet." | `acceptance-verification` (When to use: "A release candidate is deployed to staging … decide whether it ships") | `review-release-candidate` |
| N5 | "Turn GitHub issue #51 into specs. Each spec will be implemented by one agent in a single session." | `issue-to-ready-specs` (spec paradigm, issue to specs) | `raa` or `issue-to-pr` |
| N6 | "We have three vendor options for our search backend and need to pick one this week." | `decision-making` (3+ options, no clear winner) | `brainstorming` or `product-brief` |
| N7 | "What's the difference between raa and quick-spec in this repo?" | silent: no router load, no hint (a question about the vault) | any route |

3 runs per new cell per condition.

## Runs

54 top-up runs plus 36 new-cell runs: 90 in all.

## Success criteria, fixed now

| # | Criterion | Consequence if missed |
|---|---|---|
| S1 | D routes correctly on at least as many positive runs as B, over all 3-run cells | The round 1 effect does not hold |
| S2 | D loads the router on at least as many positive runs as B | Same |
| S3 | On N2 to N6, every hinted run whose hint names a wrong route is counted; D's correct count is not below B's | A wrong hint misleads more than it helps |
| S4 | **N7, T5, T6 and T11 get no hint and stay silent in D** | **Blocker** for any promotion |
