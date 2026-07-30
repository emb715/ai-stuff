# Antipatterns — Named Mistakes with Corrections

Consolidated from B1–B9. Each antipattern = one named mistake, why it fails, and the correct alternative. Grouped by cluster.

---

## Perception

### Norman Door (Signifier-Affordance Mismatch)
- **Failure mode:** Identical hardware on push and pull sides (or no visible hardware) gives no cue which way the door opens; users push when they should pull. A sign to compensate is a confession of failure.
- **Source:** "When external signifiers—signs—have to be added to something as simple as a door, it indicates bad design." — B1, Chapter 1
- **Relates to:** D-1, D-28
- **Correct alternative:** Use a vertical plate where pushing is required and a pull-shaped handle where pulling is required; expose hinges/pillars so the operating side is obvious.

### Beep-Only Feedback (Uninformative Alarm)
- **Failure mode:** A single cheap beeper or flashing light encodes many states via beep patterns; users can't tell which device is beeping, what state it means, or what to do.
- **Source:** "These simple light flashes or beeps are usually more annoying than useful. They tell us that something has happened, but convey very little information about what happened... Poor feedback can be worse than no feedback at all." — B1, Chapter 1
- **Relates to:** D-2
- **Correct alternative:** Use naturalistic sounds with rich spectra that reveal the source; prioritize and coordinate alarms.

### Disappearing Information
- **Failure mode:** Critical information (status message, phone number, vital sign) displays briefly then vanishes; when the user is interrupted and returns, there is nothing to read.
- **Source:** "Computer systems often enhance people's frustration when things go wrong by presenting critical information in a message that then disappears from the display just when the person wishes to make use of the information." — B1, Chapter 3
- **Relates to:** D-2, D-21
- **Correct alternative:** Persist critical information until dismissed or make it trivially retrievable; design for interruption.

### Multi-Feature Visual Noise
- **Failure mode:** Using several different colors, shapes, and angles together on one page so the visual cortex takes longer to process and no single element stands out.
- **Source:** "If on one page you have several different colors, shapes, and angles, it may take the visual cortex longer to process. You won't be as effective in grabbing visual attention." — B5, Thing 5
- **Relates to:** D-30
- **Correct alternative:** Pick one feature to make the important element pop; use color + orientation together if you must use two.

### Over-Highlighting (Noise Collapse)
- **Failure mode:** Highlighting more than 10% of the visible design dilutes the effect — if everything is highlighted, nothing is highlighted.
- **Source:** "Highlight no more than 10 percent of the visible design; highlighting effects are diluted as the percentage increases." — B6, Highlighting
- **Relates to:** D-74, D-30
- **Correct alternative:** Limit highlighting to ≤10%; use a small number of techniques consistently; prefer bolding over italics/underlining.

### Stroop Interference from Color-Label Mismatch
- **Failure mode:** Presenting color and label-icon in incongruent combinations (green "stop" button, red "go" button) triggers Stroop interference.
- **Source:** "In populations that have learned that green means go and red means stop, the incongruence between the color and the label-icon results in interference." — B6, Interference Effects
- **Relates to:** D-77
- **Correct alternative:** Ensure coding combinations are congruent with learned conventions.

---

## Cognition

### Mode Error (Hidden Modes)
- **Failure mode:** A single control has different meanings in different states, but the current mode is not visible, so the user executes a perfectly-formed command against the wrong mode.
- **Source:** "A mode error occurs when a device has different states in which the same controls have different meanings... Mode error is really design error. Mode errors are especially likely where the equipment does not make the mode visible." — B1, Chapter 5
- **Relates to:** D-2, D-28
- **Correct alternative:** Eliminate modes where possible; otherwise make the active mode continuously visible and the two modes' displays visually distinct.

### Forcing Recall When Recognition Would Do
- **Failure mode:** Hiding functionality and requiring users to recall command names, option locations, or values from memory.
- **Source:** "If a software application hides its functionality and requires its users to recall what to do, some percentage of users will fail." — B9, Chapter 9
- **Relates to:** D-9
- **Correct alternative:** Make high-use functions visible; hide only rare functions behind Details panels or shortcut keys.

### Conceptual Model Bubbling Up from Technology
- **Failure mode:** Letting the underlying hardware, software, or database structure dictate the interface, so only the programmers' mental model fits.
- **Source:** "The conceptual model wasn't really designed at all. It's just a reflection of the underlying hardware or software or database, so the only people whose mental model it fits are the programmers." — B5, Thing 32
- **Relates to:** D-28
- **Correct alternative:** Design the conceptual model deliberately to match the audience's mental model; train if a new model is needed.

### Different Terms for the Same Concept
- **Failure mode:** Using multiple names for the same concept (or the same name for different concepts) forces users to learn and remember the mapping, burdening memory and slowing learning.
- **Source:** "Same name, same thing; different name, different thing... Never use different terms for the same concept, or the same term for different concepts." — B9, Chapter 11
- **Relates to:** D-22
- **Correct alternative:** Map terms to concepts strictly 1:1; pick one term per concept and use it everywhere.

### Long Unchunked Pages
- **Failure mode:** Dumping all information on one page with no progressive disclosure, overwhelming readers.
- **Source:** "If you don't use progressive disclosure, you will end up with very long pages of information that may overwhelm your reader." — B5, Thing 27
- **Relates to:** D-29
- **Correct alternative:** Summarize each topic in one or two sentences; let users click for more.

### False Simplicity (Hiding Complexity)
- **Failure mode:** Removing the visible expression of complexity while leaving the underlying machinery, cost, or cognitive load intact. The surface looks clean; the system is not.
- **Source:** "Simplicity is hopelessly subtle, and many of its defining characteristics are implicit (noting that it hides in simplicity)." — B3, Law 10
- **Relates to:** D-17
- **Correct alternative:** Reduce the underlying system first; let the visible simplicity follow.

---

## Composition

### Equal White Space Between Everything
- **Failure mode:** Leaving equal amounts of white space between all elements destroys grouping signals — every item appears equidistant, so no relationship can be read.
- **Source:** "Avoid leaving equal amounts of white space between elements unless each group is part of a subset." — B7, Chapter 1
- **Relates to:** D-13
- **Correct alternative:** Vary spacing deliberately — tight within a group, generous between groups — to encode which items belong together.

### Sort-of-Different Elements (Conflict, Not Contrast)
- **Failure mode:** Two elements that are slightly different (12pt vs 14pt, half-point vs one-point rule, dark brown vs black) read as a mistake rather than contrast.
- **Source:** "If the two elements are sort of different, but not really, then you don't have contrast, you have conflict." — B7, Chapter 4
- **Relates to:** D-14
- **Correct alternative:** Make the difference dramatic and unmistakable, or make the elements identical.

### Everything the Same Size and Weight
- **Failure mode:** A page where every element has similar visual weight has no focal point — nothing draws the eye, so nothing gets read first.
- **Source:** "Everything is basically the same size and weight and importance... Determine what you want the focus to be. Use contrast to create that focus." — B7, Chapter 4
- **Relates to:** D-14
- **Correct alternative:** Decide what should be the focus and make it dramatically larger/bolder; let supporting items recede.

### Visual Noise — Shouting
- **Failure mode:** Everything on the page clamoring for attention overwhelms users and signals a failure to make tough decisions about what's actually important.
- **Source:** "Shouting. When everything on the page is clamoring for your attention, the effect can be overwhelming... Shouting is usually the result of a failure to make tough decisions about which elements are really the most important." — B2, Chapter 3
- **Relates to:** D-14
- **Correct alternative:** Create a visual hierarchy that guides users to the genuinely important elements first.

### Wall of Words
- **Failure mode:** Long paragraphs confront readers with a "wall of words" that is daunting, makes it harder to keep place, and is harder to scan.
- **Source:** "Long paragraphs confront the reader with what Caroline Jarrett and Ginny Redish call a 'wall of words.' They're daunting, they make it harder for readers to keep their place." — B2, Chapter 3
- **Relates to:** D-11
- **Correct alternative:** Break long paragraphs in two; even single-sentence paragraphs are fine online.

### Misapplied Chunking
- **Failure mode:** Applying chunking to information meant to be searched or scanned (dictionary entries, reference lists). This increases scan time and yields no benefits — chunking is only for memory tasks.
- **Source:** "Chunking is often applied as a general technique to simplify designs... it is unnecessary and counterproductive to restrict the number of dictionary entries on a page to four or five." — B6, Chunking
- **Relates to:** D-83
- **Correct alternative:** Only chunk information when recall/retention is required. Leave scannable/searchable information unchunked.

---

## Interaction

### Identical Adjacent Controls
- **Failure mode:** A row of identical switches (auditorium lights, airplane flap/gear levers) guarantees description-similarity slips; the operator hits the wrong one because nothing distinguishes them.
- **Source:** "One type of popular small airplane has identical-looking switches for flaps and for landing gear, right next to one another. You might be surprised to learn how many pilots have raised the wheels instead of the flaps." — B1, Chapter 4
- **Relates to:** D-1, D-21
- **Correct alternative:** Shape-code controls, separate them spatially, or use distinct colors/labels.

### Ambiguous Clickability
- **Failure mode:** Using the same color for links and non-clickable headings, or failing to give clickable elements distinct shape/location/formatting, forces users to waste milliseconds deciding what to click.
- **Source:** "As a user, I should never have to devote a millisecond of thought to whether things are clickable—or not." — B2, Chapter 1
- **Relates to:** D-16
- **Correct alternative:** Stick to one color for all text links, or ensure shape/location identify clickability.

### Flat Design Removing Affordances
- **Failure mode:** Flat design strips away the visual distinctions (texture, depth, borders) that convey affordances, making it harder to differentiate clickable from non-clickable.
- **Source:** "By removing a number of these distinctions from the design palette, Flat design makes it harder to differentiate things." — B2, Chapter 10
- **Relates to:** D-16
- **Correct alternative:** Use all remaining visual dimensions (position, formatting, color, weight) to compensate for what Flat design removes.

### Rigid Format Requirement
- **Failure mode:** Overusing confirmations causes people to learn to ignore them and become frustrated. When everything requires confirmation, no confirmation is taken seriously.
- **Source:** "Confirmations should be used sparingly, or people will learn to ignore them, and become frustrated at the frequent interruption." — B6, Confirmation
- **Relates to:** D-35
- **Correct alternative:** Reserve confirmations for critical/irreversible operations. Prefer reversibility and safety nets.

### Long Operations Without Progress or Cancel
- **Failure mode:** Time-consuming operations block all other activity, give no clue how long they will take, and cannot be aborted.
- **Source:** "Time-consuming operations that block other activity and cannot be aborted... Providing no clue how long lengthy operations will take." — B9, Chapter 12
- **Relates to:** D-20
- **Correct alternative:** Show progress indicators (work remaining, human-scale time), provide a cancel button, free users to do other things.

### Blame-the-User Antipattern
- **Failure mode:** When a system-induced error occurs, the user is blamed ("human error"), training is repeated, and the design that produced the error is unchanged.
- **Source:** "In my experience, human error usually is a result of poor design: it should be called system error. System design should take this into account." — B1, Chapter 2
- **Relates to:** D-21
- **Correct alternative:** Treat every "human error" as a system-design signal; apply root-cause analysis and redesign so the error is harder or impossible to make.

### Featuritis / Creeping Featurism

---

## Decision

### Hidden Information
- **Failure mode:** Hiding customer support phone numbers, shipping rates, and prices forces users to hunt, diminishes goodwill.
- **Source:** "Hiding information that I want. The most common things to hide are customer support phone numbers, shipping rates, and prices." — B2, Chapter 11
- **Relates to:** D-38
- **Correct alternative:** Be upfront about support numbers, shipping costs, fees, and outages; candor rebuilds goodwill.

### Offering Many Choices Because Users Ask
- **Failure mode:** Giving users many choices because they say they want many, when choice overload actually paralyzes decisions and reduces purchases.
- **Source:** "If you ask people how many options they want, they will almost always say 'a lot' or 'give me all the options.' So if you ask, be prepared to deviate from what they ask for." — B5, Thing 92
- **Relates to:** D-8, D-10
- **Correct alternative:** Limit to three or four, or use progressive choice; ignore stated preference for many.

### Removing Choices After Granting Them
- **Failure mode:** Removing an alternative method of doing a task in a new version, even if the new method is more efficient, because users equate choice with control.
- **Source:** "Once you've given people choices, they'll be unhappy if you take those choices away. You may want to leave some of the older methods in the product so that people feel they have options." — B5, Thing 93
- **Relates to:** D-48
- **Correct alternative:** Keep the old methods alongside the new ones to preserve the feeling of choice.

### Assuming a Stress-Free Environment
- **Failure mode:** Assuming people will use your product in a stress-free context when real-world use is stressful (medical, financial, time-pressured).
- **Source:** "Don't assume that people will use your product in a stress-free environment. Things that may not seem stressful to you as a designer might be very stressful for the person using your product in the real world." — B5, Thing 86
- **Relates to:** D-57
- **Correct alternative:** Do site visits; observe and interview real users in context; redesign for stress.

### Kitchen-Sink Visibility
- **Failure mode:** Trying to make everything visible all the time overloads information and makes relevant information and controls harder to access.
- **Source:** "They try to make everything visible all the time. This approach may seem desirable, but it actually makes the relevant information and controls more difficult to access due to an overload of information." — B6, Visibility
- **Relates to:** D-27
- **Correct alternative:** Use hierarchical organization and context sensitivity. Make visibility correspond to relevance.