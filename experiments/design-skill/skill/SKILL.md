---
name: design-laws
description: "Build-time design guardrail and taste audit for UI. Activates before writing any interface (a page, landing page, pricing section, dashboard, component, form, HTML/CSS, or styles) and when checking a rendered page for polish or consistency. Sets tokens first from intent presets and concrete defaults in taste.csv, then grades the rendered page with scripts/taste-audit.js (type scale, spacing grid, contrast, targets, labels, focus, overflow). Also indexes 98 D-numbered design laws for citing in reviews."
---

# design-laws

A floor, not a ceiling. Two eval rounds showed this skill reliably makes UI **more consistent** (fewer type sizes, spacing on the grid, fewer one-off radii) but does **not** make it look better to a blind judge, and the law list adds nothing to reviews. Use it to stop sloppy output, not to supply taste. Evidence: `../evals/results-round-2.md`.

## Build guardrail

Use this whenever you write UI, even if the request does not say "design".

1. **Pick a preset.** Match the brief's intent to a row in `refs/presets.csv` (calm, premium, trustworthy, urgent, playful, authoritative, intimate, learnable, delightful, dense). If none fits, use `trustworthy`. The preset sets the floor. Distinctiveness (a concept, a signature move) still has to come from the brief.
2. **Write tokens before markup.** Declare the type scale, spacing scale, radius scale, colors (one accent plus one neutral ramp) and shadow levels as variables, from the preset and the `default` column of `refs/taste.csv`. Every later value uses a token.
3. **Build.** Use the ✓ shapes in `refs/examples.md`. One primary action per view.
4. **Audit.** If the page can be rendered locally, run the audit and fix every failure:

   ```bash
   node <skill-dir>/scripts/taste-audit.js path/to/page.html
   ```

   If it cannot be rendered, walk the `taste.csv` rows that have a `rule` by hand.

## Taste audit

`scripts/taste-audit.js` renders the page with Playwright at 1280px and 375px and checks every `taste.csv` row that has a `rule` (18 rows). It prints ✓/✗ per row, with the measured value, the evidence (e.g. which element has the lowest contrast), and the row's smell and laws. Exit code: 0 all pass, 1 any fail, 2 error. Add `--json` for machine output.

Measured: distinct font sizes and scale step, families, body size and line height, paragraph measure, centered paragraphs, off-grid spacing and spacing count, radii, shadows, gradients, minimum small-text contrast, minimum target size, unlabeled inputs, removed focus outline, motion without reduced-motion, mobile overflow.

Not measured: whether it looks good. Passing the audit means "not sloppy", nothing more.

To add a check, add a `rule` (`metric<=n`, `metric>=n` or `metric==n`) to a `taste.csv` row. If the metric is new, compute it in `measurePage()`.

## Review

Run the audit first and report its failures by taste row id (T-03, C-03). Then review what it cannot see: hierarchy, flow, copy and fit to the brief. Cite laws by D-number from `refs/laws-index.md` only when the citation helps the reader act.

## Refs

| File | Use |
|---|---|
| `refs/taste.csv` | 58 design decisions: default, range, smell, why, laws, check, and an auditable `rule` on 18 rows |
| `refs/presets.csv` | 10 intent presets with concrete values |
| `refs/examples.md` | before/after snippets for 17 laws |
| `scripts/taste-audit.js` | rendered-page audit against `taste.csv` |
| `refs/laws-index.md` | the 98 laws by cluster, plus cross-cluster failure patterns |
| `refs/{perception,cognition,composition,interaction,decision}.md` | law statements by cluster |
| `refs/patterns.md`, `heuristics.md`, `antipatterns.md`, `build-moves.md` | solutions, review checks, named mistakes, generative moves |
