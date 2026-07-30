# B6 Lidwell — Patterns, Heuristics, Antipatterns

> Source: William Lidwell, Kritina Holden, Jill Butler — *Universal Principles of Design*
> Extracted from: experiments/design-skill/laws/sources/B6-lidwell/extract.md
> Excludes the 40 already-cataloged laws (D-15, D-5, D-10, D-14, D-27..D-39, D-56, D-62..D-92).

## Patterns

### Affordance Matching
- **Description:** Design objects and environments so their physical (or perceived, in software) characteristics correspond to their intended function, and negatively afford improper use. Use familiar-object metaphors in abstract contexts (software icons) to imply function.
- **Source quote:** "When the affordance of an object or environment corresponds with its intended function, the design will perform more efficiently and will be easier to use. Conversely, when the affordance of an object or environment conflicts with its intended function, the design will perform less efficiently and be more difficult to use." (Principle: Affordance)
- **Relates to:** D-36 (constraint), D-34 (mapping), D-37 (forgiveness)

### Alignment Cues
- **Description:** Align elements into rows, columns, or along a centerline to create unity and cohesion. Left- and right-aligned text blocks provide stronger alignment cues than center-aligned; justified text is strongest for complex compositions. Diagonal alignment paths should differ by 30 degrees or more to be detectable.
- **Source quote:** "In paragraph text, left-aligned and right-aligned text blocks provide more powerful alignment cues than do center-aligned text blocks… Justified text provides more alignment cues than unjustified text, and should be used in complex compositions with many elements." (Principle: Alignment)
- **Relates to:** D-5 (Gestalt grouping), D-14 (visual hierarchy)

### Chunking for Memory
- **Description:** Combine many units of information into a limited number of chunks (4 ± 1) when people must recall or retain information, or when information is used for problem solving. Do NOT chunk information that is to be searched or scanned — chunking reference lists increases scan time with no benefit.
- **Source quote:** "Chunk information when people are required to recall and retain information, or when information is used for problem solving. Do not chunk information that is to be searched or scanned. In environments where noise or stress can interfere with concentration, consider chunking critical display information in anticipation of diminished short-term memory capacity. Use the contemporary estimate of four, plus or minus one chunks when applying this technique." (Principle: Chunking)
- **Relates to:** D-83 (performance load), D-30 (signal-to-noise)

### Closure for Minimalism
- **Description:** Use closure to reduce complexity and increase interestingness by removing elements that viewers will subconsciously supply. Strongest when elements approximate simple, recognizable patterns; use transitional elements when patterns are complex.
- **Source quote:** "Use closure to reduce the complexity and increase the interestingness of designs. When designs involve simple and recognizable patterns, consider removing or minimizing the elements of a design that can then be supplied by viewers." (Principle: Closure)
- **Relates to:** D-79 (Pragnanz), D-5 (Gestalt grouping)

### Common Fate Grouping
- **Description:** Group elements by having them move (or flicker) at the same time, velocity, and direction. Related elements move together; unrelated elements move independently or stay stationary. Move bounding edges with elements to achieve figure relationship; opposite to achieve ground.
- **Source quote:** "Consider common fate as a grouping strategy when displaying information with moving or flickering elements. Related elements should move at the same time, velocity, and direction, or flicker at the same time, frequency, and intensity." (Principle: Common Fate)
- **Relates to:** D-5 (Gestalt grouping), D-91 (uniform connectedness)

### Comparison Apples-to-Apples
- **Description:** When illustrating relationships, present comparison data using common measures and units, in a single context (multivariate displays, small multiples), and accompanied by benchmark variables so substantive comparisons can be made.
- **Source quote:** "Ensure that compared variables are apples to apples by measuring and representing variables in common ways, correcting for confounds in the data as necessary. Use multivariate displays and small multiples to present comparisons in single contexts when possible. Use benchmarks to anchor comparisons and provide a point of reference from which to evaluate the data." (Principle: Comparison)
- **Relates to:** D-30 (signal-to-noise)

### Consistency Four-Layer Model
- **Description:** Apply aesthetic consistency (style/appearance for recognition), functional consistency (meaning/action for usability), internal consistency (within system, for trust), and external consistency (across independent systems). When common standards exist, observe them.
- **Source quote:** "Consider aesthetic and functional consistency in all aspects of design. Use aesthetic consistency to establish unique identities that can be easily recognized. Use functional consistency to simplify usability and ease of learning. Ensure that systems are always internally consistent, and externally consistent to the greatest degree possible." (Principle: Consistency)
- **Relates to:** D-81 (modularity)

### Two-Step Confirmation (Arm-Fire)
- **Description:** For hardware or critical-action confirmations, use a preliminary arming step that must occur before the actual command. This prevents accidental activation far more reliably than a dialog. Reserve confirmations for critical or irreversible operations; permit less critical ones to be disabled after first confirmation.
- **Source quote:** "Confirmation using a two-step operation involves a preliminary step that must occur prior to the actual command or input. This is most often used with hardware controls, and is often referred to as an arm/fire operation—first you arm the component, and then you fire (execute) it… The purpose of the two-step operation is to prevent accidental activation of a critical control." (Principle: Confirmation)
- **Relates to:** D-35 (confirmation), D-37 (forgiveness), D-36 (constraint)

### Control by Proficiency
- **Description:** Provide beginner methods (structured, minimal choices, prompts) and expert methods (shortcuts, direct access), limited to two per task. Conceal expert methods to minimize beginner complexity. Only add expert shortcuts to systems used frequently enough to develop expertise; kiosks/ATMs should assume all users are first-time.
- **Source quote:** "Since accommodating multiple methods increases the complexity of the system, the number of methods for any given task should be limited to two—one for beginners, and one for experts. The need to provide expert shortcuts is limited to systems that are used frequently enough for people to develop expertise." (Principle: Control)
- **Relates to:** D-65 (cost-benefit)

### Defensible Space Cues
- **Description:** In physical and digital spaces, clearly mark territories to indicate ownership/responsibility, increase opportunities for surveillance (reduce concealment), and use typical symbolic barriers to convey that a space is cared for. Atypical symbols can signal affluence and act as a lure rather than barrier.
- **Source quote:** "Clearly mark territories to indicate ownership and responsibility; increase opportunities for surveillance and reduce environmental elements that allow concealment; reduce unassigned open spaces and services; and use typical symbolic barriers to indicate activity and use." (Principle: Defensible Space)
- **Relates to:** D-33 (wayfinding), D-27 (visibility)

### Elaborative Rehearsal for Recall
- **Description:** To make information memorable, engage people in deeper processing: use unique presentation, interesting activities, case studies, and examples that make information relevant and require thought. Elaborative rehearsal yields 2-3x better recall than maintenance (rote) rehearsal. Incorporate frequent rest periods — deep processing is fatiguing.
- **Source quote:** "Generally, elaborative rehearsal results in recall performance that is two to three times better than maintenance rehearsal… Use unique presentation and interesting activities to engage people to deeply process information. Use case studies, examples, and other devices to make information relevant to an audience." (Principle: Depth of Processing)
- **Relates to:** D-66 (depth of processing), D-84 (picture superiority)

### Development Cycle Iteration
- **Description:** Gather requirements through controlled interactions with target audiences (not by asking what they want). Use research, brainstorming, prototyping, and iterative design. Minimize variability in development. The iterative (vs. waterfall) model is preferred unless requirements are exact and unchanging and iteration cost is prohibitive.
- **Source quote:** "Gather requirements through controlled interactions with target audiences, rather than simple feedback or speculation by team members. Use research, brainstorming, prototyping, and iterative design to achieve optimal designs. Minimize variability in products and processes to improve quality." (Principle: Development Cycle)
- **Relates to:** D-87 (scaling fallacy)

### Entry Point Design (Barriers / Prospect / Lures)
- **Description:** Maximize entry point effectiveness with three elements: minimal barriers (nothing impedes getting to and through the entry), points of prospect (orientation and clear survey of options with time/space to decide), and progressive lures (compelling elements that pull people incrementally through the entry).
- **Source quote:** "Maximize the effectiveness of the entry point in a design by reducing barriers, establishing clear points of prospect, and using progressive lures. Provide sufficient time and space for people to review opportunities for interaction at the entry point." (Principle: Entry Point)
- **Relates to:** D-67 (entry point), D-33 (wayfinding)

### Error Taxonomy (Slips vs. Mistakes)
- **Description:** Differentiate design responses by error type. For slips (automatic, unconscious, from routine change or interruption): provide clear distinctive feedback, use confirmations, use constraints/affordances. For mistakes (conscious, from stress/bias/overconfidence): minimize noise, use checklists/decision trees, make key indicators visible within one eyespan, train on error recovery.
- **Source quote:** "Minimize slips by providing clear feedback on actions… Position controls to prevent accidental activation of functions that may have detrimental consequences. When this is not possible, use confirmations to interrupt the flow and verify the action… Minimize mistakes by increasing situational awareness and reducing environmental noise. Make key indicators and controls visible within one eyespan whenever possible." (Principle: Errors)
- **Relates to:** D-35 (confirmation), D-37 (forgiveness), D-36 (constraint)

### Face-ism Ratio for Image Intent
- **Description:** Use high face-ism images (face fills most of frame) to focus attention on intellectual and personality attributes. Use low face-ism images (body fills most of frame) to focus on physical and sensual attributes. Effect is irrespective of subject or viewer gender.
- **Source quote:** "When the design objective requires more thoughtful interpretations or associations, use images with high face-ism ratios. When the design objective requires more ornamental interpretations or associations, use images with low-face-ism ratios." (Principle: Face-ism Ratio)
- **Relates to:** D-72 (framing)

### Feedback Loop Design
- **Description:** Use positive feedback loops to perturb systems toward change, but include negative feedback loops to prevent runaway behaviors leading to failure. Use negative feedback to stabilize systems, but avoid excessive negative feedback which causes stagnation. Designers must consider variables' effects on the whole system and environment, not just isolated elements.
- **Source quote:** "Consider positive feedback loops to perturb systems to change, but include negative feedback loops to prevent runaway behaviors that lead to system failure. Consider negative feedback loops to stabilize systems, but be cautious in that too much negative feedback in a system can lead to stagnation." (Principle: Feedback Loop)
- **Relates to:** D-69 (factor of safety)

### Figure-Ground for Focus
- **Description:** Clearly differentiate figure from ground to focus attention and aid recall. Make key elements figures by giving them definite shape, placing them below horizon lines or in lower regions of the design. Figure elements receive more attention and are better remembered than ground.
- **Source quote:** "Clearly differentiate between figure and ground in order to focus attention and minimize perceptual confusion. Ensure that designs have stable figure-ground relationships by incorporating the appropriate visual cues listed above. Increase the probability of recall of key elements by making them figures in the composition." (Principle: Figure-Ground Relationship)
- **Relates to:** D-14 (visual hierarchy), D-79 (Pragnanz)

### Fitts' Law for Controls
- **Description:** Place frequently-used or critical controls near the user and make them large; place dangerous or infrequently-used controls farther away and smaller. Edges and corners of screens act as natural barriers, effectively giving controls infinite size in that direction — position buttons at screen edges/corners to reduce homing errors.
- **Source quote:** "Make sure that controls are near or large, particularly when rapid movements are required and accuracy is important. Likewise, make controls more distant and smaller when they should not be frequently used, or when they will cause problems if accidentally activated. Consider strategies that constrain movements when possible to improve performance and reduce error." (Principle: Fitts' Law)
- **Relates to:** D-10 (Hick's law), D-36 (constraint)

### Five Hat Racks (Information Organization)
- **Description:** Organize information by one of five strategies: Category (similarity/relatedness), Time (chronological sequence), Location (geographic/spatial), Alphabet (for referential, efficient nonlinear access), Continuum (magnitude, lowest-to-highest). Choose based on how people will naturally seek the information.
- **Source quote:** "Category refers to organization by similarity or relatedness… Time refers to organization by chronological sequence… Location refers to organization by geographical or spatial reference… Alphabet refers to organization by alphabetical sequence… Continuum refers to organization by magnitude." (Principle: Five Hat Racks)
- **Relates to:** D-81 (modularity)

### Flexibility-Usability Tradeoff
- **Description:** Favor specialized designs when audiences can clearly anticipate their needs; favor flexible designs when audiences cannot. Flexibility adds complexity, decreases efficiency, and costs more. As audience needs become better defined over time, shift designs toward specialization.
- **Source quote:** "When an audience has a clear understanding of its needs, favor specialized designs that target those needs as efficiently as possible. When an audience has a poor understanding of its needs, favor flexible designs to address the broadest possible set of future applications." (Principle: Flexibility-Usability Tradeoff)
- **Relates to:** D-65 (cost-benefit), D-29 (progressive disclosure)

### Forgiveness Strategies (Hierarchy)
- **Description:** Achieve forgiveness preferentially through good affordances, reversibility (undo), and safety nets. These reduce the need for confirmations, warnings, and help. The amount of help required is inversely proportional to design quality — if a lot of help is needed, the design is poor.
- **Source quote:** "The preferred methods of achieving forgiveness in a design are affordances, reversibility of actions, and safety nets. Designs that effectively use these strategies require minimal confirmations, warnings, and help—i.e., if the affordances are good, help is less necessary; if actions are reversible, confirmations are less necessary; if safety nets are strong, warnings are less necessary." (Principle: Forgiveness)
- **Relates to:** D-37 (forgiveness), D-35 (confirmation)

### Garbage In-Garbage Out Prevention
- **Description:** Prevent input problems of type (wrong input type) using affordances and constraints. Prevent problems of quality (correct type, defective value) using previews and confirmations. When input integrity is critical, use validation tests and independent multi-person verification.
- **Source quote:** "Use affordances and constraints to minimize problems of type. Use previews and confirmations to minimize problems of quality. When input integrity is critical, use validation tests to check integrity prior to input, and consider confirmation steps that require the independent verification of multiple people." (Principle: Garbage In-Garbage Out)
- **Relates to:** D-36 (constraint), D-35 (confirmation), D-37 (forgiveness)

### Good Continuation Grouping
- **Description:** Indicate relatedness by aligning elements along straight lines or smooth curves; locate unrelated items on different alignment paths. Line extensions of related objects should intersect with minimal disruption. Arrange bar graphs so endpoints form continuous, not abrupt, lines.
- **Source quote:** "Use good continuation to indicate relatedness between elements in a design. Locate elements such that their alignment corresponds to their relatedness, and locate unrelated or ambiguously related items on different alignment paths. Ensure that line extensions of related objects intersect with minimum line disruption." (Principle: Good Continuation)
- **Relates to:** D-5 (Gestalt grouping), D-91 (uniform connectedness)

### Hierarchy Visualization (Trees / Nests / Stairs)
- **Description:** Use tree structures for moderate-complexity high-level overviews. Use nest structures (Venn-like containment) for simple hierarchies and grouped information. Use stair structures for complex hierarchies, especially when the system is volatile — interactive stairs conceal child elements until parent is selected.
- **Source quote:** "Consider tree structures when representing high-level views of hierarchies of moderate complexity. Consider nest structures when representing natural systems, simple hierarchical relationships, and grouped information or functions. Consider stair structures when representing complex hierarchies, especially if the volatility and growth of the system represented is unpredictable." (Principle: Hierarchy)
- **Relates to:** D-81 (modularity), D-29 (progressive disclosure)

### Hierarchy of Needs (Functionality → Creativity)
- **Description:** Ensure lower-level needs are satisfied before resources go to higher-level: Functionality (basic requirements) → Reliability (consistent performance) → Usability (easy and forgiving) → Proficiency (empower doing things better) → Creativity (innovative interaction). Designs are perceived as higher value at higher levels.
- **Source quote:** "Consider the hierarchy of needs in design, and ensure that lower-level needs are satisfied before resources are devoted to serving higher-level needs. Evaluate existing designs with respect to the hierarchy to determine where modifications should be made." (Principle: Hierarchy of Needs)
- **Relates to:** D-65 (cost-benefit)

### Layering (2D and 3D)
- **Description:** Use 2D layering (one layer visible at a time) for managing complexity and navigation: linear for sequences, nonlinear hierarchical/parallel/web for relationships. Use 3D layering (multiple layers visible) for elaboration: opaque layers (pop-ups) for detail without context-switching, transparent layers (overlays) for illustrating concepts and highlighting relationships.
- **Source quote:** "Use two-dimensional layering to manage complexity and direct navigation through information… Use three-dimensional layering to elaborate information and illustrate concepts without switching contexts. Consider opaque layers when presenting elaborative information, and transparent layers when illustrating concepts or highlighting relationships in information." (Principle: Layering)
- **Relates to:** D-29 (progressive disclosure), D-81 (modularity)

### Mapping by Similarity
- **Description:** Position controls so their locations and behaviors correspond to the layout and behavior of the device (similarity of layout, behavior, or meaning). Simple control-effect relationships work best. Avoid single controls for multiple functions. Be cautious with conventions — different populations may interpret them differently.
- **Source quote:** "Position controls so that their locations and behaviors correspond to the layout and behavior of the device. Simple control-effect relationships work best. Avoid using a single control for multiple functions whenever possible; it is difficult to achieve good mappings for a one control-multiple effect relationship." (Principle: Mapping)
- **Relates to:** D-34 (mapping), D-36 (constraint)

### Mimicry Levels (Surface / Behavioral / Functional)
- **Description:** Use surface mimicry (look like a familiar object) to improve perceived usability; behavioral mimicry (act like a familiar entity) to improve likeability, but caution with complex behaviors; functional mimicry (work like a familiar system) to solve mechanical/structural problems, but verify transfer and scaling effects — physical principles may not transfer between contexts or scales.
- **Source quote:** "Consider surface mimicry to improve usability, ensuring that the perception of the design corresponds to how it functions or is to be used. Consider behavioral mimicry to improve likeability, but exercise caution when mimicking complex behaviors. Consider functional mimicry to assist in solving mechanical and structural problems, but also consider transfer and scaling effects that may undermine the success of the mimicked properties." (Principle: Mimicry)
- **Relates to:** D-87 (scaling fallacy), D-28 (mental model)

### Mnemonic Device Design
- **Description:** Use vivid, peculiar, exaggerated imagery and familiar, clearly related words to link unfamiliar information to familiar memory. Apply first-letter (acronyms), keyword (bridging image), rhyme, and feature-name strategies for contexts where ease of recall is critical — corporate identities, instructional materials, procedures.
- **Source quote:** "Consider mnemonic devices when developing corporate and product identities, slogans and logos for advertising campaigns, instructional materials dealing with rote information and complex procedures, and other contexts in which ease of recall is critical to success. Use vivid and concrete imagery and words that leverage familiar and related concepts." (Principle: Mnemonic Device)
- **Relates to:** D-88 (serial position), D-66 (depth of processing)

### Normal Distribution Design Range
- **Description:** Design to accommodate 98% of the population (1st to 99th percentile), not the average. Designing for the average fits only ~68%. Avoid the "average person fallacy" — the probability of matching the average in multiple measures drops to <1% for eight measures. Obtain appropriate measurement data for specific target groups.
- **Source quote:** "Where possible, create designs that will accommodate 98 percent of the population; namely, the first to the 99th percentile… The common belief that average people exist and are the standard to which designers should design is called the 'average person fallacy.'" (Principle: Normal Distribution)
- **Relates to:** D-87 (scaling fallacy)

### Ockham's Razor Application
- **Description:** Given functionally equivalent designs, select the simplest. Remove as many elements as possible without compromising function, then minimize the expression of remaining elements without compromising function. Unnecessary elements decrease efficiency and increase probability of unanticipated consequences.
- **Source quote:** "Use Ockham's razor to evaluate and select among multiple, functionally equivalent designs… Evaluate each element within the selected design and remove as many as possible without compromising function. Finally, minimize the expression of the remaining elements as much as possible without compromising function." (Principle: Ockham's Razor)
- **Relates to:** D-71 (form follows function), D-30 (signal-to-noise)

### Operant Conditioning Schedules
- **Description:** Use positive or negative reinforcement rather than punishment whenever possible. Use fixed-ratio reinforcement schedules early in training to connect reinforcement to behavior; switch to variable-ratio schedules once basic behaviors are mastered — variable schedules achieve highest behavior frequency and resistance to extinction.
- **Source quote:** "Focus on positive or negative reinforcement, rather than punishment whenever possible. Use fixed ratio schedules of reinforcement early in training. As basic behaviors are mastered, switch to variable schedules of reinforcement." (Principle: Operant Conditioning)
- **Relates to:** D-82 (operant conditioning)

### Orientation Sensitivity (30-Degree Rule)
- **Description:** Facilitate discrimination between linear elements by making their orientations differ by more than 30 degrees. In displays requiring orientation/angle estimates, provide visual indicators at 30-degree increments. Use horizontal and vertical lines as visual anchors — designs with primary vertical/horizontal elements are perceived as more aesthetic than oblique ones.
- **Source quote:** "Facilitate discrimination between linear elements by making their orientation differ by more than 30 degrees. In displays requiring estimates of orientation or angle, provide visual indicators at 30-degree increments to improve accuracy in oblique regions. Use horizontal and vertical lines as visual anchors to enhance aesthetics and maximize discrimination with oblique elements." (Principle: Orientation Sensitivity)
- **Relates to:** D-14 (visual hierarchy)

### Performance Load Reduction
- **Description:** Reduce cognitive load by minimizing visual noise, chunking remembered information, providing memory aids, and automating computation/memory-intensive tasks. Reduce kinematic load by reducing steps, minimizing range of motion and travel distances, and automating repetitive tasks.
- **Source quote:** "Reduce cognitive load by eliminating unnecessary information from displays, chunking information that is to be remembered, providing memory aids to assist in complex tasks, and automating computation-intensive and memory-intensive tasks. Reduce kinematic load by reducing unnecessary steps in tasks, reducing overall motion and energy expended, and automating repetitive tasks." (Principle: Performance Load)
- **Relates to:** D-83 (performance load), D-10 (Hick's law)

### Picture-Word Redundancy for Recall
- **Description:** Use pictures and words together, ensuring they reinforce the same information, for optimal recall. Pictures and words that conflict create interference and dramatically inhibit recall. The picture superiority effect applies after 30+ seconds from exposure; immediate recall is equal for pictures and words.
- **Source quote:** "Use the picture superiority effect to improve the recognition and recall of key information. Use pictures and words together, and ensure that they reinforce the same information for optimal effect. Pictures and words that conflict create interference and dramatically inhibit recall." (Principle: Picture Superiority Effect)
- **Relates to:** D-84 (picture superiority), D-77 (interference effects)

### Performance vs. Preference Balance
- **Description:** Do not assume user preferences indicate optimal performance — what helps people perform well and what people like are often not the same. Obtain accurate requirements by observing people interacting with the design in real contexts. Do not rely on reports of what people say they have done, will do, or plan to do — such reports are unreliable.
- **Source quote:** "The best method of obtaining accurate performance and preference requirements is to observe people interacting with the design (or a similar design) in real contexts… Do not rely on reports of what people say they have done, will do, or are planning to do in the future regarding the use of a design; such reports are unreliable." (Principle: Performance Versus Preference)
- **Relates to:** D-65 (cost-benefit)

### Prototyping Types by Stage
- **Description:** Use concept prototypes (sketches, storyboards) to develop/evaluate preliminary ideas quickly and cheaply. Use throwaway prototypes to explore functionality/performance. Use evolutionary prototyping when design specifications are uncertain or volatile — the prototype evolves into the final system. Schedule time for prototype evaluation and iteration.
- **Source quote:** "Use concept prototypes to develop and evaluate preliminary ideas, and throwaway prototypes to explore and test design functionalities and performance. Schedule time for prototype evaluation and iteration. When design requirements are unclear or volatile, consider evolutionary prototyping in lieu of traditional approaches." (Principle: Prototyping)
- **Relates to:** D-87 (scaling fallacy)

### Proximity for Relatedness
- **Description:** Arrange elements so their proximity corresponds to their relatedness. Opt for direct labeling on graphs over legends or keys. Overlapping elements imply shared attributes; proximal but non-contacting elements imply related but independent. Proximity generally overwhelms competing visual cues like similarity.
- **Source quote:** "Arrange elements such that their proximity corresponds to their relatedness. Ensure that labels and supporting information are near the elements that they describe, opting for direct labeling on graphs over legends or keys. Locate unrelated or ambiguously related items relatively far from one another." (Principle: Proximity)
- **Relates to:** D-5 (Gestalt grouping)

### Recognition Over Recall in Interfaces
- **Description:** Minimize the need to recall information from memory. Use readily accessible menus, decision aids, and similar devices to make available options clearly visible. Recognize that a familiar option is often selected over an unfamiliar one, even when the unfamiliar option may be the best choice.
- **Source quote:** "Minimize the need to recall information from memory whenever possible. Use readily accessible menus, decision aids, and similar devices to make available options clearly visible. Emphasize recognition memory in training programs, and the development of brand awareness in advertising campaigns." (Principle: Recognition Over Recall)
- **Relates to:** D-27 (visibility/discoverability), D-68 (exposure effect)

### Redundancy Strategies (Diverse / Homogenous / Active / Passive)
- **Description:** Use diverse redundancy (multiple element types — text, audio, video) for critical systems when failure causes cannot be anticipated. Use homogenous redundancy when causes can be anticipated. Use active redundancy (always-on, load-distributed) for critical systems that must maintain stable performance. Use passive redundancy (spare activates on failure) for noncritical elements. Combine all four for highly reliable systems.
- **Source quote:** "Use diverse redundancy for critical systems when the probable causes of failure cannot be anticipated. Use homogenous redundancy when the probable causes of failure can be anticipated. Use active redundancy for critical systems that must maintain stable performance in the event of element failure or extreme changes in system load. Use passive redundancy for noncritical elements within systems." (Principle: Redundancy)
- **Relates to:** D-86 (redundancy), D-69 (factor of safety), D-92 (weakest link)

### Rule of Thirds Composition
- **Description:** Divide a medium into thirds vertically and horizontally, creating an invisible grid of nine rectangles and four intersections. Position primary elements on intersections. When the primary element is so strong it imbalances the composition, center it instead, or add a counterpoint at the opposing intersection.
- **Source quote:** "When the primary element is so strong as to imbalance the composition, consider centering the element rather than using the rule of thirds—especially when the strength of the primary element is reinforced by the surrounding elements or space. If the surrounding elements or space do not reinforce the primary element, use the rule of thirds and add a secondary element (known as a counterpoint) to the opposing intersection of the primary element to bring the composition to balance." (Principle: Rule of Thirds)
- **Relates to:** D-70 (proportion)

### Shaping for Complex Behavior Training
- **Description:** Break complex behaviors into smaller, simpler subbehaviors and teach them one by one, reinforcing increasingly accurate approximations, then chaining them together. Use shaping for rote procedures and refining complex motor tasks in games, simulations, and learning environments. Watch for incidental reinforcement of superstitious behaviors.
- **Source quote:** "Use shaping to train complex behaviors in games, simulations, and learning environments. Shaping does not address the 'hows' or 'whys' of a task, and should, therefore, primarily be used to teach rote procedures and refine complex motor tasks." (Principle: Shaping)
- **Relates to:** D-82 (operant conditioning)

### Signal-to-Noise Maximization
- **Description:** Maximize signal by keeping designs simple and selecting design strategies carefully — emphasize key information through redundant coding and highlighting. Minimize noise by removing unnecessary elements and minimizing the expression of necessary elements. Every unnecessary data item, graphic, line, or symbol steals attention from relevant elements.
- **Source quote:** "Seek to maximize the signal-to-noise ratio in design. Increase signal by keeping designs simple, and selecting design strategies carefully. Consider enhancing key aspects of information through techniques like redundant coding and highlighting… Minimize noise by removing unnecessary elements, and minimizing the expression of elements." (Principle: Signal-to-Noise Ratio)
- **Relates to:** D-30 (signal-to-noise), D-74 (highlighting)

### Similarity Grouping Hierarchy
- **Description:** Use similarity to indicate relatedness — color is the strongest grouping strategy (strongest with few colors, decreases with more), size is effective when clearly distinguishable, shape is weakest (use only when color and size are uniform or in conjunction with them). Use the fewest colors and simplest shapes for strongest grouping.
- **Source quote:** "Similarity of color results in the strongest grouping effect; it is strongest when the number of colors is small, and is decreasingly effective as the number of colors increases… Similarity of shape is the weakest grouping strategy; it is best used when the color and size of other elements is uniform, or when used in conjunction with size or color." (Principle: Similarity)
- **Relates to:** D-5 (Gestalt grouping), D-62 (color)

### Three-Dimensional Projection Cues
- **Description:** Use interposition, size, elevation, linear perspective, texture gradient, shading, and atmospheric perspective to convey depth. Strongest depth effects are achieved when cues are used in combination — use as many as appropriate for the context.
- **Source quote:** "Consider these visual cues in the depiction of three-dimensional elements and environments. Strongest depth effects are achieved when the visual cues are used in combination; therefore, use as many of the cues as possible to achieve the strongest effect, making sure that the cues are appropriate for the context." (Principle: Three-Dimensional Projection)
- **Relates to:** D-14 (visual hierarchy)

### Top-Left Lighting Convention
- **Description:** Use a single top-left light source when depicting natural-looking or functional objects/environments — objects look most natural and are preferred when lit from the top-left rather than directly above (effect stronger for right-handed people). Explore bottom-up lighting only for unnatural or foreboding imagery. Use light-dark contrast to vary apparent depth.
- **Source quote:** "Use a single top-left light source when depicting natural-looking or functional objects or environments. Explore bottom-up light sources when depicting unnatural-looking or foreboding objects or environments. Use the level of contrast between light and dark areas to vary the appearance of depth." (Principle: Top-Down Lighting Bias)
- **Relates to:** D-14 (visual hierarchy), D-75 (iconic representation)

### Uncertainty Principle for Measurement
- **Description:** Use low-invasive measures whenever possible. The invasiveness of the measure should be inversely related to the sensitivity of the variable measured — more sensitive variables require less invasive measures. Consider natural system indicators (e.g., widgets produced) over measures that consume resources and introduce interference (e.g., employee logs).
- **Source quote:** "Use low-invasive measures whenever possible. Avoid high-invasive measures; they yield questionable results, reduce system efficiency, and can result in the system adapting to the measures. Consider using natural system indicators of performance when possible… rather than measures that will consume resources and introduce interference." (Principle: Uncertainty Principle)
- **Relates to:** D-72 (framing)

### Uniform Connectedness Overpowering
- **Description:** Use common regions (bounding edges) and connecting lines to group elements. Uniform connectedness generally overpowers other Gestalt principles (proximity, similarity) — useful for correcting poorly designed configurations that cannot be easily modified physically.
- **Source quote:** "Uniform connectedness will generally overpower the other Gestalt principles. In a design where uniform connectedness is at odds with proximity or similarity, the elements that are uniformly connected will appear more related than either the proximal or similar elements. This makes uniform connectedness especially useful when correcting poorly designed configurations that would otherwise be difficult to modify." (Principle: Uniform Connectedness)
- **Relates to:** D-91 (uniform connectedness), D-5 (Gestalt grouping)

### Visibility Levels (Not Kitchen-Sink)
- **Description:** Make the degree of visibility of controls and information correspond to their relevance. Use hierarchical organization (categories within parent controls) and context sensitivity (reveal/conceal based on system context) to manage complexity while preserving visibility. Avoid kitchen-sink visibility — making everything visible all the time makes relevant information harder to access.
- **Source quote:** "Hierarchical organization and context sensitivity are good solutions for managing complexity while preserving visibility… Avoid kitchen-sink visibility. Make the degree of visibility of controls and information correspond to their relevance. Use hierarchical organization and context sensitivity to minimize complexity and maximize visibility." (Principle: Visibility)
- **Relates to:** D-27 (visibility/discoverability), D-29 (progressive disclosure)

### von Restorff for Middle Items
- **Description:** Highlight key elements in a presentation or design to boost recall. Since recall for middle items in a list is weaker than items at beginning or end, use the von Restorff effect (distinctive difference) to boost recall for middle items. Apply sparingly — if everything is highlighted, nothing is highlighted.
- **Source quote:** "Take advantage of the von Restorff effect by highlighting key elements in a presentation or design (e.g., bold text). If everything is highlighted, then nothing is highlighted, so apply the technique sparingly. Since recall for the middle items in a list or sequence is weaker than items at the beginning or end of a list, consider using the von Restorff effect to boost recall for the middle items." (Principle: von Restorff Effect)
- **Relates to:** D-74 (highlighting), D-88 (serial position)

### Wayfinding Four Stages
- **Description:** Design for four wayfinding stages: orientation (landmarks, signage, distinct subspaces), route decision (minimize navigational choices, indicate shortest route, provide signs at decision points), route monitoring (paths with clear beginnings/middles/ends, clear sight lines, breadcrumbs for backtracking), destination recognition (dead-ends, barriers to disrupt flow, clear consistent identities).
- **Source quote:** "To improve orientation, divide a space into distinct small parts, using landmarks and signage to create unique subspaces… To improve route decision-making, minimize the number of navigational choices, and provide signs or prompts at decision points… To improve route monitoring, connect locations with paths that have clear beginnings, middles, and ends… To improve destination recognition, enclose destinations such that they form dead-ends, or use barriers to disrupt the flow of movement through the space." (Principle: Wayfinding)
- **Relates to:** D-33 (wayfinding), D-27 (visibility)

### Weakest Link by Design
- **Description:** Deliberately identify a weak element that will fail under predefined conditions to protect other, more important elements. Further weaken the weakest link and strengthen other links as needed. Perform adequate testing to ensure the weakest link fails only under appropriate failure conditions. Limited to systems where a failure condition affects multiple elements.
- **Source quote:** "Consider the weakest link principle when designing systems in which failures affect multiple elements. Use the weakest link to shut down the system or activate other protective systems. Perform adequate testing to ensure that only specified failure conditions cause the weakest link to fail. Further weaken the weakest element and harden other elements as needed to ensure the proper failure response." (Principle: Weakest Link)
- **Relates to:** D-92 (weakest link), D-69 (factor of safety)

---

## Heuristics

### Alignment Cue Check
- **Check:** Are text blocks left- or right-aligned (not center-aligned) for strong alignment cues? Is justified text used in complex multi-element compositions? Do diagonal alignment paths differ by at least 30 degrees?
- **Source quote:** "Left-aligned and right-aligned text blocks provide more powerful alignment cues than do center-aligned text blocks… Justified text provides more alignment cues than unjustified text, and should be used in complex compositions with many elements." (Principle: Alignment)
- **Relates to:** D-14 (visual hierarchy)

### Affordance Conflict Check
- **Check:** Does the perceived affordance of each control match its actual function? Are there any handles that must be pushed, flat plates that must be pulled, or other affordance-function conflicts?
- **Source quote:** "When the affordance of an object or environment corresponds with its intended function, the design will perform more efficiently and will be easier to use. Conversely, when the affordance of an object or environment conflicts with its intended function, the design will perform less efficiently and be more difficult to use." (Principle: Affordance)
- **Relates to:** D-36 (constraint)

### Chunking Appropriateness Check
- **Check:** Is information chunked only where recall/retention is required? Are reference lists, dictionaries, or scan-targeted content left unchunked? Are critical displays in high-stress environments chunked to 4 ± 1 items?
- **Source quote:** "Chunk information when people are required to recall and retain information, or when information is used for problem solving. Do not chunk information that is to be searched or scanned." (Principle: Chunking)
- **Relates to:** D-83 (performance load)

### Confirmation Necessity Check
- **Check:** Are confirmations reserved for critical or irreversible operations only? Are less critical confirmations disablable after first acknowledgement? Are dialog messages concise but detailed enough to convey implications, ending with a Yes/No question or action verb (not OK/Cancel)?
- **Source quote:** "Confirmations should be used sparingly, or people will learn to ignore them, and become frustrated at the frequent interruption. Dialog messages should be concise but detailed enough to convey accurately the implications of the action. The message should end with one question that is structured to be answered Yes or No, or with an action verb that conveys the action to be performed (the use of OK and Cancel should be avoided for confirmations)." (Principle: Confirmation)
- **Relates to:** D-35 (confirmation)

### Consistency Check
- **Check:** Is aesthetic consistency (style, appearance) maintained for recognition? Is functional consistency (meaning, action) maintained for usability? Is the system internally consistent? Is it externally consistent with other systems and common standards where they exist?
- **Source quote:** "Use aesthetic consistency to establish unique identities that can be easily recognized. Use functional consistency to simplify usability and ease of learning. Ensure that systems are always internally consistent, and externally consistent to the greatest degree possible. When common design standards exist, observe them." (Principle: Consistency)
- **Relates to:** D-81 (modularity)

### Control Mapping Check
- **Check:** Do control locations and behaviors correspond to the layout and behavior of the device? Are simple control-effect relationships used? Is any single control assigned to multiple functions (a red flag)?
- **Source quote:** "Position controls so that their locations and behaviors correspond to the layout and behavior of the device. Simple control-effect relationships work best. Avoid using a single control for multiple functions whenever possible." (Principle: Mapping)
- **Relates to:** D-34 (mapping)

### Entry Point Barrier Check
- **Check:** Are there minimal barriers (visual, functional, aesthetic) at the entry point? Is there a clear point of prospect allowing orientation and survey of options? Are progressive lures used to pull people through?
- **Source quote:** "The key elements of good entry point design are minimal barriers, points of prospect, and progressive lures." (Principle: Entry Point)
- **Relates to:** D-67 (entry point)

### Fitts' Law Control Check
- **Check:** Are frequently-used or critical controls large and near the user? Are dangerous or infrequently-used controls smaller and farther away? Are controls positioned at screen edges/corners where the barrier effect reduces errors?
- **Source quote:** "Make sure that controls are near or large, particularly when rapid movements are required and accuracy is important. Likewise, make controls more distant and smaller when they should not be frequently used, or when they will cause problems if accidentally activated." (Principle: Fitts' Law)
- **Relates to:** D-10 (Hick's law)

### Forgiveness Hierarchy Check
- **Check:** Are good affordances, reversibility (undo), and safety nets used as primary forgiveness strategies? Are confirmations, warnings, and help systems only used as supplements? Is the help system not a substitute for fixing poor design?
- **Source quote:** "The preferred methods of achieving forgiveness in a design are affordances, reversibility of actions, and safety nets. Designs that effectively use these strategies require minimal confirmations, warnings, and help… Be aware that the amount of help necessary to successfully interact with a design is inversely proportional to the quality of the design—if a lot of help is required, the design is poor." (Principle: Forgiveness)
- **Relates to:** D-37 (forgiveness)

### Highlighting Discipline Check
- **Check:** Is no more than 10% of the visible design highlighted? Are a small number of highlighting techniques applied consistently? Is bolding preferred over italics (less detectable) and underlining (adds noise, compromises legibility)? Is blinking used only for highly critical information requiring immediate response, and can it be turned off once acknowledged?
- **Source quote:** "Highlight no more than 10 percent of the visible design; highlighting effects are diluted as the percentage increases. Use a small number of highlighting techniques applied consistently throughout the design… Blinking should be used only to indicate highly critical information that requires an immediate response… It is important to be able to turn off the blinking once it is acknowledged." (Principle: Highlighting)
- **Relates to:** D-74 (highlighting)

### Legibility Contrast Check
- **Check:** Is dark text on light background (or vice versa) used? Do contrast levels between text and background exceed 70%? Are patterned or textured backgrounds (which dramatically reduce legibility) avoided?
- **Source quote:** "Use dark text on a light background or vice versa. Performance is optimal when contrast levels between text and background exceed 70 percent… Patterned or textured backgrounds can dramatically reduce legibility, and should be avoided." (Principle: Legibility)
- **Relates to:** D-80 (legibility)

### Progressive Disclosure Check
- **Check:** Are only necessary or requested information/controls displayed at any given time? Are infrequently used controls hidden but readily available via a simple operation (e.g., "More" button)? Is progressive disclosure used to lead people through complex procedures?
- **Source quote:** "Use progressive disclosure to reduce information complexity, especially when people interacting with the design are novices or infrequent users. Hide infrequently used controls or information, but make them readily available through some simple operation, such as pressing a More button." (Principle: Progressive Disclosure)
- **Relates to:** D-29 (progressive disclosure)

### Proximity Labeling Check
- **Check:** Are labels and supporting information positioned near the elements they describe? Does the design opt for direct labeling on graphs over legends or keys? Are unrelated or ambiguously related items located far from one another?
- **Source quote:** "Ensure that labels and supporting information are near the elements that they describe, opting for direct labeling on graphs over legends or keys. Locate unrelated or ambiguously related items relatively far from one another." (Principle: Proximity)
- **Relates to:** D-5 (Gestalt grouping)

### Readability Level Check
- **Check:** Is prose expressed in the simplest way possible? Is sentence length appropriate for the intended audience? Are acronyms, jargon, and untranslated foreign-language quotations avoided? Does the readability level approximate the level of the intended audience (verified via readability formulas)?
- **Source quote:** "Express complex material in the simplest way possible. Follow guidelines for enhancing readability, and verify that the readability level approximates the level of the intended audience." (Principle: Readability)
- **Relates to:** D-85 (readability)

### Recognition Over Recall Check
- **Check:** Does the design minimize the need to recall information from memory? Are readily accessible menus, decision aids, and similar devices used to make options clearly visible?
- **Source quote:** "Minimize the need to recall information from memory whenever possible. Use readily accessible menus, decision aids, and similar devices to make available options clearly visible." (Principle: Recognition Over Recall)
- **Relates to:** D-27 (visibility/discoverability)

### Signal-to-Noise Check
- **Check:** Is the design simple and concise? Are key aspects of information enhanced through redundant coding or highlighting? Are unnecessary elements removed? Are necessary elements minimized in expression without compromising function?
- **Source quote:** "Increase signal by keeping designs simple, and selecting design strategies carefully. Consider enhancing key aspects of information through techniques like redundant coding and highlighting… Minimize noise by removing unnecessary elements, and minimizing the expression of elements." (Principle: Signal-to-Noise Ratio)
- **Relates to:** D-30 (signal-to-noise)

### Serial Position Check
- **Check:** Are important items at the beginning or end of lists (not the middle)? For visual lists, are important items at the beginning? For auditory lists, are important items at the end? In decision-making contexts, is the item most likely to be selected placed at the end if decision is immediate, or at the beginning otherwise?
- **Source quote:** "Present important items at the beginning or end of a list (versus the middle) in order to maximize recall. When the list is visual, present important items at the beginning of the list. When the list is auditory, present important items at the end." (Principle: Serial Position Effects)
- **Relates to:** D-88 (serial position)

### Symmetry Purpose Check
- **Check:** Are simple symmetrical forms used when recognition and recall are important? Are complex combinations of different symmetry types used when aesthetics and interestingness are important? Are symmetric forms treated as figure (more attention, better recall) rather than ground?
- **Source quote:** "Use simple symmetrical forms when recognition and recall are important, and more complex combinations of the different types of symmetries when aesthetics and interestingness are important." (Principle: Symmetry)
- **Relates to:** D-89 (symmetry)

### Visibility Status Check
- **Check:** Does the system clearly indicate its status, the possible actions, and the consequences of actions performed? Are user actions immediately acknowledged with clear feedback? Does the degree of visibility correspond to relevance?
- **Source quote:** "Design systems that clearly indicate the system status, the possible actions that can be performed, and the consequences of the actions performed. Immediately acknowledge user actions with clear feedback. Avoid kitchen-sink visibility. Make the degree of visibility of controls and information correspond to their relevance." (Principle: Visibility)
- **Relates to:** D-27 (visibility/discoverability)

---

## Antipatterns

### Affordance-Function Conflict
- **Failure mode:** A control's physical (or perceived) characteristics suggest a different action than its actual function — a door with a handle that must be pushed, a red "go" button, a green "stop" button. Users fight the design's apparent suggestion, increasing errors and slowing performance.
- **Source quote:** "For example, a door with a handle affords pulling. Sometimes, doors with handles are designed to open only by pushing—the affordance of the handle conflicts with the door's function. Replace the handle with a flat plate, and it now affords pushing—the affordance of the flat plate corresponds to the way in which the door can be used. The design is improved." (Principle: Affordance)
- **Relates to:** D-36 (constraint)
- **Correct alternative:** Replace the conflicting affordance with one that matches the function (handle → flat plate for push doors); use perceived affordances in software that match familiar physical objects.

### Misapplied Chunking
- **Failure mode:** Applying chunking as a general simplification technique to information that is meant to be searched or scanned (e.g., dictionary entries, reference lists). This dramatically increases scan time and effort and yields no benefits — chunking is only effective for memory tasks.
- **Source quote:** "Chunking is often applied as a general technique to simplify designs—a potential misapplication of the principle. The limits specified by this principle deal specifically with tasks involving memory. For example, it is unnecessary and counterproductive to restrict the number of dictionary entries on a page to four or five. Reference-related tasks consist primarily of scanning for a particular item; chunking in this case would dramatically increase the scan time and effort, and yield no benefits." (Principle: Chunking)
- **Relates to:** D-83 (performance load)
- **Correct alternative:** Only chunk information when recall/retention is required. Leave scannable/searchable information unchunked.

### Confirmation Fatigue
- **Failure mode:** Overusing confirmations causes people to learn to ignore them and become frustrated at frequent interruption. When everything requires confirmation, no confirmation is taken seriously.
- **Source quote:** "Confirmations should be used sparingly, or people will learn to ignore them, and become frustrated at the frequent interruption." (Principle: Confirmation)
- **Relates to:** D-35 (confirmation)
- **Correct alternative:** Reserve confirmations for critical or irreversible operations. Make less critical confirmations disablable after first acknowledgement. Prefer reversibility and safety nets over confirmations.

### Cost-Benefit Presumption
- **Failure mode:** Designers presume which aspects of a system will be perceived as costs and which as benefits, without observing real users. Features that excite designers are often never used or noticed by users, and increase interaction costs by adding complexity without benefit.
- **Source quote:** "A common mistake regarding application of the cost-benefit principle is to presume which aspects of a system will be perceived as costs, and which will be perceived as benefits. For example, new design features or elements that excite designers are often never used or even noticed by people who interact with the design. In many cases, such features and elements increase the design's interaction costs by adding complexity to the system without adding any actual benefit to the user." (Principle: Cost-Benefit)
- **Relates to:** D-65 (cost-benefit)
- **Correct alternative:** Observe people interacting with the design or similar designs in the actual target environment. Use focus groups and usability tests when observation is not possible.

### Designer's Interaction Model Blindspot
- **Failure mode:** Designers have accurate system models but weak interaction models — they know how the system works but not how people will actually interact with it. Users have sparse system models but accurate interaction models from experience. The gap produces designs that are technically correct but unusable.
- **Source quote:** "Designers generally have very complete and accurate system models, but often have weak interaction models—i.e., they know much about how a system works, but little about how people will interact with the system. Conversely, users of a design tend to have sparse and inaccurate system models, but through use and experience commonly attain interaction models that are more complete and accurate than those of designers." (Principle: Mental Model)
- **Relates to:** D-28 (mental model)
- **Correct alternative:** Obtain accurate interaction models through personal use, laboratory testing, and direct observation of users in the target environment. Actually use the systems you design. Watch people use the design and take note of how they use it.

### Dvorak Fallacy (Performance ≠ Preference)
- **Failure mode:** Assuming that a design that helps people perform optimally will be preferred. People may prefer a familiar but less efficient design (QWERTY) over a superior but unfamiliar one (Dvorak) — performance benefits are moot if the design is never adopted.
- **Source quote:** "The Dvorak keyboard is estimated to improve typing efficiency by more than 30 percent, but has failed to rise in popularity because people prefer the more familiar QWERTY keyboard." (Principle: Performance Versus Preference)
- **Relates to:** D-65 (cost-benefit)
- **Correct alternative:** Balance performance and preference accurately. Observe people interacting with the design in real contexts. Do not rely on reports of what people say they will do.

### Flexibility-Usability Inversion
- **Failure mode:** Assuming designs should always be made as flexible as possible. Flexibility has costs in decreased efficiency, added complexity, increased time, and money for development. Flexibility only pays dividends when audiences cannot clearly anticipate future needs.
- **Source quote:** "It is a common design mistake to assume that designs should always be made as flexible as possible. In reality, however, flexibility has costs in terms of decreased efficiency, added complexity, increased time, and money for development. Flexibility generally pays dividends only when an audience cannot clearly anticipate its future needs." (Principle: Flexibility-Usability Tradeoff)
- **Relates to:** D-29 (progressive disclosure)
- **Correct alternative:** Favor specialized designs when audiences can clearly anticipate needs. Reserve flexible designs for when needs are poorly understood.

### Kitchen-Sink Visibility
- **Failure mode:** Trying to make everything visible all the time. This overloads information and actually makes relevant information and controls more difficult to access.
- **Source quote:** "This leads many designers to apply a type of kitchen-sink visibility—i.e., they try to make everything visible all the time. This approach may seem desirable, but it actually makes the relevant information and controls more difficult to access due to an overload of information." (Principle: Visibility)
- **Relates to:** D-27 (visibility/discoverability)
- **Correct alternative:** Use hierarchical organization and context sensitivity. Make the degree of visibility correspond to relevance. Reveal/conceal based on system context.

### Over-Highlighting (Noise Collapse)
- **Failure mode:** Highlighting more than 10% of the visible design dilutes the effect — if everything is highlighted, nothing is highlighted. Using multiple highlighting techniques inconsistently or combining saturated colors increases visual noise and eye fatigue.
- **Source quote:** "Highlight no more than 10 percent of the visible design; highlighting effects are diluted as the percentage increases. Use a small number of highlighting techniques applied consistently throughout the design." (Principle: Highlighting)
- **Relates to:** D-74 (highlighting), D-30 (signal-to-noise)
- **Correct alternative:** Limit highlighting to ≤10% of the visible design. Use a small number of techniques consistently. Prefer bolding over italics/underlining. Reserve blinking for highly critical, immediately-response-required information only.

### Interference from Incongruent Coding
- **Failure mode:** Combining conflicting coding combinations (a red go button, a green stop button) or placing closely positioned elements that visually interact creates Stroop/Garner interference, slowing mental processing and increasing errors.
- **Source quote:** "Interference effects of perception (i.e., Stroop and Garner) generally result from conflicting coding combinations (e.g., a red go button, or green stop button) or from an interaction between closely positioned elements that visually interact with one another (e.g., two icons group or blend because of their shape and proximity)." (Principle: Interference Effects)
- **Relates to:** D-77 (interference effects)
- **Correct alternative:** Prevent interference by avoiding designs that create conflicting mental processes. Ensure coding combinations are congruent. Separate visually interacting elements.

### Average Person Fallacy
- **Failure mode:** Designing for the "average person" — a person average in multiple measures. The probability of matching the average in two measures is ~7%; in eight measures, <1%. A design for the average fits only ~68% of the population in a single measure.
- **Source quote:** "The common belief that average people exist and are the standard to which designers should design is called the 'average person fallacy.'" (Principle: Normal Distribution)
- **Relates to:** D-87 (scaling fallacy)
- **Correct alternative:** Design to accommodate 98% of the population (1st to 99th percentile). Obtain appropriate measurement data for the specific target group.

### Feedback Loop Cascade (Isolated Optimization)
- **Failure mode:** Concentrating on a problem in isolation, without considering changes in user behavior or other variables, inadvertently creates a positive feedback loop that makes the original problem worse — e.g., harder football helmets leading to riskier tackling leading to more injuries leading to harder helmets.
- **Source quote:** "By concentrating on the problem in isolation (e.g., not considering changes in player behavior) designers inadvertently created a positive feedback loop in which players used their head and neck in increasingly risky ways. This resulted in more injuries, which resulted in additional redesigns that made the helmet shells harder and more padded, and so on." (Principle: Feedback Loop)
- **Relates to:** D-69 (factor of safety)
- **Correct alternative:** Consider the design as a whole and its relation to the greater environment, not just isolated elements. Include negative feedback loops to prevent runaway behaviors.

### Prescriptive Form Follows Function
- **Failure mode:** Applying "form follows function" as a strict design rule, focusing on the wrong question ("what aspects of form should be traded for function?") instead of the right one ("what aspects of the design are critical to success?"). Design decisions should be based on success criteria, not blind allegiance to form or function.
- **Source quote:** "The use of form follows function as a prescription or design guideline is problematic in that it focuses the designer on the wrong question. The question should not be, 'What aspects of form should be omitted or traded for function?' but rather, 'What aspects of the design are critical to success?'" (Principle: Form Follows Function)
- **Relates to:** D-71 (form follows function)
- **Correct alternative:** Focus on the relative importance of all aspects of the design — form and function — in light of the success criteria. Let success criteria drive design specifications and decisions.

### Invasive Measurement Distortion
- **Failure mode:** Using highly invasive measures over long periods permanently alters the system to adapt to the measure — e.g., standardized testing changing schools from learning to test-preparation, making the measurement meaningless.
- **Source quote:** "In cases where highly invasive measures are used over long periods of time, it is common for systems to become permanently altered in order to adapt to the disruption of the measure… The validity of the testing is thus compromised, and the invasiveness of the measure fundamentally changes the focus of the system from learning to test-preparation." (Principle: Uncertainty Principle)
- **Relates to:** D-72 (framing)
- **Correct alternative:** Use low-invasive measures. The invasiveness of the measure should be inversely related to the sensitivity of the variable. Prefer natural system indicators over measures that consume resources and introduce interference.

### Scaling Fallacy (Load and Interaction)
- **Failure mode:** Assuming a system that works at one scale will work at a smaller or larger scale. Load assumptions occur when working stresses are assumed to scale with physical specifications (they don't — gravity's effect increases exponentially with mass). Interaction assumptions occur when people/system interactions are assumed to remain the same at other scales (they don't — tall buildings introduce evacuation, suicide, terrorist-target issues absent in smaller buildings).
- **Source quote:** "The scaling fallacy is nowhere more apparent than with flight. For example, at very small and very large scales, flapping to fly is not a viable strategy. At very small scales, wings are too small to effectively displace air molecules. At very large scales, the effects of gravity are too great for flapping to work—a painful lesson learned by many early pioneers of human flight." (Principle: Scaling Fallacy)
- **Relates to:** D-87 (scaling fallacy)
- **Correct alternative:** Verify load assumptions through careful calculations, systematic testing, and appropriate factors of safety. Minimize incorrect interaction assumptions through research of analogous designs and monitoring of actual use.

### Superstitious Behavior Reinforcement
- **Failure mode:** During shaping, behaviors unrelated to the desired behavior get incidentally reinforced and become integrated but unnecessary components — e.g., a mouse lifts its foot whenever it presses a lever because the first reinforcement happened to occur while its foot was raised. Common in humans too.
- **Source quote:** "During shaping, behaviors that have nothing to do with the desired behavior can get incidentally reinforced… This behavior then becomes an integrated, but unnecessary component of the desired behavior; the mouse lifts its foot whenever it presses the lever. The development of this kind of superstitious behavior is common with humans as well." (Principle: Shaping)
- **Relates to:** D-82 (operant conditioning)
- **Correct alternative:** Be aware of incidental reinforcement during shaping. Monitor for superstitious behaviors and extinguish them by only reinforcing the target behavior in its clean form.

### von Restorff Reverse Effect
- **Failure mode:** If everything is highlighted, nothing is highlighted. Overuse of the von Restorff effect (making everything distinctive) eliminates the attention/recall advantage of being different.
- **Source quote:** "If everything is highlighted, then nothing is highlighted, so apply the technique sparingly." (Principle: von Restorff Effect)
- **Relates to:** D-74 (highlighting)
- **Correct alternative:** Apply highlighting/distinctiveness sparingly and only to key elements. Use it especially to boost recall for middle items in lists (which have weaker natural recall).

### Conflicting Frame Neutralization
- **Failure mode:** When people are exposed to multiple conflicting frames, the framing effect is neutralized — people think and act consistently with their own beliefs rather than the intended frame.
- **Source quote:** "However, when people are exposed to multiple conflicting frames, the framing effect is neutralized, and people think and act consistently with their own beliefs." (Principle: Framing)
- **Relates to:** D-72 (framing)
- **Correct alternative:** To maintain a strong framing effect, ensure frames are not conflicting. Conversely, to neutralize unwanted framing effects, deliberately present multiple conflicting frames.

### Stroop Interference from Color-Label Mismatch
- **Failure mode:** Presenting color and label-icon in incongruent combinations (e.g., a green "stop" button in populations that learned green means go) triggers Stroop interference — the irrelevant cue (color) activates a mental process that conflicts with the relevant one (the label).
- **Source quote:** "In populations that have learned that green means go and red means stop, the incongruence between the color and the label-icon results in interference." (Principle: Interference Effects)
- **Relates to:** D-77 (interference effects)
- **Correct alternative:** Ensure coding combinations are congruent with learned conventions. Do not introduce new incongruent combinations (e.g., a red traffic arrow in populations that learned arrows always mean go).