Here are the problems in `subtle.html`, most severe first.

1. **Keyboard focus is removed.** `*:focus{outline:none}` hides every focus ring, so keyboard users can't see where they are (D-27, D-19). Replace it with `:focus-visible{outline:2px solid #2f5bd3;outline-offset:2px}`.
2. **Member status is shown only as a colored dot.** The green, red and amber dots have no label, so they fail colorblind users and mean nothing to anyone else (D-62, D-86). Replace each dot with a text badge such as "Active", "Suspended" or "Pending", with the color as a secondary cue.
3. **The remove ✕ is risky.** It's a 32px icon-only button with no confirmation or undo, sitting next to the status dot (D-18, D-35, D-37). Make the target at least 44px, label it "Remove Ana", and add an undo toast or confirm step. Style it as a quiet destructive action.
4. **Save and Publish changes look identical.** Two filled blue buttons leave no primary action, and it's unclear how they differ (D-14, D-16). Keep one filled primary (probably Save), make the other a secondary or outline button, or merge them. Also give the two buttons a flex `gap` instead of relying on whitespace between them.
5. **Field spacing is inverted.** The label-to-input gap is 20px, but the gap between fields is only 8px. Each label therefore groups with the field above it rather than its own input (D-5, D-13). Use a gap of about 6px inside a field and about 20px between fields.
6. **The URL warning is a wall of text.** It's one 60-word sentence in gray, and the consequence ("links stop working after 30 days") is buried in the middle (D-11, D-49, D-78). Cut it to one line, such as "Old links redirect for 30 days." Put it directly under the URL input, ideally showing the full URL (`northline.app/…`).
7. **Muted text has low contrast.** `#7d838c` on `#eef2f7` and on `#f5f1ea` is about 3.3:1, below the 4.5:1 minimum for body text (D-80). Darken it to about `#596069`.
8. **Input borders are too faint.** `#cfd4da` on white is about 1.5:1, below the 3:1 minimum for UI components. Use about `#8a9199`. The inputs also have no hover, error, disabled or saved states, and nothing confirms that Save worked (D-19).
9. **The type scale has no hierarchy.** h1, h2 and h3 are 21.3px, 19.4px and 17.6px against 16px body text. Those sizes are too close, so the page title barely outranks the section titles (D-14). Use a scale like 28 / 20 / 16, with whole-pixel sizes.
10. **Member names are h3 headings.** Names aren't section headings, so screen-reader heading navigation is polluted, and the names are bolder than the surrounding text. Use a plain `<li>` with a medium-weight name.
11. **Member rows aren't laid out as rows.** There's no flex, so the dot and ✕ button wrap under the name instead of aligning to the right. Use a flex row with the name on the left and status and action on the right, plus a role column.
12. **Surfaces are nested and clash.** A cool blue-gray panel sits on a warm beige page, with white cards inside it (card-in-card). Use one neutral surface per section, and use dividers rather than boxes for the member rows.
13. **Spacing and radius values are arbitrary.** Spacing uses 17, 23, 13, 11, 9, 15 and 4px, and radii are 12 and 6px, with no token set (T-spacing, D-26). Adopt a 4/8px spacing scale with two radii.
14. **Buttons and inputs don't inherit the font.** `.btn` and `input` don't set `font-family`, and `.btn` doesn't set `font-size`, so buttons render at about 13px in the system font while the rest of the page is 16px Inter (D-26). Add `font:inherit` to both.
15. **Inputs stretch to the full 1100px width.** That's far too wide for a short workspace name or slug. Cap them at about 420px.
16. **The Members section has no way to add people.** It lists three people but has no "Invite member" action and no role or last-active context (D-17, D-29). Add an Invite button in the section header.

SKILLS_USED: design-laws
