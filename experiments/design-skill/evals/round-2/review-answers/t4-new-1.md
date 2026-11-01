Settings page review (`subtle.html`), most severe first:

1. **Focus outline removed** (`*:focus{outline:none}`, with no replacement). Keyboard users can't see where they are. Fix: restore a visible `:focus-visible` ring, such as 2px solid accent with a 2px offset. (D-27, D-19)
2. **Member status is color-only.** The green, red and amber dots carry no text, label or tooltip, so colorblind users and screen readers get nothing, and nobody can tell what the colors mean. Fix: add a text label ("Active", "Suspended", "Pending") and a role. (D-62, D-86)
3. **Destructive ✕ buttons have no safeguard.** Each one removes a member with no confirmation or undo. At 32px it is also smaller than a comfortable touch target and sits right next to the status dot. Fix: enlarge the target to at least 44px, use a labeled "Remove" action that opens a confirmation (or offer undo), and set it apart from the status. (D-35, D-37, D-18)
4. **Two identical primary buttons: "Save" and "Publish changes".** Both are filled blue with the same weight, so the user can't tell which one commits. It's also unclear what "Publish" does that "Save" doesn't. Fix: keep one primary action, make the other a secondary or ghost button, and clarify the labels. (D-14, D-16)
5. **The Workspace URL warning is one dense 70-word run-on in muted gray.** It's the most consequential field on the page, yet it reads as fine print, and it sits below the fields instead of next to the URL. Fix: shorten it to one line ("Existing links redirect for 30 days"), put it directly under the URL input, and make it more prominent. (D-11, D-30, D-49)
6. **Low-contrast muted text.** `#7d838c` on the beige `#f5f1ea` and the blue-gray `#eef2f7` is roughly 3.3:1 or lower, which fails AA for 16px body text. Fix: darken to about `#5a6270` or darker. (D-80, D-4)
7. **Member rows are misbuilt.** Names are `<h3>` headings (this is data, not structure), and the name, dot and ✕ aren't laid out in a row. The ✕ falls onto the same line only by inline flow, with no alignment and no right-edge anchor. Fix: use a flex row with the name on the left and status and actions on the right, and put the rows in a `<ul>`. (D-5, D-94)
8. **Spacing is arbitrary and the form has no rhythm.** Values like 17/23/13/11/8/9/15px don't come from a scale. A 20px gap inside each field separates the label from its input more than adjacent fields are separated (8px). That breaks proximity and makes each label look like it belongs to the field above. Fix: use a 4/8-based scale, a 4–8px label-to-input gap, and 20–24px between fields. (D-5, D-13)
9. **The type scale is incoherent.** The headings at 21.3, 19.4 and 17.6px are almost identical in size, and body text is a flat 16px, so there's little hierarchy. The h1 is barely bigger than the h2. Fix: use a clear scale such as 28/20/16 and use weight for emphasis. (D-14, D-13)
10. **Panels nest and blend into the background.** The beige page, the blue-gray panel and the white inner cards form three tinted layers, and the panel has no border or shadow. This is surface noise: the cool panel clashes with the warm page. Fix: use one neutral ramp, drop the inner card wrapper, and use dividers between members. (D-30, D-17)
11. **Inputs lack affordance and context.**
    - There is no hint of what the URL field is (the domain prefix is missing).
    - There is no validation or inline feedback.
    - The inputs span the full width, which is far too wide for values like these.
    
    Fix: add a "app.example.com/" prefix, cap the width at about 480px, and add validation states. (D-1, D-21, D-36)
12. **Missing basics.**
    - Members has no "Invite" action, no role column and no count.
    - The page has no section navigation.
    - There is no unsaved-changes feedback.
    - The buttons have no hover, disabled or loading states.
    
    Fix: add an Invite button, roles, and a saved or error toast. (D-19, D-33, D-20)
13. **Layout is full-bleed at 1100px with a single column.** Short forms stretch across a wide canvas, which leaves long, empty scan lines. Fix: narrow the content column to about 720px, or use a two-column layout with a label column and a field column. (D-49, D-73)

SKILLS_USED: design-laws
