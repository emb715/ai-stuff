---
title: "Taste Loop"
status: draft
confidence: low
last_tested: 2026-11-01
scope: personal
tooling:
  - "claude-code"
  - "playwright"
tags:
  - design
  - taste
  - experiment
owner: "@emb715"
---

# Taste Loop

## Context / Problem

Two eval rounds on `experiments/design-skill/` showed that design rules make generated UI more consistent but not better looking: a blind judge preferred the rule-following pages in only 3 of 6 pairs. Left alone, a model produces the median design, and rules only tidy the median. This experiment tests whether taste can be reached by comparison instead: generate several distinct concepts, look at them rendered, and select with a judge calibrated to the owner's own picks.

## Scope

Milestones, each gated:

| # | Milestone | Gate |
|---|---|---|
| M1 | Blind picks page seeded with the 12 round 2 pages (`m1-picks/`) | 30 owner picks |
| M2 | Loop skill: diverge, render and look, audit floor, select, refine | One brief end to end, every final page passes the audit |
| M3 | Judge calibrated with owner picks as examples, both A/B orders | Agrees with the owner on at least 7 of 10 held-out picks |
| M4 | Round 3: 4 new briefs × single shot / loop / loop with reference fingerprint | Pre-registered before any run |
| M5 | Optional reference fingerprint capture, an MCP server only if it wins in M4 | M4 result |

## Procedure / Steps

M1: `m1-picks/page.html` is the published picks page. It shows two full-page screenshots side by side and records A / B / tie / neither, plus an optional reason, in the artifact's database. The 30 pairs are every within-task pair of the 6 landing pages and 6 dashboards from design-skill round 2. Page ids (`p01`–`p12`), pair order and sides were shuffled with a fixed seed. `m1-picks/key.json` maps each page id back to the condition that built it. **Do not open it until the picks are done**, or the picks stop being blind. `m1-picks/shots.js` regenerates the screenshots.

## Evidence / Results

None yet.

## Failure Modes / Boundaries

- The picks come from one person, so the judge is calibrated to that person's taste, by design.
- 30 picks from 12 pages is a small, narrow seed: two briefs only.
- Screenshots are static, so motion and interaction are not judged.

## Related artifacts

- `experiments/design-skill/`, which supplies the audit used as the floor and the round 2 pages.
