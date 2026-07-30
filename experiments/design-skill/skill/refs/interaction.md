# Interaction — Design Laws for Flow and Action

13 laws. Feedback, time thresholds, error inevitability, and convention govern the user moving through time. Violations here produce abandonment and blame-the-user spirals.

---

## D-18 — Fitts' Law
- **Check:** Make frequently-used and critical controls large and near; place dangerous or infrequent controls smaller and farther — T = a + b·log₂(D/W).
- **Example:** Primary "Save" button is 44px tall and thumb-reachable; "Delete account" is a small text link in a settings submenu.
- **Source:** B9 Johnson, Ch 9 (Fitts' Law)

## D-19 — Feedback Law
- **Check:** Every action must produce immediate, clear, relevant feedback — absence of feedback is interpreted as failure and triggers re-clicks.
- **Example:** Clicking "Submit" shows a spinner → success toast → updated list; a silent submit causes the user to click again, producing duplicate submissions.
- **Source:** B1 Norman, Ch 1 (feedback); B9 Johnson, Ch 12

## D-20 — Responsiveness Threshold
- **Check:** Honor the three time constants: 0.1s = instantaneous, 1s = show spinner, 10s = show progress + allow cancel — exceeding without feedback breaks perceived control.
- **Example:** A search that takes 1.4s shows a spinner at 1s; a search that takes 8s with no indicator reads as frozen.
- **Source:** B9 Johnson, Ch 12 (responsiveness thresholds)

## D-21 — Error Inevitability
- **Check:** If an error is possible, someone will make it — errors are design failures, not user failures. Anticipate, minimize, and ensure recovery.
- **Example:** A delete action with undo for 10s outperforms one with a confirm dialog — undo handles the error class without blocking the correct action.
- **Source:** B1 Norman, Ch 5; B5 Weinschenk, Thing 85

## D-22 — Familiarity Law
- **Check:** Follow established conventions unless the departure delivers measurable value outweighing the relearning cost — novelty is not a feature.
- **Example:** Logo top-left, search top-right, cart icon to the right of nav — follow these unless you have evidence your alternative is better.
- **Source:** B9 Johnson, Ch 10; B2 Krug, Ch 3

## D-33 — Wayfinding Law
- **Check:** Provide continuous orientation cues — where am I, where can I go, how do I get back. Navigation that forces reconstruction from memory has already failed.
- **Example:** Breadcrumbs + active-section highlight + persistent "Home" link let users orient without back-button guessing.
- **Source:** B6 Lidwell (Wayfinding); B2 Krug, Ch 6

## D-35 — Confirmation Law
- **Check:** Reserve confirmations for critical or irreversible operations only; phrase as Yes/No or an action verb, never OK/Cancel — over-confirmation trains users to dismiss them.
- **Example:** "Delete project? This cannot be undone. [Delete] [Cancel]" — specific verb + clear consequence; "OK / Cancel" on the same action is ambiguous.
- **Source:** B1 Norman, Ch 5; B6 Lidwell (Confirmation)

## D-36 — Action Constraint Law
- **Check:** Block invalid-state actions before they are possible — interlocks, lockouts, and constraints prevent errors that confirmation dialogs only warn about.
- **Example:** The "Submit" button is disabled until all required fields are valid; a confirm dialog after the fact is weaker than the disabled-state constraint.
- **Source:** B1 Norman, Ch 4 (interlocks & lockouts); B6 Lidwell (Constraint)

## D-37 — Undoability Law
- **Check:** Provide multi-level undo as the default recovery path — undo handles the broadest error class with the least user friction.
- **Example:** Gmail's 30-second "Undo send" outperforms a "Are you sure?" confirm — undo does not block the correct action.
- **Source:** B1 Norman, Ch 5 (undo); B6 Lidwell (Forgiveness)

## D-52 — Error Pattern Law
- **Check:** Errors are patterned, not random — design can anticipate error classes (slips, lapses, mode errors, description-similarity errors) and defend against each.
- **Example:** A medical dosage field that flags values 10× outside the typical range catches the description-similarity slip class.
- **Source:** B5 Weinschenk, Thing 85 (predictable error types)

## D-60 — Time Over Money Law
- **Check:** In experience decisions, users often value time over money — surface time savings, not just price savings, where both apply.
- **Example:** "Skip the line — 15 min saved" can outperform "$2 off" for a coffee app's premium tier.
- **Source:** B5 Weinschenk, Thing 73 (time over money)

## D-64 — Perceived Control Law
- **Check:** User-perceived control affects confidence and adoption — provide choice, undo, and visible state even when the system handles the work.
- **Example:** A "Pause upload" button on a file transfer increases perceived control even if users rarely pause.
- **Source:** B6 Lidwell (Control)

## D-65 — Cost-Benefit Law
- **Check:** An activity is pursued only if benefit ≥ effort — every increment of effort must be matched by an increment of perceived benefit.
- **Example:** A 12-field signup form with no stated benefit is abandoned; a 3-field form + "Get your personalized plan" is completed.
- **Source:** B6 Lidwell (Cost-Benefit)

## D-72 — Framing Law
- **Check:** The presentation of options changes judgments — frame equivalent options in terms of gain or loss per the user's context.
- **Example:** "90% survival" is accepted; "10% mortality" is rejected — same data, different frame.
- **Source:** B6 Lidwell (Framing)

## D-97 — Mode Visibility Law
- **Check:** Hidden modes manufacture errors — eliminate modes where possible; otherwise make the active mode continuously and conspicuously visible.
- **Example:** A text editor with a visible "INSERT / OVERWRITE" indicator outperforms one where the mode is invisible.
- **Source:** B9 Johnson, Ch 10 (mode visibility)