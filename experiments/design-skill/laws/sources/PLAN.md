# Plan: Discovering Additional Laws Beyond the Catalogued 26

> Method to extend the fleet's design-law catalogue from the 9 source books. The current catalogue (26 laws) is a synthesis — the source books contain additional candidate laws the synthesis did not lift. This plan documents how to surface them.

## 1. Why the catalogue does not exhaust the source books

The 26 laws in `docs/design-laws-research.md` were curated as the smallest set that (a) covers every chapter of every book, (b) maps cleanly onto ndv-design's review workflow, and (c) avoids near-duplicate laws across books. This means some laws were intentionally merged, downgraded to imperatives, or omitted because they had no clean fleet application.

Known omissions (per book):

| Book | Known candidate laws not in catalogue |
|---|---|
| B1 Norman | Seven stages of action, mapping, conceptual models, forcing functions |
| B2 Krug | "Satisficing" web use, convention over invention, the "won't click unknown links" pattern, signs and breadcrumbs |
| B3 Maeda | The 10 laws of simplicity (Reduce, Organize, Time, Learn, Differences, Context, Emotion, Trust, Failure, Meaning) — only D-17 (Reduction) was lifted; the other 9 are documented but unmapped |
| B4 Gothelf | Hypothesis-driven design, MVP as a learning vehicle, collaborative design, outcome-based metrics, the "Lean Canvas" — these are process laws, not interface laws, so most were excluded. Re-evaluate against the decision cluster |
| B5 Weinschenk | "100 things" are 100 discrete findings — only 5 were lifted. ~95 candidates remain. Many are micro-laws about peripheral vision, color vision, mail cognition, motivation — worth mining for the perception/cognition clusters |
| B6 Lidwell | Alphabetized principles (~125 entries). Only 4 lifted. The book explicitly includes its own law catalogue with strength ratings. ~120 candidates remain — including Confirmation, Consistency, Constraint, Entry point, Fear effect, Form follows function, Hierarchy, Layering, Modularity, Narrative, Orientation, Performance vs preference, phi phenomenon, Progressive disclosure, Rule of thirds, Scaling fallacy, Stickiness, Symmetry, Threat orientation, Uncanny valley, Wayfinding |
| B7 Williams | PARC lifted as one law (D-13); the four sub-principles are also in the catalogue as references but not as separate laws. The book covers ~50+ practical design rules around type, color, alignment, repetition — many candidates for the composition cluster |
| B8 Greever | Most chapters are process/communication, only D-23 + D-24 lifted. ~10 candidate imperative laws about how to defend/explain a design |
| B9 Johnson | Highest yield already (11 laws). Remaining candidates: cognitive offloading, mode errors, learned irrelevance, automatic vs controlled processing boundary, imprinting — likely additions to the cognition cluster |

## 2. Discovery protocol (per book)

For each source book in `docs/laws/sources/B<n>-<author>/`:

1. **Run toc.md → extract.md → laws.md** for every book, not just B9.
2. **Cross-reference** every heading, "principle", "law", or formally stated rule against the 26-law catalogue in `docs/design-laws-research.md`.
3. **For each non-catalogued candidate**, produce a "candidate law" entry:

```
### Candidate C-<n>: <Name>
- Source: B<x>, chapter/section, page
- Core statement: <one-sentence statement>
- Fleet mapping: maps to cluster <A|B|C|D|E>; would extend ndv-design to <existing module | new module>
- Conflict / overlap: check against existing D-1..D-26
- Verdict: add as new law | merge into existing D-xx | reject (process law / not actionable)
```

4. Append candidates to `docs/laws/candidates.md` for triage.
5. Once triaged, accept/reject decisions roll up into `docs/design-laws-research.md` as new D-27, D-28, etc.

## 3. Triage criteria

A candidate becomes a new fleet law if it passes all four:

- **Actionable** — produces a concrete design rule ndv-design (Pixel) can apply during a UI review.
- **Distinct** — not a restatement of any D-1..D-26 in different words.
- **Empirical** — grounded in the source book's research/evidence, not only opinion.
- **Clusterable** — slots cleanly into a perception / cognition / composition / interaction / decision cluster.

Reject candidates are kept in `candidates.md` with the rejection reason — they may resurface when the fleet extends to other domains (process design, brand design, service design).

## 4. Sequencing (by remaining candidate yield)

Priority order:

1. **B6 Lidwell** — ~120 unmapped alphabetized principles. Highest single yield. Worth a dedicated sweep.
2. **B5 Weinschenk** — ~95 unmapped "things". Second highest.
3. **B3 Maeda** — 9 of 10 simplicity laws unmapped. Small but well-bounded.
4. **B7 Williams** — ~30+ practical rules. PARC gives us 4 sub-laws for free.
5. **B1 Norman** — canonical concepts still in the source (seven stages, conceptual models)
6. **B8 Greever** — communication laws, smaller payoff
7. **B4 Gothelf** — process laws; revisit only if the fleet extends to design-process evaluation
8. **B2 Krug** — already well-mined
9. **B9 Johnson** — already well-mined

## 5. Per-book artefact contract (target state)

```
docs/laws/sources/
  B<n>-<author>/
    raw.txt          # pdftotext/unzip output
    toc.md           # chapter map with line anchors
    extract.md       # verbatim per-chapter extract
    laws.md          # per-law citations for laws sourced HERE
    candidates.md    # candidate laws NOT in catalogue
```

Plus consolidated:

```
docs/laws/
  extracted.md       # cross-book index: law -> source quotes + page cites
  candidates.md      # all candidates from all books
```

## 6. Definition of done

- 9 books × 5 artefacts complete
- `docs/laws/extracted.md` cites at least one page-referenced quote for each of D-1..D-26 from at least one source book
- `docs/laws/candidates.md` enumerates every non-catalogued formally-stated rule from every source book
- `docs/design-laws-research.md` accepts/rejects every candidate

---

## Current state

| Book | raw.txt | toc.md | extract.md | laws.md | candidates.md |
|---|---|---|---|---|---|
| B1 Norman | DONE 990 KB | DONE | DONE 954 KB | WARN noisy (auto-section-finder off-target) | TBD |
| B2 Krug | DONE 290 KB | DONE | DONE 268 KB | DONE | TBD |
| B3 Maeda | DONE 178 KB | DONE | DONE 51 KB | WARN no auto-implications block — see extract | TBD |
| B4 Gothelf | DONE 298 KB | DONE | DONE 299 KB | WARN no auto-implications block — see extract | TBD |
| B5 Weinschenk | DONE 486 KB | DONE | DONE 465 KB | WARN sections per-"thing"; verify each law's Thing number in toc | TBD |
| B6 Lidwell | DONE 985 KB | DONE | DONE 938 KB | FAIL OCR garbage on scanned spreads — raw better than auto-find | TBD |
| B7 Williams | DONE 478 KB | DONE | DONE 454 KB | DONE | TBD |
| B8 Greever | DONE 517 KB | DONE | DONE 513 KB | DONE | TBD |
| B9 Johnson | DONE 398 KB | DONE | DONE 322 KB | DONE | TBD |

**Consolidated:** `docs/laws/extracted.md` — D-1..D-26 cross-book index linking to per-book artefacts (DONE, 14 KB).

## Quality per book (signal-to-noise order)

1. **B9 Johnson** — cleanest. "DESIGN IMPLICATIONS" section header auto-detected. 11 laws sourced here.
2. **B7 Williams** — good. PARC is the book's spine; chapters detected correctly.
3. **B2 Krug** — good. Formatted chapters, clean text. 6 laws sourced here.
4. **B8 Greever** — good. Clean text, chapters detected via "Chapter N" markers. 2 laws.
5. **B1 Norman** — text clean but auto-section-finder matched wrong paragraph (e.g., D-1 grabbed the "natural mappings" summary instead of the affordance-specific block, because Norman doesn't have a "DESIGN IMPLICATIONS" header). Re-look at extract.md for the right passage.
6. **B5 Weinschenk** — chapter boundaries rough (TOC-based heuristic, ±50 lines). Each "thing" has a discrete numbered page. laws.md may grab a nearby "TAKEAWAYS" — has to be compared against extract.
7. **B3 Maeda** — laws in book are 1-10 + 3 keys; my chapter-config treats LAW 1 (Reduce) through LAW 10 (The One) as "chapters" so extract.md is per-law. laws.md couldn't find implication blocks. Extract itself is fine.
8. **B4 Gothelf** — process book, no "DESIGN IMPLICATIONS" header per chapter. laws.md falls back to extract.
9. **B6 Lidwell** — worst. The PDF is a scanned spread (each page = 2 book pages, OCR-mashed left+right columns). raw.txt has interleaved columns, broken spacing. extract.md suffers. Will need a column-aware re-extraction. laws.md fallback triggered.

## Known cleanup todo

- [x] B6 — re-extract with column-aware tool. The book is too valuable to leave at this quality.
- [x] B1 laws.md D-1 — re-grab the affordance/signifier-specific passage from extract.md (line search for "affordance").
- [x] B5 — improve chapter boundaries with TOC page-number anchors (Weinschenk TOC has page numbers).
- [ ] Generic — apply `Figure N.N` caption filter to all extracts.
- [ ] Generic — strip standalone page-number lines and running headers in extract.md (e.g., `9780465050659-text.indd 218` for B1).
- [x] Generate `candidates.md` per book (next phase).
- [x] Hand-curate one-sentence verbatim quote per law (laws.md auto-section gives medium-granularity blocks; a one-liner is the next refinement for evidence-citation flexibility).

## Recommended next phase

- **Phase 1 (extraction)** — done for 9 books.
- **Phase 2 (cleanup)** — fix B6 OCR, B1 section targeting, B5 chapter boundaries. ~1 hour of focused work.
- **Phase 3 (candidate discovery)** — mine each book's extract.md for non-catalogued formally stated rules. Per yield estimates: B6 and B5 are highest-yield. Start there.
- **Phase 4 (catalogue update)** — accepted candidates roll into `docs/design-laws-research.md` as D-27, D-28, etc.

## Phase completion log

- Phase 1 (extraction): DONE — 9 books × raw.txt, toc.md, extract.md, laws.md
- Phase 2 (cleanup): DONE — B6 pymupdf re-extraction, B1/B5 laws.md manual targeting
- Phase 3 (candidate discovery): DONE — all 9 books × candidates.md (125 total candidates)
- Phase 4 (catalogue update): DONE — D-27..D-34 added to design-laws-research.md as proposed
- Phase 5 (skill creation): PENDING — skill to be built from docs/laws/ corpus
- Remaining open: generic extract.md cleanup (captions, running headers)