# B5 Weinschenk — Patterns, Heuristics, Antipatterns

Source: Susan Weinschenk, *100 Things Every Designer Needs to Know About People*. Extract covers Things 1–100 across nine chapters (How People See, Read, Remember, Think, Focus Attention, Motivation, Social Animals, Mistakes, Decide). Laws already in the corpus — Miller's constraint (D-8), inattentional blindness (D-7), Hick's law (D-10), error inevitability (D-21), emotional resonance (D-25), goal gradient (D-31), category drive (D-41), examples before abstractions (D-42), face priority (D-43), functional forgetting (D-44), habit loop (D-45), habituation (D-46), social mirroring (D-47), intrinsic motivation (D-48), line-length tension (D-49), memory reconstruction (D-50), pattern recognition (D-51), error pattern (D-52), progress-mastery-control (D-53), screen reading cost (D-54), shortcut threshold (D-55), story form (D-56), stress error spike (D-57), variable reward (D-58), sustained attention limit (D-59), time over money (D-60), use-it-or-lose-it (D-61) — are not re-extracted below.

---

## Patterns

### Peripheral-vision gist
- **Description:** Design the periphery of a page to communicate the purpose of the scene at a glance; reserve peripheral placement for emotional imagery and the "gist," and keep central vision clear for focal task content.
- **Source quote:** "Make sure the information in the periphery communicates clearly the purpose of the page or information they are viewing. If you have images of an emotional nature, put them in the periphery instead of in the middle." (Thing 2)
- **Relates to:** D-43

### Single-feature pop-out
- **Description:** To grab visual attention fast, make one item differ in a single visual feature (color, shape, or orientation). Combining many differing features slows visual-cortex processing and weakens the pop-out.
- **Source quote:** "If you want to grab visual attention quickly, then remember that less is more. In an image or on a page, whatever item is a different color, shape, or orientation than the others is the item that will grab attention first." (Thing 5)
- **Relates to:** D-30

### Scan-anchor placement
- **Description:** Place the most important task information about 30% in from the top and 30% in from the left margin (right margin for RTL languages), where users' central vision naturally lands on first glance; reserve edges for branding and navigation.
- **Source quote:** "Put the most important information (or things you want people to focus on) about 30 percent of the page or screen from the top and 30 percent from the left margin." (Thing 6)
- **Relates to:** D-33

### Affordance cues via shading
- **Description:** Use shadows and shading to signal that an on-screen element can be pressed, selected, or activated; avoid providing visual cues that conflict with how the control actually works.
- **Source quote:** "Think about affordance cues when you design. By giving people cues about what they can do with a particular object, you make it more likely that they will take that action. Use shading to show when an object is chosen or active. Avoid providing incorrect affordance cues." (Thing 7)
- **Relates to:** D-27, D-34

### Proximity grouping
- **Description:** Use spatial proximity to indicate that items belong together, putting less space between related items and more space between unrelated ones; try spacing before resorting to lines or boxes.
- **Source quote:** "If you want items (pictures, photos, headings, or text) to be seen as belonging together, then put them in proximity. Before you use lines or boxes to separate items or group them together, first try experimenting with the amount of space between them." (Thing 9)
- **Relates to:** D-29

### Redundant color coding
- **Description:** When color carries meaning, add a redundant cue (line thickness, pattern, icon, or box) so the encoding survives red-green color blindness; consider palettes that read alike for all vision types.
- **Source quote:** "Wherever you use color to give specific meaning, you need a redundant coding scheme—for example, color and line thickness—so that people who are color-blind will be able to decipher the code without needing to see specific colors." (Thing 11)
- **Relates to:** D-30

### Title-first comprehension
- **Description:** Provide a meaningful title or headline before any body content; the title frames comprehension and changes what readers take from the rest of the passage.
- **Source quote:** "Provide a meaningful title or headline. It's one of the most important things you can do." (Thing 14)
- **Relates to:** D-56

### Reading-level targeting
- **Description:** Tailor text to the audience's reading level — 6th grade or lower is easy, 7th–9th average, 10th+ difficult. Use simple words and shorter sentences for a general audience.
- **Source quote:** "Tailor the reading level of your text to your audience. Use simple words and fewer syllables to make your material accessible to a wider audience." (Thing 14)
- **Relates to:** D-54

### Font-difficulty attribution
- **Description:** Avoid hard-to-read decorative fonts for instructions; people transfer the felt difficulty of reading into a judgment that the task itself is hard, and lower their willingness to do it.
- **Source quote:** "If people have trouble reading the font, they will transfer that feeling of difficulty to the meaning of the text itself and decide that the subject of the text is hard to do or understand." (Thing 15)
- **Relates to:** D-54

### Large x-height for legibility
- **Description:** Choose fonts with a large x-height (e.g., Tahoma, Verdana) so that type appears larger at the same point size and reads more easily on screens.
- **Source quote:** "Consider using a font with a large x-height so that the type will appear to be larger." (Thing 16)
- **Relates to:** D-54

### Chunk to four
- **Description:** When you cannot limit total items to three or four, group the items into three or four chunks with no more than four items per chunk; phone-number formatting is the canonical example.
- **Source quote:** "If you can't limit the number of links, topics, or choices to three or four, chunk or group information into three or four groups... When you chunk or group information, make sure there are no more than four items in each chunk." (Thing 20)
- **Relates to:** D-8

### Recognition over recall
- **Description:** Eliminate memory load by offering dropdown lists, auto-fill, and visible choices rather than forcing users to recall values from memory; recognition uses context and is reliably easier.
- **Source quote:** "Eliminate memory load whenever possible. Make use of user interface features such as auto-fill and dropdown lists to reduce the need for people to recall items from memory." (Thing 22)
- **Relates to:** D-32, D-44

### Concrete terms and icons
- **Description:** Use concrete words and concrete icons because they are easier to encode and remember than abstractions; pair with phonological coding (rhyme, rhythm) where useful.
- **Source quote:** "Use concrete terms and icons. They will be easier to remember than abstract ideas or images." (Thing 23)
- **Relates to:** D-42

### Provide lookup, don't rely on memory
- **Description:** When information is important, don't trust the user to remember it; provide it in the design or make it trivially look-up-able (dropdowns, history, persistent display).
- **Source quote:** "Design with forgetting in mind. When information is really important, don't rely on people to remember it. Provide it for them in your design or have a way for them to easily look it up." (Thing 25)
- **Relates to:** D-32, D-44

### Progressive disclosure
- **Description:** Show people only what they need at the moment and let them click for more; count useful clicks, not total clicks — people don't mind clicking when each step delivers the right amount of information.
- **Source quote:** "Use progressive disclosure. Show people what they need when they need it. Build in links for them to get more information. If you have to make a trade-off on clicks versus thinking, use more clicks and less thinking." (Thing 27)
- **Relates to:** D-29

### Load-tier trade-offs
- **Description:** Rank design demands as cognitive > visual > motor. Trade a cognitive load for a visual or motor load whenever you can — even many extra clicks beat a small cognitive burden if each step is logical.
- **Source quote:** "When you design a product, remember that making people think or remember (cognitive load) requires the most mental resources. Look for trade-offs (for example, where you can reduce a cognitive load by increasing a visual or motor load)." (Thing 28)
- **Relates to:** D-29

### Fitts's-law-sized targets
- **Description:** Make motor targets large enough and close enough to the start point that users can hit them reliably; small or distant targets cause overshoots and errors.
- **Source quote:** "Make sure your motor targets are large enough to be easily reached." (Thing 28)
- **Relates to:** D-34

### Feedback for mind-wandering
- **Description:** Assume minds wander ~30% of the time; build in persistent feedback about where users are so that when they drift, they can return to the original location easily.
- **Source quote:** "Make sure you build in feedback about where people are so that if their minds wander, it's easier for them to get back to the original location." (Thing 29)
- **Relates to:** D-33, D-59

### Small-commitment persuasion
- **Description:** When users may be skeptical, ask for a small commitment first (free trial, one small action) rather than a large one; small commitments reduce resistance and open the door to belief change.
- **Source quote:** "The best way to change a belief is to get someone to commit to something very small. Don't just give people evidence that their belief is not logical, tenable, or a good choice. This may backfire and make them dig in even harder." (Thing 30)
- **Relates to:** D-45

### Conceptual-model match
- **Description:** Design the conceptual model deliberately so it matches the audience's mental model; if a mismatch is intentional, change the mental model through training before exposure to the product.
- **Source quote:** "Design the conceptual model purposefully. Don't let it 'bubble up' from the technology. The secret to designing an intuitive user experience is making sure that the conceptual model of your product matches, as much as possible, the mental model of your audience." (Thing 32)
- **Relates to:** D-28

### Flow-state design
- **Description:** To induce flow, give users control over their actions, calibrate challenge to skill, supply constant feedback (not praise), and minimize distractions.
- **Source quote:** "Give people control over their actions during the activity. Pick the right amount of challenge—too much challenge and people will give up. Not enough and the flow state won't start. Give constant feedback. Minimize distractions." (Thing 38)
- **Relates to:** D-53

### Always-visible progress indicator
- **Description:** Always provide a progress indicator so users know how long a task will take; consistent durations let users calibrate expectations, and breaking a task into steps with less mental processing makes it feel shorter.
- **Source quote:** "Always provide progress indicators so people know how long something will take. If possible, make consistent the amount of time it takes to do a task or bring up information so that people can adjust their expectations accordingly." (Thing 36)
- **Relates to:** D-31, D-53

### Strong signal for rare events
- **Description:** When users must notice an event that rarely occurs, use a strong signal (loud sound, large visual change); a normal signal will be filtered out by their mental model of expected frequency.
- **Source quote:** "If you're designing a product or application where people need to notice an event that rarely occurs, use a strong signal to get their attention when it does." (Thing 43)
- **Relates to:** D-7

### Saliency-led design
- **Description:** Decide what the salient cues are for your audience and make those cues obvious; people will attend to salient cues and ignore the rest, so don't bury critical information in non-salient form.
- **Source quote:** "Decide what the salient cues are for your audience. Design so that the salient cues are obvious. Realize that people will probably pay attention only to salient cues." (Thing 45)
- **Relates to:** D-30

### Single-task focus
- **Description:** Avoid forcing people to multitask; if they must, expect more errors and build in recovery. Two simultaneous cognitive tasks are not actually parallel — they are switched, with switching cost.
- **Source quote:** "Avoid forcing people to multitask. It is difficult for them to do two things at once (for example, have a conversation with a customer while filling out a form on a computer or tablet device). If people must multitask, pay particular attention to the ease of use of whatever tool they are using." (Thing 46)
- **Relates to:** D-59

### Old-brain attention hooks
- **Description:** Movement, faces (especially facing forward), food, sex, danger, stories, and loud noises grab attention involuntarily; use them sparingly when attention is the goal, and avoid them when focus on a task is the goal.
- **Source quote:** "It may not always be appropriate to use food, sex, or danger in your web page or software application, but if you do, they'll get a lot of attention. Use up-close images of faces. Use stories as much as you can, even for what you think is factual information." (Thing 47)
- **Relates to:** D-43

### Calibrated attention sounds
- **Description:** Pick the sound intensity that matches the attention required: reserve high-attention sounds for irreversible actions; vary sounds to prevent habituation.
- **Source quote:** "Pick a sound that is appropriate to the amount of attention you need. Save the high-attention sounds for when it's really important—for example, if someone is about to format their hard drive or take an action that can't be undone." (Thing 48)
- **Relates to:** D-46

### Signal-detection tuning
- **Description:** Decide whether a miss or a false alarm is worse for the task; if a miss is worse, strengthen the signal, if a false alarm is worse, tone it down.
- **Source quote:** "Think about what you may need to do with your design based on the four quadrants of the signal detection chart. If a false alarm is worse, then tone down the signal. If a miss is worse, then make the signal stronger." (Thing 49)
- **Relates to:** D-21

### Illusory progress boost
- **Description:** You can motivate with the illusion of progress — e.g., a reward card with two boxes pre-stamped — because perceived closeness to a goal accelerates behavior even when actual remaining work is identical.
- **Source quote:** "You can get this extra motivation even with the illusion of progress, as in the coffee card B example in this section. There really isn't any progress (you still have to buy 10 coffees), but it seems like there has been some progress, so it has the same effect." (Thing 50)
- **Relates to:** D-31

### Post-reward re-engagement
- **Description:** Motivation and activity plummet immediately after a reward is reached; design extra interactions right after a reward to prevent churn.
- **Source quote:** "Activity plummets right after the goal is reached, and you are most at risk of losing a customer right after a reward is reached. You may want to have extra interactions after giving a reward (for example, you may want to send an email thanking them for being a loyal customer)." (Thing 50)
- **Relates to:** D-31

### Dopamine loop feeding
- **Description:** Make information seeking easy, give small bits rather than full satisfaction, pair cues with arrivals (sounds, notifications), and use unpredictability to keep people searching.
- **Source quote:** "Giving small bits of information and then providing a way for people to get more information results in more information-seeking behavior. The more unpredictable the arrival of information is, the more people will be addicted to seeking it." (Thing 53)
- **Relates to:** D-58

### Unexpected extrinsic reward
- **Description:** If you use extrinsic rewards, make them unexpected rather than contingent and spelled out ahead of time; contingent expected rewards suppress the behavior once the reward stops.
- **Source quote:** "If you're going to give an extrinsic reward, it will be more motivating if it is unexpected." (Thing 54)
- **Relates to:** D-48

### Boring-task autonomy
- **Description:** If a task is boring, acknowledge it's boring and let people do it their own way; autonomy rescues motivation where mastery and purpose don't apply.
- **Source quote:** "If people have to do a task that's boring, you can help motivate them by acknowledging that it's boring and then letting them do it their own way." (Thing 55)
- **Relates to:** D-48, D-53

### Social-norms cue
- **Description:** To change behavior, show people what others like them are doing; direct comparison data is more effective than environmental, moral, or financial messages.
- **Source quote:** "If you want to change behavior, a good method is to let people know what others are doing. They will likely start to change their own behavior to line up with the social norms." (Thing 56)
- **Relates to:** D-47

### Satisficing-ready scanning
- **Description:** Design pages for scanning, not reading; large fonts, generous white space, and a clear single glance impression make a site feel easy to use and survive the first satisficing cut.
- **Source quote:** "The first glance at a page influences the impression about whether it will be easy to use. Large fonts and enough white space at first glance makes a website seem easier to use." (Thing 57)
- **Relates to:** D-29

### Easy shortcuts and safe defaults
- **Description:** Provide shortcuts that are easy to learn and find; provide defaults when you know what most people want most of the time and the cost of an accidental default is low.
- **Source quote:** "Provide shortcuts as long as they are easy to learn, find, and use, but don't assume that people will always use them. Provide defaults if you know what most people will want to do most of the time and if the result of choosing a default by mistake does not cause costly errors." (Thing 58)
- **Relates to:** D-55

### Small-easy habit actions
- **Description:** To build a habit, make the required action very small and easy, include a physical movement (click, swipe, scroll), and pair it with an auditory or visual cue.
- **Source quote:** "Give people a small, easy task to do rather than a complex one. Build in auditory cues, visual cues, or both. Include some type of physical movement (click, swipe, scroll)." (Thing 60)
- **Relates to:** D-45

### Leaderboard cap at 10
- **Description:** When adding competition, show only a small number of competitors (around 10); larger fields dampen the motivation to compete.
- **Source quote:** "Showing more than 10 competitors can dampen the motivation to compete." (Thing 61)
- **Relates to:** D-31

### Self-service autonomy framing
- **Description:** People like doing things themselves; frame self-service messaging around control and independence, not around cost-cutting.
- **Source quote:** "People like to do things themselves and are motivated to do so. If you want to increase the amount of self-service, make sure your messaging is about having control and being able to do it yourself." (Thing 62)
- **Relates to:** D-48

### Strong-tie vs weak-tie design
- **Description:** Decide whether your social feature is a strong-tie (≤150 people, requires proximity, everyone knows everyone) or weak-tie (large, distributed) community, and design accordingly.
- **Source quote:** "If you are designing a product that has social connections or a community built in, think about whether those interactions are for strong or weak ties. If you are designing for strong ties, you need to build in some amount of physical proximity and make it possible for people to interact, know each other in the network." (Thing 63)
- **Relates to:** D-47

### Show-do behavior modeling
- **Description:** To influence behavior, show someone else doing the same task; video of real people performing the target action is especially compelling because of mirror neurons.
- **Source quote:** "Don't underestimate the power of watching someone else do something. If you want to influence someone's behavior, show someone else doing the same task. Research shows that stories create images in the mind that may also trigger mirror neurons." (Thing 64)
- **Relates to:** D-47

### Social-rule mirroring in UI
- **Description:** Make online interactions follow person-to-person social rules: respond quickly, don't ask for personal information too early, remember the user between sessions; violating these expectations makes users uncomfortable.
- **Source quote:** "When you're designing a product, think about the interactions that the person will have with it. Do the interactions follow the rules of a person-to-person interaction? Many usability design guidelines for products are actually guidelines that mimic person-to-person interactions." (Thing 66)
- **Relates to:** D-47

### Medium-aware survey design
- **Description:** People lie most on the phone, less in email, least with pen and paper; choose the medium for surveys and feedback accordingly, and prefer in-person for the most accurate data.
- **Source quote:** "Customer or audience feedback is most accurate when gathered in person. If you're designing surveys via email, realize that people are likely to be more negative than they would be using pen and paper." (Thing 67)
- **Relates to:** D-47

### Audio/video for understanding
- **Description:** Hearing a human speak syncs speaker and listener brains and improves understanding; prefer audio or video over text alone when accurate comprehension is the goal.
- **Source quote:** "Presenting information through audio or video, where people can hear someone talking, is an especially powerful way to help people understand the message. Don't just rely on reading if you want people to understand information clearly." (Thing 68)
- **Relates to:** D-56

### Friends-and-relatives priority
- **Description:** Social media for friends and relatives is more motivating and earns more loyalty than channels for acquaintances or strangers; the medial prefrontal cortex activates only for personally known people.
- **Source quote:** "People are 'programmed' to pay special attention to friends and relatives. Social media channels that include your friends and relatives will be more motivating and garner more loyalty than those for acquaintances or other purposes." (Thing 69)
- **Relates to:** D-47

### Synchronous bonding opportunities
- **Description:** Build in synchronous audio or video so people can hear each other laugh; laughter bonds groups and is contagious, but it doesn't transmit through asynchronous text.
- **Source quote:** "Look for opportunities to at least have synchronous audio communication (phone calls, teleconferences) so that periodically you can laugh together. This will bond the relationship(s). You don't necessarily need humor or jokes to get people to laugh. Normal conversation and interactions will produce more laughter than intentional use of humor or jokes." (Thing 70)
- **Relates to:** D-47

### Real smiles in video
- **Description:** Use genuine smiles in video; people detect fake smiles better in video than in photos, and a fake smile undermines trust in the speaker and the brand.
- **Source quote:** "If you are using a video to put across your message, pay attention to smiles. People will be able to determine a fake smile versus a real one better in a video than in a photo. If they don't think the smile is real, they're less likely to trust the person in the video, and that may carry over to your brand or product." (Thing 71)
- **Relates to:** D-25

### Arousal calibrated to task
- **Description:** Raise arousal (color, sound, movement) for boring tasks; lower arousal (eliminate distractions) for difficult tasks; stressed users won't see things and will repeat failing actions.
- **Source quote:** "If people are performing a boring task, then you need to raise the level of arousal with sound, colors, or movement. If people are doing a difficult task, then you need to lower the level of arousal by eliminating any distracting elements such as color, sounds, or movement, unless they are directly related to the task at hand." (Thing 86)
- **Relates to:** D-57

### Plain-language error messages
- **Description:** Write error messages that tell users what they did, what the problem is, how to fix it, in plain active voice, with an example where appropriate.
- **Source quote:** "Write error messages in plain language and make sure to tell them what they did, why there is an error, and what they should do to fix it. If appropriate, show them an example." (Thing 85)
- **Relates to:** D-21, D-52

### Anticipate and prototype-test errors
- **Description:** Anticipate the errors people will make, change the design before launch to prevent them, and prototype-test with real target users (not designers down the hall).
- **Source quote:** "Think ahead to the mistakes that people are likely to make. Figure out as much as you can about the kinds of mistakes people are going to make when they use what you've designed. And then change your design before it goes out so that those mistakes won't be made." (Thing 85)
- **Relates to:** D-21, D-52

### Error taxonomy tracking
- **Description:** Classify errors during user testing (commission, omission, wrong-action, motor-control) and concentrate redesign first on errors with negative consequences.
- **Source quote:** "Before you conduct user testing or user observation, decide which possible errors you are most concerned about. During user testing and observation, collect data on which category of errors people are making. This will help focus your redesign efforts after testing." (Thing 88)
- **Relates to:** D-52

### Rational reasons alongside unconscious decisions
- **Description:** People decide unconsciously but still want a rational, logical reason to justify the decision; provide both the unconscious trigger and a rational cover.
- **Source quote:** "Even though people make decisions based on unconscious factors, they want a rational, logical reason for the decisions they make. So you still need to provide the rational, logical reasons, even though they're unlikely to be the actual reasons that people decided to take action." (Thing 90)
- **Relates to:** D-25

### Three-or-four choice curation
- **Description:** Resist offering many choices at once; limit to three or four, or use progressive choice (choose from a small set, then from a subset).
- **Source quote:** "Resist the impulse to provide your customers with a large number of choices. If possible, limit the number of choices to three or four. If you have to offer more options, try to do so in a progressive way." (Thing 92)
- **Relates to:** D-8, D-10

### Preserve alternative paths
- **Description:** Provide more than one way to accomplish a task even if some are less efficient; people equate choice with control, and removing choices makes them unhappy.
- **Source quote:** "People won't always choose the fastest way to complete a task. When you're deciding how your audience will accomplish a task with your website or product, you may want to offer more than one way, even if the alternative methods are less efficient, just so that people will have a choice. Once you've given people choices, they'll be unhappy if you take those choices away." (Thing 93)
- **Relates to:** D-48

### Rich testimonials
- **Description:** Use testimonials, ratings, and reviews; include information about the reviewer that makes the reader feel "this person is like me," which magnifies influence.
- **Source quote:** "Use testimonials, ratings, and reviews if you want to influence behavior. The more information you provide in the rating and review about the person who left it, the more influential the rating or review will be, especially when the description makes the reader feel that this person is 'someone like me.'" (Thing 98)
- **Relates to:** D-47

### Pre-decision private review
- **Description:** For better group decisions, have people consider all relevant information privately before sharing preferences, rate their confidence before sharing, and allow time to discuss disagreements.
- **Source quote:** "Give people a way and time to consider all relevant information on their own before they see what other people think. Ask people to rate how confident they are in their decision before they show that decision to others. Once opinion-sharing starts, make sure people have enough time to discuss their disagreements." (Thing 96)
- **Relates to:** D-47

### Information quantity to steer habit vs value decision
- **Description:** To keep a decision habitual, don't give extra information; to switch someone to a deliberate value-based decision, give them more information.
- **Source quote:** "If you want someone to make a habit-based decision, do not give them a lot of information. If you want someone to make a value-based decision, give them more information." (Thing 97)
- **Relates to:** D-45

### Plan-ahead phase extension
- **Description:** When designing an interface where people plan something in the future, draw out the planning phase; anticipation is more positive than the event itself.
- **Source quote:** "If you're designing an interface where people are planning something in the future (winning the lottery, going on a trip, arranging a business event, building a house), they'll have more positive feelings about the experience the longer you can draw out the planning phase." (Thing 83)
- **Relates to:** D-53

### Barriers-to-entry for loyalty
- **Description:** Moderate barriers to entry (application, criteria, invitation) make those who do join value the group more — don't optimize purely for frictionless onboarding when loyalty is the goal.
- **Source quote:** "If you want people to join your online community, you might find that people use it and value it more when there are steps that have to be taken to join. Filling out an application, meeting certain criteria, being invited by others—all of these can be seen as barriers to entry, but they may also mean that the people who do join care more about the group." (Thing 81)
- **Relates to:** D-48

### Look-and-feel trust gate
- **Description:** Design factors (color, font, layout, navigation) make the first trust cut; content factors (credible sources, expert advice, "written for people like me") make the second cut. Both gates must be passed.
- **Source quote:** "Design factors such as color, font, layout, and navigation are critical in making it through the first 'trust rejection' phase. If a website makes it through the first rejection cut, then content and credibility become the determining factors as to whether the person trusts the site." (Thing 79)
- **Relates to:** D-26

### Familiar-brand safety for fear appeals
- **Description:** When the user's mood is sad or scared, prefer familiar brand cues; when the mood is happy, novelty is persuasive. Match the message to the brand maturity.
- **Source quote:** "Brands are a shortcut. If someone has had a positive experience with a brand in the past, then that brand is a signal of safety to the old brain. Messages of fear or loss may be more persuasive if your brand is an established one. Messages of fun and happiness may be more persuasive if your brand is a new one." (Thing 84)
- **Relates to:** D-26

### Mood-aligned decision framing
- **Description:** People in a happy mood value a product more when they decide intuitively and quickly; people in a sad mood value it more when they decide deliberately. Match the decision style to the induced mood.
- **Source quote:** "People in a good mood will rate a product as being more valuable if they are asked to make the decision quickly based on their first feelings. People in a sad mood will rate a product as being more valuable if they are asked to make the decision in a more deliberate way." (Thing 95)
- **Relates to:** D-25

---

## Heuristics

### Peripheral gist check
- **Check:** Does the periphery of the page communicate the purpose of the scene, or is it dead space? Are emotional images placed where peripheral vision will pick them up?
- **Source quote:** "Although the middle of the screen is important for central vision, don't ignore what is in viewers' peripheral vision. Make sure the information in the periphery communicates clearly the purpose of the page or information they are viewing." (Thing 2)
- **Relates to:** D-43

### Single-feature attention check
- **Check:** Is the most important element on the page different from everything else in exactly one visual feature (color, shape, or orientation)? Have you accidentally used so many differing features that nothing stands out?
- **Source quote:** "You will grab more attention if you use just one feature at a time. But if you are going to use two, then the two to use together are color and orientation (tilt or angle)." (Thing 5)
- **Relates to:** D-30

### Scan-start anchor check
- **Check:** Is the most important task information placed ~30% in from the top and ~30% in from the left, or is it lost at the edges where central vision won't land?
- **Source quote:** "Avoid putting task-related information at the edges, since people tend not to look there with central vision. Save the edges for peripheral vision, which may include images with emotion or anything that will give the 'gist' of the scene." (Thing 6)
- **Relates to:** D-33

### Affordance cue check
- **Check:** Do buttons, links, and controls give visual cues (shadows, shading, hover states) that match how they actually behave? Are there any incorrect affordances (a pull-shaped handle on a push door)?
- **Source quote:** "Avoid providing incorrect affordance cues." (Thing 7)
- **Relates to:** D-27, D-34

### Change-blindness check
- **Check:** If you refresh a screen with one small change (e.g., an error message in a form field), have you added a blinking or auditory cue so users actually notice the change?
- **Source quote:** "Don't assume that people will see something on a screen or page just because it's there. This is especially true when you refresh a screen and make one change on it—for example, the screen reappears with a message about an incorrect piece of data entered in a form field. Users may not even realize they are looking at a different screen." (Thing 8)
- **Relates to:** D-7

### Proximity-vs-noise check
- **Check:** Before adding a line or box to group items, have you tried just adjusting the spacing? Does the spacing correctly signal what belongs together vs. apart?
- **Source quote:** "Before you use lines or boxes to separate items or group them together, first try experimenting with the amount of space between them. Sometimes changing the spacing is sufficient, and you'll be reducing the visual noise of the page." (Thing 9)
- **Relates to:** D-29

### Color-meaning redundancy check
- **Check:** Wherever color conveys meaning, is there a redundant cue (line, pattern, icon, box) that survives red-green color blindness? Have you checked the page with a color-blindness simulator?
- **Source quote:** "If you use color to imply a certain meaning (for example, items in green need immediate attention), use a redundant coding scheme (items in green and with a box around them need immediate attention)." (Thing 11)
- **Relates to:** D-30

### All-caps usage check
- **Check:** Are you using all caps sparingly — only for headlines or critical warnings (e.g., deleting an important file) — and not for body text where it reads as shouting?
- **Source quote:** "People perceive all caps as shouting, and they're unused to reading text in all caps, so use all caps sparingly. Save all caps text for headlines and when you need to get someone's attention (for example, before deleting an important file)." (Thing 13)
- **Relates to:** D-54

### Title-first check
- **Check:** Does the page or passage have a meaningful title or headline that frames what the reader is about to understand?
- **Source quote:** "Provide a meaningful title or headline. It's one of the most important things you can do." (Thing 14)
- **Relates to:** D-56

### Font-difficulty attribution check
- **Check:** Is the font you've chosen for instructions so decorative that users will transfer the felt reading difficulty onto the task itself and decide the task is hard?
- **Source quote:** "If people have trouble reading the font, they will transfer that feeling of difficulty to the meaning of the text itself and decide that the subject of the text is hard to do or understand." (Thing 15)
- **Relates to:** D-54

### X-height legibility check
- **Check:** For on-screen reading, is the font's x-height large enough that the type reads comfortably at the chosen point size?
- **Source quote:** "Consider using a font with a large x-height so that the type will appear to be larger." (Thing 16)
- **Relates to:** D-54

### Chunk-size check
- **Check:** If you can't limit total items to four, are they grouped into chunks of no more than four? Is any single menu, list, or choice set longer than four ungrouped items?
- **Source quote:** "Limit the number of choices or items to three or four. For example, when you provide links that people can go to for more information, limit the number of links to three or four." (Thing 20)
- **Relates to:** D-8

### Recognition-vs-recall check
- **Check:** Are users asked to recall a value from memory when a dropdown, auto-fill, or visible list would let them recognize it? Have you eliminated avoidable memory load?
- **Source quote:** "Eliminate memory load whenever possible. Make use of user interface features such as auto-fill and dropdown lists to reduce the need for people to recall items from memory." (Thing 22)
- **Relates to:** D-32

### Working-memory interference check
- **Check:** While users hold something in working memory, are they asked to do anything else? Have you allowed them to complete the memory task before introducing interference?
- **Source quote:** "If you ask people to remember things in working memory, don't ask them to do anything else until they've completed that task. Working memory is sensitive to interference—too much sensory input will prevent them from focusing attention." (Thing 19)
- **Relates to:** D-8

### Cross-page memory check
- **Check:** Are users asked to remember letters or numbers from one page and enter them on another? If so, can the data be carried or shown automatically?
- **Source quote:** "Don't ask people to remember information from one place to another, such as reading letters or numbers on one page and then entering them on another page; if you do, they'll probably forget the information and get frustrated." (Thing 19)
- **Relates to:** D-32

### Concrete-terms check
- **Check:** Are key concepts expressed in concrete terms and paired with concrete icons? Are abstractions anchored to things the user can picture?
- **Source quote:** "Use concrete terms and icons. They will be easier to remember than abstract ideas or images." (Thing 23)
- **Relates to:** D-42

### Important-info lookup check
- **Check:** When information is critical, are you relying on the user to remember it, or have you provided it in the design or a trivial lookup?
- **Source quote:** "When information is really important, don't rely on people to remember it. Provide it for them in your design or have a way for them to easily look it up." (Thing 25)
- **Relates to:** D-32

### Click-vs-thinking check
- **Check:** Are you minimizing clicks at the cost of making people think? Would more clicks with less thinking actually feel easier?
- **Source quote:** "If you have to make a trade-off on clicks versus thinking, use more clicks and less thinking." (Thing 27)
- **Relates to:** D-29

### Progressive-disclosure research check
- **Check:** Before using progressive disclosure, have you researched what most people want most of the time at each step? (The pattern fails if you guess wrong.)
- **Source quote:** "Progressive disclosure works only if you know what most people will be looking for at each part of the path." (Thing 27)
- **Relates to:** D-29

### Load-tier trade-off check
- **Check:** Have you checked whether you can trade a cognitive load for a visual or motor one? Are motor targets large enough (Fitts's law)?
- **Source quote:** "Look for trade-offs (for example, where you can reduce a cognitive load by increasing a visual or motor load). Make sure your motor targets are large enough to be easily reached." (Thing 28)
- **Relates to:** D-29, D-34

### Mind-wander feedback check
- **Check:** If users' minds wander, is there persistent feedback about where they are so they can return? Are hyperlinks available to support quick topic switching?
- **Source quote:** "Make sure you build in feedback about where people are so that if their minds wander, it's easier for them to get back to the original location." (Thing 29)
- **Relates to:** D-33

### Conceptual-model match check
- **Check:** Have you designed the conceptual model deliberately, or did it bubble up from the technology? Does it match the audience's mental model? If not, is training provided to adjust the mental model before first use?
- **Source quote:** "Design the conceptual model purposefully. Don't let it 'bubble up' from the technology. If you have a brand new product that you know will not match anyone's mental model, you'll need to provide training to prepare people to create a new mental model." (Thing 32)
- **Relates to:** D-28

### Progress-indicator check
- **Check:** For any wait or long task, is there a progress indicator? Is the duration consistent enough that users can calibrate expectations?
- **Source quote:** "Always provide progress indicators so people know how long something will take." (Thing 36)
- **Relates to:** D-31, D-53

### Confirmation-bias entry check
- **Check:** When introducing a new idea, do you start with something the audience already agrees with rather than leading with the disagreement?
- **Source quote:** "If you know your target audience and you know what their beliefs are, you can start by speaking to those beliefs rather than against them. This allows you to get past a first layer of confirmation bias, and then you can start to point out a different or better way." (Thing 37)
- **Relates to:** D-25

### Flow-state design check
- **Check:** Have you given users control over their actions, calibrated challenge to skill, provided constant feedback (not praise), and minimized distractions?
- **Source quote:** "Give people control over their actions during the activity. Pick the right amount of challenge—too much challenge and people will give up. Not enough and the flow state won't start. Give constant feedback." (Thing 38)
- **Relates to:** D-53

### Culture-context design check
- **Check:** If designing for multiple cultures, have you tested with audience research in each region? East-Asian audiences attend more to background and context; Western audiences to focal foreground objects.
- **Source quote:** "People from different geographical regions and cultures respond differently to photos and website designs. In East Asia people notice and remember the background and context more than people in the West do. If you are designing products for multiple cultures and geographical regions, then you had better conduct audience research in multiple locations." (Thing 39)
- **Relates to:** D-47

### Animation-in-periphery check
- **Check:** If users must concentrate on a part of the screen, are there any animations or blinking elements in their peripheral vision that will pull attention away?
- **Source quote:** "If you want users to concentrate on a certain part of the screen, don't put animation or blinking elements in their peripheral vision." (Thing 2)
- **Relates to:** D-43

### Habituation alert check
- **Check:** If users might be habituating and not noticing that information has changed, are you using color, size, animation, video, or sound to draw attention to what's different? Are critical changes 10× more prominent than you think is necessary?
- **Source quote:** "If you think people might be habituating and not noticing that information has changed, then use color, size, animation, video, or sound to draw attention to what's different. If it's critical that people pay attention to certain information, make that information stand out 10 times more than you think is necessary." (Thing 41)
- **Relates to:** D-46

### Automatic-sequence undo check
- **Check:** If users perform a sequence repeatedly (it will become automatic), can they undo not just the last action but the entire sequence? Could a bulk action replace the repeated one?
- **Source quote:** "Make it easy for people to undo not only their last action but also an entire sequence. Rather than requiring people to perform a task over and over, consider a design where they can choose all the items they want to take action on and then perform the action on all the items at once." (Thing 42)
- **Relates to:** D-21

### Rare-event signal check
- **Check:** If users need to notice an event that rarely occurs, is the signal strong enough to break their frequency-based mental model?
- **Source quote:** "If you're designing a product or application where people need to notice an event that rarely occurs, use a strong signal to get their attention when it does." (Thing 43)
- **Relates to:** D-7

### Sustained-attention budget check
- **Check:** Are online demos or tutorials under 7–10 minutes? If you must hold attention longer, have you introduced novel information or a break?
- **Source quote:** "Assume that you have at most 7 to 10 minutes of a person's attention. If you must hold attention longer than 7 to 10 minutes, introduce novel information or a break. Keep online demos or tutorials under 7 to 10 minutes in length." (Thing 44)
- **Relates to:** D-59

### Salient-cue audit check
- **Check:** Have you decided what the salient cues for your audience are, and designed so those cues are obvious? Are you expecting users to notice non-salient information they will actually ignore?
- **Source quote:** "Decide what the salient cues are for your audience. Design so that the salient cues are obvious. Realize that people will probably pay attention only to salient cues." (Thing 45)
- **Relates to:** D-30

### Multitasking recovery check
- **Check:** If people must multitask, have you built in ways for them to fix the additional errors they will make?
- **Source quote:** "If you require people to multitask, expect them to make more errors. Build in ways for them to fix errors afterward." (Thing 46)
- **Relates to:** D-21

### Sound-habituation check
- **Check:** If you use sounds to get attention, do you vary them so people don't habituate and the sounds keep working?
- **Source quote:** "If you use sounds to get attention, then consider changing them so that people will not habituate and the sounds will continue to be attention-getting." (Thing 48)
- **Relates to:** D-46

### Signal-detection tuning check
- **Check:** For each detection task, is a miss worse or a false alarm worse? Have you tuned the signal strength accordingly?
- **Source quote:** "If you're designing for a particular task, think about the four quadrants of the signal detection chart. Is it more damaging for people to have a false alarm or a miss?" (Thing 49)
- **Relates to:** D-21

### Illusory-progress opportunity check
- **Check:** Where motivation is flagging, can you show illusory progress (e.g., pre-stamped boxes) to exploit the goal-gradient effect?
- **Source quote:** "You can get this extra motivation even with the illusion of progress, as in the coffee card B example." (Thing 50)
- **Relates to:** D-31

### Post-reward churn check
- **Check:** Right after a reward is reached, do you have extra interactions (e.g., a thank-you email) to prevent the motivation and activity plummet?
- **Source quote:** "Activity plummets right after the goal is reached, and you are most at risk of losing a customer right after a reward is reached. You may want to have extra interactions after giving a reward." (Thing 50)
- **Relates to:** D-31

### Information-seeking ease check
- **Check:** Have you made information seeking easy? Are you giving small bits rather than full satisfaction? Are arrivals paired with cues (sounds, notifications) and made unpredictable?
- **Source quote:** "The easier you make it for people to find information, the more information-seeking behavior they will engage in. Giving small bits of information and then providing a way for people to get more information results in more information-seeking behavior." (Thing 52, Thing 53)
- **Relates to:** D-58

### Extrinsic-reward design check
- **Check:** If you use extrinsic rewards, are they unexpected rather than contingent? Are you avoiding the trap of expected rewards that kill the behavior once they stop?
- **Source quote:** "Don't assume that money or any other extrinsic reward is the best way to reward people. Look for intrinsic rewards rather than extrinsic rewards. If you're going to give an extrinsic reward, it will be more motivating if it is unexpected." (Thing 54)
- **Relates to:** D-48

### Progress-visibility check
- **Check:** Are there small, visible signs of progress toward goals? Are people's goals tracked and shown?
- **Source quote:** "Look for ways to help people set goals and track them. Show people how they're progressing toward goals." (Thing 55)
- **Relates to:** D-53

### Social-norm data check
- **Check:** To change behavior, are you showing people what others (especially others like them) are doing? Is the comparison direct and data-anchored?
- **Source quote:** "To make use of social norms, provide information in your content about what others are doing, and, if possible, directly show how others' data or information is similar to or different from your users' own." (Thing 56)
- **Relates to:** D-47

### First-glance satisficing check
- **Check:** At first glance (1–2 seconds), does the page feel easy to use? Are the fonts large enough, the white space generous enough, and the content density low enough to survive the satisficing cut?
- **Source quote:** "The first glance at a page influences the impression about whether it will be easy to use. Large fonts and enough white space at first glance makes a website seem easier to use." (Thing 57)
- **Relates to:** D-29

### Shortcut discoverability check
- **Check:** Are shortcuts easy to learn, find, and use? Are defaults provided when you know what most people want most of the time, and is the cost of an accidental default low?
- **Source quote:** "Provide shortcuts as long as they are easy to learn, find, and use, but don't assume that people will always use them. Provide defaults if you know what most people will want to do most of the time and if the result of choosing a default by mistake does not cause costly errors." (Thing 58)
- **Relates to:** D-55

### Attribution-error self-check
- **Check:** When interviewing subject-matter experts about what users will do, are you (or they) over-weighting personality and under-weighting situation? Have you stopped to ask, "Am I making a fundamental attribution error?"
- **Source quote:** "If you're interviewing a subject matter expert or domain expert who's telling you what people do or will do, think carefully about what you're hearing. The expert may miss situational factors and put too much value on people's personalities. Try to build in ways to crosscheck your own biases." (Thing 59)
- **Relates to:** D-25

### Habit-action design check
- **Check:** Is the target habit behavior small and easy? Is there a physical movement (click, swipe, scroll)? Are there auditory or visual cues?
- **Source quote:** "Give people a small, easy task to do rather than a complex one. Build in auditory cues, visual cues, or both. Include some type of physical movement (click, swipe, scroll)." (Thing 60)
- **Relates to:** D-45

### Competition size check
- **Check:** Does the leaderboard show more than 10 competitors? If so, are you dampening the very motivation you're trying to create?
- **Source quote:** "Showing more than 10 competitors can dampen the motivation to compete." (Thing 61)
- **Relates to:** D-31

### Self-service framing check
- **Check:** Is self-service messaging framed around control and independence, or around cost-cutting?
- **Source quote:** "If you want to increase the amount of self-service, make sure your messaging is about having control and being able to do it yourself." (Thing 62)
- **Relates to:** D-48

### Tie-strength design check
- **Check:** Have you decided whether your social feature is strong-tie (≤150, proximity, everyone knows everyone) or weak-tie (large, distributed), and designed the interaction model to match?
- **Source quote:** "If you are designing a product that has social connections or a community built in, think about whether those interactions are for strong or weak ties." (Thing 63)
- **Relates to:** D-47

### Show-do modeling check
- **Check:** Where you want to influence behavior, have you shown someone else doing the same task (especially via video)?
- **Source quote:** "Don't underestimate the power of watching someone else do something. If you want to influence someone's behavior, show someone else doing the same task." (Thing 64)
- **Relates to:** D-47

### Synchronous-bonding check
- **Check:** For online communities, have you built in any synchronous audio or video opportunities so people can hear each other laugh and bond?
- **Source quote:** "Look for opportunities to at least have synchronous audio communication (phone calls, teleconferences) so that periodically you can laugh together. This will bond the relationship(s)." (Thing 70)
- **Relates to:** D-47

### Person-to-person rule check
- **Check:** Do the product's interactions follow person-to-person social rules (responding promptly, not asking for personal info too early, remembering the user between sessions)?
- **Source quote:** "When you're designing a product, think about the interactions that the person will have with it. Do the interactions follow the rules of a person-to-person interaction?" (Thing 66)
- **Relates to:** D-47

### Survey-medium accuracy check
- **Check:** For surveys or audience feedback, have you chosen the medium knowing that phone ⇒ most lying, pen-and-paper ⇒ least lying, in-person ⇒ most accurate?
- **Source quote:** "If you are conducting a survey or getting audience feedback, be aware that telephone surveys will not get you as accurate a response as email or pen-and-paper surveys will. Customer or audience feedback is most accurate when gathered in person." (Thing 67)
- **Relates to:** D-47

### Audio/video comprehension check
- **Check:** When accurate understanding matters, are you relying on text alone, or have you used audio or video of a human speaker to sync speaker-listener brains?
- **Source quote:** "Don't just rely on reading if you want people to understand information clearly. Presenting information through audio or video, where people can hear someone talking, is an especially powerful way to help people understand the message." (Thing 68)
- **Relates to:** D-56

### Friends-and-relatives channel check
- **Check:** Does your social channel distinguish between friends-and-relatives (more motivating, more loyal) vs. acquaintances and strangers?
- **Source quote:** "It may be important to distinguish between social media for friends and relatives and social media for people you're not already connected to. People are 'programmed' to pay special attention to friends and relatives." (Thing 69)
- **Relates to:** D-47

### Video-smile authenticity check
- **Check:** In any video used to put across a message, are the smiles real (Duchenne)? Are you aware that people can detect fake smiles better in video than in photos?
- **Source quote:** "People will be able to determine a fake smile versus a real one better in a video than in a photo. If they don't think the smile is real, they're less likely to trust the person in the video, and that may carry over to your brand or product." (Thing 71)
- **Relates to:** D-25

### Western-emotion-design check
- **Check:** If designing for Western audiences, are you using Ekman's seven basic emotions (joy, sadness, contempt, fear, disgust, surprise, anger) where high-emotion expressions will grab attention? If designing for non-Western cultures, are you using lower-arousal expressions?
- **Source quote:** "If you are designing for Western audiences, you can assume that your audience will recognize Ekman's seven basic emotions of joy, sadness, contempt, fear, disgust, surprise, and anger. You can also assume that high-emotion expressions will be more attention getting. If you are designing for non-Western cultures, then you may want to use images and facial expressions that have less emotional arousal." (Thing 72)
- **Relates to:** D-25

### Groupthink check
- **Check:** Is your cohesive teamwatching out for groupthink? Are debate and disagreement established as social norms? Are group decisions submitted to an outsider's review?
- **Source quote:** "The more cohesive your team is, the more you need to watch out for 'groupthink.' Establish debate and disagreement as social norms for the group. Use the power of the group to create a new social norm that allows, indeed encourages, disagreement and debate. Submit group decisions to an outsider's review." (Thing 73)
- **Relates to:** D-47

### Anecdote-over-data check
- **Check:** When persuading, are you using anecdotes and stories in addition to (or instead of) raw data? Stories evoke feelings, are processed more deeply, and are remembered longer.
- **Source quote:** "Use anecdotes and stories in addition to data. Look for ways to provide a message that will evoke emotions and empathy." (Thing 74)
- **Relates to:** D-56

### Emotion-before-decision check
- **Check:** If you want people to decide and act, have you shown information, images, or video that trigger an emotion? (Without emotion, decision is impaired.)
- **Source quote:** "If you want people to make a decision and take an action (for example, to register for your newsletter or click a Buy button), you need to show them information, images, or a video that triggers an emotion. They will be more likely to decide if they have an emotional experience." (Thing 75)
- **Relates to:** D-25

### Unintended-facial-expression check
- **Check:** Could the interface cause unintended facial expressions (e.g., squinting at tiny fonts → frowning) that prevent people from feeling happy or friendly and harm the action you want?
- **Source quote:** "Watch out for unintended facial expressions that may change how people feel about your product. For example, if the font on your website is very small and people are squinting and frowning to read it, that may actually prevent them from feeling happy or friendly, and that may affect an action you want them to take." (Thing 75)
- **Relates to:** D-25

### Novelty check
- **Check:** To grab attention or bring people back, have you designed something new and novel? (The brain craves the unexpected.)
- **Source quote:** "If you want to grab attention, design something that is new and novel. Something unexpected not only gets attention but can also be pleasurable." (Thing 76)
- **Relates to:** D-58

### Busy-not-idle check
- **Check:** Are there idle waits in the flow where users would be happier doing a worthwhile task? Is the busywork actually worthwhile (not just perceived as busywork)?
- **Source quote:** "People don't like to be idle. People will do a task rather than be idle, but the task has to be seen as worthwhile. If people perceive it to be busywork, then they prefer to stay idle. People who are busy are happier." (Thing 77)
- **Relates to:** D-53

### Pastoral-scene check
- **Check:** If using a nature scene, does it include pastoral elements (hills, water, trees, a path, animals, birds)? Are you aware that on-screen nature improves perceived wellbeing but not actual stress recovery?
- **Source quote:** "People like pastoral scenes. If you're looking for a nature scene to use at a website, try to pick one with pastoral elements." (Thing 78)
- **Relates to:** D-25

### Look-and-feel trust check
- **Check:** Have you passed the first "trust rejection" phase — color, font, layout, navigation? Only then will content and credibility matter.
- **Source quote:** "Design factors such as color, font, layout, and navigation are critical in making it through the first 'trust rejection' phase. If a website makes it through the first rejection cut, then content and credibility become the determining factors as to whether the person trusts the site." (Thing 79)
- **Relates to:** D-26

### Music engagement check
- **Check:** Have you considered allowing people to use or add their own music to an activity? (Music releases dopamine and increases engagement and return visits.)
- **Source quote:** "Allowing people to use or add their own music to a website, product, design, or activity is a powerful way to engage them. It also makes it more likely that they will want to come back and engage again." (Thing 80)
- **Relates to:** D-58

### Barrier-to-entry value check
- **Check:** Could moderate barriers to entry (application, criteria, invitation) make those who join value the community more?
- **Source quote:** "People use it and value it more when there are steps that have to be taken to join." (Thing 81)
- **Relates to:** D-48

### Overreaction-claim check
- **Check:** When users claim a change will make them much happier or never use the product again, are you discounting their overestimation?
- **Source quote:** "Be careful of believing customers or users who tell you that making a particular change to a product or design will make them much happier with it or cause them to never use it again. They are likely overestimating their reactions." (Thing 82)
- **Relates to:** D-25

### Planning-phase length check
- **Check:** For future-planning interfaces, are you drawing out the planning phase to maximize positive anticipation?
- **Source quote:** "If you're designing an interface where people are planning something in the future, they'll have more positive feelings about the experience the longer you can draw out the planning phase." (Thing 83)
- **Relates to:** D-53

### Timing-of-satisfaction-measurement check
- **Check:** Are you measuring satisfaction days after interaction (more positive) or during/right after (more realistic)? Have you chosen the timing deliberately?
- **Source quote:** "If you measure satisfaction or other feelings, realize that you'll get more positive ratings when you ask people a few days after the interaction than when you ask them while they're interacting with the product or website. Alternatively, you'll get better, more realistic data when you ask them during or right after the interaction rather than asking their opinion several days or weeks later." (Thing 83)
- **Relates to:** D-25

### Familiar-brand-for-fear check
- **Check:** If your message uses fear or loss, is your brand established enough to serve as a safety signal? If your brand is new, are you using fun and happiness instead?
- **Source quote:** "Messages of fear or loss may be more persuasive if your brand is an established one. Messages of fun and happiness may be more persuasive if your brand is a new one." (Thing 84)
- **Relates to:** D-26

### Error-message quality check
- **Check:** Does each error message tell the user what they did, explain the problem, instruct how to correct it, use active (not passive) voice, and show an example where appropriate?
- **Source quote:** "Write error messages in plain language and make sure to tell them what they did, why there is an error, and what they should do to fix it. If appropriate, show them an example." (Thing 85)
- **Relates to:** D-21, D-52

### Stress-context research check
- **Check:** Have you done site visits to determine whether the real-world context is stressful (medical, financial, customer-present, time-pressure)? Have you redesigned to reduce stress?
- **Source quote:** "Do research to find out which situations might be stressful. Make site visits, observe and interview the people who are using your product, determine the level of stress, and then redesign if stress is present." (Thing 86)
- **Relates to:** D-57

### Arousal-task match check
- **Check:** For a boring task, have you raised arousal (sound, color, movement)? For a difficult task, have you lowered arousal (eliminated distracting elements)?
- **Source quote:** "If people are performing a boring task, then you need to raise the level of arousal with sound, colors, or movement. If people are doing a difficult task, then you need to lower the level of level of arousal by eliminating any distracting elements such as color, sounds, or movement, unless they are directly related to the task at hand." (Thing 86)
- **Relates to:** D-57

### Tunnel-action recovery check
- **Check:** If users are under stress, are they likely to repeat a failing action over and over? Have you designed a clear escape from the tunnel?
- **Source quote:** "If people are under stress, they won't see things on the screen, and they'll tend to do the same actions over and over, even if they don't work." (Thing 86)
- **Relates to:** D-57

### Expert-performance-stress check
- **Check:** For a well-learned task performed by experts, are you aware that high stakes can cause overanalysis and errors? Have you protected against performance stress?
- **Source quote:** "If someone is an expert at a well-learned task, then performance stress may cause errors." (Thing 86)
- **Relates to:** D-57

### Error-consequence classification check
- **Check:** During user testing, have you classified each error as positive, negative, or neutral consequence, and concentrated redesign first on negative-consequence errors?
- **Source quote:** "Since you know there will be errors, look for and document them during user testing. Note whether each error consequence is positive, negative, or neutral. After user testing (and even before it), first concentrate on redesigning to minimize or avoid errors with negative consequences." (Thing 87)
- **Relates to:** D-52

### Error-strategy observation check
- **Check:** During user testing, have you collected data on which error-correction strategies people use (systematic, trial-and-error, rigid)? Are you redesigning with those strategies in mind?
- **Source quote:** "People use different types of strategies in correcting errors. During user testing and observation, collect data on which strategies your particular audience uses. This information will be helpful in predicting future issues and in redesign." (Thing 89)
- **Relates to:** D-52

### Rational-cover check
- **Check:** Even when decisions are unconsciously driven, have you provided a rational, logical reason users can cite to justify the decision?
- **Source quote:** "Even though people make decisions based on unconscious factors, they want a rational, logical reason for the decisions they make. So you still need to provide the rational, logical reasons, even though they're unlikely to be the actual reasons that people decided to take action." (Thing 90)
- **Relates to:** D-25

### Self-report skepticism check
- **Check:** When people tell you their reasons for a decision, are you skeptical? Have you watched their behavior instead of just listening to what they think their behavior is?
- **Source quote:** "When people tell you their reasons for deciding to take a certain action, you have to be skeptical about what they say. Because decision-making is unconscious, they may be unaware of the true reasons for their decisions." (Thing 90)
- **Relates to:** D-25

### Choice-count check
- **Check:** Have you limited choices to three or four, or used progressive choice (small set → subset)? Are you resisting the impulse to offer many options just because users say they want many?
- **Source quote:** "Resist the impulse to provide your customers with a large number of choices. If possible, limit the number of choices to three or four. If you have to offer more options, try to do so in a progressive way." (Thing 92)
- **Relates to:** D-8, D-10

### Choice-as-control check
- **Check:** Have you offered more than one way to accomplish a task (even if some are less efficient) so people feel in control? Are you avoiding taking existing choices away?
- **Source quote:** "People won't always choose the fastest way to complete a task. When you're deciding how your audience will accomplish a task with your website or product, you may want to offer more than one way, even if the alternative methods are less efficient, just so that people will have a choice." (Thing 93)
- **Relates to:** D-48

### Mood-decision-style match check
- **Check:** Are you matching decision style to the user's mood (happy → intuitive/quick; sad → deliberate)? Can you induce the mood with a short video clip if needed?
- **Source quote:** "People in a good mood will rate a product as being more valuable if they are asked to make the decision quickly based on their first feelings. People in a sad mood will rate a product as being more valuable if they are asked to make the decision in a more deliberate way. If you influence people's mood, then you can suggest to them how to think about their decision-making process." (Thing 95)
- **Relates to:** D-25

### Pre-meeting private-review check
- **Check:** Before group decisions, do people consider all relevant information privately before seeing others' preferences? Do they rate confidence before sharing? Is there time to discuss disagreements?
- **Source quote:** "Give people a way and time to consider all relevant information on their own before they see what other people think. Ask people to rate how confident they are in their decision before they show that decision to others. Once opinion-sharing starts, make sure people have enough time to discuss their disagreements." (Thing 96)
- **Relates to:** D-47

### Information-quantity decision check
- **Check:** To preserve a habit-based decision, are you withholding extra information? To shift to a value-based decision, are you providing information to review?
- **Source quote:** "If you want someone to make a habit-based decision, do not give them a lot of information. If you want someone to make a value-based decision, give them more information." (Thing 97)
- **Relates to:** D-45

### Social-validation check
- **Check:** Are you using testimonials, ratings, and reviews? Does each review include information about the reviewer that makes the reader feel "someone like me"?
- **Source quote:** "Use testimonials, ratings, and reviews if you want to influence behavior. The more information you provide in the rating and review about the person who left it, the more influential the rating or review will be, especially when the description makes the reader feel that this person is 'someone like me.'" (Thing 98)
- **Relates to:** D-47

### Self-report-influence skepticism check
- **Check:** When users say ratings and reviews don't influence them, are you disbelieving them and watching behavior instead?
- **Source quote:** "If you're doing customer research and people say, 'Ratings and reviews don't influence my decision,' don't believe what they're saying. Remember that these are unconscious processes, and people are largely unaware of what is affecting them. Watch their behavior, instead of just listening to what they think their behavior is." (Thing 99)
- **Relates to:** D-47

### Physical-product-display check
- **Check:** Where the dollar value people place on a product matters, can you get the real item in front of them? (Picture and text don't match the effect; even samples or behind-Plexiglas views fall short.)
- **Source quote:** "Brick-and-mortar stores may retain an edge if they have products on hand, especially when it comes to price. Having a product behind glass or any other kind of barrier may lower the price that the customer is willing to pay." (Thing 100)
- **Relates to:** D-25

---

## Antipatterns

### Animation in the periphery during focal tasks
- **Failure mode:** Placing animation or blinking elements in users' peripheral vision when they must concentrate on a central task, pulling attention away against the designer's intent.
- **Source quote:** "If you want users to concentrate on a certain part of the screen, don't put animation or blinking elements in their peripheral vision." (Thing 2)
- **Relates to:** D-43
- **Correct alternative:** Keep the focal area static and the periphery calm; if motion is needed, put it where the user should look.

### Multi-feature visual noise
- **Failure mode:** Using several different colors, shapes, and angles together on one page so the visual cortex takes longer to process and no single element stands out.
- **Source quote:** "A mistake that designers sometimes make is to use several of these visual features together. If on one page or in one image you have several different colors, shapes, and angles, it may take the visual cortex longer to process that information. You won't be as effective in grabbing visual attention." (Thing 5)
- **Relates to:** D-30
- **Correct alternative:** Pick one feature to make the important element pop; use color + orientation together if you must use two.

### Task information at the edges
- **Failure mode:** Putting important task-related information at the edges of the page where central vision doesn't naturally land, while reserving the 30%-in zone for branding or peripheral "gist."
- **Source quote:** "Avoid putting task-related information at the edges, since people tend not to look there with central vision." (Thing 6)
- **Relates to:** D-33
- **Correct alternative:** Place task-critical content ~30% in from top and side; reserve edges for logos, branding, navigation.

### Incorrect affordances
- **Failure mode:** Giving a control visual cues that contradict how it actually works (e.g., a pull-shaped handle on a push door; a button that looks pressed but isn't), forcing you to plaster on confusing text instructions.
- **Source quote:** "When the cue doesn't match the function, then you end up having to post confusing messages so that people know how to interact with the object. When an object is giving cues that go against how it really works, that is known as providing an incorrect affordance." (Thing 7)
- **Relates to:** D-27, D-34
- **Correct alternative:** Make the visual cue match the actual behavior; remove the conflicting text instructions.

### Hyperlinks that lose affordance cues
- **Failure mode:** Making hyperlinks so subtle that the only "clickable" cue appears on hover, forcing users to wander the page with their mouse to discover what's interactive (especially hostile on touch devices).
- **Source quote:** "Lately many hyperlinks are more subtle, with the only cue that they are clickable showing up when you hover... To see links, you have to wander over the page with your finger on your mouse." (Thing 7)
- **Relates to:** D-27
- **Correct alternative:** Keep a persistent affordance cue for links (color, underline, or icon) so clickability is visible without hover.

### Silent screen refreshes with single small changes
- **Failure mode:** Refreshing a screen with only a small change (e.g., an error message in one form field) and assuming users will notice the new screen.
- **Source quote:** "Don't assume that people will see something on a screen or page just because it's there. This is especially true when you refresh a screen and make one change on it—for example, the screen reappears with a message about an incorrect piece of data entered in a form field. Users may not even realize they are looking at a different screen." (Thing 8)
- **Relates to:** D-7
- **Correct alternative:** Add a visual cue (blinking) or auditory cue (beep) to flag the change.

### Forcing recall when recognition is possible
- **Failure mode:** Asking users to recall values from memory (e.g., to type into a form) when a dropdown, auto-fill, or visible list would allow them to recognize instead.
- **Source quote:** "Eliminate memory load whenever possible. Make use of user interface features such as auto-fill and dropdown lists to reduce the need for people to recall items from memory." (Thing 22)
- **Relates to:** D-32, D-44
- **Correct alternative:** Show the options; let users pick rather than produce.

### Cross-page memory transfer
- **Failure mode:** Making users read letters or numbers on one page and enter them on another page, relying on working memory for the transfer.
- **Source quote:** "Don't ask people to remember information from one place to another, such as reading letters or numbers on one page and then entering them on another page; if you do, they'll probably forget the information and get frustrated." (Thing 19)
- **Relates to:** D-32
- **Correct alternative:** Carry the data forward automatically, or show it persistently on the target page.

### Interfering with working memory
- **Failure mode:** Asking users to do anything else while they hold something in working memory, breaking focus and causing them to lose the information.
- **Source quote:** "If you ask people to remember things in working memory, don't ask them to do anything else until they've completed that task. Working memory is sensitive to interference—too much sensory input will prevent them from focusing attention." (Thing 19)
- **Relates to:** D-8
- **Correct alternative:** Let users complete the memory task before introducing new input or actions.

### Relying on self-reports of past behavior
- **Failure mode:** Trusting what people say they did in the past (e.g., in user research interviews), when long-term memory is faulty and reconstructed.
- **Source quote:** "Don't rely entirely on self-reports of past behavior. People will not always remember accurately what they or others did or said. Take what people say after the fact—when they are remembering using your product, for instance, or remembering the experience of calling your customer service line—with a grain of salt." (Thing 24)
- **Relates to:** D-50
- **Correct alternative:** Observe behavior directly; word interview questions carefully because wording can change what people "remember."

### Long unchunked pages
- **Failure mode:** Dumping all the information on one page (the book's example: a 7-screen Social Security survivors page) with no progressive disclosure, overwhelming readers.
- **Source quote:** "If you don't use progressive disclosure, you will end up with very long pages of information that may overwhelm your reader." (Thing 27)
- **Relates to:** D-29
- **Correct alternative:** Summarize each topic in one or two sentences; let users click for more.

### Minimizing clicks at the cost of thinking
- **Failure mode:** Treating click count as the primary metric and compressing many decisions into a single dense screen so users have to think harder.
- **Source quote:** "Counting clicks isn't what counts. People are very willing to click multiple times. In fact, they won't even notice they're clicking if they're getting the right amount of information at each click to keep them going down the path. Think progressive disclosure; don't count clicks." (Thing 27)
- **Relates to:** D-29
- **Correct alternative:** Trade clicks for less thinking; more steps with logical, expected content beats fewer steps with higher cognitive load.

### Small or distant motor targets
- **Failure mode:** Making targets (buttons, arrows, dropdown handles) too small or too far from the start point, causing overshoots and motor errors.
- **Source quote:** "Fitts's law tells us that they will probably overshoot the arrow if they move quickly, and they'll have to back up and go to the arrow." (Thing 28)
- **Relates to:** D-34
- **Correct alternative:** Size and place targets per Fitts's law so users can reach them reliably.

### Evidence-first persuasion
- **Failure mode:** Telling people they're wrong and presenting evidence that their belief isn't logical; this often backfires and makes them dig in harder.
- **Source quote:** "Don't just give people evidence that their belief is not logical, tenable, or a good choice. This may backfire and make them dig in even harder." (Thing 30)
- **Relates to:** D-25
- **Correct alternative:** Start with something they already agree with, then ask for a small commitment that induces cognitive dissonance and opens the door to change.

### Conceptual model "bubbling up" from the technology
- **Failure mode:** Letting the underlying hardware, software, or database structure dictate the interface, so only the programmers' mental model fits.
- **Source quote:** "There are no real designers. The conceptual model wasn't really designed at all. It's just a reflection of the underlying hardware or software or database, so the only people whose mental model it fits are the programmers. If the audience is not the programmers, then you're in trouble." (Thing 32)
- **Relates to:** D-28
- **Correct alternative:** Design the conceptual model deliberately to match the audience's mental model; train if a new model is needed.

### Putting body content before a title
- **Failure mode:** Starting body content without a meaningful title or headline, leaving readers without a frame for comprehension.
- **Source quote:** "Provide a meaningful title or headline. It's one of the most important things you can do." (Thing 14)
- **Relates to:** D-56
- **Correct alternative:** Always lead with a title that frames the passage; even poorly written content becomes understandable with a good title.

### Decorative fonts for instructions
- **Failure mode:** Using overly decorative fonts for instructions so that users perceive the task as harder than it is and become less willing to do it.
- **Source quote:** "If the instructions were in an easy-to-read font (such as Arial), people estimated that it would take about eight minutes to do the exercise and that it wouldn't be too difficult. But if the instructions were given in an overly decorative font (such as Brush Script MT Italic), people estimated it would take almost twice as long—15 minutes—to do the exercise, and they rated the exercise as being difficult to do." (Thing 15)
- **Relates to:** D-54
- **Correct alternative:** Use simple, easy-to-read fonts for instructions; reserve decorative fonts for mood, not for procedural content.

### Tiny on-screen fonts
- **Failure mode:** Choosing a point size too small for the screen (especially with a low x-height), causing eyestrain and the unintended frowning that suppresses positive emotion.
- **Source quote:** "Use a large point size for text that will be read on a screen. This will help minimize eyestrain." (Thing 17)
- **Relates to:** D-54, D-25
- **Correct alternative:** Use a larger point size and a font with a large x-height for on-screen reading.

### Forcing multitasking
- **Failure mode:** Requiring users to do two cognitive tasks at once (e.g., talk to a customer while filling out a form), expecting them to perform well.
- **Source quote:** "Avoid forcing people to multitask. It is difficult for them to do two things at once... If you require people to multitask, expect them to make more errors. Build in ways for them to fix errors afterward." (Thing 46)
- **Relates to:** D-59, D-21
- **Correct alternative:** Sequence the tasks; if they must overlap, make the tool extremely easy to use and build in error recovery.

### Halfalogue environments
- **Failure mode:** Forcing users to work in an environment where they can hear only one side of a phone conversation (halfalogue), which is more distracting than a full conversation because of its unpredictability.
- **Source quote:** "A one-sided conversation (or halfalogue) uses more of your mental resources because the information is less predictable. You're in suspense wondering what you're missing in the other half of the conversation." (Thing 46)
- **Relates to:** D-59
- **Correct alternative:** Avoid halfalogue in shared work environments; if unavoidable, mask with pink noise or full conversation.

### Long online demos and tutorials
- **Failure mode:** Producing online demos or tutorials longer than 7–10 minutes without breaks, exceeding the sustained-attention limit.
- **Source quote:** "Keep online demos or tutorials under 7 to 10 minutes in length." (Thing 44)
- **Relates to:** D-59
- **Correct alternative:** Break into segments under 7–10 minutes, or introduce novel information/breaks to reset attention.

### Misjudging eye-tracking data
- **Failure mode:** Treating eye-tracking fixation as proof of attention; central vision can land on something the user never consciously registers.
- **Source quote:** "Eye-tracking data can be misleading for several reasons: 1) As we've discussed in this section, eye tracking tells you what people looked at, but that doesn't mean that they paid attention to it." (Thing 8)
- **Relates to:** D-7
- **Correct alternative:** Treat eye-tracking as one signal among several; combine with behavioral measures.

### Assuming attention is sustained
- **Failure mode:** Assuming people are paying close selective attention when they're actually filtering out most of the page.
- **Source quote:** "Don't assume, however, that people are always paying close selective attention." (Thing 40)
- **Relates to:** D-59
- **Correct alternative:** Use large images, faces, animation, and video deliberately to grab attention; don't rely on users' good intentions.

### Habituated critical alerts
- **Failure mode:** Using the same sound or visual style for critical alerts so often that users habituate and stop noticing them.
- **Source quote:** "If you use sounds to get attention, then consider changing them so that people will not habituate and the sounds will continue to be attention-getting." (Thing 48)
- **Relates to:** D-46
- **Correct alternative:** Vary the alert stimulus; reserve high-intensity alerts for genuinely critical events.

### Expected contingent rewards
- **Failure mode:** Promising an extrinsic reward contingent on a specific behavior (e.g., "draw to get a certificate"), which suppresses the behavior once the reward stops.
- **Source quote:** "Contingent rewards (rewards given based on specific behavior that is spelled out ahead of time) resulted in less of the desired behavior if the reward was not repeated." (Thing 54)
- **Relates to:** D-48
- **Correct alternative:** Make rewards unexpected; prefer intrinsic motivators (mastery, autonomy, purpose).

### Crowded leaderboards
- **Failure mode:** Showing dozens or hundreds of names on a leaderboard, dampening the motivation to compete.
- **Source quote:** "It's common to see products with leaderboards that list dozens or even hundreds of names. To keep people motivated you may want to show only the top 10 on the leaderboard." (Thing 61)
- **Relates to:** D-31
- **Correct alternative:** Cap the visible leaderboard at ~10 competitors.

### Framing self-service as cost-cutting
- **Failure mode:** Framing self-service in terms of cost savings or removing human help, when autonomy is the actual motivator.
- **Source quote:** "If you want to increase the amount of self-service, make sure your messaging is about having control and being able to do it yourself." (Thing 62)
- **Relates to:** D-48
- **Correct alternative:** Frame self-service around control and independence.

### Subject-matter-expert attribution error
- **Failure mode:** Trusting a domain expert's account of what users will do without checking for fundamental attribution errors (over-weighting personality, under-weighting situation).
- **Source quote:** "If you're interviewing a subject matter expert or domain expert who's telling you what people do or will do, think carefully about what you're hearing. The expert may miss situational factors and put too much value on people's personalities." (Thing 59)
- **Relates to:** D-25
- **Correct alternative:** Crosscheck expert claims with behavioral observation and situation analysis.

### Forgetting the medium in survey design
- **Failure mode:** Running a telephone survey expecting accurate answers, or running an email survey expecting fair-minded answers, when the medium itself biases honesty.
- **Source quote:** "People lie most on the phone and least in email, with face-to-face and messaging interactions equal and in the middle of the other techniques." (Thing 67)
- **Relates to:** D-47
- **Correct alternative:** Pick the medium for the level of honesty you need; prefer in-person for the most accurate data.

### Asynchronous-only community
- **Failure mode:** Building a community on asynchronous text alone (email, messaging), expecting strong bonds that only synchronous audio or video can create.
- **Source quote:** "Many online interactions are asynchronous (email, messaging) and therefore don't afford a lot of opportunity for social bonding through laughing. Look for opportunities to at least have synchronous audio communication (phone calls, teleconferences) so that periodically you can laugh together." (Thing 70)
- **Relates to:** D-47
- **Correct alternative:** Build in synchronous audio or video so people can hear each other laugh and bond.

### Fake smiles in marketing video
- **Failure mode:** Using a fake smile in a video, assuming people can't tell; they can — and the distrust transfers to the brand.
- **Source quote:** "If you are using a video to put across your message, pay attention to smiles. People will be able to determine a fake smile versus a real one better in a video than in a photo. If they don't think the smile is real, they're less likely to trust the person in the video, and that may carry over to your brand or product." (Thing 71)
- **Relates to:** D-25
- **Correct alternative:** Use genuine smiles; if you can't get a Duchenne smile, prefer a photo over a fake-smile video.

### Groupthink in cohesive teams
- **Failure mode:** Letting a cohesive, well-functioning team minimize conflict to preserve harmony, so important issues go unaddressed and decisions skew toward consensus rather than quality.
- **Source quote:** "People who are part of a well-working group tend to want to minimize conflict. They don't want to do or say anything that may disrupt the good feelings and harmony. This means that, sometimes, important issues are not dealt with, and difficult decisions are not made—or, if decisions are dealt with, those decisions might not be best in the long run." (Thing 73)
- **Relates to:** D-47
- **Correct alternative:** Establish debate and disagreement as social norms; submit group decisions to an outsider's review.

### Data-only persuasion
- **Failure mode:** Presenting only numerical/statistical data to persuade, expecting it to land as well as a story.
- **Source quote:** "This data-based approach will be less persuasive than anecdotes. You may want to include the data, but your presentation will be more powerful if you focus on one or more anecdotes." (Thing 74)
- **Relates to:** D-56
- **Correct alternative:** Lead with an anecdote or story; include the data as support.

### Decision-without-emotion
- **Failure mode:** Asking users to decide and act without triggering any emotion, expecting a rational decision to be enough.
- **Source quote:** "If you want people to make a decision and take an action, you need to show them information, images, or a video that triggers an emotion. They will be more likely to decide if they have an emotional experience." (Thing 75)
- **Relates to:** D-25
- **Correct alternative:** Show emotion-triggering content before the decision point.

### Idle waits
- **Failure mode:** Forcing users to stand idle with nothing to do, even when a worthwhile task could fill the wait.
- **Source quote:** "People don't like to be idle. People who are busy are happier." (Thing 77)
- **Relates to:** D-53
- **Correct alternative:** Offer a worthwhile task (not busywork) during waits to keep users happier.

### Busywork fillers
- **Failure mode:** Offering a task during a wait that users perceive as pointless busywork; they'll prefer to stay idle.
- **Source quote:** "People will do a task rather than be idle, but the task has to be seen as worthwhile. If people perceive it to be busywork, then they prefer to stay idle." (Thing 77)
- **Relates to:** D-53
- **Correct alternative:** Make the filler task meaningful, or remove it.

### Trust by content alone
- **Failure mode:** Investing only in content and credibility while ignoring the look-and-feel trust gate, which rejects sites before content ever gets considered.
- **Source quote:** "When participants in the study rejected a health website as not being trustworthy, 83 percent of their comments were related to design factors, such as an unfavorable first impression of the look and feel, navigation, color, text size, or name of the website." (Thing 79)
- **Relates to:** D-26
- **Correct alternative:** Pass the design trust gate first (color, font, layout, navigation), then invest in content.

### Trusting overestimated reactions
- **Failure mode:** Believing users who say a change will make them much happier or never use the product again; people overestimate their future emotional reactions.
- **Source quote:** "Be careful of believing customers or users who tell you that making a particular change to a product or design will make them much happier with it or cause them to never use it again. They are likely overestimating their reactions." (Thing 82)
- **Relates to:** D-25
- **Correct alternative:** Discount self-reported future reactions; test behaviorally.

### Fear appeals for an unknown brand
- **Failure mode:** Using fear or loss messaging for a brand users don't yet know, when familiar brands are the ones that can safely trigger fear-based responses.
- **Source quote:** "Messages of fear or loss may be more persuasive if your brand is an established one. Messages of fun and happiness may be more persuasive if your brand is a new one." (Thing 84)
- **Relates to:** D-26
- **Correct alternative:** For new brands, lead with fun and happiness; reserve fear appeals for established brands.

### Passive-voice error messages
- **Failure mode:** Writing error messages in passive voice ("it is necessary that..."), without telling the user what they did or how to fix it.
- **Source quote:** "#402: Before the invoice can be paid it is necessary that the invoice payment be later than the invoice create date. Say instead, 'You entered an invoice payment date that is earlier than the invoice create date. Check the dates and reenter so that the invoice payment date is after the invoice create date.'" (Thing 85)
- **Relates to:** D-21, D-52
- **Correct alternative:** Use active voice; tell users what they did, why there's an error, and how to fix it; include an example.

### Testing with designers instead of real users
- **Failure mode:** Testing the prototype with designers down the hall instead of the actual users (e.g., nurses for a medical device), missing the errors real users will make.
- **Source quote:** "Create a prototype of your design and get people to use it so you can see what the errors are likely to be. When you do this, make sure the people who are testing the prototype are the same people who will be using it. For example, if the product is designed for nurses in a hospital, don't use your designers down the hall to test for errors." (Thing 85)
- **Relates to:** D-52
- **Correct alternative:** Test with representative target users, not colleagues.

### Assuming a stress-free environment
- **Failure mode:** Assuming people will use your product in a stress-free context when real-world use is stressful (medical, financial, customer-present, time-pressured).
- **Source quote:** "Don't assume that people will use your product in a stress-free environment. Things that may not seem stressful to you as a designer might be very stressful for the person using your product in the real world." (Thing 86)
- **Relates to:** D-57
- **Correct alternative:** Do site visits; observe and interview real users in context; redesign for stress.

### One-size-fits-all arousal
- **Failure mode:** Using the same arousal level (color, sound, movement) for boring and difficult tasks alike, when the optimal arousal differs by task difficulty.
- **Source quote:** "If people are performing a boring task, then you need to raise the level of arousal with sound, colors, or movement. If people are doing a difficult task, then you need to lower the level of arousal by eliminating any distracting elements." (Thing 86)
- **Relates to:** D-57
- **Correct alternative:** Calibrate arousal to task difficulty — raise for boring, lower for difficult.

### Believing self-reported reasons for decisions
- **Failure mode:** Taking users' stated reasons for a decision at face value, when decision-making is largely unconscious.
- **Source quote:** "When people tell you their reasons for deciding to take a certain action, you have to be skeptical about what they say. Because decision-making is unconscious, they may be unaware of the true reasons for their decisions." (Thing 90)
- **Relates to:** D-25
- **Correct alternative:** Watch behavior; treat stated reasons as rational cover, not root cause.

### Offering many choices because users ask for them
- **Failure mode:** Giving users many choices because they say they want many, when choice overload actually paralyzes decisions and reduces purchases.
- **Source quote:** "If you ask people how many options they want, they will almost always say 'a lot' or 'give me all the options.' So if you ask, be prepared to deviate from what they ask for." (Thing 92)
- **Relates to:** D-8, D-10
- **Correct alternative:** Limit to three or four, or use progressive choice; ignore stated preference for many.

### Removing choices after granting them
- **Failure mode:** Removing an alternative method of doing a task in a new version of the product, even if the new method is more efficient, because users equate choice with control.
- **Source quote:** "Once you've given people choices, they'll be unhappy if you take those choices away. If a new version of your product includes improved methods for accomplishing tasks, you may want to leave some of the older methods in the product so that people feel they have options." (Thing 93)
- **Relates to:** D-48
- **Correct alternative:** Keep the old methods alongside the new ones to preserve the feeling of choice.

### Pre-meeting preference sharing
- **Failure mode:** Sharing group members' initial preferences before everyone has reviewed the relevant information, biasing the group away from the best decision.
- **Source quote:** "The researchers concluded that when a group of people starts a discussion by sharing their initial preferences, they spend less time and less attention on the information available outside the group's preferences. And they therefore make a less than optimal decision." (Thing 96)
- **Relates to:** D-47
- **Correct alternative:** Have everyone review information privately first; share preferences only after private review; rate confidence before sharing.

### Flooding habitual decisions with information
- **Failure mode:** Adding lots of information to a renewal or repeat-decision screen, inadvertently kicking the user from a habit-based decision (which they would accept) to a value-based decision (which they might reject).
- **Source quote:** "If you give someone a lot of information, then they will switch from a habit-based decision to a value-based decision. If you want someone to make a habit-based decision, don't give them too much information to review." (Thing 97)
- **Relates to:** D-45
- **Correct alternative:** To preserve a habit decision, withhold extra information; to shift to a value decision, provide it.

### Trusting "ratings don't influence me" claims
- **Failure mode:** Believing users who say ratings and reviews don't influence them, when the third-person effect shows the influence is unconscious.
- **Source quote:** "If you're doing customer research and people say, 'Ratings and reviews don't influence my decision,' don't believe what they're saying. Remember that these are unconscious processes, and people are largely unaware of what is affecting them." (Thing 99)
- **Relates to:** D-47
- **Correct alternative:** Watch behavior, not self-report; use testimonials, ratings, and reviews and include reviewer information.

### Picture-only product display where physical matters
- **Failure mode:** Expecting a picture to do the work of the physical product, when having the real item in front of users can raise willingness-to-pay by up to 60%.
- **Source quote:** "Having a picture didn't significantly increase the amount of money people were willing to bid for the product, but having the product right in front of them definitely did, by up to 60 percent." (Thing 100)
- **Relates to:** D-25
- **Correct alternative:** Where dollar value matters, get the real item in front of the user; even samples or behind-glass views fall short.

### Default that creates more work
- **Failure mode:** Setting a default that users will accept by mistake, then making it costly to recover (e.g., defaulting shipping to the last address used, which sends the order to the wrong person).
- **Source quote:** "If it takes a lot of work to change the result of accepting 'wrong' defaults, then think twice about using them in your design." (Thing 58)
- **Relates to:** D-55
- **Correct alternative:** Only use defaults when you know what most people want and the cost of an accidental default is low.