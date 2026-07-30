# Heuristics — Checkable Questions for UI Review

Consolidated from B1–B9. Each heuristic = one checkable question. Grouped by review stage.

---

## Layout

### Visual Stops Count (Squint Test)
- **Check:** Squint at the page and count how many times your eye stops. If more than 3–5, group related items into closer proximity until they become one visual unit.
- **Source:** "Squint your eyes slightly and count the number of visual elements on the page by counting the number of times your eye stops. If there are more than three to five items, see which of the separate elements can be grouped together." — B7, Chapter 1
- **Relates to:** D-13, D-14

### Alignment Lines Check
- **Check:** Can you draw visible lines along aligned objects? If alignments are weak, missing, or multiple-and-unconnected, the page will feel messy.
- **Source:** "In any well-designed piece, you will be able to draw lines to the aligned objects, even if the overall presentation of material is a wild collection of odd things." — B7, Chapter 2
- **Relates to:** D-13

### Contrast Strength Check
- **Check:** For every pair of elements that are not the same, is the difference strong enough that no one could mistake it for an error? 12pt vs 14pt, half-point vs one-point rules, dark brown vs black all fail.
- **Source:** "You cannot contrast 12-point type with 14-point type. You cannot contrast a half-point rule with a one-point rule. Get serious." — B7, Chapter 4
- **Relates to:** D-14

### Clear Focal Point Check
- **Check:** Glance at the page for one second. Where did your eye land? If nothing drew the eye, there is no focal point.
- **Source:** "Everything is basically the same size and weight and importance... Determine what you want the focus to be." — B7, Chapter 4
- **Relates to:** D-14

### Legibility Contrast Check
- **Check:** Is dark text on light background (or vice versa) used? Do contrast levels exceed 70%? Are patterned/textured backgrounds avoided?
- **Source:** "Use dark text on a light background or vice versa. Performance is optimal when contrast levels between text and background exceed 70 percent." — B6, Legibility
- **Relates to:** D-80

---

## Interaction

### Affordance Cue Check
- **Check:** Do buttons, links, and controls give visual cues (shadows, shading, hover states) that match how they actually behave? Are there any incorrect affordances?
- **Source:** "Avoid providing incorrect affordance cues." — B5, Thing 7
- **Relates to:** D-1, D-27, D-34

### Mode Visibility Check
- **Check:** If the device has modes (same control, different meaning), is the current mode continuously and conspicuously visible? Could the mode be eliminated?
- **Source:** "Mode errors are especially likely where the equipment does not make the mode visible. Designers must try to avoid modes, but if they are necessary, the equipment must make it obvious which mode is invoked." — B1, Chapter 5
- **Relates to:** D-2, D-28

### Fitts' Law Control Check
- **Check:** Are frequently-used/critical controls large and near? Are dangerous/infrequent controls smaller and farther away? Are controls at screen edges/corners?
- **Source:** "Make sure that controls are near or large, particularly when rapid movements are required and accuracy is important. Likewise, make controls more distant and smaller when they should not be frequently used." — B6, Fitts' Law
- **Relates to:** D-10, D-36

### 0.1s Cause-and-Effect Deadline Check
- **Check:** Does the system acknowledge user actions within 0.1 seconds, preserving perception of cause and effect?
- **Source:** "If software waits longer than 0.1 second to show a response to a user's action, the perception of cause and effect is broken." — B9, Chapter 12
- **Relates to:** D-20

### Confirmation Necessity Check
- **Check:** Are confirmations reserved for critical or irreversible operations only? Do messages end with Yes/No or an action verb (not OK/Cancel)?
- **Source:** "Confirmations should be used sparingly, or people will learn to ignore them... The message should end with one question structured to be answered Yes or No, or with an action verb (OK and Cancel should be avoided)." — B6, Confirmation
- **Relates to:** D-35

---

## Content

### Question-Mark Elimination
- **Check:** Looking at this page, what question marks appear over the user's head? Where am I? Where should I begin? Where did they put X? Why did they call it that?
- **Source:** "I could list dozens of things that users shouldn't spend time thinking about, like Where am I? Where should I begin? Where did they put ___? Why did they call it that?" — B2, Chapter 1
- **Relates to:** D-17

### Title-First Check
- **Check:** Does the page or passage have a meaningful title or headline that frames what the reader is about to understand?
- **Source:** "Provide a meaningful title or headline. It's one of the most important things you can do." — B5, Thing 14
- **Relates to:** D-56

### Font-Difficulty Attribution Check
- **Check:** Is the font so decorative that users will transfer the felt reading difficulty onto the task itself and decide the task is hard?
- **Source:** "If people have trouble reading the font, they will transfer that feeling of difficulty to the meaning of the text itself and decide that the subject of the text is hard to do or understand." — B5, Thing 15
- **Relates to:** D-54

### Label-Goal Match Check
- **Check:** At each choice point, does the wording of each option literally match what a goal-directed user would be scanning for?
- **Source:** "People don't think deeply about instructions, command names, option labels... their attention will be attracted by anything displaying the words 'buy,' 'flight,' 'ticket,' or 'reservation.'" — B9, Chapter 8
- **Relates to:** D-9

### Chunk-Size Check
- **Check:** If you can't limit total items to four, are they grouped into chunks of no more than four? Is any single menu, list, or choice set longer than four ungrouped items?
- **Source:** "Limit the number of choices or items to three or four. When you chunk or group information, make sure there are no more than four items in each chunk." — B5, Thing 20
- **Relates to:** D-8

---

## Flow

### Trunk Test
- **Check:** Dropped on a random deep page (at arm's length / squinting), can you immediately identify: Site ID, page name, sections, local nav, "You are here", and search?
- **Source:** "Step 1: Choose a page anywhere in the site at random. Step 2: Hold it at arm's length or squint. Step 3: As quickly as possible, try to find and circle each of these items." — B2, Chapter 6
- **Relates to:** D-33

### Mindless Click Test
- **Check:** Is each click a mindless, unambiguous choice? Does the link give off a strong "scent of information" that I'm on the right track?
- **Source:** "It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice." — B2, Chapter 4
- **Relates to:** D-39

### Interruption Recovery Check
- **Check:** After an interruption, can the user resume by reading the current state from the system, or does the system discard the goal/plan/state needed to resume?
- **Source:** "A major source of error is interruption... Most systems make it difficult to resume after an interruption. Most discard critical information needed by the user." — B1, Chapter 5
- **Relates to:** D-2, D-21, D-27

---

## State

### Discoverability Check
- **Check:** Can a first-time user determine what actions are possible, where and how to perform them, and what state the device is in — without a manual?
- **Source:** "Discoverability: Is it possible to even figure out what actions are possible and where and how to perform them?" — B1, Chapter 1
- **Relates to:** D-1, D-2, D-28

### Feedback Quality Check
- **Check:** Is feedback immediate, informative, prioritized, and unobtrusive — does each action confirm receipt, convey what happened, and avoid drowning out critical signals?
- **Source:** "Feedback must be immediate... Feedback must also be informative... Feedback must also be prioritized, so that unimportant information is presented in an unobtrusive fashion, but important signals are presented in a way that does capture attention." — B1, Chapter 1
- **Relates to:** D-2

### Conceptual Model Coherence Check
- **Check:** Does the system image (controls + labels + behavior) suggest a single, consistent conceptual model that matches the actual mechanism?
- **Source:** "When the system image is incoherent or inappropriate, then the user cannot easily use the device. If it is incomplete or contradictory, there will be trouble." — B1, Chapter 1
- **Relates to:** D-27

### Change-Blindness Check
- **Check:** If you refresh a screen with one small change (e.g., an error message), have you added a blinking or auditory cue so users actually notice the change?
- **Source:** "Don't assume that people will see something on a screen just because it's there. Users may not even realize they are looking at a different screen." — B5, Thing 8
- **Relates to:** D-7

### Recognition-vs-Recall Check
- **Check:** Are users asked to recall a value from memory when a dropdown, auto-fill, or visible list would let them recognize it?
- **Source:** "Eliminate memory load whenever possible. Make use of user interface features such as auto-fill and dropdown lists to reduce the need for people to recall items from memory." — B5, Thing 22
- **Relates to:** D-32

---

## Error

### Error-Message Quality Check
- **Check:** Does each error message tell the user what they did, explain the problem, instruct how to correct it, use active voice, and show an example where appropriate?
- **Source:** "Write error messages in plain language and make sure to tell them what they did, why there is an error, and what they should do to fix it. If appropriate, show them an example." — B5, Thing 85
- **Relates to:** D-21, D-52

### Error Placement Check
- **Check:** Are error messages placed where the user is looking (near the field in error or clicked button), marked with an error symbol, and is red reserved exclusively for errors?
- **Source:** "Put it where users are looking... Mark the error prominently to indicate clearly that something is wrong... Reserve red for errors." — B9, Chapter 6
- **Relates to:** D-6, D-19

### Blame-the-Design Check
- **Check:** When many users make the same "error," is the design treated as the cause rather than the user? Is the system redesigned instead of the user retrained?
- **Source:** "If the system lets you make the error, it is badly designed... Teaching me the relationship will not stop the error from recurring: redesigning the stove will." — B1, Chapter 5
- **Relates to:** D-21, D-34

### Mensch / Goodwill Check
- **Check:** Does the site behave like a mensch — doing the right thing, being considerate? Is anything (hidden pricing, format strictness, unneeded info requests, faux sincerity) draining the goodwill reservoir?
- **Source:** "Besides 'Is my site clear?' you also need to be asking, 'Does my site behave like a mensch?'... Every time we enter a Web site, we start out with a reservoir of goodwill. Each problem we encounter lowers the level." — B2, Chapter 11
- **Relates to:** D-38

### Description-Similarity Check
- **Check:** Are easily confused controls made visually and physically distinct (shape-coded, separated, differently colored), so the wrong target cannot match a vague description?
- **Source:** "Designers need to ensure that controls and displays for different purposes are significantly different from one another. A lineup of identical-looking switches is very apt to lead to description-similarity error." — B1, Chapter 5
- **Relates to:** D-1, D-28

### Inclusive-Design Edge Check
- **Check:** Does the design work for the 5th and 95th percentile (or beyond)? Do adjustments for the edges benefit the middle (type size, contrast, adjustability)?
- **Source:** "Design for the 99th percentile of the world and 70 million people are left out... The best solution is flexibility: flexibility in the size of the images, in the sizes, heights, and angles of tables and chairs." — B1, Chapter 6
- **Relates to:** D-28