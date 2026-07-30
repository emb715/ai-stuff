# Proposed Laws — Shortlist for Possible D-27+ Additions
> Consolidated and deduplicated from the 9 per-book `candidates.md` files. This is the serious shortlist, not the raw candidate pool.
> Criteria: actionable, distinct from D-1..D-26, empirically grounded, and cleanly mappable to one of the five design-law clusters.

---

## Selection rules
- Includes only candidates with clear practical leverage for UI review or design decisions.
- Deduplicates overlapping proposals across books.
- Prefers laws with support from multiple books when available.
- Marks whether a proposal should be a new law or a merge/split of an existing law.

## Proposed additions

### P-01 — Discoverability Law
- **Cluster:** interaction
- **Priority:** high
- **Proposed statement:** If a user cannot determine what actions are possible without instruction, the design is already failing.
- **Why this is distinct:** Current D-1 covers affordances/signifiers, but not the broader requirement that possible actions and system pathways be discoverable as a whole.
- **Source books:** B1 Norman, B2 Krug
- **Supporting candidate entries:** B1: Discoverability, B2: Don’t Make Me Think / Self-evident pages
- **Catalogue relationship:** Extends D-1, D-9, D-11; likely a distinct D-27.

### P-02 — Conceptual Model Law
- **Cluster:** cognition
- **Priority:** high
- **Proposed statement:** Users operate through an internal model of how the system works; if the design does not support a coherent model, errors and hesitation are guaranteed.
- **Why this is distinct:** The current catalogue references mental models indirectly, but no law centers them explicitly.
- **Source books:** B1 Norman, B9 Johnson, B6 Lidwell
- **Supporting candidate entries:** B1: Conceptual Model, B9: External memory aids / automatic vs controlled processing, B6: Mental Model
- **Catalogue relationship:** Could become D-28.

### P-03 — Progressive Disclosure Law
- **Cluster:** composition
- **Priority:** high
- **Proposed statement:** Reveal complexity only when it becomes relevant; showing everything at once transfers system complexity directly into user burden.
- **Why this is distinct:** Strongly implied by D-8 and D-10, but distinct enough to stand alone as a concrete structural UI law.
- **Source books:** B6 Lidwell
- **Supporting candidate entries:** B6: Progressive Disclosure
- **Catalogue relationship:** Related to D-8, D-10, D-17. Strong D-29 candidate.

### P-04 — Signal-to-Noise Law
- **Cluster:** composition
- **Priority:** high
- **Proposed statement:** Relevant information must dominate irrelevant information; when noise visually or textually competes with signal, comprehension falls and action slows.
- **Why this is distinct:** This is stronger and more general than Reduction Law (D-17). Reduction says remove what does not earn its place; Signal-to-Noise says what remains must preserve salience ratios.
- **Source books:** B6 Lidwell, B7 Williams
- **Supporting candidate entries:** B6: Signal-to-Noise Ratio, B7: No element is arbitrary / visual relationship before decoration
- **Catalogue relationship:** Likely D-30.

### P-05 — Goal Gradient Law
- **Cluster:** decision
- **Priority:** high
- **Proposed statement:** Motivation increases as users perceive themselves getting closer to a goal; visible progress is not decoration, it is behavioral fuel.
- **Why this is distinct:** The current catalogue covers feedback and outcomes, but not the motivational acceleration produced by perceived progress.
- **Source books:** B5 Weinschenk
- **Supporting candidate entries:** B5: Goal Gradient
- **Catalogue relationship:** Distinct from D-19 Feedback and D-24 Outcome Over Aesthetic. Strong D-31 candidate.

### P-06 — Habit Loop Law
- **Cluster:** decision
- **Priority:** medium
- **Proposed statement:** Repeated behavior stabilizes when cues, routines, and rewards are aligned; frictionless repetition creates habit whether intended or not.
- **Why this is distinct:** No current law captures habit formation explicitly, despite its centrality to product retention and misuse.
- **Source books:** B5 Weinschenk, B6 Lidwell
- **Supporting candidate entries:** B5: Habit Easier than Expected / Shortcut Threshold, B6: Operant Conditioning
- **Catalogue relationship:** Could become D-32.

### P-07 — External Memory Law
- **Cluster:** cognition
- **Priority:** high
- **Proposed statement:** Good systems move memory burden from the user’s head into the environment through cues, history, structure, and reminders.
- **Why this is distinct:** D-9 says recognition beats recall; this law says what to do architecturally about that truth.
- **Source books:** B9 Johnson, B6 Lidwell, B1 Norman
- **Supporting candidate entries:** B9: External memory aids, B6: Mnemonic Device, B1: Knowledge in the world
- **Catalogue relationship:** Likely D-33 or mergeable into stronger D-9 extension if you prefer a smaller catalogue.

### P-08 — Story Form Law
- **Cluster:** cognition
- **Priority:** medium
- **Proposed statement:** People process, retain, and are persuaded by information more effectively when it is structured as a story rather than a disconnected fact list.
- **Why this is distinct:** No current law captures narrative cognition directly.
- **Source books:** B5 Weinschenk, B6 Lidwell
- **Supporting candidate entries:** B5: Story Form Superiority / Stories Beat Data, B6: Storytelling
- **Catalogue relationship:** Likely D-34.

### P-09 — Wayfinding Law
- **Cluster:** interaction
- **Priority:** high
- **Proposed statement:** Users need continuous orientation cues to know where they are, where they can go, and how to get back.
- **Why this is distinct:** Current laws discuss scanning, clickability, and hierarchy, but not navigational orientation as a first-class law.
- **Source books:** B6 Lidwell, B2 Krug
- **Supporting candidate entries:** B6: Wayfinding, B2: Street-sign principle / signs and breadcrumbs
- **Catalogue relationship:** Likely D-35.

### P-10 — Reversibility Law
- **Cluster:** interaction
- **Priority:** high
- **Proposed statement:** The cost of exploration must stay low; users move faster and with more confidence when actions can be undone or safely reversed.
- **Why this is distinct:** D-21 gestures toward recovery, but reversibility is specific enough and practically important enough to stand on its own.
- **Source books:** B1 Norman, B6 Lidwell
- **Supporting candidate entries:** B1: Undoability / confirmation before irreversible action, B6: Forgiveness
- **Catalogue relationship:** Likely D-36 or D-21 split.

### P-11 — Attention Decay Law
- **Cluster:** cognition
- **Priority:** medium
- **Proposed statement:** Attention is selective, unstable, and degrades with exposure duration; repeated or persistent signals lose power unless their salience changes.
- **Why this is distinct:** D-7 captures not noticing off-path elements, but not habituation and sustained-attention decay over time.
- **Source books:** B5 Weinschenk
- **Supporting candidate entries:** B5: Attention Selectivity, B5: Habituation, B5: Sustained Attention Limit
- **Catalogue relationship:** Likely D-37.

### P-12 — Examples Before Abstractions Law
- **Cluster:** cognition
- **Priority:** medium
- **Proposed statement:** People learn faster and more accurately from concrete examples than from abstract rules alone.
- **Why this is distinct:** Important for onboarding, documentation, empty states, and settings explanations; absent from current 26.
- **Source books:** B5 Weinschenk
- **Supporting candidate entries:** B5: Example-First Learning
- **Catalogue relationship:** Likely D-38.

### P-13 — Mode Visibility Law
- **Cluster:** interaction
- **Priority:** medium
- **Proposed statement:** If system modes change the meaning of user actions, the active mode must be continuously obvious; hidden modes manufacture errors.
- **Why this is distinct:** This is not fully covered by D-21. It is a specific, recurring UI failure class.
- **Source books:** B9 Johnson
- **Supporting candidate entries:** B9: Mode visibility / automatic vs controlled processing
- **Catalogue relationship:** Likely D-39.

### P-14 — Natural Mapping Law
- **Cluster:** interaction
- **Priority:** high
- **Proposed statement:** Controls are easier to learn and harder to misuse when their arrangement, movement, or symbolism matches the effect they produce.
- **Why this is distinct:** Norman discusses mapping deeply, but the current catalogue does not promote it to its own law.
- **Source books:** B1 Norman
- **Supporting candidate entries:** B1: Natural Mapping
- **Catalogue relationship:** Strong D-40 candidate.

### P-15 — Visible Progress Law
- **Cluster:** interaction
- **Priority:** medium
- **Proposed statement:** When a task takes time, people need to see that movement toward completion is happening; invisible waiting erodes trust and persistence.
- **Why this is distinct:** D-20 covers time thresholds, but not the design obligation to visualize progress itself.
- **Source books:** B9 Johnson, B5 Weinschenk
- **Supporting candidate entries:** B9: perceived responsiveness / cause-and-effect timing, B5: Goal Gradient
- **Catalogue relationship:** Likely D-41 or merge with D-20 if you want a smaller set.

---

## Recommended first-pass acceptance set
If you do not want to expand the catalogue too aggressively, start with these 8:
- P-01 Discoverability Law
- P-02 Conceptual Model Law
- P-03 Progressive Disclosure Law
- P-04 Signal-to-Noise Law
- P-05 Goal Gradient Law
- P-07 External Memory Law
- P-09 Wayfinding Law
- P-14 Natural Mapping Law

## Recommended merge/split decisions before adding new laws
- Decide whether **Reversibility Law** stays inside D-21 or becomes its own law.
- Decide whether **Visible Progress Law** stays inside D-20 or becomes its own law.
- Decide whether **Discoverability Law** is a D-1 extension or a separate law.
- Decide whether **External Memory Law** is a D-9 extension or a separate law.

## Next step after this file
For each accepted proposal, add one page-cited quote from the source books and promote it into `docs/design-laws-research.md` as D-27, D-28, etc.
