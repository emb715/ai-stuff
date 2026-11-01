# M3, step 1: uncalibrated judge against the owner's picks

Before calibrating anything, the judge from the loop skill was run as is, with no examples, on all 30 pairs the owner picked, in both A/B orders (60 judgments). A judgment counts only when both orders agree. The prompt is in `judge.sh`. It was allowed to answer NEITHER, the owner's "both below the bar".

## Owner picks

| Choice | Count |
|---|---|
| A clear winner | 8 |
| Tie | 4 |
| Neither (both below the bar) | 18 |

No reasons were given. Unblinded with `m1-picks/key.json` after the picks were done:

- On the 3 decisive pairs that put a skilled page against an unskilled one, the owner picked the unskilled page every time.
- One unskilled landing page (`p07`) won all 4 of its decisive pairs.
- Only 2 of the 15 dashboard pairs got a winner. The owner rejected most dashboards from both conditions.

## Judge vs owner

| | Result |
|---|---|
| Agrees with the owner's winner (both orders) | 2 of 8 |
| Picks the other page (both orders) | 4 of 8 |
| Order-dependent | 2 of 8 |
| Says NEITHER where the owner did | 0 of 18 (it said NEITHER once in 60 judgments) |
| Same verdict in both orders | 25 of 30 |

The judge is stable but has different taste. Its reasons (`why.txt`) reward the generated flourish (italic serif accents, numbered editorial rows, tinted bands) and, on dashboards, more detail (icons in pills, two-line cells). It never holds a bar: it always finds a winner.

## What this means

- The pre-registered M3 gate (7 of 10 held-out picks) cannot be tested: there are only 8 decisive picks.
- An uncalibrated model judge is not a proxy for the owner. In the loop skill, step 5 should not be trusted to select alone.
- 18 of 30 "neither" says the ceiling is the problem. Most pages from both conditions are below the owner's bar, which neither the rules nor the judge can see.
