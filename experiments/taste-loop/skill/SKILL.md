---
name: taste-loop
description: "Design a page by divergence and selection instead of a single shot: three distinct concepts, each built, rendered and looked at, held to the taste-audit floor, then judged blind and the winner refined. Use when the user asks to design, redesign or make a page look great, distinctive, premium or on-brand (a landing page, marketing page, dashboard, app screen, HTML/CSS mockup) and quality matters more than speed. Needs Playwright. Not for small style fixes or a single component."
---

# taste-loop

A single shot gives you the median design, and rules only make that median tidier. Taste is a choice between options, so this skill makes options, looks at them, and chooses. It is about 5 to 6 times the cost of a single build, so use it when the look matters.

Work in `loop/<slug>/`: concepts in `concepts.md`, builds in `c1/`, `c2/`, `c3/`, the result in `final/`.

## 1. Diverge: three concepts, not three variations

Write `concepts.md` before any code. For each concept give:

- **Name:** two or three words that capture the idea, e.g. "Paper desk" or "Night shift console".
- **Idea:** one sentence on what the page should make the user feel or do, and how.
- **Preset:** a row from `design-laws` `refs/presets.csv`.
- **Type pairing:** the actual families, display and text.
- **Palette:** the background temperature, the accent, and how much color.
- **Layout skeleton:** the hero shape and the section rhythm, e.g. "left-aligned editorial hero, numbered rows, tinted pricing band".
- **Signature move:** the one thing someone would remember about this page.

The three concepts must differ in at least three of preset, type pairing, palette temperature, layout skeleton and signature move. If two read as the same page with different paint, replace one.

At least one concept should be safe and on-brief. At least one should take a real risk the brief allows.

Avoid the generated defaults unless the brief asks for them:

- a purple-to-blue gradient hero
- everything centered
- emoji as icons
- six identical feature cards
- cream background with a serif display and a terracotta accent
- Inter as the only face

## 2. Build each

For each concept, build `cN/index.html` with the `design-laws` build guardrail: declare tokens first from the concept's preset and type pairing, then the markup. Use real, specific copy that fits the brief, never lorem ipsum. Keep each page self-contained.

## 3. Render and look

```bash
node <this-skill>/scripts/render.js loop/<slug>/cN/index.html
```

**Read `desktop.png` and `mobile.png`. Actually look at them.** This is the step a single shot never takes. Write the three biggest problems against the concept's own idea in `cN/critique.md`, worst first. Typical problems:

- the signature move is not visible
- the hierarchy reads in the wrong order
- the page is cramped or empty
- the type pairing fights
- the mobile layout breaks

Fix them once, then render again.

## 4. Floor

```bash
node <design-laws>/scripts/taste-audit.js loop/<slug>/cN/index.html
```

Fix every failing row and run the audit again, at most three rounds. A concept that cannot pass is dropped. If all three are dropped, report that instead of shipping.

## 5. Select, blind

The builder is the worst judge of its own work, so selection is done by a **fresh subagent** that has not seen the concepts or the code. Give it only:

- the brief
- the desktop screenshots, labelled X, Y and Z in a shuffled order
- the rubric below
- the calibration examples in `refs/picks-examples.md`, when that file exists

Ask it for one winner and one sentence of reasons. Then run the same judgment a second time with the order reversed.

> Rubric: fit to the brief and audience; one clear idea carried through; hierarchy readable at a glance; a memorable signature move; restraint (nothing that does not earn its place). Craft errors count against a page; plainness alone does not win.

- **Both runs agree:** that page wins.
- **They disagree:** show the two finalists to the user and ask, or, when nobody can be asked, take the one with the higher audit score and say so.

## 6. Refine the winner

Copy the winner to `final/`. Take at most one idea from the losing concepts, and only if it strengthens the winner's own idea. Do one more render, look and fix pass, then a final audit, which must pass.

## 7. Report

Report in a few lines:

- the winner's name and idea
- why it won (the judge's sentence)
- what the runners-up were
- the final audit score
- paths to `final/index.html` and its screenshots

Keep the losing concepts on disk. The user may prefer one of them, and that preference is worth recording as a pick.
