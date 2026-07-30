---
name: design-laws
description: UI/UX review, design critique, and interface building using 98 evidence-backed design laws from 9 canonical books (Norman, Krug, Maeda, Lidwell, Williams, Weinschenk, Johnson, Gothelf, Greever). Activates when reviewing a UI, critiquing a design, evaluating layout, hierarchy, or flow, building a new interface, auditing for usability issues, or making principled design decisions. Covers perception, cognition, composition, interaction, and decision clusters plus concrete patterns, heuristics, and antipatterns mapped to each law.
---

# design-laws

98 evidence-backed design laws from 9 canonical design books, with concrete patterns, heuristics, and antipatterns mapped to each law — for UI/UX review, design critique, interface building, and principled design decisions.

Cite laws by D-number. Load the cluster ref for the checkable statement, example, and source anchor. Use `refs/build-moves.md` when building from intent (creative application, law tensions, deliberate breaks, named compositions). Use `refs/patterns.md` for concrete solutions to known problems, `refs/heuristics.md` for review checks, `refs/antipatterns.md` for named mistakes with corrections.

## When to load

- Reviewing, critiquing, or auditing a UI
- Building a new interface — from a problem (patterns) or from intent (build-moves)
- Making or defending a design decision
- Designing flows, layouts, or interactions

## Build mode — start from intent

When building from creative intent (not reviewing an existing surface), load `refs/build-moves.md` for:
- Intent → laws (calm, premium, trustworthy, urgent, playful, authoritative, intimate, learnable, delightful, scalable)
- Law tensions and resolution principles (e.g., D-17 Reduction vs D-86 Redundancy)
- Deliberate breaks — when breaking a law is the move, with the cost named
- Compositions — named law combinations producing emergent effects (Negative Space as Luxury, Progress as Motivation, Conversational Warmth, Expert Density, Trust Through Transparency, The Deliberate Surprise, The Recovery Story, The Familiar Stranger, The Calm Expert, The Honest Warning)
- Generative prompts

See [refs/build-moves.md](refs/build-moves.md) for the full build-mode toolkit.

## The 98 laws — quick reference

### Perception (20) → refs/perception.md
- **D-1 Norman's Affordance Law** — Every interactive element must signal what it does. [B1]
- **D-2 Gulf of Execution/Evaluation** — Two gaps (intent→action, action→understanding) must be bridged. [B1]
- **D-3 Perception Bias Law** — Design for the perceived interface, not the intended one. [B9]
- **D-4 Contrast Primacy Law** — Vision finds edges, not values; convey meaning via contrast, not subtle color. [B9]
- **D-5 Gestalt Grouping** — Proximity, similarity, closure, continuity construct meaning; violating them makes UIs unparseable. [B6,B7]
- **D-6 Peripheral Vision Law** — Periphery is a frosted shower door; critical info outside the foveal zone is missed. [B9]
- **D-7 Inattentional Blindness** — Focused users miss even obvious off-path elements; visibility ≠ noticing. [B9,B5]
- **D-27 Discoverability Law** — Possible actions and current state must be inferable from the surface alone. [B1,B2]
- **D-34 Natural Mapping Law** — Arrange controls so their position/movement/symbolism matches their effect. [B1]
- **D-43 Face Priority Law** — Faces get privileged attentional processing; use intentionally, never accidentally. [B5]
- **D-46 Habituation Law** — Repeated exposure decays salience; refresh or relocate stale critical cues. [B5]
- **D-50 Memory Reconstruction Law** — User reports of past flows are reconstructions; design for re-derivation. [B5]
- **D-51 Pattern Recognition Law** — Build recognizable structure over novel detail; familiar patterns parse in ms. [B5]
- **D-59 Sustained Attention Limit Law** — Attention decays after ~10 min; break long-form content with checkpoints. [B5]
- **D-62 Color Law** — Use color as hierarchy/semantic signal, never as the sole encoding. [B6]
- **D-63 Constancy Law** — Keep perceived object identity stable across changing input. [B6]
- **D-68 Exposure Effect Law** — Repeated exposure increases preference/trust when first exposure is non-negative. [B6]
- **D-79 Pragnanz Law** — Prefer simplest coherent interpretation; ambiguous visuals force the brain to work. [B6]
- **D-80 Legibility Law** — Optimize character clarity: dark-on-light, >70% contrast, no patterned backgrounds. [B6]
- **D-84 Picture Superiority Law** — Pictures are recalled better than words; prefer visuals for must-remember items. [B6]
- **D-86 Redundancy Law** — Repeat critical info in multiple cue channels so encoding survives single-channel loss. [B6]
- **D-89 Symmetry Law** — Symmetry conveys balance/stability; break it deliberately, never accidentally. [B6]
- **D-90 Threat Detection Law** — Threat cues capture attention disproportionately; reserve for genuine warnings. [B6]
- **D-91 Uniform Connectedness Law** — Visually connected elements are perceived as grouped; use connectors to encode relations. [B6]
- **D-98 Subitizing Limit Law** — Instant quantification works only to 4–5 items; above that, users must count. [B9]

See [refs/perception.md](refs/perception.md) for checkable statements, examples, and source anchors per law. See [refs/heuristics.md](refs/heuristics.md) for review questions and [refs/antipatterns.md](refs/antipatterns.md) for named perception mistakes.

### Cognition (24) → refs/cognition.md
- **D-8 Miller's Constraint** — Hold working-memory items to ~4; exceeding produces errors and abandonment. [B5,B9]
- **D-9 Recognition Over Recall** — Every item a user must remember is a failure mode; provide cues. [B9,B2]
- **D-10 Hick's Law** — Decision time grows log with alternatives; reducing options is a design improvement. [B6,B5]
- **D-11 Scanning Law** — Users scan, not read; structure for the scanner with headings, short paragraphs, anchors. [B2]
- **D-12 Reading Disruption** — Reading is fragile; poor contrast/jargon/competing visuals fragment comprehension. [B9]
- **D-28 Conceptual Model Law** — The system image must support a coherent mental model. [B1,B6,B9]
- **D-32 External Memory Law** — Move memory burden into the environment; recall is hard, recognition is easy. [B1,B6,B9]
- **D-41 Category Drive Law** — People create categories instinctively; support explicit, predictable grouping. [B5]
- **D-42 Examples Before Abstractions Law** — Lead with concrete examples, follow with abstractions. [B5]
- **D-44 Functional Forgetting Law** — Forgetting is functional; design for resurfacing and resumption, not retention. [B5]
- **D-45 Habit Loop Law** — Cue-routine-reward loops stabilize behavior; design for the existing routine or build a cue. [B5]
- **D-47 Social Mirroring Law** — People imitate; social proof and visible collaborators shape behavior intentionally. [B5]
- **D-48 Intrinsic Motivation Law** — Prefer intrinsic (autonomy/mastery/purpose) over extrinsic rewards for sustained engagement. [B5]
- **D-49 Line-Length Tension Law** — Readability is a tradeoff; 45–75 characters is the working band. [B5]
- **D-53 Progress-Mastery-Control Law** — Motivation is the triad of visible progress, felt mastery, perceived control. [B5]
- **D-54 Screen Reading Cost Law** — Screen reading is harder than paper; reduce text burden on screens. [B5]
- **D-56 Story Form Law** — Stories are encoded, recalled, acted on better than equivalent data dumps. [B5,B6]
- **D-57 Stress Error Spike Law** — Stress increases errors; design for real, stressed contexts. [B5]
- **D-58 Variable Reward Law** — Unpredictable rewards motivate disproportionately; use intentionally, never exploitively. [B5]
- **D-61 Use-It-or-Lose-It Law** — Information must be rehearsed to stick; design spaced re-exposure, not one-shot tutorials. [B5]
- **D-66 Depth of Processing Law** — Deeper processing (meaning) produces stronger memory than shallow (surface). [B6]
- **D-76 Immersion Law** — Immersive contexts tolerate longer flows; non-immersive demand chunking. [B6]
- **D-77 Interference Effects Law** — Competing stimuli impede performance; separate channels, sequence, avoid incongruent cues. [B6]
- **D-82 Operant Conditioning Law** — Consistent positive reinforcement builds routines; punishing reinforcement breaks them. [B6]
- **D-88 Serial Position Law** — Beginnings/endings remembered better than middles; never bury critical content mid-list. [B6]
- **D-95 Automatic Processing Law** — Forcing automatic behavior into conscious control slows and destabilizes; preserve automatic paths. [B9]
- **D-96 Interruptibility Cost Law** — Interruptions damage working-memory continuity; design for resumption with persistent state. [B9]

See [refs/cognition.md](refs/cognition.md) for checkable statements, examples, and source anchors per law.

### Composition (23) → refs/composition.md
- **D-13 PARC Principle** — Proximity, Alignment, Repetition, Contrast govern all visual composition; nothing is arbitrary. [B7]
- **D-14 Visual Hierarchy Law** — Important elements must be more prominent; a clear reading order must exist. [B2,B6,B7]
- **D-15 Aesthetic-Usability Effect** — Pleasing designs are perceived as easier to use; visual quality is a trust signal. [B6]
- **D-16 Clickability Law** — Interactive must look interactive; non-interactive must not; false affordances break trust. [B2]
- **D-17 Reduction Law** — Every element must earn its presence; removal is a design act. [B3,B2]
- **D-29 Progressive Disclosure Law** — Reveal complexity only when relevant; infrequent controls belong behind a request. [B6]
- **D-30 Signal-to-Noise Law** — Signal must dominate noise; every non-signal element actively degrades what it surrounds. [B6,B7]
- **D-38 Cognitive Friction Law** — Eliminate "what is this? what do I do?" moments; every thought is a defect. [B2]
- **D-39 Satisficing Law** — Users pick the first plausible option; make the first reasonable choice the correct one. [B2,B6]
- **D-40 Muddling Through Law** — Users proceed with partial understanding; surfaces must work under incomplete models. [B2]
- **D-55 Shortcut Threshold Law** — Shortcuts are adopted only when cost is trivially low; surface them, do not bury them. [B5]
- **D-67 Entry Point Law** — Design the point of attentional entry deliberately; it sets context and tone. [B6]
- **D-69 Factor of Safety Law** — Include margin for error beyond nominal need; edge-tolerant designs survive variance. [B6]
- **D-70 Proportion Law** — Use proportion systems (golden ratio, Fibonacci, rule of thirds) for harmonious relationships. [B6]
- **D-71 Form Follows Function Law** — Let function dictate visible form; form that misleads is decoration. [B6]
- **D-73 Gutenberg Diagram Law** — Weight reading-gravity zones: top-left + bottom-right get the most attention. [B6]
- **D-74 Highlighting Law** — Highlight ≤10% with a small consistent technique set; if everything is highlighted, nothing is. [B6]
- **D-75 Iconic Representation Law** — Use pictorial forms to reduce cognitive load — only when the icon is recognized. [B6]
- **D-78 Inverted Pyramid Law** — Most important first, then detail, then background; readers leave at any point. [B6]
- **D-81 Modularity Law** — Break complexity into comprehensible units; modules scan, learn, maintain, recombine better. [B6]
- **D-83 Performance Load Law** — Minimize total mental + physical effort; every increment of load is a tax on completion. [B6]
- **D-85 Readability Law** — Optimize text-block reading: type size, line-height, measure, contrast, font choice together. [B6]
- **D-87 Scaling Fallacy Law** — What works at one scale may fail at another; re-test at 10× thresholds. [B6]
- **D-92 Weakest Link Law** — Experience fails at the most fragile component; invest in the weakest link. [B6]
- **D-93 Centered Text Penalty Law** — Avoid centered alignment for most UI copy; reserve center for short headlines. [B7]
- **D-94 Structure Before Style Law** — Organize visual relationships first, style second; styling hides disorganization. [B7]

See [refs/composition.md](refs/composition.md) for checkable statements, examples, and source anchors per law. See [refs/patterns.md](refs/patterns.md) for concrete composition solutions.

### Interaction (13) → refs/interaction.md
- **D-18 Fitts' Law** — T = a + b·log₂(D/W); large nearby targets are fast, small distant ones are slow. [B9]
- **D-19 Feedback Law** — Every action must produce immediate, clear, relevant feedback; absence reads as failure. [B1,B9]
- **D-20 Responsiveness Threshold** — 0.1s instant, 1s spinner, 10s progress + cancel; exceed without feedback = broken control. [B9]
- **D-21 Error Inevitability** — If an error is possible, someone will make it; errors are design failures, not user failures. [B1,B5]
- **D-22 Familiarity Law** — Follow conventions unless the departure delivers measurable value; novelty is not a feature. [B9,B2]
- **D-33 Wayfinding Law** — Provide continuous orientation: where am I, where can I go, how do I get back. [B6,B2]
- **D-35 Confirmation Law** — Reserve confirmations for irreversible operations; phrase as Yes/No or action verb, never OK/Cancel. [B1,B6]
- **D-36 Action Constraint Law** — Block invalid-state actions before they are possible; constraints beat confirmations. [B1,B6]
- **D-37 Undoability Law** — Provide multi-level undo as the default recovery path; undo does not block correct actions. [B1,B6]
- **D-52 Error Pattern Law** — Errors are patterned, not random; anticipate classes (slips, lapses, mode errors) and defend. [B5]
- **D-60 Time Over Money Law** — Users often value time over money; surface time savings where they apply. [B5]
- **D-64 Perceived Control Law** — User-perceived control affects confidence/adoption; provide choice, undo, visible state. [B6]
- **D-65 Cost-Benefit Law** — Activity is pursued only if benefit ≥ effort; match every effort increment with visible benefit. [B6]
- **D-72 Framing Law** — Presentation of options changes judgments; frame equivalent options per user context. [B6]
- **D-97 Mode Visibility Law** — Hidden modes manufacture errors; eliminate modes or make the active mode continuously visible. [B9]

See [refs/interaction.md](refs/interaction.md) for checkable statements, examples, and source anchors per law.

### Decision (11) → refs/decision.md
- **D-23 Principled Decision Law** — Every decision must be traceable to a user need or principle; "I like it" is not a reason. [B8]
- **D-24 Outcome Over Aesthetic** — Measure by outcomes (completion, error rate, confidence), not by looks in isolation. [B4,B8]
- **D-25 Emotional Resonance Law** — Account for how it feels, not just what it does; emotion drives most decisions. [B5,B3]
- **D-26 Trust-Through-Consistency** — Repeat patterns to teach the rules; each violation fractures trust and forces relearning. [B3,B7]
- **D-31 Goal Gradient Law** — Motivation increases near the goal; visible progress is behavioral fuel, not decoration. [B5]
- **D-58 Variable Reward Law** — Unpredictable rewards motivate disproportionately; use intentionally, never exploitively. [B5]
- **D-60 Time Over Money Law** — Users often value time over money in experience decisions. [B5]
- **D-64 Perceived Control Law** — User-perceived control affects confidence and adoption. [B6]
- **D-65 Cost-Benefit Law** — Activity is pursued only if benefit ≥ effort. [B6]
- **D-72 Framing Law** — Presentation of options changes judgments. [B6]
- **D-92 Weakest Link Law** — Experience fails at the most fragile component; invest in the weakest link. [B6]

See [refs/decision.md](refs/decision.md) for checkable statements, examples, and source anchors per law.

## Cross-cluster failure patterns

**Invisible primary action** — D-1 (absent affordance) + D-14 (hierarchy collapse) + D-16 (clickability failure) → the most important action on the surface is not findable.

**Working memory bomb** — D-8 (Miller exceeded) + D-9 (recall demanded) + D-10 (too many choices) → user abandons because deciding costs more than completing.

**Feedbackless void** — D-19 (no feedback) + D-20 (threshold exceeded) + D-2 (gulf of evaluation unbridged) → user cannot tell if their action had any effect.

**Invisible system** — D-27 (discoverability) + D-28 (conceptual model) + D-34 (natural mapping) → user cannot form a working model of what the system does.

**Complexity flood** — D-29 (progressive disclosure) + D-30 (signal-to-noise) + D-17 (reduction) → user is shown more than needed; noise competes with signal.

**Invisible finish line** — D-31 (goal gradient) + D-19 (feedback) + D-32 (external memory) → user cannot see progress, remember what's done, or see how close to done.

**Lost user** — D-33 (wayfinding) + D-27 (discoverability) + D-9 (recognition) → user cannot determine where they are, what they can do, or how to return.

## Skill output example

Bad — principle named informally, no source anchor, generic fix:

> The submit and cancel buttons look identical. Users might hit cancel by accident. This violates Fitts's Law and visual hierarchy. Fix: make them look different.

Good — law cited by D-number, concrete pattern, cluster referenced:

> Submit and Cancel are the same size, color, and weight — **violates D-14 (Visual Hierarchy) + D-16 (Clickability) + D-1 (Affordance)**. This is the **invisible primary action** cross-cluster pattern (D-1 + D-14 + D-16): the most important action on the surface is not findable. Fix: Submit becomes the large filled primary button (Single-Feature Pop-Out, refs/patterns.md → D-30); Cancel becomes a ghost/text secondary. Place Submit bottom-right per D-73 (Gutenberg Diagram). See refs/interaction.md for D-18, D-35, D-37.