---
title: "Taste loop — round 3 plan (pre-registered)"
status: draft
confidence: low
last_tested: 2026-11-01
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

# Taste loop — round 3 plan (pre-registered)

## Context / Problem

M3 showed that a model judge does not share the owner's taste. It agreed with the owner on 2 of 8 decisive picks and almost never said "neither", while the owner said it on 18 of 30 pairs. So the owner now selects, and the loop only proposes.

That leaves one question: **does the loop propose better options than just sampling a single shot several times?** If three independent single shots do as well, divergence, looking at renders and the audit floor add cost and nothing else.

This plan is committed before any run and is not changed afterwards.

## Scope

Four new briefs (`briefs/`), none seen in earlier rounds:

| Brief | Kind |
|---|---|
| b1 | A bold launch page for a developer tool |
| b2 | An editorial long-form article |
| b3 | An app settings screen |
| b4 | Playful onboarding for a consumer app |

Two conditions per brief, with the same prompt and the same model (`claude-sonnet-5-5`):

- **A, three single shots:** three independent runs with no skills installed. Each produces one page.
- **B, one loop:** one run with `taste-loop` and `design-laws` installed. Running headless, the skill stops at step 5 and leaves three concepts on disk.

That gives 6 pages per brief and 24 in total. Every brief asks for system fonts only, because the sandbox browser cannot load web fonts. That way the screenshots show what was built.

## Procedure / Steps

1. Run `run.sh single` three times and `run.sh loop` once per brief.
2. Screenshot every page at 1280 px wide, full page. Run `taste-audit.js` on each and record the score. The score is not used to select.
3. Publish a picks page. For each brief it shows the 6 pages in a shuffled order labelled 1 to 6, with nothing that reveals the condition. For each page the owner marks **above the bar** (yes or no), then picks **one favorite** or "none".
4. Unblind with `key.json` only after all four briefs are picked.

## Pass criteria

| # | Criterion | Pass if |
|---|---|---|
| R1 | Favorite | The owner's favorite comes from B in at least 3 of 4 briefs. A brief with no favorite counts against B. |
| R2 | Above the bar | B has at least 2 more pages above the bar than A, summed over the 4 briefs (out of 12 each). |
| R3 | Spread | In at least 3 of 4 briefs, the owner marks B's three pages differently or picks one of them as favorite. This checks that the three concepts give a real choice. |
| R4 | Cost | Recorded, not gated: B's cost against A's three runs combined. |

## Verdict rules

- **R1 and R2 pass:** the loop proposes better options than sampling. Adopt "the loop proposes, the user selects", and go on to M5 only if the owner wants the reference fingerprint.
- **Only one of R1 or R2 passes:** mixed. Report it, and do not add more machinery before a new round with new briefs.
- **Neither passes:** the loop adds cost without better options, so the experiment fails. Close it and keep only `render.js` and the audit.
- **Fewer than 4 of 24 pages above the bar in total:** whatever R1 and R2 say, the ceiling is still the problem. Report that the loop does not lift the ceiling.

## Failure Modes / Boundaries

- One owner, 4 briefs, and one loop run per brief: small n, so this can only show a large effect.
- A's three runs share a prompt, so they may come out similar. That is part of what is being tested: the loop claims to diverge further than resampling does.
- If a loop run fails to produce three concepts, it is rerun once, and the rerun is noted.
