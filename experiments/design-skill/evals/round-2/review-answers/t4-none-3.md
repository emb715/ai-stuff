**Design review: Workspace settings (subtle.html)**

1. **Focus outlines are removed (`*:focus{outline:none}`).** Keyboard users can't see where they are. Delete the rule, or replace it with a visible `:focus-visible` ring such as `outline:2px solid #2f5bd3; outline-offset:2px`.

2. **Member status is shown by color alone.** The green, red and amber dots have no text, no label and no `aria-label`. Color-blind and screen-reader users get nothing, and the meaning is undefined for everyone. Add a text label ("Active", "Suspended", "Pending") with an icon or shape, and put the label in the accessible name.

3. **Member removal is a bare, unconfirmed ✕.** It deletes a person with no confirmation or undo, sits right beside the status dot, and is labeled only "Remove". The 32px target is also small. Use "Remove Ana Torres", add a confirm dialog or undo toast, make the target at least 40–44px, and style it as destructive on hover.

4. **Two equal primary buttons, "Save" and "Publish changes".** Both use the same filled blue, so the difference in consequence is unclear. "Save" versus "Publish" is ambiguous, and nothing says what publishing does. Keep one primary action. Make the other secondary, or merge them. Disable the buttons until something changes.

5. **The URL-change warning is a dense wall of text.** It's a 70-word sentence in grey that uses the same style as ordinary help text. Users will skip it, and it's the one place a mistake is costly. Shorten it to something like "Old links redirect for 30 days, then break." Put it in a warning callout, show it only when the field changes, and add a confirm step.

6. **The Workspace URL field has no URL context.** It shows a bare "northline" with no domain prefix or suffix. Add a visible `.app.com/` prefix, plus validation and an availability check.

7. **Help text and lede contrast is too low.** `#7d838c` on `#eef2f7` is about 3.4:1 and on `#f5f1ea` about 3.3:1, which fails WCAG AA for 16px text. Darken to roughly `#5a616b` or darker.

8. **Heading hierarchy is wrong, and the sizes are nearly flat.** The h1, h2 and h3 sizes are 21.3, 19.4 and 17.6px, and the 16px body sits close behind. There's almost no visual hierarchy. Members are marked up as `h3` when they're list items, which clutters the outline for screen readers. Use a clear scale (for example 28/20/16 with weight differences). Render members as a `ul`/`li` with the name as plain text.

9. **Form spacing is inverted.** Label-to-input gap is 20px, but the gap between fields is only 8px. Each label looks closer to the previous field's input than to its own. Set label-to-input gap to about 6px and field-to-field gap to about 20px.

10. **Nested panels use low-contrast surfaces.** White `.inner` cards sit on a blue-grey `.panel` that sits on a warm beige page. That's three unrelated surface tones, and a card inside a card for a simple list. The cool and warm backgrounds clash. Pick one neutral family. Use dividers in a list instead of nested cards.

11. **Member rows lack structure.** The name, dot and button are inline with no alignment, no role, no email, and no right-aligned actions. Use a flex row: avatar and name on the left, role and status in the middle, remove on the right.

12. **The Members section has no purpose or actions.** There's no invite button, no count, no roles and no empty state. The lede promises "who can access it", but nothing here manages access. Add an "Invite member" button, a role selector and a member count.

13. **Layout and details.**
    - The 1100px line length is too wide for a single-column form. The inputs stretch edge to edge. Cap the form at about 560–640px.
    - The buttons are separated by an HTML whitespace gap rather than by spacing rules. Use a flex `gap`.
    - Inputs lack `autocomplete` and `spellcheck="false"` on the URL field.
    - The font stack names Inter but never loads it, so the rendering differs between machines.
    - `p,label,input` are fixed at 16px with no scale, and the `h1` has no landmark `main` wrapper.

SKILLS_USED: none
