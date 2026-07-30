# B9 Johnson — Patterns, Heuristics, Antipatterns

Source: Jeff Johnson, *Designing with the Mind in Mind*. Quotes verbatim from the extract at `B9-johnson/extract.md`. Chapter numbers in parens.

## Patterns

### Consistent Control Placement
- **Description:** Place functionally identical controls in the same screen location, with the same color, font, and shading across every page where they appear, so users can spot and recognize them without reading.
- **Source quote:** "Place information and controls in consistent locations. Controls and data displays that serve the same function on different pages should be placed in the same position on each page on which they appear. They should also have the same color, text fonts, shading, and so on. This consistency allows users to spot and recognize them quickly." (Chapter 1)
- **Relates to:** D-22, D-9

### Proximity-Based Grouping (no boxes)
- **Description:** Group related controls by spacing them closer to each other than to other controls, rather than relying on group boxes or separator lines, to reduce visual clutter.
- **Source quote:** "items on a display can be visually grouped simply by spacing them closer together to each other than to other controls, without group boxes or visible borders" (Chapter 2)
- **Relates to:** D-4

### Structured (Non-Prose) Information Presentation
- **Description:** Present data in terse structured form (outline, table, labeled fields) rather than prose so users can scan and understand quickly; eliminate repetition that buries key information.
- **Source quote:** "The more structured and terse the presentation of information, the more quickly and easily people can scan and comprehend it." (Chapter 3)
- **Relates to:** D-9

### Segmented Long-Number Fields
- **Description:** Break long numbers (phone, credit card, dates) into segments either via separate fields or by allowing spaces/punctuation, so users can scan and verify them.
- **Source quote:** "A long number can be broken up in two ways: either the user interface breaks it up explicitly by providing a separate field for each part of the number, or the interface provides a single number field, but lets users break the number into parts with spaces or punctuation" (Chapter 3)
- **Relates to:** D-98

### Data-Specific Controls
- **Description:** Use controls designed for a specific data type (e.g., pop-up calendar for dates) instead of plain text fields, to provide visual structure and prevent entry errors.
- **Source quote:** "Instead of using simple text fields—whether segmented or not—designers can use controls that are designed specifically to display (and accept as input) a value of a specific type." (Chapter 3)
- **Relates to:** D-9

### Visual Hierarchy
- **Description:** Break information into labeled sections and subsections; present higher-level sections more strongly (size, prominence, position) than lower-level ones so users can skip irrelevant content instantly.
- **Source quote:** "A visual hierarchy allows people, when scanning information, to separate what is relevant to their goals from what is irrelevant instantly, and to focus their attention on the relevant information." (Chapter 3)
- **Relates to:** D-4, D-6

### Error Messages Near User's Gaze
- **Description:** Place error messages where the user is looking (near the clicked button or the field in error), mark them with an error symbol, and reserve red exclusively for errors.
- **Source quote:** "Put it where users are looking… Mark the error: Somehow mark the error prominently to indicate clearly that something is wrong… Reserve red for errors" (Chapter 6)
- **Relates to:** D-6, D-19

### Show Search Terms with Results
- **Description:** Echo the user's search terms on the results page so they don't have to hold them in working memory while evaluating results.
- **Source quote:** "Search-results sometimes don't show the search terms that generated the results… reducing the burden on users' short-term memory." (Chapter 7)
- **Relates to:** D-32

### Persistent Instructions During Multi-Step Tasks
- **Description:** Keep instructions for multi-step operations visible and accessible while users execute the steps; don't force users to hold steps in memory.
- **Source quote:** "interactive systems that display instructions for multistep operations should allow people to refer to the instructions while executing them until completing all the steps." (Chapter 7)
- **Relates to:** D-32

### Progress Tracking via Done/Not-Done Markers
- **Description:** Indicate what users have done versus not yet done (read/unread messages, visited links, completed steps) and let users mark or move objects to track their own progress.
- **Source quote:** "interactive systems should indicate what users have done versus what they have not yet done. Most email applications do this by marking already-read versus unread messages" (Chapter 8)
- **Relates to:** D-32

### Strong Information Scent at Choice Points
- **Description:** At each decision point, label options with words that literally match users' goals so their goal-directed scanning lands on the right choice; avoid generic labels like OK/Cancel when they obscure the goal.
- **Source quote:** "interactive systems should be designed so that the scent is strong and really does lead users to their goals… designers need to understand the goals that users are likely to have at each decision point" (Chapter 8)
- **Relates to:** D-9

### Goal-Execute-Evaluate Cycle Support
- **Description:** Provide clear initial paths to goals, clear scent at each choice, and feedback/status so users can evaluate progress and back out of wrong turns.
- **Source quote:** "Goal: Provide clear paths—including initial steps—for the user goals… Execute: …Provide clear information scent at choice points… Evaluate: Provide feedback and status information to show users their progress toward the goal. Allow users to back out of tasks" (Chapter 8)
- **Relates to:** D-19, D-20

### Automatic Cleanup / Spring-Loaded Modes
- **Description:** Auto-revert special modes or auto-complete cleanup steps (turn signals off, document ejection) so users don't have to remember loose ends after the primary goal is achieved.
- **Source quote:** "Special software modes should revert to 'normal' automatically, either by timing out… or through the use of spring-loaded mode controls, which must be physically held in the non-normal state and revert to normal when released" (Chapter 8)
- **Relates to:** D-96, D-97

### See-and-Choose Over Recall-and-Type
- **Description:** Show users their options and let them choose rather than forcing them to recall and type; use pictures/icons to convey function so recognition does the work.
- **Source quote:** "See and choose is easier than recall and type. Show users their options and let them choose among them, rather than force users to recall their options and tell the computer what they want." (Chapter 9)
- **Relates to:** D-9

### Thumbnail Images for Recognition
- **Description:** Display pictures as small thumbnails (recognition is size-insensitive) so users can see many options at once and recognize rather than recall.
- **Source quote:** "a great way to display pictures people have already seen is to present them as small 'thumbnail' images… Displaying small thumbnails instead of full-sized images allows people to see more of their options, their data, their history, etc., at once." (Chapter 9)
- **Relates to:** D-9

### Visibility Scales with Audience Size
- **Description:** The more people who will use a function, the more visible it must be; rarely used functions (especially by trained users) can be hidden behind Details panels or shortcut keys.
- **Source quote:** "make functions that many people need highly visible, so users see and recognize their options rather than having to recall them. By contrast, functionality that few people will use… can be hidden, e.g., behind 'Details' panels, in right-click menus, or via special key combinations." (Chapter 9)
- **Relates to:** D-9

### Visual Cues for Location Identity
- **Description:** Give each site section or workspace a distinctive visual style so users instantly recognize where they are without reading.
- **Source quote:** "all pages in a Web site should have a common distinctive visual style so people can easily tell whether they are still on the site or have gone to a different one. Slight but systematic variations on a site's visual style can show users which section of the site they are in." (Chapter 9)
- **Relates to:** D-9, D-22

### Task-Focused Conceptual Model
- **Description:** Build the application's exposed objects, actions, and attributes from a task analysis so the gulf of execution is small and users don't have to translate their goals into implementation concepts.
- **Source quote:** "The way to reduce the gulf is to design the tool to provide operations that match what users are trying to do." (Chapter 11)
- **Relates to:** D-95

### Objects/Actions Matrix — Small and Dense
- **Description:** Aim for a small, dense objects/actions matrix: few concepts, with the same actions applying to every object type, so users transfer learning across the system.
- **Source quote:** "A small, dense matrix indicates a design that will be easy to learn: few objects, few actions, and the operations on every type of object are the same… A large, sparse matrix reflects an inconsistent design that will be hard to learn" (Chapter 11)
- **Relates to:** D-95

### Keystroke-Level Consistency (Muscle Memory)
- **Description:** Standardize the physical actions (keystrokes, pointer movements) for all activities of a given type regardless of context, so motor habits form and operation becomes automatic.
- **Source quote:** "Achieving keystroke-level consistency requires standardizing the physical actions for all activities of the same type… A system that is inconsistent at the keystroke level does not let people quickly fall into 'muscle memory' motor habits" (Chapter 11)
- **Relates to:** D-95

### Let the Computer Do the Math
- **Description:** Don't make users calculate values the system can compute itself; represent problems graphically so users can use perception instead of calculation.
- **Source quote:** "Don't make people calculate things the computer can calculate itself… Let people use perception rather than calculation. Some problems that might seem to require calculation can be represented graphically, allowing people to achieve their goals with quick perceptual estimates" (Chapter 10)
- **Relates to:** D-95

### Progressive / Important-First Rendering
- **Description:** Display important information first, then details and auxiliary information, so users can begin planning their next unit task while the rest loads.
- **Source quote:** "Interactive systems can appear to be operating fast by displaying important information first, then details and auxiliary information later… Research indicates that users prefer progressive results to progress indicators" (Chapter 12)
- **Relates to:** D-20

### Low-Resolution-First Image Rendering
- **Description:** When a high-resolution image takes more than two seconds, render the whole image at low resolution first and refine, rather than revealing full-resolution top-to-bottom; the visual system processes images holistically.
- **Source quote:** "To decrease the perceived time for an image to render, the system can display the image quickly at low resolution and then re-render it at a higher resolution. Because the visual system processes images holistically, this appears faster than revealing a full-resolution image slowly from top to bottom" (Chapter 12)
- **Relates to:** D-20

### Fake Feedback During Hand-Eye Coordination
- **Description:** When the system can't keep up with the 0.1s hand-eye feedback deadline, provide lightweight simulated feedback (rubberband outlines, quick-and-dirty previews) until the real operation can be applied.
- **Source quote:** "When your system cannot update its display fast enough to meet this hand-eye-coordination deadline, provide lightweight simulated feedback until the goal is clear and then apply the real operation." (Chapter 12)
- **Relates to:** D-20

### Work Ahead of Users
- **Description:** Use idle periods to pre-compute high-probability requests (next search match, next document page) so responses feel instant when the user asks.
- **Source quote:** "Software can use periods of low load to pre-compute responses to high-probability requests… If the user never wants it, so what? The software did it in 'free' time" (Chapter 12)
- **Relates to:** D-20

### Graceful Degradation to Maintain Frame Rate
- **Description:** When animation can't hold the minimum frame rate, simplify rendering (drop labels, shading, 3D) temporarily rather than let the frame rate drop; users attribute the loss to motion blur.
- **Source quote:** "it is better to reduce an animated three-dimensional image temporarily to a line drawing than it is to let the frame rate drop below the limit… Most users don't even notice a degradation of the image during the movement, because they attribute their inability to read the labels to motion blur." (Chapter 12)
- **Relates to:** D-20

## Heuristics

### Are controls placed consistently?
- **Check:** Do functionally identical controls appear in the same location, color, and style on every page where they appear?
- **Source quote:** "if the positions of the 'Next' and 'Back' buttons on the last page of a multipage dialog box switched, many people would not immediately notice the switch… This is why 'place controls consistently' is a common user interface design guideline." (Chapter 1)
- **Relates to:** D-22

### Do labels match user goals literally?
- **Check:** At each choice point, does the wording of each option literally match what a goal-directed user would be scanning for?
- **Source quote:** "People don't think deeply about instructions, command names, option labels, icons, navigation bar items… their attention will be attracted by anything displaying the words 'buy,' 'flight,' 'ticket,' or 'reservation.'" (Chapter 8)
- **Relates to:** D-9

### Does the design imply unintended groupings?
- **Check:** View the display with each Gestalt principle in turn (Proximity, Similarity, Continuity, Closure, Symmetry, Figure/Ground, Common Fate) — does it suggest relationships you did not intend?
- **Source quote:** "A recommended practice, after designing a display, is to view it with each of the Gestalt principles in mind… to see if the design suggests any relationships between elements that you do not intend." (Chapter 2)
- **Relates to:** D-4

### Can the user scan this in one pass, or must they hunt for labels?
- **Check:** Are labels close enough to their values (Proximity) and aligned in reading order so users perceive correspondences without conscious thought?
- **Source quote:** "the labels were just as close to the value below as to their own value, so proximity… could not be used to perceive that labels were grouped with their values. To understand this mortgage results table, users had to scrutinize it carefully" (Chapter 3)
- **Relates to:** D-4

### Does the text presentation disrupt automatic reading?
- **Check:** Is text presented in a way that drops skilled readers out of automatic feature-based reading — tiny fonts, ALL CAPS, patterned backgrounds, centered prose, unfamiliar vocabulary?
- **Source quote:** "Careless writing or presentation of text can reduce skilled readers' automatic, context-free reading to conscious, context-based reading, burdening working memory, thereby decreasing speed and comprehension." (Chapter 4)
- **Relates to:** D-12, D-95

### Is the user forced to remember what the system could show?
- **Check:** Does the UI require users to hold system state, search terms, or instructions in short-term memory instead of displaying them?
- **Source quote:** "user interfaces should help people remember essential information from one moment to the next. Don't require people to remember system status or what they have done, because their attention is focused on their primary goal" (Chapter 7)
- **Relates to:** D-32

### Are users forced to diagnose system problems?
- **Check:** Does the system present technical errors or compatibility questions that require diagnostic reasoning most users don't have training for?
- **Source quote:** "Don't make users diagnose system problems, such as a faulty network connection. Such diagnosis requires technical training, which most users don't have." (Chapter 10)
- **Relates to:** D-95

### Does the system meet the 0.1s cause-and-effect deadline?
- **Check:** Does the system acknowledge user actions (button press, drag feedback, character echo) within 0.1 seconds, preserving perception of cause and effect?
- **Source quote:** "If software waits longer than 0.1 second to show a response to a user's action, the perception of cause and effect is broken" (Chapter 12)
- **Relates to:** D-20

### Does the system meet the 1-second conversational deadline?
- **Check:** For operations that can't finish in 0.1s, does the system display a progress indicator within 1 second and indicate how long the operation will take?
- **Source quote:** "Systems have about 1 second to either do what the user asked or indicate how long it will take. Otherwise, users get impatient." (Chapter 12)
- **Relates to:** D-20

### Are delays placed between unit tasks, not within them?
- **Check:** When the system must impose delays, do they fall between unit tasks (high closure) rather than within a unit task (where they cause users to lose track)?
- **Source quote:** "If a system has to impose delays, it should do so between unit tasks, not during tasks." (Chapter 12)
- **Relates to:** D-20, D-96

## Antipatterns

### Hidden / Poorly-Signaled Modes
- **Failure mode:** The system has modes but gives poor feedback about the current mode, so users make mode errors — invoking the wrong action for the mode they thought they were in.
- **Source quote:** "one well-known disadvantage of modes is that people often make mode-errors: they forget what mode the system is in and do the wrong thing by mistake (Johnson, 1990). This is especially true in systems that give poor feedback about what the current mode is." (Chapter 7)
- **Relates to:** D-97
- **Correct alternative:** Avoid modes, or provide strong, continuous feedback about which mode is active; use spring-loaded modes that auto-revert.

### Expectation-Induced Blindness from Inconsistent Controls
- **Failure mode:** Changing the position, shape, or color of a control users have learned to expect in a specific place causes them to miss it even when it's in plain view.
- **Source quote:** "if the 'Submit' button on one form in a Web site is shaped differently or is a different color from those on other forms on the site, users might not find it. This expectation-induced blindness" (Chapter 1)
- **Relates to:** D-7, D-22
- **Correct alternative:** Keep functionally identical controls visually and positionally consistent across the site/app.

### Centered or Right-Aligned Prose Text
- **Failure mode:** Centering or right-aligning prose text breaks the automatic leftward eye-return trained in skilled readers, forcing conscious gaze adjustment and slowing reading greatly.
- **Source quote:** "In automatic (fast) reading, our eyes are trained to go back to the same horizontal position and down one line. If text is centered or right-aligned, each line of text starts in a different horizontal position. Automatic eye movements therefore take our eyes back to the wrong place" (Chapter 4)
- **Relates to:** D-12
- **Correct alternative:** Left-align prose text; reserve centering for poetry, titles, and wedding invitations.

### "Geek Speak" in User-Facing Copy
- **Failure mode:** Using computer-engineering jargon (reauthenticate, database, current state) forces non-technical users out of automatic reading and into conscious decoding they can't complete.
- **Source quote:** "Most nontechnical users would not understand the word 'reauthenticate,' so they would drop out of automatic reading mode into conscious wondering about the message's meaning." (Chapter 4; see also Chapter 11)
- **Relates to:** D-12, D-95
- **Correct alternative:** Use task-focused, familiar vocabulary drawn from user interviews; rewrite error messages in terms users understand.

### Different Terms for the Same Concept
- **Failure mode:** Using multiple names for the same concept (or the same name for different concepts) forces users to learn and remember the mapping, burdening long-term memory and slowing learning.
- **Source quote:** "Same name, same thing; different name, different thing… Never use different terms for the same concept, or the same term for different concepts. Even terms that are ambiguous in the real world should mean only one thing in the system." (Chapter 11)
- **Relates to:** D-22
- **Correct alternative:** Map terms to concepts strictly 1:1; pick one term per concept and use it everywhere.

### Error Messages in the Visual Periphery
- **Failure mode:** Placing error messages away from where the user's fovea is focused (e.g., a "message bar" far from the clicked button) means the message lands in low-resolution peripheral vision and is missed.
- **Source quote:** "if a user enters an incorrect username or password and clicks 'Sign In', an error message appears in a 'message bar' far away from where the user's eyes are most likely focused… it should not be surprising that the person might not notice it." (Chapter 6)
- **Relates to:** D-6
- **Correct alternative:** Place error messages near the field in error or the clicked button; mark with an error symbol and red color reserved exclusively for errors.

### Red Used for Non-Errors
- **Failure mode:** Using red for page titles, branding, or other non-error elements means a red error message appearing in the periphery doesn't register as a change, because there was already something red there.
- **Source quote:** "the error message is not the only thing near the top of the page that is red. The page title is also red… when the error message appears, the user's visual system may not register any change: there was something red up there before, and there still is" (Chapter 6)
- **Relates to:** D-6
- **Correct alternative:** Reserve red exclusively for errors; if brand color is red, pick another color for errors or rely on error symbols plus stronger methods.

### Overuse of Heavy-Attention Methods (Pop-ups, Sound, Blinking)
- **Failure mode:** Frequent use of modal pop-ups, beeps, and blinking to attract attention causes habituation — users learn to ignore them, so important messages get blocked.
- **Source quote:** "When pop-ups, sound, motion, and blinking are used frequently to attract users' attention, a psychological phenomenon called habituation sets in. Our brain pays less and less attention to any stimulus that occurs frequently." (Chapter 6)
- **Relates to:** D-19
- **Correct alternative:** Use heavy-artillery methods sparingly — only for critical messages; prefer placement, marking, and symbol for routine errors.

### Forcing Recall When Recognition Would Do
- **Failure mode:** Hiding functionality and requiring users to recall command names, plug-in names, or option locations from memory — a percentage of users will fail.
- **Source quote:** "If a software application hides its functionality and requires its users to recall what to do, some percentage of users will fail… The solution is to make functions that many people need highly visible, so users see and recognize their options rather than having to recall them." (Chapter 9)
- **Relates to:** D-9
- **Correct alternative:** Make high-use functions visible; hide only rare functions behind Details panels or shortcut keys.

### Burdensome Authentication Memory Requirements
- **Failure mode:** Imposing password rules or security-question choices that make it impossible for users to recall their credentials, driving them to write passwords down or use guessable ones.
- **Source quote:** "told users to change their personal identification number (PIN) 'to a number that is easy … to remember,' but then imposed restrictions that made it impossible to do so… Never mind that writing a PIN down creates a security risk" (Chapter 7)
- **Relates to:** D-9
- **Correct alternative:** Let users create their own security questions and password hints; prefer biometric or low-memory authentication where privacy permits.

### Exposing Implementation Concepts to Users
- **Failure mode:** Making users learn implementation objects (database, buffer, mode, hash table) instead of task objects (transaction, check, account) widens the gulf of execution and slows automation.
- **Source quote:** "Objects and actions that are related purely to implementation—such as a text buffer, a hash table, or a database record—do not belong in a conceptual model… 'If it isn't in the objects/actions analysis, users shouldn't know about it.'" (Chapter 11)
- **Relates to:** D-95
- **Correct alternative:** Build the conceptual model from the task analysis; keep implementation-only objects invisible.

### Concept Creep (Overlapping Concepts)
- **Failure mode:** Exposing several concepts that overlap in meaning (Membership, Subscription, Access, Entitlements) forces users to learn distinctions that don't matter to their task.
- **Source quote:** "Users confused these four concepts. The four concepts should have been collapsed into one, or at least fewer than four." (Chapter 11)
- **Relates to:** D-95
- **Correct alternative:** Collapse overlapping concepts into as few as the task requires.

### Feature Bloat (Adding "In Case" Functionality)
- **Failure mode:** Each extra concept multiplies complexity (concepts interact), making the system harder to learn nonlinearly; "in case a user might want it" is insufficient justification.
- **Source quote:** "every extra concept increases the complexity of the software. It is one more thing users have to learn. But actually it is not just one more thing. Each concept in an application interacts with most of the other concepts, and those interactions result in more complexity. Therefore, as concepts are added to an application, the application's complexity grows not just linearly, but multiplicatively" (Chapter 11)
- **Relates to:** D-95
- **Correct alternative:** Resist adding functionality unless considerable evidence shows a significant number of users need it.

### Long Operations Without Progress or Cancel
- **Failure mode:** Time-consuming operations block all other activity, give no clue how long they will take, and cannot be aborted.
- **Source quote:** "Time-consuming operations that block other activity and cannot be aborted… Providing no clue how long lengthy operations will take" (Chapter 12)
- **Relates to:** D-20
- **Correct alternative:** Show progress indicators (work remaining, human-scale time), provide a cancel button, free users to do other things while waiting.