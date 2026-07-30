# B3 Maeda — Patterns, Heuristics, Antipatterns

Source: John Maeda, *The Laws of Simplicity*. Extract covers Laws 1–10 and three Keys (Away, Open, Power). Laws already in the corpus — reduction (D-17), emotional resonance (D-25), trust-through-consistency (D-26) — are not re-extracted below.

---

## Patterns

### Organize to make many appear fewer
- **Description:** When you cannot reduce further, group, sort, label, integrate, and prioritize so a system of many reads as fewer. Structure substitutes for subtraction.
- **Source quote:** "Organization makes a system of many appear fewer." (Law 2)
- **Relates to:** D-17

### Time-shrinking
- **Description:** Compress the time a task takes (or feels to take); perceived savings in time are experienced as simplicity even when nothing else changes.
- **Source quote:** "Savings in time feel like simplicity." (Law 3)
- **Relates to:** D-17

### Knowledge as simplifier
- **Description:** Invest in helping the user learn the system — knowledge makes everything simpler. Affordances, learn-as-you-go, and progressive disclosure lower perceived complexity.
- **Source quote:** "Knowledge makes everything simpler." (Law 4)
- **Relates to:** D-17, D-25

### Honor the simple/complex symbiosis
- **Description:** Preserve deliberate contrasts of simplicity and complexity within a design; each defines the other. A completely simple world erases the signal that makes simplicity legible.
- **Source quote:** "Simplicity and complexity need each other." (Law 5)
- **Relates to:** D-25

### Treat the periphery as content
- **Description:** What surrounds the focal task — ambient information, empty space, context — is not throwaway. Design the periphery deliberately; it shapes the perceived simplicity of the foreground.
- **Source quote:** "What lies in the periphery of simplicity is definitely not peripheral." (Law 6)
- **Relates to:** D-17, D-25

### Subtract the obvious, add the meaningful
- **Description:** The master move: remove what is self-evident or decorative, then invest that budget where it carries meaning. Reduction alone is not the goal — meaningful addition after obvious subtraction is.
- **Source quote:** "Simplicity is about subtracting the obvious, and adding the meaningful." (Law 10)
- **Relates to:** D-17, D-25

### Away — move the work, keep the result
- **Description:** Push compute, storage, or complexity to a remote location and keep only the lightweight result local. The surface becomes simple because the bulk lives elsewhere.
- **Source quote:** "More appears like less by simply moving it far, far away." (Key 1: Away)
- **Relates to:** D-17

### Open — expose select functionality
- **Description:** Open a system selectively (API, extensibility, plugin surface) so the many can extend the few. Openness redistributes complexity across a community rather than concentrating it in a closed product.
- **Source quote:** "Openness simplifies complexity. With an open system, the power of the many can outweigh the power of the few." (Key 2: Open)
- **Relates to:** D-26

### Power — use less, gain more
- **Description:** Reduce resource consumption (battery, bandwidth, compute, attention) and treat constraint as a design force. Devices and interfaces that demand less feel simpler.
- **Source quote:** "Use less, gain more." (Key 3: Power)
- **Relates to:** D-17

---

## Heuristics

### Is it simpler, or just minimal?
- **Check:** Does the design actually reduce perceived complexity, or has it only removed visible elements while leaving underlying complexity intact? Minimal surface ≠ simple system.
- **Source quote:** "Simplicity is hopelessly subtle, and many of its defining characteristics are implicit (noting that it hides in simplicity)." (Law 10)
- **Relates to:** D-17

### Did I earn the periphery, or waste it?
- **Check:** Is the space, motion, context, and ambient detail around the focal element contributing to comprehension — or is it dead weight? Peripheral does not mean disposable.
- **Source quote:** "What lies in the periphery of simplicity is definitely not peripheral." (Law 6)
- **Relates to:** D-17, D-25

### What time cost am I imposing?
- **Check:** Measure the time the user spends waiting, navigating, or recovering. Any time savings the design delivers will register as simplicity; any time cost registers as complexity.
- **Source quote:** "Savings in time feel like simplicity." (Law 3)
- **Relates to:** D-17

### Does every remaining element carry meaning?
- **Check:** After subtracting the obvious, can each surviving element justify itself as meaningful? If it survives only by habit or decoration, it fails Law 10.
- **Source quote:** "Simplicity is about subtracting the obvious, and adding the meaningful." (Law 10)
- **Relates to:** D-17, D-25

### Is there a frame of reference for the simplicity?
- **Check:** Is the design legibly simple *because* of contrast with complexity elsewhere, or does it sit in a context that makes it read as empty or unfinished? Simplicity needs its counterpart.
- **Source quote:** "Deeming something as complex or simple requires a frame of reference." (Law 9 / Failure)
- **Relates to:** D-25

### Have I tried to simplify something that cannot be simplified?
- **Check:** Is the effort to simplify this particular thing productive, or am I chasing an impossible goal? Some systems should be left complex; recognize the limit and redirect effort.
- **Source quote:** "Some things can never be made simple." (Law 9)
- **Relates to:** D-17

### Is undo or recovery available where trust is asked?
- **Check:** Where the system asks the user to trust it (automation, defaults, irreversible actions), is there an undo or safe recovery path? Undo lets the user remain the master.
- **Source quote:** "undo allows us to become the Masters ourselves by gently learning to trust our own knowledge of a system." (Law 8 / Trust)
- **Relates to:** D-26

---

## Antipatterns

### False simplicity (hiding complexity)
- **Failure mode:** Removing the *visible* expression of complexity while leaving the underlying machinery, cost, or cognitive load intact. The surface looks clean; the system is not.
- **Source quote:** "Simplicity is hopelessly subtle, and many of its defining characteristics are implicit (noting that it hides in simplicity)." (Law 10)
- **Relates to:** D-17
- **Correct alternative:** Reduce the underlying system first; let the visible simplicity follow. Verify with Law 10 — only what survives after subtracting the obvious *and* adding the meaningful counts.

### Decoration as complexity
- **Failure mode:** Pouring on more decoration, glamour, and flavor in the name of emotion, when the actual effect is increased cognitive load dressed as richness.
- **Source quote:** "I eschew the importance of complexity as delivered by pouring on more decoration, more glamour, and generally more flavor." (Law 7 / Emotion)
- **Relates to:** D-25
- **Correct alternative:** Use emotion deliberately (Law 7 reserves the right to change your mind); favor emotional resonance from meaning over ornament.

### Bloat under resource abundance
- **Failure mode:** When memory, bandwidth, or compute is abundant, letting the product expand to fill it — multi-DVD installs, feature sprawl — until maintaining it becomes a full-time job.
- **Source quote:** "What could once be installed from a single floppy disk grew to fill an entire CD, then a set of CD's, then a DVD, and now multiple DVD's." (Key 1: Away)
- **Relates to:** D-17
- **Correct alternative:** Apply Key 3 (Power: use less, gain more) and Key 1 (Away: move the bulk elsewhere). Treat constraint as a design force, not an obstacle.

### Acronym overload
- **Failure mode:** Encoding every method as a new acronym until the reader is buried in mnemonic overhead — a form of false simplicity that adds cognitive tax under the guise of reducing it.
- **Source quote:** "Acronyms are a great way to simplify complex ideas, but the monotony of YAA (Yet Another Acronym) is too much to bear." (Flaws of Simplicity 1: Acronym Overload)
- **Relates to:** D-17
- **Correct alternative:** Limit named systems; reuse a small shared vocabulary. If a new acronym does not buy real compression of meaning, drop it.

### Technology as disabler
- **Failure mode:** Reaching for a digital tool when a simpler analog action would finish the task; the tool, meant to enable, becomes a dependency that blocks completion.
- **Source quote:** "while technology is an exhilarating enabler, it can be an exasperating disabler as well." (Life)
- **Relates to:** D-17
- **Correct alternative:** Audit each step for the lightest sufficient means; prefer the analog or local path when the digital one only adds ceremony.