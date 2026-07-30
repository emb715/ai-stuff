# B8 Greever — Patterns, Heuristics, Antipatterns

> Source: Tom Greever — *Articulating Design Decisions*. Quotes verbatim from extract.md; chapter numbers per source headers. Most of the book is rhetoric on stakeholder communication; only UI/UX-review-applicable items extracted.

## Patterns

### Explicit completion affordance for invisible state changes
- **Description:** When an interface updates state instantly without perceptible feedback (e.g. filter results refreshing automatically), users may not realize anything changed. Add an explicit completion control (a "Done" button) that does nothing functional but gives users a sense of control and closure over the interaction.
- **Source quote:** "The page was updated instantaneously, without even the need for a loading indicator, but some of the users we observed didn't realize the search results had been updated so I added a 'Done' button which closed the filter panel and gave them a sense of completion. The addition of a 'Done' button gave the user a greater sense of control, but did nothing more than close the panel." (Chapter 7: The Response: Strategy and Tactics)
- **Relates to:** D-1, D-9

### Planned flexible real estate for business content
- **Description:** Pre-plan one or more flexible content areas (a container, sidebar, or dedicated "About" page) where stakeholder-requested or seasonal content can be added and removed without disrupting the user's primary flow. Rotating the location also keeps the surface fresh.
- **Source quote:** "It's a good idea to always plan a place where you know you can easily add or remove elements that might be requested from time to time. I'd even recommend having several areas where content can be added and removed on a regular basis to accommodate changing needs. Many stakeholder requests are temporary or seasonal: a special promotion, announcements, or a new initiative. If you have planned real estate (like a container, sidebar, or flexible content area) where you can include these elements without disrupting the user's flow, the conversation becomes a lot easier to manage." (Chapter 11: Recovering from Disaster)
- **Relates to:** D-9, D-26

### Downgrade objectionable requests to subtler form
- **Description:** When forced to accommodate a UI request that would harm the experience, reduce its visual weight rather than reject it outright: convert a button to a text link, move a menu off-canvas unless explicitly invoked, or relocate a requested element from the top to an out-of-the-way position. Preserves usability while appeasing the request.
- **Source quote:** "If they want a button, make it a text link. If they suggest a menu, hide it off canvas unless the user explicitly asks for it. If they want it at the top, put it at the bottom, out of the way. Whatever it takes to appease them while also removing it from the domain of distraction that will cloud the usability of the app. It's often possible to minimize the impact these requests have by making them more subtle." (Chapter 11: Recovering from Disaster)
- **Relates to:** D-9, D-14

### Conditional message-logic to prevent overload
- **Description:** When the business wants many value messages on one item (list price, percentage off, dollar off, free shipping, "Great Value," timer, quantity), apply rules so only the most relevant one or two show at a time. Mutually exclusive choices (percentage vs. dollar off) and threshold gates (timer only within 24h) keep the user from drowning in competing signals.
- **Source quote:** "Our solution is to apply some logic and rules around what messages are shown when so that we don't overwhelm the user with too many messages at once. For example, we should always choose between showing the percentage and the dollar off, but never both. In this case, we show the percentage savings because it's greater than 30% and communicates the value more than the dollar off, which is only $3. Next, we will only show the timer if within 24 hours and we only show the quantity available when it reaches a certain threshold." (Chapter 9: The Ideal Response: Getting Agreement — Too Many Messages case)
- **Relates to:** D-13, D-93

### Progressive disclosure in signup to reduce abandonment
- **Description:** Require only the minimum field (e.g. email) on the first signup step and let users add profile information later. Hiding non-essential fields up-front reduces perceived form length, lowers abandonment, and avoids exposing validation rules that break the user's forward flow on a mistake.
- **Source quote:** "Our signup flow requires only the email address to be submitted first because we can reduce abandonment by not exposing all the fields at once and allowing the user to progressively add information to their profile later. If we add the additional fields to this step, it will complicate the process with validation rules and break the user's flow if they make a mistake that has to be corrected first." (Chapter 8: The Response: Common Messages)
- **Relates to:** D-1, D-9

## Heuristics

### Can the decision be traced to an observed user need?
- **Check:** For each design decision, ask whether it can be tied back to a concrete observation, user story, or usability session — not just intuition or preference. If the only justification is "it looks better" or "I just know," the rationale lives only in the designer's head and the design is not defensible.
- **Source quote:** "You can't represent someone you've never met, observed, or talked to. So do whatever is necessary to make yourself get up and go watch people use your project. It doesn't take very many observations to draw meaningful insights about the design of your application or website." (Chapter 7: The Response: Strategy and Tactics)
- **Relates to:** D-1, D-23

### Is the primary use case still optimized after this change?
- **Check:** After any change (especially committee-driven ones), circle back and verify the documented primary use case is still served — that secondary or edge cases haven't been promoted at the expense of the main flow. A drift in placement often silently breaks the primary path.
- **Source quote:** "It's always useful, even after a decision has been made, to circle back and double-check your decisions against the documented use cases that you hope to design for. When you find your team getting off track, bring them back by reminding everyone what the use cases are and how our decisions affect them." (Chapter 8: The Response: Common Messages)
- **Relates to:** D-1, D-9

### Does each decision connect to a business goal or metric?
- **Check:** Ask whether the design choice can be stated as "[design] will affect [goal] because [reason]." If no goal, KPI, or use case can be named, the decision is untethered and likely driven by aesthetics or preference alone.
- **Source quote:** "Whatever the source of the reasoning, always be sure to call out when your design is intended to help the company achieve their goals." (Chapter 8: The Response: Common Messages)
- **Relates to:** D-24

### Does the design comply with technical and accessibility standards?
- **Check:** Verify the chosen controls, interactions, and patterns respect accessibility requirements, standard HTML control types, and browser/platform conventions. Custom or over-engineered controls that break standards usually cost more than they return.
- **Source quote:** "Sometimes what our stakeholders want us to do will go against the technical or social standards we've set for our application. We want our app to work in all browsers, on different devices, and for all people so we have to follow the 'rules' that are set forth on the development side." (Chapter 8: The Response: Common Messages — "Complies with a standard")
- **Relates to:** D-21, D-26

## Antipatterns

### Homepage syndrome (catch-all home screen)
- **Description:** The home screen of an app or site becomes a garage sale of links, buttons, and banner ads as every business unit demands representation. The accumulation unravels usability because nothing is prioritized and the surface becomes noise.
- **Source quote:** "The homepage syndrome is a condition whereby the home screen of an application or website becomes a catch-all for everything, creating a garage-sale of links, buttons, and banner ads that unravels the fabric of usability, causing designers to cry themselves to sleep." (Chapter 2: Great Designers are Great Communicators)
- **Relates to:** D-9, D-13

### The CEO button (exec feature that destroys balance)
- **Description:** An unusual or unexpected request from an executive to add a single feature that completely unbalances the project and undermines the designer's role. The feature is typically driven by personal preference or a one-off concern, not the documented user need.
- **Source quote:** "The CEO button is an unusual or otherwise unexpected request from an executive to add a feature that completely destroys the balance of a project and undermines the very purpose of a designer's existence." (Chapter 2: Great Designers are Great Communicators)
- **Relates to:** D-9, D-23

### Hamburger menu as a catch-all dumping ground
- **Description:** Using the hamburger icon as a generic bucket for every menu item the team can't otherwise place. Research shows the icon is less effective than the word "Menu," and overloading it buries discoverability of everything inside.
- **Source quote:** "One of the mobile projects I worked on used the all-too-common 'hamburger menu' for the primary navigation. During the course of a redesign, I tried several times (unsuccessfully) to convince my client to abandon the use of this icon as a catch-all for everything in the menu. My recommendation was based on research indicating that the icon is not as effective as the word 'Menu'." (Chapter 8: The Response: Common Messages — "Taking Hamburger Off the Menu")
- **Relates to:** D-9, D-26

### Overbranding in-app (logo in header that serves no function)
- **Description:** Adding a company logo to the app header that provides no functionality to the user. It only reinforces a brand the user has already bought into, consumes scarce nav space, and adds a visual distraction from the user's actual tasks.
- **Source quote:** "The reason we chose not to include the logo in the header is because it does not actually provide any functionality for the user. By not including it, we have more space for the nav options and a simpler interface for the user. The logo doesn't directly provide value to the user once they're in the app. It only serves to reinforce the brand of a service they are already consuming." (Chapter 9: The Ideal Response — Branded Banners case)
- **Relates to:** D-9, D-24