---
title: "design-system-first-styles"
status: validated
confidence: medium
last_tested: 2026-10-06
scope: personal
tooling:
  - "agnostic/any-LLM"
  - "ripgrep/grep"
tags:
  - skill
  - design-system
  - styles
  - ui
  - naming
  - refactor
owner: "@emb715"
---

# Purpose

Makes an agent write UI styles as a design system instead of per-screen styles: name components after what they are rather than where they appear, find the existing pattern before writing a new one, and reach for the highest applicable layer (tokens → primitives → composite patterns → place deltas). Stack-agnostic — the layer vocabulary maps onto plain CSS, SCSS, CSS modules, utility-class config, CSS-in-JS, and native toolkit style objects or modifier chains.

# Context / Problem

The common failure in UI codebases is not bad styling, it is duplication under place-based names: `SettingsCard`, `labels-card`, `views-card` — three implementations of one component, none discoverable from the others, each acquiring states one bug report at a time. The cause is a missing composite-pattern layer. When a codebase has tokens and primitives but nothing between them and the screen, every screen invents what it needs and names it after itself. An agent adding UI code reproduces this faster than a human does, because it has no memory of the fourteen earlier versions.

# Scope / When to use

- Before adding or changing any component, screen, stylesheet, class, token, theme value, or style rule.
- When a screen "looks off", "doesn't match the rest of the app", or is "inconsistent".
- When a review turns up duplicated styles, one-off colours, magic numbers, or a component named after the screen it appears on.
- When auditing an undocumented design system to find out what it already agrees on.
- Not for choosing a visual direction, picking a palette, or any new-design-from-scratch work — this governs *how styles are organised and named*, not what they look like.

# Inputs

- `<ui-source-dirs>` / `<styles-dir>` — the path(s) holding the project's style decisions: stylesheets, component files, theme files (used in the search and audit commands).
- Optional: the location of a component inventory (Storybook, gallery screen, `/design` route, styleguide page).
- Optional: the project's written design-system map, if one exists.

# Procedure / Skill

Use [`SKILL.md`](SKILL.md) — the naming rule and its test, the four layers mapped across CSS/SCSS, utility classes, CSS-in-JS and native toolkits, the pre-write search procedure, the undocumented-system measurement commands (stylesheet and style-object forms) and how to read the counts, the bar for adding a new pattern, variants over new components, the three enforcement mechanisms, and the review checklist.

# Evidence / Results

**Origin audit (production UI).** Counting decision-carrying properties across the stylesheet produced: 69 bordered surfaces, 26 distinct (radius, background) pairs, 10 pairs carrying 54 of the 69. The consistent system existed and had never been written down, so it could not be followed deliberately — and the most recently added screen was the one that diverged. This produced the skill's consensus/variant/drift ranking and the "match on role, not name" enforcement rule.

**Case 1 — small single stylesheet (464 lines, 33 classes, 11 surfaces).** Ran the full procedure against a static-site stylesheet. Measured output:

```text
radii:    4px ×6 · 3px ×3 · 6px ×1 · 50% ×1
surfaces: 11 radius-bearing rules, 8 distinct (radius, background, border) combinations
```

Produced 9 findings. Three were predicted by the skill before the file was read: one job with four implementations (`consumable-link-block`, `consumable-header`, `meta`, `quickstart` — all "a padded tinted panel"), the newest of the four carrying the singleton 6px radius, and a missing composite layer between a complete token set and element styling (no `panel`, `chip`, `button`). Two classes were place-named after the page their CSS comment names. One finding was a live bug — a hardcoded `#ffffff` where a token exists, invisible in light mode; the dark-mode computed value (`rgb(255,255,255)` on `rgb(26,26,26)`) was confirmed in a browser against the running site.

**Case 2 — multi-file page layer (8,210 lines across 17 stylesheets, origin codebase).** Re-ran the measurement on the codebase the skill came from:

```text
bordered surfaces:                146
distinct (radius, background):     51
top 10 pairs carry:                91 of 146  (62%)
singleton pairs:                   28
radius declarations:              146 across 14 distinct values
  — 8px ×39, var(--radius) ×29, 999px ×22, 7px ×16, 6px ×9, 5px ×7, 9px ×4 …
```

The distribution shape reproduced (a consistent core plus a long singleton tail) at 2× the surface count of the original audit, and only 29 of 146 radius declarations use the `--radius` token that exists — the 5/6/7/8/9px spread is the signature the skill predicts for a missing token reach. The naming table in the skill was written from this codebase and still matches it literally: `settings-card`, `labels-card`, `accounts-card`, `tokens-card` coexist with a vendored `card`; `accounts-row`, `labels-row`, `settings-row` coexist with a correctly-named `row-menu`. The codebase also contains the correct delta form the skill prescribes — `class="card project-card"`, the shared component plus a scoped adjustment — directly beside `class="accounts-card"`, a standalone reinvention. Both forms, one codebase: the skill's rule separates them.

**Refinements produced by validation.**

- *Thresholds rewritten as a ranking.* At 11 surfaces the original absolute threshold ("a pair used 10+ times is the pattern") could not fire at all, while at 146 surfaces it fired correctly. `SKILL.md` now states a ranking that scales with codebase size, with absolute numbers quoted as illustrations at two scales.
- *Token coverage added as a measured step.* The token rule existed in three places but had no procedure behind it, and it was the rule both cases violated worst. `SKILL.md` gained a step 0 ("open the token file and read the names") and a token-coverage recipe. The recipe was executed against both codebases, not written from memory:

  ```text
  roadmap v2/   border-radius ->  29/146 tokenised   (--radius exists)
  roadmap v2/   color         -> 394/411 tokenised
  site public/  border-radius ->   0/11  tokenised   (no radius token defined)
  site public/  background    ->  18/20  tokenised
  ```

  The `394/411` vs `29/146` split inside one codebase is the strongest evidence the skill carries: same stylesheets, same authors, same `--radius` available throughout. The variable was the token set's shape, not anyone's discipline — which is why the skill now frames a low ratio as a diagnosis (reach problem vs gap) rather than a scolding.

**What was not tested.** No without-skill baseline run, and no different-domain task to check over-triggering — steps 2 and 3 of the `_meta/framebook/write-skill/` evaluation. The evidence supports "the procedure produces real, verifiable findings at both small and large scale"; it does not yet support "produces better output than no skill". That is why confidence is `medium` rather than `high`.

# Failure Modes / Boundaries

- **Triggers broadly by design.** The description fires on most UI work, which is the point — the failure it prevents happens at the moment a style is written, not at review. In sessions that only read UI code it is dead context.
- **The measurement commands are regex over source text.** The stylesheet and token-coverage forms are executed and verified against both evidence cases; the style-object form is not.
- **Token coverage counts syntax, not meaning.** The recipe matches `var(--`, `theme.` and `$`. A codebase that indirects through a function call, a utility class, or a build-time map will read as untokenised when it is fine. Treat a low ratio as a prompt to look, not as a verdict. Utility classes in markup and modifier chains (SwiftUI, Compose) have no recipe here at all — the counting has to be done by reading components, and the layer reasoning is what transfers rather than the commands.
- **Shell pipelines undercount multi-file codebases.** In case 2 the `grep | sort | uniq` form counts declarations, not surfaces; pairing a radius with its background across a rule body needed a short parsing script. For anything beyond one stylesheet, parse rule bodies rather than grepping lines, or the pair counts will be wrong in a way that looks plausible.
- **Only the vocabulary is stack-agnostic, not the examples.** The code samples are CSS and TSX. An agent working in Swift or Kotlin gets the layer table and the principle, and has to translate the examples itself.
- **Thresholds are from one audit, not a survey.** "10+ uses is the pattern" matched one real codebase's distribution. A small or very large codebase will want different cut-offs; the ranking (consensus > variant > singleton) is what transfers.
- **Says nothing about visual quality.** A perfectly systematised UI can still be ugly. Pair with design-judgment work; this skill only governs structure, naming, and reuse.
- **Cannot create the missing layer on its own.** When a codebase genuinely has no composite-pattern layer, following the skill means proposing one — a larger change than the task that triggered it. Expect to flag it rather than silently build it.
- **Nothing here governs platform-specific obligations.** Hit-target sizes, dynamic type, safe areas, dark-mode contrast: all out of scope. "Use the token" is correct advice for theming and insufficient advice for accessibility.

# Related artifacts

- [`skills/skill-authoring/`](../skill-authoring/) — the authoring process this copy follows (progressive disclosure, affirmative writing, trigger description, token efficiency)
- [`_meta/framebook/write-skill/`](../../_meta/framebook/write-skill/) — the vault procedure for writing and evaluating a skill
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — the three-file folder convention
- Source: a personal skill kept in a local harness skills directory, rewritten here for vault structure and stack-agnostic wording
