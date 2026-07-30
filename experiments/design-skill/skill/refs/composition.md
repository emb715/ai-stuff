# Composition — Design Laws for Layout and Visual Structure

23 laws. PARC is the operating system; hierarchy, signal-to-noise, and reduction are its instruments. Every element on a surface has a visual relationship with something else, or it is noise.

---

## D-13 — PARC Principle
- **Check:** Apply Proximity (group related), Alignment (create structure), Repetition (teach patterns), Contrast (create emphasis) — every element must be governed by all four; nothing on the surface is arbitrary.
- **Example:** A pricing card with tight internal spacing (P), a left-aligned column (A), consistent button styling across tiers (R), and a bold highlighted "Popular" tier (C) applies PARC fully.
- **Source:** B7 Williams, *The Non-Designer's Design Book*, Ch 1–4

## D-14 — Visual Hierarchy Law
- **Check:** Important elements must be more prominent (size, weight, color, position) and a clear reading order must exist — when everything is prominent, nothing is.
- **Example:** Primary CTA gets size + weight + contrast; secondary actions recede into a ghost-button style.
- **Source:** B2 Krug, Ch 3; B6 Lidwell (Hierarchy); B7 Williams, Ch 4

## D-15 — Aesthetic-Usability Effect
- **Check:** Aesthetically pleasing designs are perceived as easier to use even when objectively they are not — visual quality is a trust signal, not vanity.
- **Example:** A polished, well-spaced form is rated more usable than the same form with default browser styling, even with identical field counts.
- **Source:** B6 Lidwell (Aesthetic-Usability Effect)

## D-16 — Clickability Law
- **Check:** What is interactive must look interactive; what is not interactive must not look interactive — false and hidden affordances both break trust.
- **Example:** Links use one consistent color + underline-on-hover; non-clickable headings use no link styling.
- **Source:** B2 Krug, Ch 1 (make it obvious what's clickable)

## D-17 — Reduction Law
- **Check:** Every element must earn its presence — if you cannot state what this element contributes to the user's goal, remove it. Removal is a design act.
- **Example:** A dashboard with 4 KPIs the user actually checks outperforms one with 12 "in case someone wants them".
- **Source:** B3 Maeda, *The Laws of Simplicity* (REDUCE); B2 Krug, Ch 12

## D-29 — Progressive Disclosure Law
- **Check:** Reveal complexity only when it becomes relevant — infrequently needed controls belong behind an explicit request, not on the surface by default.
- **Example:** A settings panel shows 5 common toggles + an "Advanced" disclosure for the 30 rarely-used ones.
- **Source:** B6 Lidwell (Progressive Disclosure)

## D-30 — Signal-to-Noise Law
- **Check:** Relevant information must dominate irrelevant information — every element that is not signal is noise, and noise actively degrades what it surrounds.
- **Example:** A chart with a title, one data series, and minimal axes has high S/N; the same chart with 5 series, gradient fills, and decorative gridlines has low S/N.
- **Source:** B6 Lidwell (Signal-to-Noise Ratio); B7 Williams, Ch 4

## D-38 — Cognitive Friction Law (Don't Make Me Think)
- **Check:** Eliminate cognitive friction — every moment the user has to think "what is this? what do I do?" is a defect, not a feature.
- **Example:** A nav labeled "Products", "Pricing", "Docs" requires no thought; a nav labeled "Solutions", "Engage", "Enable" does.
- **Source:** B2 Krug, *Don't Make Me Think*, Ch 1

## D-39 — Satisficing Law
- **Check:** Users pick the first plausible option, not the optimal one — design for the satisficer: make the first reasonable choice the correct one.
- **Example:** A search results page with the top result being the most-likely answer outperforms one optimized for the "best" answer buried at position 3.
- **Source:** B2 Krug, Ch 11 (muddling through); B6 Lidwell (Satisficing)

## D-40 — Muddling Through Law
- **Check:** Users proceed with partial understanding, not complete models — design surfaces that work even when the user does not fully understand the system.
- **Example:** A user who never reads the docs must still be able to complete the primary task; the surface must be usable under partial understanding.
- **Source:** B2 Krug, Ch 11 (muddling through)

## D-55 — Shortcut Threshold Law
- **Check:** Users adopt shortcuts only when the shortcut cost is trivially low — do not build shortcut power-users expect to discover; surface them.
- **Example:** A keyboard shortcut hint shown on hover over the button is adopted; the same shortcut buried in a settings doc is not.
- **Source:** B5 Weinschenk, Thing 58 (shortcut threshold)

## D-67 — Entry Point Law
- **Check:** Design the point of attentional entry deliberately — the first element the user sees sets context, expectation, and tone for the whole surface.
- **Example:** A landing page hero with a single headline + CTA is a designed entry point; a landing page that opens on a generic nav + 3 carousels is not.
- **Source:** B6 Lidwell (Entry Point)

## D-69 — Factor of Safety Law
- **Check:** Include margin for error beyond the nominal need — designs operated at the edge of tolerance fail under real-world variance.
- **Example:** A form that accepts dates in 5 formats tolerates user variance; one that accepts only ISO-8601 does not.
- **Source:** B6 Lidwell (Factor of Safety)

## D-70 — Proportion Law
- **Check:** Use proportion systems (golden ratio, Fibonacci, rule of thirds) to produce harmonious relationships — proportional intuition is learned, not innate.
- **Example:** A hero image placed on the left-third intersection (rule of thirds) reads as balanced; the same image dead-center reads as static.
- **Source:** B6 Lidwell (Fibonacci / Golden Ratio / Rule of Thirds)

## D-71 — Form Follows Function Law
- **Check:** Let function dictate visible form — form that does not reflect function is decoration that misleads.
- **Example:** A toggle that looks like a switch and behaves like a switch succeeds; a "toggle" implemented as two radio buttons fails the form-function match.
- **Source:** B6 Lidwell (Form Follows Function)

## D-73 — Gutenberg Diagram Law
- **Check:** For scan-first layouts, weight the reading-gravity zones: top-left (primary optical area) and bottom-right (terminal area) get the most attention.
- **Example:** Place the brand/logo top-left and the primary CTA bottom-right; users' eyes complete the diagonal sweep naturally.
- **Source:** B6 Lidwell (Gutenberg Diagram)

## D-74 — Highlighting Law
- **Check:** Highlight no more than 10% of the visible design, using a small consistent set of techniques — if everything is highlighted, nothing is.
- **Example:** Bold 3 key terms in a 60-word paragraph; do not bold 15.
- **Source:** B6 Lidwell (Highlighting)

## D-75 — Iconic Representation Law
- **Check:** Use pictorial forms to reduce cognitive load — but only when the icon is recognized; unrecognized icons are noise.
- **Example:** A magnifying-glass search icon is recognized; a custom "lens-with-wings" search icon is not.
- **Source:** B6 Lidwell (Iconic Representation)

## D-78 — Inverted Pyramid Law
- **Check:** Place the most important information first, then supporting detail, then background — readers leave at any point and still get the core.
- **Example:** A news article with a 1-sentence summary lede, then 3 supporting paragraphs, then context outperforms a chronological narrative.
- **Source:** B6 Lidwell (Inverted Pyramid)

## D-81 — Modularity Law
- **Check:** Break complexity into comprehensible units — modules are easier to scan, learn, maintain, and recombine than monoliths.
- **Example:** A settings page split into 6 cards (Account, Billing, Notifications, Privacy, Security, Advanced) outperforms a single 60-field form.
- **Source:** B6 Lidwell (Modularity)

## D-83 — Performance Load Law
- **Check:** Minimize the total mental + physical effort required to complete a task — every increment of load is a tax on completion.
- **Example:** Autofill shipping address from a saved profile reduces performance load; a blank form demanding re-entry increases it.
- **Source:** B6 Lidwell (Performance Load)

## D-85 — Readability Law
- **Check:** Optimize ease of reading at the text-block level — type size, line-height, measure, contrast, and font choice together determine readability.
- **Example:** 16px / 1.6 line-height / 66ch measure / #222 on #fff reads; 12px / 1.1 / 200ch / #666 on #ccc does not.
- **Source:** B6 Lidwell (Readability)

## D-87 — Scaling Fallacy Law
- **Check:** What works at one scale may fail at another — re-test layouts, lists, and flows when the data, user count, or content size crosses a 10× threshold.
- **Example:** A 10-row table UI is fine; the same UI with 10,000 rows needs pagination, virtualization, and filter-first access.
- **Source:** B6 Lidwell (Scaling Fallacy)

## D-92 — Weakest Link Law
- **Check:** Experience fails at the most fragile component — invest in the weakest link, not the strongest; the strongest cannot compensate.
- **Example:** A polished onboarding + a broken email-verification step produces a failed first session; fix the email step, not the onboarding.
- **Source:** B6 Lidwell (Weakest Link)

## D-93 — Centered Text Penalty Law
- **Check:** Avoid centered alignment for most UI copy — centered text weakens structural clarity and slows scanning; reserve center for short headlines.
- **Example:** A left-aligned paragraph reads as a structured block; a centered paragraph reads as a floating fragment.
- **Source:** B7 Williams, Ch 2 (centered text weakens structure)

## D-94 — Structure Before Style Law
- **Check:** Organize visual relationships first, style second — styling a disorganized surface hides, not fixes, the disorganization.
- **Example:** Group + align + space the elements first, then apply color/typography; the inverse produces a styled mess.
- **Source:** B7 Williams, Ch 1 (visual relationship before decoration)