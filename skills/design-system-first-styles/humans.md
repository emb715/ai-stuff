# humans.md — design-system-first-styles

## Name

The original was `design-system-first`. Renamed to `design-system-first-styles` on import so the trigger surface says what the skill actually governs: how style decisions are named, layered and reused. `design-system-first` reads like it covers component API design, token taxonomy and design-system governance in general, and it does not — it is about styling. The longer name also keeps the folder distinguishable from anything broader added later.

## Origin

This is a vault copy of a personal skill that lived as a single flat `SKILL.md` in a local harness skills directory (outside this repo). It was written after auditing a production UI's stylesheet and finding 69 bordered surfaces spread across 26 distinct (radius, background) pairs, with 10 pairs covering 54 of them. The audit is the whole reason the skill exists: the system was already consistent, nobody had written it down, and the newest page was the one that broke it. Every threshold in the skill traces back to that distribution.

The flat original carried a `user-invocable: true` frontmatter key and spoke almost exclusively in CSS class selectors. Both were narrowed on import — see below.

## Why this structure

Three files, per `docs/standards/artifact-structure.md`:

- `SKILL.md` is the only file an agent loads. It carries the trigger description, the naming rule, the layer model, the search and measurement commands, and the review checklist.
- `README.md` is the repo record — frontmatter, scope, evidence provenance, failure modes, index linkage.
- This file holds the decisions that would otherwise be invisible.

No `references/` directory. The skill is a single concern (how styles are organised and named) and lands around 150 lines, inside the 100–180 target from `skills/skill-authoring/`. Splitting it would create a routing link for content the model needs in the same pass anyway. If the enforcement section ever grows real test implementations per stack, `references/enforcement.md` is where they go, linked from "Making it stick".

## Changes from the original on import

**Removed `user-invocable: true`.** Harness-specific frontmatter. Frontmatter is now `name` + `description` only, which is what every harness this vault targets reads.

**Made the layer model stack-agnostic.** The original named CSS classes throughout, which quietly implies the skill is for CSS codebases. The layer table now maps the four layers across four columns: CSS/SCSS, utility-class config, CSS-in-JS, and native toolkits (React Native, SwiftUI, Flutter, Compose). The chosen framing: the layers are the content, the syntax is incidental. Utility-first codebases have exactly the same disease (the fifteenth copy of the same twelve utility classes in markup), and excluding them would have cut most modern projects.

**Second agnosticism pass.** On review, four things still assumed a web stylesheet and were generalised:

- *"page" → "screen"/"place".* `page` is a web noun, and the fourth layer was called "page deltas" while the rule it encodes is "scoped to the place, whatever a place is here". It is now "place deltas", with "screen" used for the concrete case.
- *Added a component-side delta example.* The CSS `.profile-screen .card` form has no meaning in a codebase with no cascade. The TSX pair (`<Card padding="loose" />` versus a new `styled.div`) shows the same delta where the shared component owns the variant. Both ✗/✓ pairs, per skill-authoring.
- *Second measurement recipe.* The original counting command only parsed `selector { ... }` blocks. A style-object form (`borderRadius:` / `backgroundColor:`) now sits beside it, with the framing stated explicitly: the unit of counting is the decision-carrying properties of a surface, not the file type that holds them. Property names also vary by toolkit, so the search step lists the aliases (`borderRadius`, `cornerRadius`, `clipShape`) rather than assuming `border-radius`.
- *Enforcement section de-CSS-ed.* "The class exists in a stylesheet" became "this name is defined somewhere"; "whole rule" became "whole declaration". The rule being described — match on role, not name — was never CSS-specific; only its phrasing was.

Deliberately **not** generalised: the code examples stay CSS and TSX. Writing each example four ways would quadruple the skill to teach the same principle, and a model working in Swift can translate a two-line example. The limit is recorded as a boundary in `README.md` instead. Utility-class markup and modifier chains also get no counting recipe — there is no short regex that counts a Tailwind surface honestly, and inventing one that half-works would be worse than saying it has to be read.

**Kept the commands as ripgrep with a note that any recursive grep works.** The alternative — writing both `rg` and `grep` forms — doubles the command block to teach nothing. The note is one parenthetical.

**Replaced the prose audit figure with a fenced block.** Partly readability, partly lint: the repo's `DL005` rule requires a measurable or reproducible evidence signal in any document using prescriptive language ("never", "always", "recommended"), and the skill uses all three. The numbers were already there; the block makes them unmissable to a reader and to the linter.

**Added a delta code example.** The original asserted `.profile-page .card { ... }` over a second `.card` in prose. Showing the wrong version next to the right one follows the paired-antipattern rule from `skills/skill-authoring/` — never a ✗ without a ✓, because an uncorrected wrong example is retrievable in the wrong context later.

**Dropped the markdown bold/emphasis on a few headings and the double-space line breaks.** Cosmetic; matches the other skills in `skills/`.

## Design decisions

**The description is deliberately broad.** Most skill descriptions in this vault are narrowed to avoid over-triggering. This one fires on nearly all UI work, and that is intended: the failure mode it prevents (inventing a component that already exists) happens at the instant a style is written. A narrow trigger that only fires when the user says "design system" would miss every case that matters, because a user who knew to say that would not make the mistake. The cost is accepted: wasted context in read-only UI sessions. If evaluation shows it polluting unrelated sessions, narrow it to style-*writing* contexts rather than cutting the general UI trigger.

**No footgun section, despite the write-skill procedure asking for one.** The skill's entire body is the footgun — place-naming is the non-obvious, severe, instinctive mistake. Hoisting one paragraph under a "Footgun" heading would duplicate "The one rule" for the sake of a template slot.

**Status went `draft` → `validated` on two documented runs, not on the full evaluation.** Two vault rules disagree about what validation means here, and the disagreement is worth recording. `_meta/framebook/save-artifact/` step 6 says "used once, outcome documented → `validated`". `_meta/framebook/write-skill/` step 8 wants three runs: without the skill, with it, and a different-domain task to check over-triggering. Only the second kind of run has happened — twice, on a 464-line stylesheet and on the 8,210-line codebase the skill came from — so the import rule is satisfied and the authoring rule is not.

The resolution: `validated` with the gap named explicitly in the Evidence section, and `confidence: medium`. The weaker claim the runs actually support is "the procedure produces real, verifiable findings at both scales"; the claim they do not support is "better output than no skill", because no baseline was run. Promotion to `vetted` needs that baseline and the over-trigger check. Keeping the status at `draft` instead would have been equally defensible and would have understated two real runs — including one that found a live light-mode bug (`#ffffff` on `--bg: #ffffff`) that a reader of the stylesheet had not noticed.

`skills/README.md` says a skill lands here only when validated, which this now is.

**Case 2 was chosen deliberately.** Auditing the codebase that produced the skill risks circularity — of course the skill describes its own origin. It was run anyway because it answers a different question: whether the origin finding *persists and grows*. It does. The original audit found 69 surfaces across 26 pairs; the same codebase now has 146 surfaces across 51 pairs with 28 singletons, so the drift rate held while the surface count doubled. That is evidence the failure mode is structural rather than a one-time mess someone could have tidied. The non-circular evidence is case 1: a stylesheet written by someone who had never seen this skill, where three of the skill's predictions landed before the file was read.

## Maintenance notes

- Before promoting to `validated`, run the three-task evaluation and replace the "Not yet validated" bullet in `README.md` with what was observed. Bump `last_tested`.
- The consensus / variant / drift thresholds are the most falsifiable thing in the skill, and validation already moved them once: the original absolute "10+ uses is the pattern" could not fire on an 11-surface stylesheet, so the rule is now a ranking with absolute numbers quoted as illustrations at two scales. If a third audit produces a different distribution, record all three and say which is which rather than averaging them.
- Watch for the measurement commands rotting. They are regex over stylesheet text; a project that moves from SCSS to CSS-in-JS silently makes them return nothing. If that becomes common, the honest fix is a second measurement recipe for component files, not a more elaborate regex.
- If the skill ever acquires per-stack enforcement tests, they belong in `references/enforcement.md` with a routing link from "Making it stick" — one link, or the file is an orphan.

## The token rule, and why it needed a third pass

The first two drafts carried the token rule in three places — a row in the layer table, a clause in layer 1, a line in the review checklist — and no procedure anywhere. Validation exposed that as the weak point: both audited codebases violated the token rule worse than any other rule in the skill, and in case 2 the metric that proved it (`29/146` radius declarations tokenised against a `--radius` that had existed the whole time) was computed by hand because the skill had no recipe for it.

Two things were added. A **step 0** — open the token file and read the names, before naming the job — on the reasoning that nobody reaches for a token they do not know exists, and a model has even less reason to assume one does. And a **token-coverage command**, executed against both codebases rather than written from memory, after the earlier boundary admission that the measurement commands had only been eyeballed.

The `394/411` colour versus `29/146` radius split within one codebase decided the framing. Same files, same authors, same token available. If discipline were the variable the two numbers would be closer, so the skill now reads a low ratio as a diagnosis — the token exists and nobody found it, or it was never defined — rather than as a failure to care. That framing is also more useful to a model, which cannot be shamed but can be told which of two fixes applies.

What this deliberately does not do: enforce tokens for one-off values. The checklist asks whether the value will recur. A genuinely singular value with a written reason is the exception the "Making it stick" section already accounts for, and promoting every literal to a token produces a token file nobody can read, which is the same disease at a different layer.

## Known gaps

- No worked example of the structural lint rule it recommends. "A rule that sets a border, a radius and a background is a card, whatever it calls itself" is stated as a principle with no implementation in any linter. A real stylelint or custom-AST implementation would make the enforcement section actionable instead of aspirational.
- Nothing on the migration path. Advising the fifteenth card not to exist is easy; consolidating fourteen that already do is a different and much larger job the skill does not address.
- Accessibility and theming interactions are untouched. "Use the token" is the right advice for dark mode, but contrast obligations when a variant changes a background are out of scope here.
