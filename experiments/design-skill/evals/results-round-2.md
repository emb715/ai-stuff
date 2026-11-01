---
title: "design-laws — evaluation results, round 2"
status: draft
confidence: medium
last_tested: 2026-11-01
scope: personal
tooling:
  - "claude-code"
tags:
  - experiment
  - evals
  - design
owner: "@emb715"
---

# design-laws — evaluation results, round 2

## Context / Problem

Round 2 tests whether the taste layer added in round 1 works, against the criteria pre-registered in `plan-round-2.md`. That plan was committed before any run and was not changed afterwards.

## Scope

20 runs. Two build tasks (T1 calm landing page, T3 dense dashboard), each run 3 times with and without the skill. One subtle review task (T4), also run 3 times per condition. Two negative probes (N1 backend bug, N2 docs edit), run with the skill only. Raw data is in `round-2/`.

## Procedure / Steps

As in the plan, with two changes:

1. **Measurement bug fixed before scoring.** `measure.js` misread colors written with `color-mix()`, which compute to `color(srgb …)` in the 0–1 range. That reported a false 2.9:1 contrast on one run. The fix scales those values to 0–255. The numbers below come from the fixed script.
2. **The judge ran both orders.** The seeded randomization put the new run in slot A for 5 of 6 pairs, so every pair was also judged with A and B swapped (12 judgments). A pair counts as a win only when both orders agree, and as a tie when they disagree. This is stricter than the plan, not looser.

## Evidence / Results

| # | Criterion | Observed | Result |
|---|---|---|---|
| P1 | Triggers on ≥5 of 6 build runs | 6 of 6 | **pass** |
| P2 | 0 of 2 negatives load the skill | 0 of 2 | **pass** |
| P3 | New median better on ≥3 of 4 consistency metrics | 4 of 4 (table below) | **pass** |
| P4 | New minimum small-text contrast ≥4.5 in every run | 5 of 6. One dashboard run was at 4.4. Without the skill, 3 of 6 were under 4.5, the lowest at 2.9 | **fail (narrow)** |
| P5 | Blind judge prefers new in ≥4 of 6 pairs | 3 of 6 (1 + 1 wins, 2 ties, 2 losses) | **fail** |
| P6 | Review: new finds ≥1.5 more defects on average | 10.7 vs 10.0 of 11 (+0.7) | **fail** |

### Consistency, pooled medians (T1 + T3, 6 runs each)

| Metric | none | new |
|---|---|---|
| distinct font sizes | 9 | 5 |
| distinct radii | 2.5 | 2 |
| distinct spacing values | 16.5 | 9 |
| off-grid spacing % | 64 | 17 |

### Blind judge, per pair (both orders)

| Pair | Verdict |
|---|---|
| T1 run 1 | none, in both orders |
| T1 run 2 | none, in both orders |
| T1 run 3 | **new**, in both orders |
| T3 run 1 | tie (the orders disagree) |
| T3 run 2 | **new**, in both orders |
| T3 run 3 | tie (the orders disagree) |

On T1 the judge favored the unskilled pages for their flourish: centered serif heroes, italic accents and tinted bands. It read the skilled pages as "clean but flatter". The one skilled landing page that won was the most distinctive of them (an editorial layout with numbered feature rows). On the dashboard, the skilled runs won where they added labeled filters and status icons.

### Review

Both conditions found the same 10 defects. The difference is that 2 of 3 skilled runs also named the equal nested radius (taste row F-02), which no unskilled run caught. The skill's reviews cite taste row ids, which makes them easier to act on, but they do not find meaningfully more.

## Verdict

Per the pre-registered rules, P3 passing while P5 fails gives **"continue as a lint, not a skill"**. The taste layer reliably makes output more consistent: fewer sizes, fewer spacing values, and spacing on the grid. But consistency is not what a judge calls taste. On the premium landing page it made the output plainer, and the judge preferred the unskilled version 2 pairs to 1.

What that means in practice:

- `taste.csv` earns its place as **checks**: rows with a `measure` check are exactly what `measure.js` already counts. Grow that into an audit that grades a page against the CSV.
- As a **prompting skill**, it does not improve how output looks. Keep it as a light build guardrail at most (tokens first, contrast floor), not as the 98-law body it is now.
- The 98 laws added nothing measurable in either round.

## Failure Modes / Boundaries

- n = 3 per cell. Two of six judge pairs were order-dependent, which shows how noisy one-shot taste judgments are.
- The judge is the same model family as the builder and may share its taste. A human pass over the screenshots is the missing check.
- The presets were never tuned. A preset with more flourish for "premium" might change P5, but changing it after seeing these results and re-testing on the same tasks would be fitting to the test. A new round would need new briefs.
