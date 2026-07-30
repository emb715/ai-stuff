# B4 Gothelf — Patterns, Heuristics, Antipatterns

Source: Jeff Gothelf & Josh Seiden, *Lean UX*. Extract covers Chapters 1–9. The book is overwhelmingly process/team methodology; items below are the subset that applies to evaluating the interface itself. Laws already in the corpus — outcome over aesthetic (D-24), principled decision (D-23) — are not re-extracted.

---

## Patterns

### Hypothesis-driven feature design
- **Description:** Treat each feature as a proposed business solution — a hypothesis — not a requirement. The interface element exists to be tested against a measurable change in customer behavior, not to be "shipped as specified."
- **Source quote:** "Each design is a proposed business solution—a hypothesis. Your goal is to validate the proposed solution as efficiently as possible by using customer feedback. The smallest thing you can build to test each hypothesis is your MVP." (Ch 2, Foundations / Lean Startup foundation)
- **Relates to:** D-23, D-24

### Outcome-level success criteria tied to the UI
- **Description:** Define success at the outcome level (a measurable change in customer behavior) rather than the output level (the feature shipped). The UI is measured against the behavior it produces, not its mere existence.
- **Source quote:** "Output... only capture[s] the team's delivery performance. Outcome... is the change in the world we hope to see after we've created the output... It is therefore in your best interest to ask your teams to work on outcome-level metrics." (Ch 3, Output/Outcome/Impact)
- **Relates to:** D-24

### Feature fake / "button to nowhere"
- **Description:** Ship the appearance of a feature (button, call to action, link) before building the underlying functionality, then measure click rate to validate demand. The UI element is an experiment instrument, not the finished feature.
- **Source quote:** "Sometimes, the cost of implementing a feature is very high. In these cases, it is cheaper and faster to learn about the value of the idea to create the appearance of the feature where none actually exists. HTML buttons, calls to action, and other prompts and links provide the illusion to your customer that a feature exists." (Ch 5, Feature fake)
- **Relates to:** D-24

### Fidelity-proportional prototyping (Truth Curve)
- **Description:** Match the fidelity of the UI artifact to the amount of market evidence you have. Low evidence → low-fidelity, disposable artifact; high evidence → invest in higher-fidelity production work. Effort spent polishing unvalidated UI is waste.
- **Source quote:** "The amount of effort you put into your MVP should be proportional to the amount of evidence you have that your idea is a good one... The less evidence you have, the less effort you want to put into your MVP." (Ch 5, The Truth Curve)
- **Relates to:** D-23, D-24

### Behavior measurement over stated opinion
- **Description:** Build UIs that let you observe and measure what people actually do, not what they say they would do. Instrument the interface so behavior is the signal; opinion is noise.
- **Source quote:** "Build MVPs with which you can observe and measure what people do. This lets you bypass what people say they (will) do in favor of what they actually do. In digital product design, behavior trumps opinion." (Ch 5, Measure behavior)
- **Relates to:** D-24

### Chunked-up long form
- **Description:** A longer form broken into categorized chunks reads as shorter than a genuinely short form, and can produce higher completion confidence. CarMax's loan form validated that "felt length" matters more than field count.
- **Source quote:** "The end result was a 'chunked-up' long form—a higher number of fields broken down into categories—that didn't feel as long." (Ch 9, CarMax / The Next Iteration)
- **Relates to:** (none directly; supports D-24 via outcome validation)

### Design system as single source of truth for the presentation layer
- **Description:** Centralize interaction, visual, and copywriting elements in one actionable, owned, living system so screens are assembled from consistent parts rather than reinvented per feature. Element docs include what / where / when.
- **Source quote:** "In practice, a design system functions as a single source of truth for the presentation layer of a product... Provide three data points for each interaction design element: What does the element look like? Where it's usually placed on the screen. When it should be used." (Ch 4, Design Systems / What goes into a design system)
- **Relates to:** (consistency / D-26 family)

---

## Heuristics

### Is this feature serving an outcome or just producing output?
- **Check:** For every UI element under review, ask whether it is tied to a measurable change in customer behavior. If the only success criterion is "it shipped," the feature is output, not outcome, and is a review flag.
- **Source quote:** "Features and services are outputs. The goals they are meant to achieve are outcomes... When we attempt to predict which features will achieve specific outcomes, we are mostly engaging in speculation." (Ch 2, Outcomes, not output)
- **Relates to:** D-24

### Can this design decision be tested?
- **Check:** For each meaningful UI decision, can you state the hypothesis it embodies and the market feedback that would confirm or invalidate it? If neither is expressible, the decision is untested assumption, not design.
- **Source quote:** "Hypotheses have behavior change (outcomes) as their definition of success. Shipping a working feature is table stakes... Our team's success is not measured in how fast they can get features launched. Instead we measure success by how well our customers can achieve 'some goal' initially and ongoing." (Ch 3, Hypotheses vs Agile User Stories)
- **Relates to:** D-23, D-24

### Is this assumption or verified user need?
- **Check:** Distinguish what the team believes from what it has evidence for. Every UI choice resting on an unvalidated assumption carries risk proportional to how far downstream it propagates.
- **Source quote:** "Every project begins with a set of assumptions... To eliminate the risk of investing a lot of time and effort in work that's based on bad assumptions, we begin by validating our assumptions." (Ch 2, Moving from doubt to certainty)
- **Relates to:** D-23

### Is the fidelity proportional to the evidence?
- **Check:** Does the polish of the artifact match how much you actually know? High-fidelity polish on an unvalidated idea locks the team in; low fidelity on a validated idea starves it.
- **Source quote:** "The amount of effort you put into your MVP should be proportional to the amount of evidence you have that your idea is a good one." (Ch 5, The Truth Curve)
- **Relates to:** D-23, D-24

### Are you measuring behavior or opinion?
- **Check:** Does the UI's instrumentation capture what users do, or only what they say they would do? If only the latter, the signal cannot validate the hypothesis.
- **Source quote:** "Build MVPs with which you can observe and measure what people do. This lets you bypass what people say they (will) do in favor of what they actually do." (Ch 5, Measure behavior)
- **Relates to:** D-24

### Does each design-system element say what, where, and when?
- **Check:** For every component in the system, can a designer or developer answer what it looks like, where it goes, and when to use it (vs. an alternative)? If any of the three is missing, the component is incomplete.
- **Source quote:** "Provide three data points for each interaction design element: What does the element look like? Where it's usually placed on the screen. When it should be used." (Ch 4, What goes into a design system)
- **Relates to:** (consistency family)

### Are you editing the idea or polishing the artifact?
- **Check:** At the early stage, effort spent perfecting pixels is effort not spent learning. Ask: who do I need to communicate with, what do they need to see, and what is the least work to get there?
- **Source quote:** "Working quickly means generating many artifacts. Don't waste time debating which type of artifact to create, and don't waste time polishing them to perfection... create the artifact that will take the least amount of time." (Ch 8, Speed first, aesthetics second)
- **Relates to:** D-24

---

## Antipatterns

### Shipping features without outcome validation
- **Description:** Treating "feature shipped" as the definition of done. The feature reaches customers with no measurement of whether it produced the intended behavior change, so the team cannot decide whether to keep, change, or replace it.
- **Source quote:** "Most teams we've worked with replace 'some goal' with 'this feature.' After the user story is written, most teams discard the pieces around 'some goal' and begin implementing the feature. The user is quickly forgotten... The only testing being done is whether the system 'works as designed.'" (Ch 3, Hypotheses vs Agile User Stories)
- **Relates to:** D-24

### Assumption-as-fact design
- **Description:** Beginning design from unspoken, untested assumptions and treating them as requirements. Every downstream decision compounds the risk of the foundational assumption being wrong.
- **Source quote:** "Every project starts with assumptions, but mostly we don't acknowledge this fact. Instead, we try to ignore assumptions, or worse, treat them as facts." (Ch 3, Assumptions)
- **Relates to:** D-23

### Big Design Up Front / Agile-fall
- **Description:** Designing the entire interface in detail before any market contact, then handing off to engineering. Removes the feedback loop that would let the design be corrected; produces heavy documentation and late-stage rework.
- **Source quote:** "Agile-fall is the combination of an up-front design phase that results in work that is handed off, waterfall style, to an engineering team... Agile-fall removes the collaboration between design and engineering that Lean UX requires to succeed." (Ch 8, From BDUF to Agile-fall)
- **Relates to:** D-23, D-24

### Hero design / aesthetic-driven decision bias
- **Description:** Letting the visual polish of a deliverable bias decisions — awards, hiring, and buy-in flow from the beauty of the artifact rather than the outcome it produces. Glossy mockups persuade stakeholders into shipping unvalidated work.
- **Source quote:** "Those glossy deliverables can drive bad corporate decisions—they can bias judgment specifically because their beauty is so persuasive. Awards are based on the aesthetics of the designs (rather than the outcome of the work)." (Ch 8, No more heroes)
- **Relates to:** D-24

### Over-polishing intermediate artifacts
- **Description:** Investing high-fidelity polish in wireframes, site maps, and workflow diagrams that are meant to be thrown away. The sunk cost makes the team reluctant to rework ideas when feedback contradicts them.
- **Source quote:** "Putting in this level of polish and effort into the early-stage artifacts—wireframes, site maps, workflow diagrams—is (usually) a waste of time... you'll be more willing to change and rework your ideas if you've put less effort into presenting them." (Ch 8, Speed first, aesthetics second)
- **Relates to:** D-24

### Designing for stakeholder approval, not user outcome
- **Description:** Producing pixel-perfect presentations optimized to win internal sign-off rather than to learn from the market. The deliverable is the artifact; the customer is absent from the loop.
- **Source quote:** "Building a pixel-perfect specification might be a route to rake in six-figure consulting fees, but it's not a way to make a meaningful difference to a real product that is crucial to real users." (Preface)
- **Relates to:** D-24

### Pissing on the Picasso — premature pixel-perfect critique
- **Description:** Bringing high-fidelity mockups to a cross-functional review too early, triggering debates about implementation feasibility rather than learning. The fidelity invites the wrong conversation.
- **Source quote:** "The designers wanted to avoid what the team came to call 'pissing on the Picasso,' a situation in which engineers respond to pixel-perfect mockups by debating what they can and can't implement." (Ch 9, PayPal / Getting Started and Overcoming Obstacles)
- **Relates to:** D-23, D-24

### UX debt left untracked
- **Description:** Shipping UI workarounds and "version one" interfaces but never returning to refine them. Without an explicit UX-debt backlog, the temporary becomes permanent and the experience erodes.
- **Source quote:** "Teams need to make a commitment to continuous improvement, and that means not simply refactoring code and addressing technical debt, it also means reworking and improving user interfaces. Teams need to embrace the concept of UX debt." (Ch 8, UX debt)
- **Relates to:** (none directly; supports D-24 via lifecycle integrity)