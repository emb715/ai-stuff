# Cognition — Design Laws for What Users Process

24 laws. Working memory holds ~4 items, recognition beats recall, reading is fragile, and decisions are log-scaled by choice count. Violations here turn screens into taxes.

---

## D-8 — Miller's Constraint
- **Check:** Hold simultaneous working-memory items to ~4 (Weinschenk's update of 7±2); exceeding 4 produces errors and abandonment.
- **Example:** A checkout that asks the user to remember promo code, shipping estimate, gift option, tax, and total across 3 steps exceeds the limit; show a persistent summary panel.
- **Source:** B5 Weinschenk, Thing 20; B9 Johnson, Ch 4

## D-9 — Recognition Over Recall
- **Check:** Every piece of information a user must remember is a failure mode — provide cues, dropdowns, visible state, history.
- **Example:** A "Recently used" list outperforms a free-text field that demands the user recall a saved filter name.
- **Source:** B9 Johnson, Ch 9; B2 Krug, Ch 3

## D-10 — Hick's Law
- **Check:** Decision time grows logarithmically with alternatives — reducing options is a design improvement, not a feature cut.
- **Example:** A settings page with 4 primary actions outperforms one with 20 equal-weighted links; move rare actions to an "Advanced" panel.
- **Source:** B6 Lidwell (Hick's Law); B5 Weinschenk, Thing 92

## D-11 — Scanning Law
- **Check:** Structure content for the scanner — meaningful headings, short paragraphs, frontloaded info, visual anchors. Walls of prose are abandoned, not read.
- **Example:** A docs page with H2 per question, 2-sentence answers, and bold key terms is read; a 5-paragraph essay on the same content is skipped.
- **Source:** B2 Krug, Ch 3 (users scan)

## D-12 — Reading Disruption
- **Check:** Reading is unnatural and breaks easily — poor contrast, jargon, competing visuals, or inconsistent layout fragment comprehension.
- **Example:** A 11px light-grey body on a busy photo background fails; 16px #222 on a plain #fff succeeds.
- **Source:** B9 Johnson, Ch 6 (reading is fragile)

## D-28 — Conceptual Model Law
- **Check:** The system image (controls + labels + behavior) must support a coherent, accurate mental model — incoherent models produce hesitation, misuse, and false confidence.
- **Example:** A file system with folders, files, and a trash can maps to a physical office model users already hold; a "documents as URLs" model does not.
- **Source:** B1 Norman, Ch 1; B6 Lidwell (Mental Model); B9 Johnson, Ch 11

## D-32 — External Memory Law
- **Check:** Move memory burden from the user's head into the environment — cues, history, visible state, reminders. Recall is hard; recognition is easy.
- **Example:** A wizard that shows "Step 3 of 5: Shipping" with a completed-step sidebar outperforms one that shows only the current step.
- **Source:** B1 Norman, Ch 3; B6 Lidwell (Mnemonic Device); B9 Johnson, Ch 9

## D-41 — Category Drive Law
- **Check:** People create categories instinctively — design must support explicit, predictable grouping; ungrouped lists force the user to categorize mentally.
- **Example:** A 60-item settings list grouped into 6 named sections is navigable; the same 60 items in a flat alphabetical list are not.
- **Source:** B5 Weinschenk, Thing 21 (people create categories)

## D-42 — Examples Before Abstractions Law
- **Check:** Lead with concrete examples, follow with abstractions — examples teach, abstractions label.
- **Example:** An empty state that shows a filled example record outperforms one that explains "you can add records here".
- **Source:** B5 Weinschenk, Thing 24 (example-first learning)

## D-44 — Functional Forgetting Law
- **Check:** Forgetting is not purely a defect — design for resurfacing and resumption, not for permanent retention.
- **Example:** A "Continue where you left off" prompt on return is better than expecting the user to remember their last action.
- **Source:** B5 Weinschenk, Thing 25 (forgetfulness is functional)

## D-45 — Habit Loop Law
- **Check:** Cue-routine-reward loops stabilize behavior — design for the routine the user already has, or build a new cue explicitly.
- **Example:** A daily-standup app that pings at 9:55 with "Add your update" + shows team responses after submit builds the loop; a manual-trigger app does not.
- **Source:** B5 Weinschenk, Thing 67 (habit loops)

## D-47 — Social Mirroring Law
- **Check:** People imitate and mirror — social proof, "others also did X", and visible collaborator avatars shape behavior intentionally.
- **Example:** "32 of your teammates use this template" increases adoption; a hidden template gallery does not.
- **Source:** B5 Weinschenk, Thing 44 (imitation and empathy)

## D-48 — Intrinsic Motivation Law
- **Check:** Prefer intrinsic rewards (autonomy, mastery, purpose) over extrinsic ones (points, badges) for sustained engagement — extrinsics decay.
- **Example:** A learning app that surfaces "you can now build X" (mastery) outperforms one that surfaces "+50 XP" (extrinsic) past week 2.
- **Source:** B5 Weinschenk, Thing 71 (intrinsic over extrinsic)

## D-49 — Line-Length Tension Law
- **Check:** Readability is a tradeoff — too short lines break rhythm, too long lines lose the return sweep; 45–75 characters is the working band.
- **Example:** A reading column at 66ch with 1.5 line-height reads well; a 200ch full-width column on a 1440px screen does not.
- **Source:** B5 Weinschenk, Thing 27 (line-length tension)

## D-53 — Progress-Mastery-Control Law
- **Check:** Motivation is the triad of visible progress, felt mastery, and perceived control — design for all three, not just progress.
- **Example:** A language app showing streak (progress), "you mastered 12 verbs" (mastery), and a free-choice lesson picker (control) outperforms a streak-only design.
- **Source:** B5 Weinschenk, Thing 93 (progress + mastery + control)

## D-54 — Screen Reading Cost Law
- **Check:** Screen reading is harder than paper reading — reduce text burden on screens; prefer visuals, scannable structure, and shorter copy.
- **Example:** A 3-icon "How it works" row outperforms a 3-paragraph "How it works" block on a mobile onboarding screen.
- **Source:** B5 Weinschenk, Thing 26 (screen reading cost)

## D-56 — Story Form Law
- **Check:** Prefer story form over data dumps — stories are encoded, recalled, and acted on better than equivalent facts.
- **Example:** A case study told as "Customer X had problem Y, did Z, got result W" outperforms a feature comparison table for the same content.
- **Source:** B5 Weinschenk, Thing 60; B6 Lidwell (Storytelling)

## D-57 — Stress Error Spike Law
- **Check:** Stress increases errors — design for the real, stressed context (medical, financial, time-pressured), not the calm designer's desk.
- **Example:** A hospital charting UI tested in a quiet office fails in a noisy ward; test on the floor and enlarge touch targets.
- **Source:** B5 Weinschenk, Thing 86 (stress error spike)

## D-58 — Variable Reward Law
- **Check:** Unpredictable reward schedules motivate disproportionately — use intentionally for engagement, never exploitively.
- **Example:** A "Surprise me" daily prompt with rotating content sustains return visits better than a fixed "Today's prompt".
- **Source:** B5 Weinschenk, Thing 74 (variable rewards)

## D-61 — Use-It-or-Lose-It Law
- **Check:** Information must be rehearsed to stick — design learning UX with spaced repetition or re-exposure, not one-shot tutorials.
- **Example:** A keyboard-shortcut hint that re-appears after 3 days of use outperforms a one-time onboarding tooltip.
- **Source:** B5 Weinschenk, Thing 35 (use it to keep it)

## D-66 — Depth of Processing Law
- **Check:** Deeper processing (meaning, association) produces stronger memory than shallow processing (surface features) — design for meaning, not for decoration.
- **Example:** A label "Delete project" (meaning) is remembered; an icon-only trash button (surface) is re-derived each time.
- **Source:** B6 Lidwell (Depth of Processing)

## D-76 — Immersion Law
- **Check:** Focused involvement changes tolerance and attention — immersive contexts tolerate longer flows; non-immersive contexts demand chunking.
- **Example:** A game can demand a 10-minute onboarding; a banking app cannot.
- **Source:** B6 Lidwell (Immersion)

## D-77 — Interference Effects Law
- **Check:** Competing stimuli impede performance — reduce interference by separating channels, sequencing rather than simultaneous display, and avoiding incongruent cues.
- **Example:** A red "Go" button + green "Stop" button triggers Stroop interference; align color with learned meaning.
- **Source:** B6 Lidwell (Interference Effects)

## D-82 — Operant Conditioning Law
- **Check:** Reinforcement shapes repeated behavior — consistent positive reinforcement for desired actions builds the routine; inconsistent or punishing reinforcement breaks it.
- **Example:** A "Saved!" toast on every save reinforces the save habit; a silent save leaves the user unsure whether to repeat the action.
- **Source:** B6 Lidwell (Operant Conditioning)

## D-88 — Serial Position Law
- **Check:** Beginnings and endings are remembered better than middles — place the most important items first or last; never bury critical content in the middle.
- **Example:** A feature list with the flagship feature first + the pricing CTA last outperforms the same list with the flagship buried at position 4.
- **Source:** B6 Lidwell (Serial Position Effects)

## D-95 — Automatic Processing Law
- **Check:** Forcing formerly automatic behavior into conscious control slows and destabilizes — preserve automatic paths; do not re-route without compensation.
- **Example:** Moving the keyboard shortcut for "Save" from Cmd+S to Cmd+Shift+S forces every experienced user back into conscious control and spikes errors.
- **Source:** B9 Johnson, Ch 7 (automatic vs controlled processing)

## D-96 — Interruptibility Cost Law
- **Check:** Interruptions damage working-memory continuity — design for resumption: persist state, surface the prior goal, and show "where was I?" cues.
- **Example:** An editor that auto-saves drafts and shows "Welcome back — you were editing Section 3" outperforms one that opens to a blank canvas.
- **Source:** B9 Johnson, Ch 8 (interruptibility cost)