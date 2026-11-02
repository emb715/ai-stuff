---
title: "Taste loop — round 3 results"
status: draft
confidence: low
last_tested: 2026-11-02
scope: personal
tooling:
  - "claude-code"
  - "playwright"
tags:
  - experiment
  - evals
  - design
owner: "@emb715"
---

# Taste loop — round 3 results

## Context / Problem

Round 3 asks whether the loop proposes better options than three plain single shots, with the owner as the only judge. The criteria were pre-registered in `plan.md`. Deviations are in `README.md`: the loop never triggered on its own, so the loop prompt names the skill.

## Scope

4 briefs, each with 6 pages: 3 single shots (A) and the loop's 3 concepts (B). That is 24 pages, picked blind on the round 3 picks page.

## Procedure / Steps

The owner marked exactly one page per brief as above the bar, left the other five unmarked, and starred no favorite. The results below read that as: the marked page is the favorite and the only page above the bar. The owner was asked to confirm this reading.

## Evidence / Results

| Brief | Owner's page | Condition | Audit |
|---|---|---|---|
| b1 launch | b1-6 | B, loop concept 3 ("Yellow strike", the concept marked as the real risk) | 18/18 |
| b2 editorial | b2-3 | A, single shot | 12/18 |
| b3 settings | b3-4 | A, single shot | 8/18 |
| b4 playful | b4-2 | A, single shot | 12/18 |

| # | Criterion | Observed | Result |
|---|---|---|---|
| R1 | Favorite from B in ≥3 of 4 briefs | 1 of 4 | **fail** |
| R2 | B has ≥2 more pages above the bar than A | B 1, A 3 | **fail** |
| R3 | B's three pages marked differently in ≥3 of 4 briefs | 1 of 4 | **fail** |
| R4 | Cost (recorded) | Loop about $0.90 per brief; three single shots about $0.60 | B costs about 1.5 times as much |
| Ceiling | Fewer than 4 of 24 above the bar | 4 of 24 | not triggered (at the line) |

Two more observations:

- **The audit does not predict the owner's taste.** Every loop concept scored 18/18, and the single shots scored 6 to 13. Three of the four pages the owner kept were single shots, scoring 8 to 12.
- **The one loop page that won was its riskiest concept.** The skill asks for one concept that takes a real risk the brief allows. That concept was the only loop page above the bar.

## Verdict

Per the pre-registered rules, neither R1 nor R2 passes, so **the experiment fails**. The loop costs more and does not propose better options than sampling three single shots. With the owner as judge, plain resampling produced 3 of the 4 pages worth keeping.

Following the plan: close the experiment, and keep only `render.js` (looking at a render is cheap and useful on its own) and the audit as a floor check, not as a quality signal.

## Failure Modes / Boundaries

- n is small: one owner, 4 briefs, one loop run per brief.
- The loop was invoked by name, because it never triggered on its own (0 of 8).
- The owner's marks were sparse and no favorite was starred. If the marked page was not meant as the favorite, or the unmarked pages were meant as "not judged" rather than "below the bar", all three criteria need rescoring.
- The loop's tokens-first and audit steps may push pages toward the same tidy look, which the owner did not prefer. That is a guess, not tested.
