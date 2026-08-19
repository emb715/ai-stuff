---
title: "Design Laws Research"
status: draft
confidence: medium
last_tested: 2026-08-18
scope: personal
tooling:
  - "research/qualitative"
  - "ndv-design"
tags:
  - design
  - research
  - laws
  - principles
  - experiment
owner: "@emb715"
---

# Design Laws Research

## Context / Problem

Design laws are scattered across many canonical books (Norman, Krug, Maeda, Lidwell, Johnson, et al.). Each book frames a subset of laws with its own vocabulary, polarity, and strength labels. There was no consolidated reference that an agent could consult when making or reviewing design decisions. This experiment consolidates them into a single catalogue mapped to the ndv fleet's design specialist (ndv-design / Pixel).

## Scope

9 canonical design books catalogued. Laws extracted, classified by tag / polarity / strength, and mapped to ndv-design (Pixel) and its cognitive module (ndv-perceptual). Output is research-grade, not a validated artifact.

## Procedure / Steps

1. Source list taken from `sobrief.com` top essential design principles books.
2. For each book: extracted stated laws/principles/heuristics.
3. Classified each law by tag (`perception`, `cognition`, `composition`, `interaction`, `decision`, `visual`, `ux`, `accessibility`, `emotion`, `consistency`), polarity (`prescriptive` / `descriptive` / `cautionary`), and strength (`law` / `principle` / `heuristic`).
4. Mapped every law to the responsible ndv fleet agent and module.
5. Triage passes (`laws/triage-pass-2.md`) refined proposed laws for skill inclusion.

## Evidence / Results

Produced:
- `design-laws-research.md` — full catalogue (188 lines, clusters A–F).
- `laws/` — extracted laws, quotes, sources, proposed-laws, triage passes.
- `skill/` — draft `SKILL.md` + `humans.md` + `refs/` for an ndv-perceptual skill candidate.

This is research output, not a validated artifact. No reproducible outcome measurement has been run.

## Failure Modes / Boundaries

- Laws are prescriptive guidance drawn from books, not empirical measurements taken in this repo.
- Strength labels (`law` / `principle` / `heuristic`) are author-assigned per book, not independently verified here.
- Mapping to ndv agents is an interpretive step; a law may legitimately route to more than one module.
- Skill draft in `skill/` is unvetted — do not consume as authoritative without promotion.

## Related artifacts

- Companion software-engineering laws doc `docs/laws-research.md` is referenced by the research file but not yet present in the repo.
- Index entry: `experiments/README.md`.