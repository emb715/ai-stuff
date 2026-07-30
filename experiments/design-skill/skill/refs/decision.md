# Decision — Design Laws for Rationale and Outcomes

11 laws. The meta-layer: why this choice, defended by what principle, measured by what outcome. Without these, the other 87 laws become optional.

---

## D-23 — Principled Decision Law
- **Check:** Every design decision must be traceable to a user need or a design principle — "I like it this way" is not a reason. A decision that cannot be defended with a law is a defect.
- **Example:** When asked "why is the CTA that size?", cite D-14 (hierarchy) + D-18 (Fitts' Law), not personal preference.
- **Source:** B8 Greever, *Articulating Design Decisions*

## D-24 — Outcome Over Aesthetic
- **Check:** Measure success by outcomes (task completion, error rate, confidence) — not by how the design looks in isolation. A beautiful design that does not move the user toward their goal is expensive decoration.
- **Example:** A polished pricing page with 2% conversion is worse than a plain page with 8% conversion.
- **Source:** B4 Gothelf, *Lean UX*; B8 Greever

## D-25 — Emotional Resonance Law
- **Check:** Account for how the design feels, not just what it does — most decisions are unconscious and emotion-driven; functionally correct but emotionally incongruent designs are resisted.
- **Example:** A medical-results page with cold clinical styling in a context where users are anxious amplifies the anxiety; warm, calm styling reduces it.
- **Source:** B5 Weinschenk, Thing 7; B3 Maeda (EMOTION)

## D-26 — Trust-Through-Consistency
- **Check:** Repeat patterns to teach the system's rules — each violation (same action, different result) fractures trust and forces relearning. A system inconsistent with itself cannot be learned, only endured.
- **Example:** Every "Save" button across the app uses the same color, label, and position; a Save button that is blue here and green there erodes trust.
- **Source:** B3 Maeda (TRUST); B7 Williams, Ch 3

## D-31 — Goal Gradient Law
- **Check:** Motivation increases as users perceive themselves closer to the goal — visible progress is behavioral fuel, not decoration. Hiding progress hides the reason to continue.
- **Example:** A multi-step form with a progress bar ("Step 2 of 4") is completed more often than the same form with no progress indicator.
- **Source:** B5 Weinschenk, Thing 41 (goal gradient)

## D-58 — Variable Reward Law
- **Check:** Unpredictable reward schedules motivate disproportionately — use intentionally for engagement, never exploitively. (Cross-listed with Cognition.)
- **Example:** A "Discover" feed with rotating content sustains return visits better than a fixed daily feed.
- **Source:** B5 Weinschenk, Thing 74 (variable rewards)

## D-60 — Time Over Money Law
- **Check:** Users often value time over money in experience decisions — surface time savings where they apply. (Cross-listed with Interaction.)
- **Example:** "Save 20 min per week" can be the dominant selling point over "$5/month off".
- **Source:** B5 Weinschenk, Thing 73 (time over money)

## D-64 — Perceived Control Law
- **Check:** User-perceived control affects confidence and adoption — provide choice, undo, and visible state. (Cross-listed with Interaction.)
- **Example:** Users who can pause/cancel a long operation report higher satisfaction even when they never pause.
- **Source:** B6 Lidwell (Control)

## D-65 — Cost-Benefit Law
- **Check:** Activity is pursued only if benefit ≥ effort — every increment of effort must be matched by perceived benefit. (Cross-listed with Interaction.)
- **Example:** Adding a required step must come with a stated benefit the user can see; a step with no visible benefit is abandoned.
- **Source:** B6 Lidwell (Cost-Benefit)

## D-72 — Framing Law
- **Check:** Presentation of options changes judgments — frame equivalent options per the user's context (gain vs loss). (Cross-listed with Interaction.)
- **Example:** Default-opt-in vs default-opt-out for organ donation produces ~99% vs ~15% participation from the same choice.
- **Source:** B6 Lidwell (Framing)

## D-92 — Weakest Link Law
- **Check:** Experience fails at the most fragile component — invest in the weakest link, not the strongest. (Cross-listed with Composition.)
- **Example:** A perfect onboarding funnel with a broken email-verification step fails the whole flow; fix the email step first.
- **Source:** B6 Lidwell (Weakest Link)