---
name: design-system-first-styles
description: Write UI styles as a design system rather than per-screen styles. Activates before adding or changing any component, screen, page, stylesheet, class, token, theme value, or style rule — any work touching CSS, SCSS, CSS modules, utility-class config (Tailwind and similar), styled/CSS-in-JS components, design tokens, native style objects or modifier chains (React Native StyleSheet, SwiftUI, Flutter, Compose), or a component library. Also activates when a screen "looks off", "doesn't match the rest of the app", or is "inconsistent", and when a review turns up duplicated styles, one-off colours, magic numbers, or a component named after the screen it appears on. Teaches naming things rather than places, finding the existing pattern before writing a new one, and making reuse enforceable.
---

# design-system-first-styles

The default failure in UI code is not ugly styles. It is the fifteenth version of a component that already existed fourteen times, each named after the screen that needed it, none findable from any of the others.

That is not carelessness. It is what happens when there is nothing to reach for: with no `card` in the codebase, every screen that needs a card invents one, and the name it invents is the screen's own — the only name the author is certain about.

Everything below is about names, layers and counts, not syntax. It applies wherever style decisions are written: stylesheets, utility classes in markup, style objects, modifier chains, theme files.

## The one rule

**Name things, not places.**

| ✗ named after a place | ✓ named after the thing |
|---|---|
| `SettingsCard`, `labels-card`, `views-list` | `Card` |
| `accounts-row`, `settings-row`, `labels-row` | `card-row` |
| `type-choice`, `label-colour`, `filter-option` | `choice` |
| `labels-row-menu`, `accounts-menu` | `row-menu` |
| `tokens-body`, `accounts-body`, `views-body` | `screen-body` |

A place-named unit is a promise it will never be needed elsewhere. The promise breaks, and when it does the second author does not find the first one's work — they cannot, because they are not building a *settings* thing, they are building a *card*.

**The test:** can you describe what it is without naming the screen? If yes, name it that. `SettingsCard` fails ("it's the card on settings"). `Card` passes.

A place-scoped name is right for exactly one thing: **a delta** — one screen's adjustment to a shared component. Then the place is the point, and the override should say so. Expressed as a scoped rule, or as a variant the shared component already understands:

```css
/* ✓ delta — reuses the shared component, adjusts one value */
.profile-screen .card { --card-padding: 2rem; }

/* ✗ a second card, now drifting from the first */
.profile-card { border: 1px solid #ddd; border-radius: 10px; }
```

```tsx
// ✓ same delta, component-side: the shared component owns the variant
<Card padding="loose" />

// ✗ a second card
const ProfileCard = styled.div`border: 1px solid #ddd; border-radius: 10px;`
```

## Layer vocabulary (any stack)

The layers are what matters; the syntax is incidental. Map them onto whatever the project uses:

| Layer | CSS / SCSS | Utility classes | CSS-in-JS / styled | Native toolkit |
|---|---|---|---|---|
| Tokens | custom properties, `$vars` | theme config scale | theme object | theme / resource constants |
| Primitives | vendored component styles | plugin/preset components | imported library components | platform widgets and controls |
| Composite patterns | `card`, `row` in the shared layer | `@apply`-backed class or wrapper component | exported styled component | shared `Card` view + its style object |
| Place deltas | scoped override | variant prop on the wrapper | prop/variant on the shared component | prop/modifier on the shared view |

**Always reach for the highest layer that does the job.**

1. **Tokens** — colour, spacing, radius, type scale. A literal where a token exists is one value in both themes and wrong in one of them.
2. **Primitives / vendored components** — button, input, select, dialog. Editing vendored or generated files loses the edit at the next upgrade; override in your own layer. If the vendor's rule wins on specificity, raise your specificity rather than the number.
3. **Composite patterns** — card, row, choice, menu, screen frame. **This is the layer that is usually missing**, and its absence is what produces place-named components. Tokens and buttons with nothing between them and the screen is the bug.
4. **Place deltas** — one screen's adjustment to a layer-3 component, always scoped to that place.

Going lower than necessary is how a fifteenth card gets made.

## Before writing any style

0. **Open the token file and read the names.** Whatever holds the theme — a `:root` block, a theme object, a config scale, a constants file. You cannot reach for a token you do not know exists, and this is the single most-violated rule in practice: codebases that define `--radius` still write `8px` in most places, because nobody looked. Five seconds of reading removes the entire class of error.
1. **Name the job.** "A panel holding a list of editable rows." Not "a div with a border and some padding." The job is what you search for; the markup is not.
2. **Search for the job, not your name for it.** You will not find `card` by grepping `settings`. Search the *properties*, in whichever files hold style decisions — stylesheets, component files, theme files (ripgrep shown; any recursive search works, and property names vary by toolkit — `borderRadius`, `cornerRadius`, `clipShape`):
   ```bash
   rg -i 'border-?radius|corner-?radius' <ui-source-dirs>   # which radii exist, and how many
   rg -i 'box-?shadow|elevation|shadowOpacity' <ui-source-dirs>
   rg -il 'background|surface' <ui-source-dirs>
   ```
   Then group what comes back. **The consensus is the system**, whether or not anyone wrote it down.
3. **Look at the component inventory** if one exists — a Storybook, a gallery screen, a `/design` route, a styleguide page. Five minutes there is the whole job.
4. **Only then decide**: reuse, extend with a variant, or add a new pattern.

## Measuring an undocumented system

Most codebases have a design system; few wrote it down. The unit of counting is the *decision-carrying properties* of one surface, not the file that holds them — so this works on a stylesheet, a style object, or a modifier chain, with the extraction regex adjusted to the syntax:

```bash
# stylesheet form: which (radius, background) pairs exist, and how often
rg -U --multiline '\.[\w-]+\s*\{[^}]*\}' <styles-dir> -o \
  | rg -o 'border-radius:[^;]+|background[^;]*:[^;]+' | sort | uniq -c | sort -rn

# style-object form: same counting, different delimiters
rg -o 'borderRadius:\s*[^,}]+|backgroundColor:\s*[^,}]+' <ui-source-dirs> \
  | sort | uniq -c | sort -rn
```

Then measure **token coverage** — of the declarations of one property, how many reference a token rather than a literal:

```bash
prop='border-radius'                                  # repeat per property that has a token
all=$(grep -rho "$prop:[^;]*" <ui-source-dirs> | wc -l)
tok=$(grep -rho "$prop:[^;]*" <ui-source-dirs> | grep -c 'var(--\|theme\.\|\$')
echo "$tok/$all tokenised"
```

A low ratio against a token that *exists* is the most common and most fixable finding there is. Measured in one production codebase: `color` ran `394/411` tokenised while `border-radius` ran `29/146` — same stylesheets, same authors, and `--radius` defined the whole time. Discipline was not the variable; a well-named, obvious token set for colour and a single lonely token for radius was. In a second, much smaller stylesheet: colour fully tokenised, no radius token defined at all, and four different radius values accumulated across 11 surfaces.

So read the ratio as a diagnosis, not a scolding — a reach problem (the token exists, nobody found it) or a gap (it was never defined). Both are fixed at layer 1, not by arguing about the value.

Interpreting the surface counts — the ranking is what matters, and the cut-offs scale with the codebase:

- **The top pairs, the ones carrying most of the surfaces, are the pattern.** Use them. Do not relitigate them. (In a few-hundred-line stylesheet that is a pair used 4–6 times; at a few thousand lines, 10+.)
- **A pair used 2–3 times is a variant.** It probably deserves a name.
- **A pair used once is drift** — unless it has a reason, written next to it. Count the singletons: their share of the total is the drift rate.

This matters because the thing you are about to add will be a singleton, and singletons are how systems rot. Observed in one audit of a production UI:

```text
69 bordered surfaces
26 distinct (radius, background) pairs
10 pairs carrying 54 of the 69 surfaces
```

The system was consistent and had simply never been written down, so it could not be followed on purpose — and the newest screen was the one that broke it.

## Adding a pattern

Only when no existing pattern does the job. **The bar is that you can name the job — not that your values differ.** "I need 12px instead of 10px" is not a new pattern; it is a variant or a mistake.

Land all three together, or the next person will not find it:

1. **The rule**, in the shared layer, named after the thing.
2. **A specimen** in the inventory, drawn with the real component — never a copy of the markup. A showcase with its own markup is a second implementation that drifts from the first and documents nothing.
3. **A line in the written map**, saying which job it is for.

## Variants over new components

When something is nearly right, ask whether it is the same thing at a different size or in a different state. Usually it is:

```css
.choice { /* the card: title, description, room to read */ }
.choice-set[data-size="sm"] > .choice { /* the chip: a mark and a word */ }
```

Component-side the same move is a `size` prop on one component, not `Choice` plus `Chip`.

Two sizes of one component beats two components. The states — checked, disabled, focus, hover, error — are written once and every caller gets them. A second component starts with none of them and acquires them one bug at a time.

## Making it stick

Documentation alone does not hold. Nobody reads a styleguide before adding a view, and a document restating property values disagrees with the code within a month. Three things that do hold:

**Put the inventory where it cannot drift.** The authoritative inventory is a screen rendered by the real components. Prose should be a *map* — the layers, the jobs, where to add one — not a catalogue of numbers.

**Write a test that fails on reinvention.** Ordinary lint rules cannot do this: "this name is defined somewhere" and "this file imports the shared layer" both pass for a component just invented. A test that catches reinvention matches on **role, not name** — a rule keyed on names catches only names already known, and the whole problem is that the next one has a name nobody has thought of. Match on structure:

> *anything that sets a border, a radius and a background is a card, whatever it calls itself, and its values must be one of the named combinations*

And match on the **decision-carrying properties, not the whole declaration.** Two cards that disagree may agree on everything except the two values that matter; whole-declaration matching passes exactly the case you need to catch.

**Make the exception list the backlog.** Deviations are inevitable. Require each to carry a written reason, and check the allow-list against the document both ways so it can neither grow silently nor go stale. An exception that exists only in a test is debt nobody reads.

## Reviewing someone else's UI change

- A new name — is it a thing or a place? If a place, is it scoped as a delta?
- A literal value — is there a token for it? If there is, this is a change request, not a preference. If there isn't and the value will recur, the change is to the token file.
- A new component — does it duplicate one that exists under another name? Search by job, not by name.
- A new state (hover, checked, disabled, pressed) — written once on the component, or re-implemented here?
- The inventory — updated, or does it now describe something that is no longer the whole truth?

## The smells, in one line each

- A component or class named after the screen being built.
- A radius, colour or spacing value that appears exactly once in the codebase.
- Two files that would be identical after a find-and-replace of one word.
- A component whose states were added one bug report at a time.
- An inventory built from its own copy of the markup instead of the real components.
- A styleguide that lists property values prose-side, where they go stale.
