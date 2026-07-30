# B2 Krug — Patterns, Heuristics, Antipatterns

## Patterns

### Self-Evident Page
- **Description:** Design each page/screen so its purpose and use are immediately obvious at a glance, requiring no thought. When full self-evidence is impossible, settle for self-explanatory.
- **Source quote:** "Your goal should be for each page or screen to be self-evident, so that just by looking at it the average user will know what it is and how to use it. In other words, they'll 'get it' without having to think about it." (Chapter 1)
- **Relates to:** D-11, D-17

### Convention Following
- **Description:** Use established Web/site conventions (logo top-left, primary nav across top or left, shopping cart metaphor, search icon) instead of reinventing. Innovate only when you have a demonstrably better idea; otherwise follow the convention.
- **Source quote:** "My recommendation: Innovate when you know you have a better idea, but take advantage of conventions when you don't." (Chapter 3)
- **Relates to:** D-22

### Clearly Defined Page Areas
- **Description:** Divide pages into well-defined regions (navigation, content, promos, utilities) so users can quickly decide which areas to focus on and which to ignore, enabling banner blindness to work for them.
- **Source quote:** "Dividing the page into clearly defined areas is important because it allows users to decide quickly which areas of the page to focus on and which areas they can safely ignore." (Chapter 3)
- **Relates to:** D-14

### Visual Hierarchy of Prominence/Grouping/Nesting
- **Description:** Make the visual appearance of page elements accurately reflect their relationships: more important = more prominent (larger, bolder, higher, more whitespace); related items grouped/styled together; parent/child relationships shown via visual nesting.
- **Source quote:** "Pages with a clear visual hierarchy have three traits: The more important something is, the more prominent it is... Things that are related logically are related visually... Things are 'nested' visually to show what's part of what." (Chapter 3)
- **Relates to:** D-14

### Scan-Friendly Text Formatting
- **Description:** Format text to support scanning: use plenty of well-written headings with obvious visual distinction between levels; keep paragraphs short (break long ones); use bulleted lists for any series; highlight key terms in bold where they first appear.
- **Source quote:** "Use plenty of headings... Keep paragraphs short... Use bulleted lists... Highlight key terms." (Chapter 3)
- **Relates to:** D-11

### Persistent Navigation
- **Description:** Show a consistent set of navigation elements (Site ID, Sections, Utilities, Home link, Search) on every page so users always know where the navigation is and only have to learn it once. Use a minimal version on form/checkout pages.
- **Source quote:** "Just having the navigation appear in the same place on every page with a consistent look gives you instant confirmation that you're still in the same site... Persistent navigation should include the four elements you most need to have on hand at all times." (Chapter 6)
- **Relates to:** D-33

### Site ID as Home Link
- **Description:** Place the Site ID/logo at the top of every page (upper-left in LTR languages) and make it clickable to return Home. It frames the page, represents the whole site, and acts as a reset button.
- **Source quote:** "Almost all Web users expect the Site ID to be a button that can take you to the Home page... the best place for it—the place that is least likely to make me think—is at the top, where it frames the entire page." (Chapter 6)
- **Relates to:** D-33

### Universal Search Box
- **Description:** Provide a search box (or link to one) on every page using the simple formula: a box, a button, and the word "Search" or the magnifying-glass icon. Avoid fancy wording, instructions, and scope options in the persistent box.
- **Source quote:** "It's a simple formula: a box, a button, and either the word 'Search' or the universally recognized magnifying glass icon. Don't make it hard for them—stick to the formula." (Chapter 6)
- **Relates to:** D-17

### Page Name Match
- **Description:** Every page needs a prominent name placed to frame the page's unique content, and the name must match (or nearly match) the words the user clicked to get there. This implicit social contract prevents the "why are those two things different?" moment.
- **Source quote:** "The name of the page will match the words I clicked to get there... Each time a site violates it, I'm forced to think, even if only for milliseconds, 'Why are those two things different?'" (Chapter 6)
- **Relates to:** D-9

### "You Are Here" Indicator
- **Description:** Highlight the user's current location in navigation bars/menus using obvious, multi-dimensional visual distinctions (e.g., different color AND bold). Subtle cues fail because users are in a hurry.
- **Source quote:** "The most common failing of 'You are here' indicators is that they're too subtle. They need to stand out... One way to ensure that they stand out is to apply more than one visual distinction—for instance, a different color and bold text." (Chapter 6)
- **Relates to:** D-33

### Breadcrumbs
- **Description:** Place breadcrumbs at the top of the page, use ">" as the level separator, and boldface the last item (the current page, which is not a link). They show the path from Home and make backing up a level easy.
- **Source quote:** "Put them at the top... Use > between levels... Boldface the last item. The last item in the list should be the name of the current page, and making it bold gives it the prominence it deserves." (Chapter 6)
- **Relates to:** D-33

### Tabs for Navigation
- **Description:** Use tabs (with the active tab visually "popping" to the front via a different color and physical connection to the content area below) to divide content into sections. Tabs are self-evident, hard to miss, and hard to mistake for anything but navigation.
- **Source quote:** "For tabs to work to full effect, the graphics have to create the visual illusion that the active tab is in front of the other tabs... the active tab needs to be a different color or contrasting shade, and it has to physically connect with the space below it." (Chapter 6)
- **Relates to:** D-22

### Just-in-Time Guidance
- **Description:** When a difficult choice is unavoidable, provide guidance that is brief, timely (encountered exactly when needed), and unavoidable (formatted so it will be noticed). Examples: tips next to form fields, "What's this?" links, the "LOOK RIGHT" street markings in London.
- **Source quote:** "This guidance works best when it's Brief: The smallest amount of information that will help me... Timely: Placed so I encounter it exactly when I need it... Unavoidable: Formatted in a way that ensures that I'll notice it." (Chapter 4)
- **Relates to:** D-17

### Tagline Next to Site ID
- **Description:** Place a clear, informative, differentiating tagline (6–8 words) next to the Site ID to convey the site's purpose. Avoid generic mottos; a good tagline is one no competitor could use.
- **Source quote:** "Good taglines are clear and informative and explain exactly what your site or your organization does... Jakob Nielsen has suggested that a really good tagline is one that no one else in the world could use except you." (Chapter 7)
- **Relates to:** D-22

### Progressive Disclosure of Choices
- **Description:** Instead of confronting users with all options/details at once, make an initial selection that leads to another screen showing only the relevant questions for that selection (e.g., NYT login vs. subscribe paths).
- **Source quote:** "The New York Times makes the same kind of choice seem much easier by not confronting you with all the details at once. Making an initial selection... takes you to another screen where you see only the relevant questions or information for that selection." (Chapter 4)
- **Relates to:** D-17

### Visible Affordances
- **Description:** Make affordances (visual clues signaling how an element is used) noticeable: 3D button styling, bordered text boxes, position + formatting distinctions for menu items. Never hide affordances; compensate for Flat design by using all remaining visual dimensions.
- **Source quote:** "For affordances to work, they need to be noticeable... affordances are the last thing you should hide... You can do all the Flat design you want... but make sure you're using all of the remaining dimensions to compensate for what you lose." (Chapter 10)
- **Relates to:** D-16

### Trunk Test Navigation
- **Description:** Any page deep in a site, viewed at arm's length/squinted, should immediately reveal: Site ID, page name, sections (primary nav), local navigation, "You are here" indicator, and search. These elements must pop without close scrutiny.
- **Source quote:** "Imagine that you've been blindfolded and locked in the trunk of a car, then driven around for a while and dumped on a page somewhere deep in the bowels of a Web site. If the page is well designed, when your vision clears you should be able to answer these questions without hesitation." (Chapter 6)
- **Relates to:** D-33

## Heuristics

### Question-Mark Elimination
- **Check:** Looking at this page, what question marks appear over the user's head? Where am I? Where should I begin? Where did they put X? Why did they call it that? Is that an ad or part of the site?
- **Source quote:** "I could list dozens of things that users shouldn't spend their time thinking about, like Where am I? Where should I begin? Where did they put _____? What are the most important things on this page? Why did they call it that? Is that an ad or part of the site?" (Chapter 1)
- **Relates to:** D-17

### Mindless Click Test
- **Check:** Is each click a mindless, unambiguous choice? Does the link give off a strong "scent of information" that I'm on the right track?
- **Source quote:** "It doesn't matter how many times I have to click, as long as each click is a mindless, unambiguous choice." (Chapter 4)
- **Relates to:** D-39

### Name-Click Match Check
- **Check:** Does the page name match (or nearly match) the words I clicked to get there? If not, is the difference obvious and minimal?
- **Source quote:** "The name of the page will match the words I clicked to get there... if there's a major discrepancy between the link name and the page name or a lot of minor discrepancies, my trust in the site... will be diminished." (Chapter 6)
- **Relates to:** D-9

### Clarity Trumps Consistency
- **Check:** Would making something slightly inconsistent make it significantly clearer? If so, favor clarity over consistency.
- **Source quote:** "CLARITY TRUMPS CONSISTENCY. If you can make something significantly clearer by making it slightly inconsistent, choose in favor of clarity." (Chapter 3)
- **Relates to:** D-22

### Big Picture First-Glance Test
- **Check:** In the first few seconds on the Home page, can a new visitor answer: What is this site? What do they do here? Why should I be here instead of somewhere else? Where do I start?
- **Source quote:** "As quickly and clearly as possible, the Home page needs to answer the four questions I have in my head when I enter a new site for the first time... I need to be able to answer these questions at a glance, correctly and unambiguously, with very little effort." (Chapter 7)
- **Relates to:** D-17

### Trunk Test
- **Check:** Dropped on a random deep page, can I immediately identify (at arm's length / squinting): Site ID, page name, sections, local nav, "You are here", and search?
- **Source quote:** "Step 1: Choose a page anywhere in the site at random, and print it. Step 2: Hold it at arm's length or squint so you can't really study it closely. Step 3: As quickly as possible, try to find and circle each of these items: Site ID, Page name, Sections (Primary navigation), Local navigation, 'You are here' indicator(s), Search." (Chapter 6)
- **Relates to:** D-33

### Search Box Formula Check
- **Check:** Does the search use the word "Search" (not Find/Quick Find/Keyword Search), a box, and a button—without instructions or scope options in the persistent box?
- **Source quote:** "They'll be looking for the word 'Search,' so use the word Search, not Find, Quick Find, Quick Search, or Keyword Search... Adding 'Type a keyword' is like saying, 'Leave a message at the beep' on your voice mail message." (Chapter 6)
- **Relates to:** D-22

### Mensch Check
- **Check:** Does the site behave like a mensch—doing the right thing, being considerate of the user? Or is it hiding information I want, punishing me for not doing things its way, asking for info it doesn't need?
- **Source quote:** "Besides 'Is my site clear?' you also need to be asking, 'Does my site behave like a mensch?'" (Chapter 11)
- **Relates to:** D-38

### Goodwill Reservoir Check
- **Check:** What on this page diminishes the user's reservoir of goodwill, and what refills it? Is anything (hidden pricing, formatting strictness, extraneous requested info, faux sincerity, marketing bloat) draining it?
- **Source quote:** "I've always found it useful to imagine that every time we enter a Web site, we start out with a reservoir of goodwill. Each problem we encounter on the site lowers the level of that reservoir." (Chapter 11)
- **Relates to:** D-38

### Mobile Affordance Visibility Check
- **Check:** With no cursor and no hover, are all affordances still visible enough for users to perceive how to interact? Have hover-dependent features (tool tips, hover-revealed menus, color-change clickability cues) been replaced?
- **Source quote:** "As a designer, you need to be aware that these elements don't exist for mobile users and try to find ways to replace them." (Chapter 10)
- **Relates to:** D-16

### Heading Proximity Check
- **Check:** Are headings closer to the section they introduce than to the section they follow? Are heading levels visually distinct enough to be impossible to miss?
- **Source quote:** "Don't let your headings float. Make sure they're closer to the section they introduce than to the section they follow. This makes a huge difference." (Chapter 3)
- **Relates to:** D-14

## Antipatterns

### Cute or Clever Names
- **Failure mode:** Using cute, marketing-induced, company-specific, or unfamiliar technical names for sections/links forces users to think about what things mean and erodes confidence.
- **Source quote:** "Typical culprits are cute or clever names, marketing-induced names, company-specific names, and unfamiliar technical names... the tradeoffs should usually be skewed further in the direction of 'Obvious' than we think." (Chapter 1)
- **Relates to:** D-22
- **Correct alternative:** Use obvious, plain-language names; reserve cleverness for cases where it still conveys (not obscures) the benefit.

### Ambiguous Clickability
- **Failure mode:** Using the same color for links and non-clickable headings, or failing to give clickable elements a distinct shape/location/formatting, forces users to waste milliseconds deciding what to click.
- **Source quote:** "As a user, I should never have to devote a millisecond of thought to whether things are clickable—or not... Just don't make silly mistakes like using the same color for links and nonclickable headings." (Chapter 1, Chapter 3)
- **Relates to:** D-16
- **Correct alternative:** Stick to one color for all text links, or ensure shape/location identify clickability.

### Visual Noise — Shouting
- **Failure mode:** Everything on the page clamoring for attention (exclamation points, multiple typefaces, bright colors, auto-slideshows, pop-ups) overwhelms users and signals a failure to make tough decisions about what's actually most important.
- **Source quote:** "Shouting. When everything on the page is clamoring for your attention, the effect can be overwhelming... Shouting is usually the result of a failure to make tough decisions about which elements are really the most important." (Chapter 3)
- **Relates to:** D-14
- **Correct alternative:** Create a visual hierarchy that guides users to the genuinely important elements first.

### Visual Noise — Disorganization
- **Failure mode:** Pages that look ransacked, with elements strewn everywhere, indicate the designer doesn't understand the importance of using grids to align elements.
- **Source quote:** "Disorganization. Some pages look like a room that's been ransacked, with things strewn everywhere. This is a sure sign that the designer doesn't understand the importance of using grids to align the elements on a page." (Chapter 3)
- **Relates to:** D-14
- **Correct alternative:** Use a grid to align elements.

### Visual Noise — Clutter
- **Failure mode:** Too much stuff on a page (especially Home pages) produces a low signal-to-noise ratio where useful content is obscured by noise, like an inbox flooded with newsletters.
- **Source quote:** "Clutter. We've all seen pages—especially Home pages—that just have too much stuff... You end up with what engineers call a low signal-to-noise ratio: Lots of noise, not much information, and the noise obscures the useful stuff." (Chapter 3)
- **Relates to:** D-17
- **Correct alternative:** Start with the assumption that everything is visual noise ("presumed guilty until proven innocent") and remove anything not making a real contribution.

### Wall of Words
- **Failure mode:** Long paragraphs confront readers with a "wall of words" that is daunting, makes it harder to keep place, and is harder to scan than shorter paragraphs.
- **Source quote:** "Long paragraphs confront the reader with what Caroline Jarrett and Ginny Redish call a 'wall of words.' They're daunting, they make it harder for readers to keep their place, and they're harder to scan than a series of shorter paragraphs." (Chapter 3)
- **Relates to:** D-11
- **Correct alternative:** Break long paragraphs in two; even single-sentence paragraphs are fine online.

### Happy Talk
- **Failure mode:** Introductory/welcome text that's self-congratulatory and content-free ("Welcome to..." / "Blah blah blah blah blah") wastes space and users' time, and makes pages seem more daunting than they are.
- **Source quote:** "Happy talk is like small talk—content-free, basically just a way to be sociable. But most Web users don't have time for small talk; they want to get right to the point. You can—and should—eliminate as much happy talk as possible." (Chapter 5)
- **Relates to:** D-17
- **Correct alternative:** Cut all happy talk; get straight to useful content.

### Instructions
- **Failure mode:** Wordy instructions that no one reads (until after muddling through fails) add noise and make pages seem more complex than they are.
- **Source quote:** "The main thing you need to know about instructions is that no one is going to read them—at least not until after repeated attempts at 'muddling through' have failed... Your objective should always be to eliminate instructions entirely by making everything self-explanatory, or as close to it as possible." (Chapter 5)
- **Relates to:** D-40
- **Correct alternative:** Make the interface self-explanatory; when instructions are absolutely necessary, cut them to the bare minimum.

### Floating Headings
- **Failure mode:** Headings that sit equidistant between the preceding and following sections, or are closer to the section they follow, confuse readers about which section the heading belongs to.
- **Source quote:** "Don't let your headings float. Make sure they're closer to the section they introduce than to the section they follow. This makes a huge difference." (Chapter 3)
- **Relates to:** D-14
- **Correct alternative:** Place headings closer to the content they introduce; add clear visual distinction between heading levels.

### Custom Scrollbars / Reinvented Conventions
- **Failure mode:** Designers reinventing standard controls (e.g., custom scrollbars) usually produce something worse, underestimating the hundreds of hours of fine-tuning that went into the OS-standard version.
- **Source quote:** "The classic example is custom scrollbars. Whenever a designer decides to create scrollbars from scratch—usually to make them prettier—the results almost always make it obvious that the designer never thought about how many hundreds or thousands of hours of fine tuning went into the evolution of the standard operating system scrollbars." (Chapter 3)
- **Relates to:** D-22
- **Correct alternative:** Use existing conventions unless your replacement is (a) as clear as the convention with no learning curve, or (b) adds so much value it's worth a small learning curve.

### Home Page Promotional Overload (Tragedy of the Commons)
- **Failure mode:** Every stakeholder adds "just one more thing" to the Home page; each promo gains its section traffic while the shared loss in Home page effectiveness is borne by all, eventually destroying the page.
- **Source quote:** "The problem is, the rewards and the costs of adding more things to the Home page aren't shared equally. The section that's being promoted gets a huge gain in traffic, while the overall loss in effectiveness of the Home page as it gets more cluttered is shared by all sections... It's a perfect example of the tragedy of the commons." (Chapter 7)
- **Relates to:** D-17
- **Correct alternative:** Educate stakeholders about overgrazing; cross-promote from other pages; take turns using the same Home page space.

### Mission Statement as Welcome Blurb
- **Failure mode:** Using corporate mission-statement prose ("XYZCorp offers world-class solutions in the burgeoning field of blah blah blah") as the Home page welcome blurb—nobody reads it.
- **Source quote:** "Don't use a mission statement as a Welcome blurb. Many sites fill their Home page with their corporate mission statement that sounds like it was written by a Miss America finalist. 'XYZCorp offers world-class solutions in the burgeoning field of blah blah blah blah blah....' Nobody reads them." (Chapter 7)
- **Relates to:** D-17
- **Correct alternative:** Use a terse, plain-language description of what the site actually does.

### Generic Tagline / Motto as Tagline
- **Failure mode:** Using a generic motto ("We bring good things to life") instead of a differentiating tagline conveys no value proposition and could apply to anyone.
- **Source quote:** "Don't confuse a tagline with a motto... A motto expresses a guiding principle, a goal, or an ideal, but a tagline conveys a value proposition. Mottoes are lofty and reassuring, but if I don't know what the thing is, a motto isn't going to tell me." (Chapter 7)
- **Relates to:** D-22
- **Correct alternative:** Write a tagline no competitor could use; clear, informative, 6–8 words, conveying differentiation and benefit.

### Hidden Information
- **Failure mode:** Hiding customer support phone numbers, shipping rates, and prices forces users to hunt, diminishes goodwill, and often results in more annoyance when they finally find what they were looking for.
- **Source quote:** "Hiding information that I want. The most common things to hide are customer support phone numbers, shipping rates, and prices... if the 800 number is in plain sight—perhaps even on every page—somehow knowing that they can call if they want to is often enough to keep people looking for the information on the site longer." (Chapter 11)
- **Relates to:** D-38
- **Correct alternative:** Be upfront about support numbers, shipping costs, fees, and outages; candor rebuilds goodwill.

### Format Strictness
- **Failure mode:** Forcing users to format data a specific way (no spaces in credit card numbers, no dashes in SSNs, no parentheses in phone numbers) punishes them for not doing things your way and makes correct entry harder.
- **Source quote:** "Punishing me for not doing things your way. I should never have to think about formatting data: whether or not to put dashes in my Social Security number, spaces in my credit card number, or parentheses in my phone number... Don't make me jump through hoops just because you don't want to write a little bit of code." (Chapter 11)
- **Relates to:** D-38
- **Correct alternative:** Accept any reasonable formatting; strip separators in code.

### Asking for Unneeded Information
- **Failure mode:** Requesting personal information beyond what the task requires makes users skeptical and annoyed.
- **Source quote:** "Asking me for information you don't really need. Most users are very skeptical of requests for personal information and find it annoying if a site asks for more than what's needed for the task at hand." (Chapter 11)
- **Relates to:** D-38
- **Correct alternative:** Ask only for what's needed to complete the task.

### Labels Inside Form Fields
- **Failure mode:** Putting labels inside form fields risks the labels being confused with answers, being submitted as part of the entry, and being inaccessible—unless very strict conditions are met.
- **Source quote:** "Don't put labels inside form fields. Yes, it can be very tempting, especially on cramped mobile screens. But don't do it unless all of these are true: The form is exceptionally simple, the labels disappear when you start typing and reappear if you empty the field, the labels can never be confused with answers, and there's no possibility that you'll end up submitting the labels along with what you type." (Chapter 13)
- **Relates to:** D-16
- **Correct alternative:** Place labels outside fields; only use in-field labels under strict conditions.

### Small Low-Contrast Type
- **Failure mode:** Combining small size with low contrast makes text unreadable; this is the one combination to never use.
- **Source quote:** "Don't use small, low-contrast type. You can use large, low-contrast type, or small (well, smallish) high-contrast type. But never use small, low-contrast type." (Chapter 13)
- **Relates to:** D-11
- **Correct alternative:** Use large low-contrast OR small high-contrast; never both small AND low-contrast.

### Over-Chunked Mobile Content
- **Failure mode:** Breaking stories into too-small chunks that each take a long time to load, forcing the user to scroll past repeated elements between tiny morsels of text, drives users to competing sources.
- **Source quote:** "I've learned over time that their stories are broken up into too-small (for me) chunks, and each one takes a long time to load... It's so annoying that when I'm scanning Google News... and notice that the story I'm about to tap is linked to CBS News, I always click on Google's 'More stories' link to choose another source." (Chapter 10)
- **Relates to:** D-38
- **Correct alternative:** Balance chunk size against load time; don't make users repeat the same scroll past boilerplate on every page.

### Front-Door Redirect on Mobile
- **Failure mode:** Tapping a deep link from email/social sends the user to the mobile Home page instead of the article, leaving them to hunt for the thing themselves.
- **Source quote:** "Don't leave me standing at the front door. Another real nuisance: You tap on a link in an email or a social media site and instead of taking you to the article in question it takes you to the mobile Home page, leaving you to hunt for the thing yourself." (Chapter 10)
- **Relates to:** D-33
- **Correct alternative:** Deep-link to the actual content on mobile just as on desktop.

### Flat Design Removing Affordances
- **Failure mode:** Flat design strips away the visual distinctions (texture, depth, borders) that convey affordances, making it harder to differentiate clickable from non-clickable elements.
- **Source quote:** "Unfortunately, Flat design has a tendency to take along with it not just the potentially distracting decoration but also the useful information that the more textured elements were conveying... By removing a number of these distinctions from the design palette, Flat design makes it harder to differentiate things." (Chapter 10)
- **Relates to:** D-16
- **Correct alternative:** Use all remaining visual dimensions (position, formatting, color, weight) to compensate for what Flat design removes.