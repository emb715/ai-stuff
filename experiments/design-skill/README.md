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

## Source corpora are local-only (2026-10-27)

`laws/sources/` held full-text captures of nine copyrighted books — 108 MB, `raw.txt` plus `extract.md` per book. It is now **untracked and gitignored**, and the files remain on disk for continued experimentation.

Why: this repository is public, and had been serving those captures since 2026-07-30. Distilling them into reusable law statements was the point of the experiment; redistributing the sources was never part of it.

Consequences to know:

- The derived artifacts in `laws/` (`extracted.md`, `quotes.md`, `proposed-laws-ready.md`) stay tracked and still cite `sources/B*/` paths. Those citations now point at files only present in a local checkout. That is intended — the citation records provenance, it is not a dependency a reader can follow.
- Anyone cloning this repo gets the derived work and not the corpora. Re-running the extraction requires supplying the books yourself.
- **Untracking does not remove them from git history.** They remain reachable in the public history from 2026-07-30 onward. Removing them for real needs a history rewrite or a fresh squashed repo — an open decision, recorded in `changelog/week-2026-44.md`.

## Failure Modes / Boundaries

- Laws are prescriptive guidance drawn from books, not empirical measurements taken in this repo.
- Strength labels (`law` / `principle` / `heuristic`) are author-assigned per book, not independently verified here.
- Mapping to ndv agents is an interpretive step; a law may legitimately route to more than one module.
- Skill draft in `skill/` is unvetted — do not consume as authoritative without promotion.

## Related artifacts

- Companion software-engineering laws doc `docs/laws-research.md` is referenced by the research file but not yet present in the repo.
- Index entry: `experiments/README.md`.