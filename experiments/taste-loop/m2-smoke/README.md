---
title: "Taste loop — M2 smoke run"
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

# Taste loop — M2 smoke run

## Context / Problem

The M2 gate: one brief runs end to end through `skill/SKILL.md`, and every final page passes the audit.

## Scope

One brief (`brief.txt`: a coffee subscription landing page), one run, headless `claude -p` with `claude-sonnet-5-5`. The `taste-loop` and `design-laws` skills were installed under `.claude/skills/`, and tools were limited to file tools, Skill, Agent and `node`.

## Procedure / Steps

The prompt never names a skill. The run was left to trigger and follow the skill on its own.

## Evidence / Results

- **Triggered:** yes (`SKILLS_USED: taste-loop, design-laws`).
- **Cost:** 50 turns, about 4 minutes, about $0.84 at list price.
- **Diverge:** three clearly different concepts (`concepts.md`):
  - *Tide table*: navy with an amber tide curve, the risk concept.
  - *Roast tag*: an orange poster with a tilted hang-tag, the bold concept.
  - *Provenance ledger*: sage with a ledger card, the safe concept.
- **Look:** the run rendered and read the screenshots, then edited after looking.
- **Floor:** all three concepts and the final page scored 18 of 18 on `taste-audit.js`.
- **Select:** two blind subagent judgments in reversed orders agreed on *Tide table*. The reason given was "the tide wave marking each fortnightly delivery is a memorable signature move that carries the brand name through the whole page."
- **Refine:** it took one idea from a runner-up, the provenance strip.

Screenshots are `final-desktop.png` and `c1`–`c3-desktop.png`.

**M2 gate: pass.** The run worked end to end, and every page passed the audit.

## Failure Modes / Boundaries

- **Web fonts failed in this sandbox.** Chromium's requests to Google Fonts fail with `ERR_BLOCKED_BY_ORB` here, so the critique and the judge saw fallback faces. `render.js` now warns when this happens. On a normal network the fonts load.
- **Critiques were not written to disk.** The run did not write `critique.md` files, so the look step can only be confirmed from the transcript.
- **Only part of mobile was checked.** The run looked at the top of the winner's mobile render only.
- **One run proves the mechanics, not the quality.** Whether the loop beats a single shot is the question for M4, judged by the owner's blind picks.
