# Perception — Design Laws for What Users See

20 laws. Vision is not a faithful copy of reality — it is filtered, edge-seeking, peripheral-blurred, and goal-biased. Violations here propagate into cognition, composition, and interaction.

---

## D-1 — Norman's Affordance Law
- **Check:** Every interactive element must signal through its visual form what it does. Absent or wrong signifiers are broken design — not user error.
- **Example:** A primary button uses raised shading + label "Save"; a flat grey rectangle with no cue fails even if it is clickable.
- **Source:** B1 Norman, *The Design of Everyday Things*, Ch 1 (signifiers & affordances)

## D-2 — Gulf of Execution / Evaluation
- **Check:** Both gaps between user and system must be bridged explicitly — intent→action (execution) and action→understanding (evaluation).
- **Example:** After clicking "Submit", the form shows both a confirmation receipt and the updated record the user can inspect.
- **Source:** B1 Norman, Ch 1 (gulfs of execution and evaluation)

## D-3 — Perception Bias Law
- **Check:** Design for the interface the user *perceives* (filtered by experience, context, goals) — not the one you intend.
- **Example:** A "Trash" icon reads as delete to desktop users but as "discard photo" to camera-app users; the same glyph carries different perceived meaning.
- **Source:** B9 Johnson, *Designing with the Mind in Mind*, Ch 2 (perception is filtered)

## D-4 — Contrast Primacy Law
- **Check:** Convey structure and meaning through edges and contrast, not subtle color differences alone — vision finds edges, not absolute values.
- **Example:** A 3% grey-on-white status indicator fails; a 1px border + dark icon succeeds for the same semantic.
- **Source:** B9 Johnson, Ch 3 (vision is optimized for contrast)

## D-5 — Gestalt Grouping
- **Check:** Use proximity, similarity, closure, and continuity to construct meaning — violating them produces interfaces users cannot parse without effort.
- **Example:** Form fields clustered by section with internal tight spacing and external generous spacing read as three groups, not twelve fields.
- **Source:** B6 Lidwell, *Universal Principles of Design* (Proximity/Similarity); B7 Williams, Ch 1

## D-6 — Peripheral Vision Law
- **Check:** Do not place critical information outside the foveal zone — the periphery is a frosted shower door, not a clear field.
- **Example:** A "session expired" banner in the far top-right corner is missed; the same banner centered above the main content is seen.
- **Source:** B9 Johnson, Ch 3 (peripheral vision is blurred)

## D-7 — Inattentional Blindness
- **Check:** Never assume visibility equals noticing — focused users miss even obvious off-path elements.
- **Example:** A user completing a checkout form does not see a new discount banner appearing in the sidebar; animate or use audio to force attention to critical changes.
- **Source:** B9 Johnson, Ch 3; B5 Weinschenk, Thing 8

## D-27 — Discoverability Law
- **Check:** A user must be able to determine possible actions and current system state from the surface alone — without instruction.
- **Example:** A drawing app shows tool icons, a canvas, and a layers panel; a blank canvas with a hidden menu bar fails discoverability.
- **Source:** B1 Norman, Ch 1 (discoverability); B2 Krug, Ch 1

## D-34 — Natural Mapping Law
- **Check:** Arrange controls so their position, movement, or symbolism matches the effect they produce — mappings that exploit spatial or cultural analogy require no learning.
- **Example:** A stove burner knob arranged in the same 2×2 layout as the burners (not in a linear row) needs no label.
- **Source:** B1 Norman, Ch 4 (natural mapping)

## D-43 — Face Priority Law
- **Check:** Treat faces as privileged attentional targets — use them intentionally for imagery, avatars, and emotional anchoring; avoid accidental faces that hijack attention.
- **Example:** A charity landing page with a single direct-gaze portrait outperforms a stock crowd shot for donation conversion.
- **Source:** B5 Weinschenk, Thing 38 (faces get privileged processing)

## D-46 — Habituation Law
- **Check:** Expect repeated exposure to decay an element's salience — refresh or relocate critical-but-stale cues; do not rely on a banner the user has seen 100 times.
- **Example:** A "trial expires in 3 days" banner that has shown for 30 days is now wallpaper; escalate by changing color/position as the deadline approaches.
- **Source:** B5 Weinschenk, Thing 33 (habituation is salience decay)

## D-50 — Memory Reconstruction Law
- **Check:** Treat user reports of past flows as reconstructions, not replays — design flows that can be re-derived from current state rather than depending on accurate user memory.
- **Example:** A "Recently viewed" list outperforms asking "what did you look at last time?" because memory is reconstructed, not replayed.
- **Source:** B5 Weinschenk, Thing 31 (memory is reconstruction)

## D-51 — Pattern Recognition Law
- **Check:** Build recognizable structure over novel detail — people identify objects by pattern recognition, and familiar patterns are processed in milliseconds.
- **Example:** A standard three-line hamburger icon is recognized instantly; a custom three-dot-triangle menu icon is not.
- **Source:** B5 Weinschenk, Thing 4 (people recognize by pattern)

## D-59 — Sustained Attention Limit Law
- **Check:** Assume attention decays after ~10 minutes — break long-form content, build checkpoints, and do not demand sustained focus past the limit.
- **Example:** A 30-minute onboarding video fails; the same content as six 5-minute chapters with knowledge checks is completed.
- **Source:** B5 Weinschenk, Thing 42 (sustained attention limit)

## D-62 — Color Law
- **Check:** Use color as a hierarchy and semantic signal, never as the sole encoding — combine with luminance, shape, or label.
- **Example:** A red "error" badge with an icon + text survives red-blind users; a red fill alone fails.
- **Source:** B6 Lidwell (Color)

## D-63 — Constancy Law
- **Check:** Keep the perceived identity of objects stable across changing input (size, rotation, lighting) — users perceive constancy, and violating it confuses recognition.
- **Example:** An app icon stays the same recognizable shape across light/dark mode, badge states, and sizes; do not restyle it per surface.
- **Source:** B6 Lidwell (Constancy)

## D-68 — Exposure Effect Law
- **Check:** Repeated exposure increases preference and trust — but only when initial exposure is neutral-to-positive; hostile first exposures compound negatively.
- **Example:** A new nav label that users initially dislike becomes familiar and preferred after 3–5 exposures — provided the function works.
- **Source:** B6 Lidwell (Exposure Effect)

## D-79 — Pragnanz Law
- **Check:** Prefer the simplest coherent interpretation — ambiguous, fragmented, or over-complex visuals force the brain to work; simple closed forms are resolved effortlessly.
- **Example:** A logo built from 3 clean geometric primitives is parsed instantly; a 40-vertex hand-drawn crest is not.
- **Source:** B6 Lidwell (Law of Pragnanz)

## D-80 — Legibility Law
- **Check:** Optimize visual clarity of characters independent of meaning — dark text on light background (or vice versa), >70% contrast, no patterned backgrounds behind text.
- **Example:** 14px #333 on #fff at 1.5 line-height is legible; 12px #888 on a photo is not.
- **Source:** B6 Lidwell (Legibility)

## D-84 — Picture Superiority Law
- **Check:** Prefer pictures over words for items that must be remembered — pictures are recalled significantly better than words.
- **Example:** A feature tour with annotated screenshots outperforms a text-only tour for retention.
- **Source:** B6 Lidwell (Picture Superiority Effect)

## D-86 — Redundancy Law
- **Check:** Repeat critical information in multiple cue channels (color + shape + label) so the encoding survives single-channel loss.
- **Example:** A status chip uses color (red) + icon (⚠) + word ("Failed") — survives color-blindness, icon-font failure, and screen readers.
- **Source:** B6 Lidwell (Redundancy)

## D-89 — Symmetry Law
- **Check:** Use symmetry to convey balance, stability, and unity — but break symmetry deliberately where focus is needed; accidental asymmetry reads as error.
- **Example:** A login form centered on a symmetric card reads as stable; the same form with a 3px offset reads as broken.
- **Source:** B6 Lidwell (Symmetry)

## D-90 — Threat Detection Law
- **Check:** Threat cues (sharp shapes, sudden motion, angry faces, red) capture attention disproportionately — use intentionally for genuine warnings, never for decoration.
- **Example:** A red error toast with a sharp triangle icon correctly hijacks attention; a red "Sale!" banner trains users to ignore the channel.
- **Source:** B6 Lidwell (Threat Detection)

## D-91 — Uniform Connectedness Law
- **Check:** Visually connected elements (by line, enclosure, or uniform color) are perceived as grouped — use explicit connectors to encode relationships that proximity alone cannot.
- **Example:** A tree view with explicit connector lines reads as hierarchy; the same indentation without lines is ambiguous past two levels.
- **Source:** B6 Lidwell (Uniform Connectedness)

## D-98 — Subitizing Limit Law
- **Check:** People instantly quantify only 4–5 items without counting — above 5, force counting and the glance-quantification fails.
- **Example:** A badge showing "3" is parsed instantly; a badge showing "12" forces the user to count or read the numeral.
- **Source:** B9 Johnson, Ch 5 (subitizing limit)