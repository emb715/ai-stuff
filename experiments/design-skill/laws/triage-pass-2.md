# Triage Pass 2 — All 125 Candidates Classified

> Verdicts for every candidate from the 9 per-book `candidates.md` files.
> Output of the second-pass triage. Input to the skill structure decision.

---

## Methodology

**Verdicts:**
- `PROMOTE` — distinct, actionable, UI/UX-relevant. Becomes a new law (D-35+).
- `MERGE` — restates, supports, or is a subset of an existing law (D-1..D-34) or a PROMOTED candidate. Folds in as supporting evidence.
- `REJECT` — process/method/factoid, not a UI/UX review law, or too niche/poetic for standalone use.

**Cross-candidate merges:** Multiple candidates from different books describing the same phenomenon are combined into one PROMOTED law. The combined law carries all source anchors.

**Scope rule:** UI (what the user sees and interacts with) + UX (how the user experiences the flow). Excludes pure design-process laws (how the team works) and pure rhetoric/stakeholder laws (how the designer defends decisions). Those belong in a future `design-process-laws` skill if ever built.

---

## Existing 34 laws (D-1..D-34) — not re-triaged

These are already ratified (D-1..D-26) or proposed (D-27..D-34). They are the baseline against which all 125 candidates are deduped.

---

## B1 Norman — 7 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B1-01 | Conceptual Model | MERGE | Already D-28 (proposed) |
| C-B1-02 | Confirmation before irreversible action | PROMOTE | Distinct interaction gate; combines with C-B6-03 Confirmation → **D-35 Confirmation Law** |
| C-B1-03 | Discoverability | MERGE | Already D-27 (proposed) |
| C-B1-04 | Interlocks | PROMOTE | Distinct — force action ordering; combines with C-B1-05 + C-B6-05 Constraint → **D-36 Action Constraint Law** |
| C-B1-05 | Lockouts | MERGE | Folds into D-36 Action Constraint Law (block invalid-state actions) |
| C-B1-06 | Natural Mapping | MERGE | Already D-34 (proposed) |
| C-B1-07 | Undoability | PROMOTE | Distinct from D-21 (recovery vs prevention); combines with C-B6-14 Forgiveness → **D-37 Undoability Law** |

**B1 result:** 3 PROMOTE (→ 3 new laws), 4 MERGE

---

## B2 Krug — 5 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B2-01 | Don't Make Me Think | PROMOTE | The book's thesis — meta cognitive-friction law. Distinct from D-11 (scanning) and D-10 (Hick's). → **D-38 Cognitive Friction Law** |
| C-B2-02 | Good enough search | MERGE | Folds into D-39 Satisficing Law (same phenomenon: stop at first plausible) |
| C-B2-03 | Muddling Through | PROMOTE | Distinct — users proceed with partial understanding, not complete models. → **D-40 Muddling Through Law** |
| C-B2-04 | Satisficing | PROMOTE | Distinct decision behavior; combines with C-B2-02 + C-B6-40 → **D-39 Satisficing Law** |
| C-B2-05 | Street-sign principle | MERGE | Folds into D-33 Wayfinding (navigation at speed = wayfinding) |

**B2 result:** 3 PROMOTE (→ 3 new laws), 2 MERGE

---

## B3 Maeda — 6 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B3-01 | Away | MERGE | Perceived quantity shrinks with distancing = progressive disclosure principle. Folds into D-29 |
| C-B3-02 | Context | MERGE | Periphery changes center interpretation = context shapes salience. Folds into D-30 Signal-to-Noise |
| C-B3-03 | Differences | MERGE | Simplicity/complexity define each other = contrast. Folds into D-13 PARC + D-4 Contrast Primacy |
| C-B3-04 | Open | MERGE | Exposing structure = D-28 Conceptual Model + D-27 Discoverability |
| C-B3-05 | Power | MERGE | Use less, gain more = D-17 Reduction family |
| C-B3-06 | Time | MERGE | Time savings as simplicity dimension = D-17 Reduction + D-20 Responsiveness family |

**B3 result:** 0 PROMOTE, 6 MERGE. Maeda's poetic phrasings are supporting evidence for already-ratified laws. No standalone laws survive.

---

## B4 Gothelf — 4 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B4-01 | Assumption-first design | MERGE | Actionable form of D-23 Principled Decision + D-24 Outcome Over Aesthetic. Folds in |
| C-B4-02 | Permission to fail | REJECT | Design-process law (team experimentation), not UI/UX review |
| C-B4-03 | Removing waste | MERGE | = D-17 Reduction + D-24 Outcome. Folds in |
| C-B4-04 | Shared understanding | REJECT | Team/org process, not interface law |

**B4 result:** 0 PROMOTE, 2 MERGE, 2 REJECT. Lean UX process laws don't survive as UI/UX review checks.

---

## B5 Weinschenk — 37 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B5-01 | All-Caps Penalty Myth | REJECT | Niche typographic myth — too narrow for a law |
| C-B5-02 | Attention Selectivity | MERGE | Folds into D-7 Inattentional Blindness (same phenomenon) |
| C-B5-03 | Category Drive | PROMOTE | Distinct — people create categories; design must support grouping. → **D-41 Category Drive Law** |
| C-B5-04 | Choice as Control | MERGE | Folds into D-10 Hick's Law (choice-overload family) |
| C-B5-05 | Engineer Better Group Decisions | REJECT | Group dynamics process, not UI/UX review |
| C-B5-06 | Example-First Learning | PROMOTE | Distinct — concrete examples before abstractions. Critical for onboarding/docs/empty states. → **D-42 Examples Before Abstractions Law** |
| C-B5-07 | Face Priority | PROMOTE | Distinct — faces get privileged attentional processing. UX-relevant for imagery/avatars. → **D-43 Face Priority Law** |
| C-B5-08 | Familiarity under Threat | MERGE | Folds into D-22 Familiarity Law (stress-context variant) |
| C-B5-09 | Feeling Precedes Deciding | MERGE | Folds into D-25 Emotional Resonance (same mechanism) |
| C-B5-10 | Forgetfulness is Functional | PROMOTE | Distinct — forgetting is not purely a defect; design should support resurfacing. → **D-44 Functional Forgetting Law** |
| C-B5-11 | Frequency Expectation | REJECT | Weak standalone — observation about attention, not a design law |
| C-B5-12 | Goal Gradient | MERGE | Already D-31 (proposed) |
| C-B5-13 | Habit Easier than Expected | PROMOTE | Distinct — cue-routine-reward loops stabilize behavior. → **D-45 Habit Loop Law** |
| C-B5-14 | Habituation | PROMOTE | Distinct from D-7 (which is about off-path elements). Habituation is salience decay over time. → **D-46 Habituation Law** |
| C-B5-15 | Imitation and Empathy | PROMOTE | Distinct — social proof, mirroring. UX-relevant for social/collaborative UI. → **D-47 Social Mirroring Law** |
| C-B5-16 | Intrinsic over Extrinsic | PROMOTE | Distinct motivation law — intrinsic rewards sustain engagement better. → **D-48 Intrinsic Motivation Law** |
| C-B5-17 | Line-Length Tension | PROMOTE | Distinct typographic UX — readability is a tradeoff, not a one-way rule. → **D-49 Line-Length Tension Law** |
| C-B5-18 | Memory Reconstruction | PROMOTE | Distinct — memory is reconstructed, not replayed. Affects what users "remember" about flows. → **D-50 Memory Reconstruction Law** |
| C-B5-19 | Memory Resource Cost | MERGE | Folds into D-9 Recognition Over Recall (same mechanism: recall is costly) |
| C-B5-20 | Online Social Rules | REJECT | Interesting fact, weak direct UI actionability |
| C-B5-21 | Pattern Recognition Speed | PROMOTE | Distinct — people identify objects by pattern recognition; design recognizable structure over novel detail. → **D-51 Pattern Recognition Law** |
| C-B5-22 | Predictable Error Types | PROMOTE | Distinct from D-21 (which says errors are inevitable). This says errors are *patterned* — design can anticipate classes. → **D-52 Error Pattern Law** |
| C-B5-23 | Progress Mastery Control | PROMOTE | Distinct from D-31 Goal Gradient (which is distance-to-goal). This is the full motivation triad: progress + mastery + control. → **D-53 Progress-Mastery-Control Law** |
| C-B5-24 | Screen Scanning by Expectation | MERGE | Folds into D-3 Perception Bias (expectation shapes perception) |
| C-B5-25 | Screen-vs-Paper Reading Cost | PROMOTE | Distinct constraint — screen reading is harder than paper. Reduces text-burden obligation. → **D-54 Screen Reading Cost Law** |
| C-B5-26 | Shortcut Threshold | PROMOTE | Distinct — users adopt shortcuts only when shortcut cost is trivially low. → **D-55 Shortcut Threshold Law** |
| C-B5-27 | Simple Feature Processing | MERGE | Folds into D-4 Contrast Primacy (low-level features processed rapidly) |
| C-B5-28 | Stories Beat Data | MERGE | Folds into D-56 Story Form Law (combined with C-B5-29 + C-B6-44) |
| C-B5-29 | Story Form Superiority | PROMOTE | Distinct cognition law; combines C-B5-28 + C-B5-29 + C-B6-44 → **D-56 Story Form Law** |
| C-B5-30 | Stress Error Spike | PROMOTE | Distinct — stress increases errors. Design for stress contexts. → **D-57 Stress Error Spike Law** |
| C-B5-31 | Surprise Reward | MERGE | Folds into D-58 Variable Reward Law (combined with C-B5-37) |
| C-B5-32 | Sustained Attention Limit | PROMOTE | Distinct — ~10 min attention decay. Affects long-form UX. → **D-59 Sustained Attention Limit Law** |
| C-B5-33 | Third-Person Effect | REJECT | Niche bias — people think others are more influenced. Weak UI actionability |
| C-B5-34 | Time Over Money | PROMOTE | Distinct — users may value time over money in experience decisions. → **D-60 Time Over Money Law** |
| C-B5-35 | Unconscious First | MERGE | Folds into D-25 Emotional Resonance (affective judgment precedes reasoning) |
| C-B5-36 | Use It to Keep It | PROMOTE | Distinct — information must be rehearsed to stick. Affects learning UX. → **D-61 Use-It-or-Lose-It Law** |
| C-B5-37 | Variable Rewards | PROMOTE | Distinct — unpredictable reward schedules motivate disproportionately; combines C-B5-31 + C-B5-37 → **D-58 Variable Reward Law** |

**B5 result:** 21 PROMOTE (→ 21 new laws), 9 MERGE, 5 REJECT, 2 MERGE-into-PROMOTE (28+29, 31+37 counted within the 21)

---

## B6 Lidwell — 50 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B6-01 | Cognitive Dissonance | REJECT | Cognitive bias, weak direct UI actionability |
| C-B6-02 | Color | PROMOTE | Distinct composition — color as hierarchy and semantic signal. → **D-62 Color Law** |
| C-B6-03 | Confirmation | MERGE | Folds into D-35 Confirmation Law (combined with C-B1-02) |
| C-B6-04 | Constancy | PROMOTE | Distinct perception — objects perceived as stable despite changing input. → **D-63 Constancy Law** |
| C-B6-05 | Constraint | MERGE | Folds into D-36 Action Constraint Law (combined with C-B1-04 + C-B1-05) |
| C-B6-06 | Control | PROMOTE | Distinct decision — user-perceived control affects confidence/adoption. → **D-64 Perceived Control Law** |
| C-B6-07 | Cost-Benefit | PROMOTE | Distinct decision — activity pursued only if benefit ≥ effort. → **D-65 Cost-Benefit Law** |
| C-B6-08 | Depth of Processing | PROMOTE | Distinct cognition — deeper processing = stronger memory. → **D-66 Depth of Processing Law** |
| C-B6-09 | Entry Point | PROMOTE | Distinct composition — point of attentional entry into a design. → **D-67 Entry Point Law** |
| C-B6-10 | Expectation Effect | MERGE | Folds into D-3 Perception Bias (expectation shapes perception) |
| C-B6-11 | Exposure Effect | PROMOTE | Distinct perception — repeated exposure increases preference. → **D-68 Exposure Effect Law** |
| C-B6-12 | Factor of Safety | PROMOTE | Distinct interaction — include margin for error beyond nominal need. → **D-69 Factor of Safety Law** |
| C-B6-13 | Fibonacci Sequence | MERGE | Folds into D-70 Proportion Law (combined with C-B6-17 + C-B6-39) |
| C-B6-14 | Forgiveness | MERGE | Folds into D-37 Undoability Law (combined with C-B1-07) |
| C-B6-15 | Form Follows Function | PROMOTE | Distinct composition — function dictates visible form. → **D-71 Form Follows Function Law** |
| C-B6-16 | Framing | PROMOTE | Distinct decision — presentation of options changes judgments. → **D-72 Framing Law** |
| C-B6-17 | Golden Ratio | MERGE | Folds into D-70 Proportion Law |
| C-B6-18 | Gutenberg Diagram | PROMOTE | Distinct composition — reading gravity pattern for scan-first layouts. → **D-73 Gutenberg Diagram Law** |
| C-B6-19 | Highlighting | PROMOTE | Distinct composition — controlled emphasis prevents noise. → **D-74 Highlighting Law** |
| C-B6-20 | Iconic Representation | PROMOTE | Distinct — pictorial forms reduce cognitive load. → **D-75 Iconic Representation Law** |
| C-B6-21 | Immersion | PROMOTE | Distinct cognition — focused involvement changes tolerance/attention. → **D-76 Immersion Law** |
| C-B6-22 | Interference Effects | PROMOTE | Distinct cognition — competing stimuli impede performance. → **D-77 Interference Effects Law** |
| C-B6-23 | Inverted Pyramid | PROMOTE | Distinct composition — most important information first. → **D-78 Inverted Pyramid Law** |
| C-B6-24 | Law of Pragnanz | PROMOTE | Distinct perception — people prefer simplest coherent interpretation. → **D-79 Pragnanz Law** |
| C-B6-25 | Layering | MERGE | Folds into D-29 Progressive Disclosure (same mechanism: nested layers) |
| C-B6-26 | Legibility | PROMOTE | Distinct perception — visual clarity of characters independent of meaning. → **D-80 Legibility Law** |
| C-B6-27 | Mapping | MERGE | Already D-34 (proposed) |
| C-B6-28 | Mental Model | MERGE | Already D-28 (proposed) |
| C-B6-29 | Mnemonic Device | MERGE | Folds into D-32 External Memory Law |
| C-B6-30 | Modularity | PROMOTE | Distinct composition/architecture — break complexity into comprehensible units. → **D-81 Modularity Law** |
| C-B6-31 | Ockham's Razor | MERGE | Folds into D-17 Reduction (same principle) |
| C-B6-32 | Operant Conditioning | PROMOTE | Distinct — reinforcement shapes repeated behavior. → **D-82 Operant Conditioning Law** |
| C-B6-33 | Orientation Sensitivity | MERGE | Folds into D-4 Contrast Primacy (orientation is a contrast dimension) |
| C-B6-34 | Performance Load | PROMOTE | Distinct interaction — total mental + physical effort required. → **D-83 Performance Load Law** |
| C-B6-35 | Picture Superiority Effect | PROMOTE | Distinct cognition — pictures remembered better than words. → **D-84 Picture Superiority Law** |
| C-B6-36 | Progressive Disclosure | MERGE | Already D-29 (proposed) |
| C-B6-37 | Readability | PROMOTE | Distinct perception/cognition — ease of reading at text-block level. → **D-85 Readability Law** |
| C-B6-38 | Redundancy | PROMOTE | Distinct perception — repeat info in multiple cue channels for robustness. → **D-86 Redundancy Law** |
| C-B6-39 | Rule of Thirds | MERGE | Folds into D-70 Proportion Law |
| C-B6-40 | Satisficing | MERGE | Folds into D-39 Satisficing Law (combined with C-B2-04) |
| C-B6-41 | Scaling Fallacy | PROMOTE | Distinct — what works at one scale may fail at another. → **D-87 Scaling Fallacy Law** |
| C-B6-42 | Serial Position Effects | PROMOTE | Distinct cognition — beginnings/endings remembered better than middles. → **D-88 Serial Position Law** |
| C-B6-43 | Signal-to-Noise Ratio | MERGE | Already D-30 (proposed) |
| C-B6-44 | Storytelling | MERGE | Folds into D-56 Story Form Law (combined with C-B5-28 + C-B5-29) |
| C-B6-45 | Symmetry | PROMOTE | Distinct composition — symmetrical forms convey balance/stability. → **D-89 Symmetry Law** |
| C-B6-46 | Threat Detection | PROMOTE | Distinct perception — threat cues capture attention disproportionately. → **D-90 Threat Detection Law** |
| C-B6-47 | Uniform Connectedness | PROMOTE | Distinct perception — visually connected elements perceived as grouped. Foundational Gestalt principle distinct from D-5's grouping summary. → **D-91 Uniform Connectedness Law** |
| C-B6-48 | Visibility | MERGE | Folds into D-27 Discoverability (same requirement) |
| C-B6-49 | Wayfinding | MERGE | Already D-33 (proposed) |
| C-B6-50 | Weakest Link | PROMOTE | Distinct decision/architecture — experience fails at most fragile component. → **D-92 Weakest Link Law** |

**B6 result:** 32 PROMOTE (→ 30 new laws including 1 combined Proportion Law from 3 candidates), 17 MERGE, 1 REJECT

---

## B7 Williams — 4 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B7-01 | Centered text weakens structure | PROMOTE | Distinct — centered alignment reduces structural clarity in most UI copy. → **D-93 Centered Text Penalty Law** |
| C-B7-02 | Contrast over similarity | MERGE | Folds into D-13 PARC (Contrast sub-principle) |
| C-B7-03 | No element is arbitrary | MERGE | Folds into D-17 Reduction (every element earns its place) |
| C-B7-04 | Visual relationship before decoration | PROMOTE | Distinct — organize relations first, style second. → **D-94 Structure Before Style Law** |

**B7 result:** 2 PROMOTE (→ 2 new laws), 2 MERGE

---

## B8 Greever — 6 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B8-01 | Common-message preparation | REJECT | Rhetoric/stakeholder process, not UI/UX review |
| C-B8-02 | Listening is understanding | REJECT | Communication process, not interface law |
| C-B8-03 | Recovery from critique failure | REJECT | Rhetoric strategy, not interface law |
| C-B8-04 | Reduce cognitive load in presentations | MERGE | Application of D-8 Miller's to presentations — already covered |
| C-B8-05 | Relationships before persuasion | REJECT | Stakeholder relationship process, not interface law |
| C-B8-06 | Response strategy before response tactics | REJECT | Rhetoric planning, not interface law |

**B8 result:** 0 PROMOTE, 1 MERGE, 5 REJECT. Greever's laws govern design advocacy, not UI/UX review. Belong in a future `design-advocacy-laws` skill if built.

---

## B9 Johnson — 6 candidates

| # | Candidate | Verdict | Reason / Target |
|---|-----------|---------|-----------------|
| C-B9-01 | Automatic vs controlled processing | PROMOTE | Distinct — forcing formerly automatic behavior into conscious control slows/destabilizes. → **D-95 Automatic Processing Law** |
| C-B9-02 | External memory aids | MERGE | Already D-32 External Memory Law (proposed) |
| C-B9-03 | Interruptibility cost | PROMOTE | Distinct — interruptions damage working-memory continuity. → **D-96 Interruptibility Cost Law** |
| C-B9-04 | Mode visibility | PROMOTE | Distinct — hidden modes manufacture errors. → **D-97 Mode Visibility Law** |
| C-B9-05 | Reading needs visual rhythm | MERGE | Folds into D-12 Reading Disruption (complementary: preserve rhythm = avoid disruption) |
| C-B9-06 | Subitize limit | PROMOTE | Distinct cognition — people instantly quantify only 4–5 items. → **D-98 Subitizing Limit Law** |

**B9 result:** 4 PROMOTE (→ 4 new laws), 2 MERGE

---

## Summary Statistics

### By verdict

| Verdict | Count | % |
|---------|-------|---|
| PROMOTE (new law) | 64 | 51% |
| MERGE (into existing or promoted) | 45 | 36% |
| REJECT | 16 | 13% |
| **Total** | **125** | |

### By book

| Book | Candidates | PROMOTE | MERGE | REJECT |
|------|-----------|----------|-------|--------|
| B1 Norman | 7 | 3 | 4 | 0 |
| B2 Krug | 5 | 3 | 2 | 0 |
| B3 Maeda | 6 | 0 | 6 | 0 |
| B4 Gothelf | 4 | 0 | 2 | 2 |
| B5 Weinschenk | 37 | 21 | 11 | 5 |
| B6 Lidwell | 50 | 30 | 19 | 1 |
| B7 Williams | 4 | 2 | 2 | 0 |
| B8 Greever | 6 | 0 | 1 | 5 |
| B9 Johnson | 6 | 4 | 2 | 0 |
| **Total** | **125** | **64** | **45** | **16** |

### Final law count

| Range | Count | Source |
|-------|-------|--------|
| D-1..D-26 | 26 | Ratified (pass 1) |
| D-27..D-34 | 8 | Proposed (pass 1) |
| D-35..D-98 | 64 | Promoted (pass 2 — this file) |
| **Total** | **98** | |

---

## New Laws D-35..D-98 — Cluster Assignment

### Cluster A: Perception (16 laws)

| # | Law | Source |
|---|-----|--------|
| D-62 | Color Law | B6 |
| D-63 | Constancy Law | B6 |
| D-68 | Exposure Effect Law | B6 |
| D-79 | Pragnanz Law | B6 |
| D-80 | Legibility Law | B6 |
| D-90 | Threat Detection Law | B6 |
| D-91 | Uniform Connectedness Law | B6 |
| D-43 | Face Priority Law | B5 |
| D-51 | Pattern Recognition Law | B5 |
| D-59 | Sustained Attention Limit Law | B5 |
| D-46 | Habituation Law | B5 |
| D-98 | Subitizing Limit Law | B9 |
| D-84 | Picture Superiority Law | B6 |
| D-86 | Redundancy Law | B6 |
| D-89 | Symmetry Law | B6 |
| D-50 | Memory Reconstruction Law | B5 (perception-cognition bridge) |

### Cluster B: Cognition (20 laws)

| # | Law | Source |
|---|-----|--------|
| D-41 | Category Drive Law | B5 |
| D-42 | Examples Before Abstractions Law | B5 |
| D-44 | Functional Forgetting Law | B5 |
| D-45 | Habit Loop Law | B5 |
| D-47 | Social Mirroring Law | B5 |
| D-48 | Intrinsic Motivation Law | B5 |
| D-49 | Line-Length Tension Law | B5 |
| D-54 | Screen Reading Cost Law | B5 |
| D-56 | Story Form Law | B5+B6 |
| D-58 | Variable Reward Law | B5 |
| D-61 | Use-It-or-Lose-It Law | B5 |
| D-66 | Depth of Processing Law | B6 |
| D-76 | Immersion Law | B6 |
| D-77 | Interference Effects Law | B6 |
| D-82 | Operant Conditioning Law | B6 |
| D-88 | Serial Position Law | B6 |
| D-95 | Automatic Processing Law | B9 |
| D-96 | Interruptibility Cost Law | B9 |
| D-53 | Progress-Mastery-Control Law | B5 (cognition-decision bridge) |
| D-57 | Stress Error Spike Law | B5 (cognition-interaction bridge) |

### Cluster C: Composition (19 laws)

| # | Law | Source |
|---|-----|--------|
| D-67 | Entry Point Law | B6 |
| D-70 | Proportion Law (Fibonacci + Golden Ratio + Rule of Thirds) | B6 |
| D-71 | Form Follows Function Law | B6 |
| D-73 | Gutenberg Diagram Law | B6 |
| D-74 | Highlighting Law | B6 |
| D-75 | Iconic Representation Law | B6 |
| D-78 | Inverted Pyramid Law | B6 |
| D-81 | Modularity Law | B6 |
| D-85 | Readability Law | B6 |
| D-87 | Scaling Fallacy Law | B6 |
| D-93 | Centered Text Penalty Law | B7 |
| D-94 | Structure Before Style Law | B7 |
| D-38 | Cognitive Friction Law (Don't Make Me Think) | B2 (composition-cognition bridge) |
| D-40 | Muddling Through Law | B2 (cognition-composition bridge) |
| D-39 | Satisficing Law | B2+B6 (decision-composition bridge) |
| D-55 | Shortcut Threshold Law | B5 (interaction-composition bridge) |
| D-83 | Performance Load Law | B6 (interaction-composition bridge) |
| D-69 | Factor of Safety Law | B6 (interaction-composition bridge) |
| D-92 | Weakest Link Law | B6 (decision-composition bridge) |

### Cluster D: Interaction (10 laws)

| # | Law | Source |
|---|-----|--------|
| D-35 | Confirmation Law | B1+B6 |
| D-36 | Action Constraint Law | B1+B6 |
| D-37 | Undoability Law | B1+B6 |
| D-97 | Mode Visibility Law | B9 |
| D-52 | Error Pattern Law | B5 |
| D-65 | Cost-Benefit Law | B6 (interaction-decision bridge) |
| D-64 | Perceived Control Law | B6 (interaction-decision bridge) |
| D-72 | Framing Law | B6 (decision-interaction bridge) |
| D-60 | Time Over Money Law | B5 (decision-interaction bridge) |
| D-34 | Natural Mapping Law (already proposed) | B1 (interaction-perception bridge) |

### Cluster E: Decision (6 laws)

| # | Law | Source |
|---|-----|--------|
| D-60 | Time Over Money Law | B5 |
| D-64 | Perceived Control Law | B6 |
| D-65 | Cost-Benefit Law | B6 |
| D-72 | Framing Law | B6 |
| D-58 | Variable Reward Law | B5 |
| D-92 | Weakest Link Law | B6 |

Note: many laws span clusters. The assignment above is by *primary* cluster. Cross-cluster bridges are marked. The skill should not enforce hard cluster boundaries — the failure-cluster patterns (see `design-laws-research.md` §5) depend on cross-cluster interaction.

---

## Skill Structure Recommendation

### The question: one skill or split?

**98 laws is a lot.** But the math works for one skill if we use the refs/ structure properly.

**One-skill math:**
- SKILL.md: 98 laws × ~1.5 lines (one-line checkable statement + ID) = ~150 lines + 30 lines intro/routing = **~180 lines** (at the upper bound of the playbook's 100–180 range, but feasible)
- refs/ by cluster: 5 files
  - `refs/perception.md`: 23 laws (D-1..D-7 + D-27 + D-34 + 16 new) × ~6 lines = ~140 lines
  - `refs/cognition.md`: 24 laws (D-8..D-12 + D-28 + D-32 + 20 new) × ~6 lines = ~140 lines
  - `refs/composition.md`: 24 laws (D-13..D-17 + D-29 + D-30 + 19 new) × ~6 lines = ~140 lines
  - `refs/interaction.md`: 19 laws (D-18..D-22 + D-33 + 10 new) × ~6 lines = ~110 lines
  - `refs/decision.md`: 12 laws (D-23..D-26 + D-31 + 6 new) × ~6 lines = ~70 lines
- Total refs/: ~600 lines across 5 files, loaded on demand per cluster

**Three-skill math (alternative):**
- `design-laws-perception-cognition`: 47 laws, SKILL.md ~80 lines, 2 refs/
- `design-laws-composition-interaction`: 33 laws, SKILL.md ~60 lines, 2 refs/
- `design-laws-decision`: 12 laws, SKILL.md ~30 lines, 1 ref/
- Problem: a UI review needs all three simultaneously. Loading 3 skills for one task is more overhead than loading 1 skill with 5 refs/.

### Recommendation: ONE skill

**`design-laws`** — one skill, cluster-based refs/, loaded on demand.

Reasons:
1. **Laws cross-reference constantly.** The failure-cluster patterns (invisible primary action, working memory bomb, feedbackless void) span perception + cognition + composition + interaction. Splitting forces the model to reassemble context that belongs together.
2. **UI review needs all clusters at once.** A reviewer checking a screen needs perception (what they see), cognition (what they process), composition (how it's organized), interaction (how it flows), and decision (what it's for). Splitting by cluster means the model loads 3 skills for every review.
3. **The refs/ structure handles the token budget.** SKILL.md loads only the 180-line routing layer. refs/ load per cluster on demand. The model never pays for 600 lines unless it needs all of them.
4. **The playbook's 100–180 line ceiling is a guideline, not a hard limit.** 180 lines for 98 laws is dense but workable — each law gets one actionable line. The alternative (3 skills, 3 trigger descriptions, 3 humans.md, 3 evaluation passes) is more overhead than the line-count saving is worth.

**When to revisit:** if evaluation (playbook step 8) shows the skill over-triggers — i.e., the model loads it for tasks that only need one cluster — then split. But start unified and let the evaluation tell us.

---

## Rejected candidates — where they belong

| Category | Count | Destination |
|----------|-------|-------------|
| Design process (B4 Gothelf, B8 Greever) | 7 | Future `design-process-laws` skill if built |
| Rhetoric/stakeholder (B8 Greever) | 5 | Future `design-advocacy-laws` skill if built |
| Factoids/observations (B5 niche) | 4 | Nowhere — not laws |

---

## Next steps

1. **Review this file.** Especially the 64 PROMOTED laws — are any wrongly promoted or wrongly rejected?
2. **Decide: one skill or split.** My recommendation is one skill (see above). Override if you want a split.
3. **Ratify D-27..D-34 + D-35..D-98 as full laws.** The "proposed" label on D-27..D-34 can be dropped — they have source anchors and survived triage. Final count: **98 laws**.
4. **Build the skill** in `experiments/design-skill/skill/` (Path B) with cluster-based refs/.
5. **Evaluate** per `write-skill` playbook step 8.