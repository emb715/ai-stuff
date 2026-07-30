# Proposed Laws — Insertion-Ready Drafts for D-27+

> Top 8 proposed additions from `docs/laws/proposed-laws.md`, rewritten in the same style as `docs/design-laws-research.md` and paired with source anchors.

---

## Draft entries

| # | Law | Core Statement | Source | Tags | Type | Strength | NDV Agent | NDV Module |
|---|-----|----------------|--------|------|------|----------|-----------|------------|
| D-27 | **Discoverability Law** | If a user cannot determine what actions are possible without instruction, the design is already failing. Discoverability requires that possible actions and current state be inferable from the surface. | B1 Norman, B2 Krug | `interaction` `ux` `perception` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-28 | **Conceptual Model Law** | Users operate through an internal model of how the system works. If the design does not support a coherent model, hesitation, misuse, and false confidence are guaranteed. | B1 Norman, B6 Lidwell, B9 Johnson | `cognition` `ux` `decision` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-29 | **Progressive Disclosure Law** | Reveal complexity only when it becomes relevant. Showing everything at once transfers system complexity directly into user burden. | B6 Lidwell | `composition` `cognition` `ux` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-30 | **Signal-to-Noise Law** | Relevant information must dominate irrelevant information. When visual or textual noise competes with signal, comprehension falls and action slows. | B6 Lidwell, B7 Williams | `composition` `visual` `ux` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-31 | **Goal Gradient Law** | Motivation increases as users perceive themselves getting closer to a goal. Visible progress is not decoration; it is behavioral fuel. | B5 Weinschenk | `decision` `ux` `emotion` | descriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-32 | **External Memory Law** | Good systems move memory burden from the user’s head into the environment through cues, history, structure, and reminders. | B1 Norman, B6 Lidwell, B9 Johnson | `cognition` `ux` `consistency` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-33 | **Wayfinding Law** | Users need continuous orientation cues to know where they are, where they can go, and how to get back. | B6 Lidwell, B2 Krug | `interaction` `ux` `visual` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |
| D-34 | **Natural Mapping Law** | Controls are easier to learn and harder to misuse when their arrangement, movement, or symbolism matches the effect they produce. | B1 Norman | `interaction` `ux` `perception` | prescriptive | law | ndv-design (Pixel) | ndv-perceptual |

---

## Source anchors (verbatim)

### D-27 — Discoverability Law
- **B1 Norman:** “Discoverability. It is possible to determine what actions are possible and the current state of the device.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~3746-3748
- **B2 Krug support:** “FACT OF LIFE #1: We don’t read pages. We scan them.” and “One of the best ways to make almost anything easier to grasp in a hurry is to follow the existing conventions...”

### D-28 — Conceptual Model Law
- **B1 Norman:** “A conceptual model is an explanation, usually highly simplified, of how something works.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~1702-1708
- **B1 Norman:** “It is the conceptual model that provides true understanding.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~1050-1052

### D-29 — Progressive Disclosure Law
- **B6 Lidwell:** “Progressive disclosure involves separating information into multiple layers and only presenting layers that are necessary or relevant.”
- **Source lines:** `docs/laws/sources/B6-lidwell/raw.txt` lines ~6938-6940

### D-30 — Signal-to-Noise Law
- **B6 Lidwell:** “The ratio of relevant to irrelevant information in a display. The highest possible signal-to-noise ratio is desirable in design.”
- **Source lines:** `docs/laws/sources/B6-lidwell/raw.txt` lines ~8390-8394
- **B6 Lidwell:** “The goal of good design is to maximize signal and minimize noise...”
- **Source lines:** `docs/laws/sources/B6-lidwell/raw.txt` lines ~8408-8413

### D-31 — Goal Gradient Law
- **B5 Weinschenk support anchor:** "People need to feel that they have a good chance of completing the goal to get into, and hold onto, the flow state."
- **Source lines:** `docs/laws/sources/B5-weinschenk/raw.txt` lines ~3798-3800

### D-32 — External Memory Law
- **B1 Norman:** “Knowledge in the world is usually easy to come by.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~4023-4027
- **B1 Norman:** “Signifiers, physical constraints, and natural mappings are all perceivable cues that act as knowledge in the world.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~4024-4027

### D-33 — Wayfinding Law
- **B6 Lidwell:** “The process of using spatial and environmental information to navigate to a destination.”
- **Source lines:** `docs/laws/sources/B6-lidwell/raw.txt` lines ~9547-9551
- **B6 Lidwell:** “Orientation refers to determining one’s location relative to nearby objects and the destination.”
- **Source lines:** `docs/laws/sources/B6-lidwell/raw.txt` lines ~9552-9555

### D-34 — Natural Mapping Law
- **B1 Norman:** “Natural mapping, by which I mean taking advantage of spatial analogies, leads to immediate understanding.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~1551-1554
- **B1 Norman:** “The relationship between a control and its results is easiest to learn wherever there is an understandable mapping between the controls, the actions, and the intended result.”
- **Source lines:** `docs/laws/sources/B1-norman/raw.txt` lines ~1548-1551

---

## Recommended insertion point in `docs/design-laws-research.md`

These 8 belong after D-26 in a new section:

- **Phase A:** add D-27 to D-34 as “Proposed Extensions”
- **Phase B:** after review, promote them into the main catalogue and update summary statistics

## Required follow-up if accepted

1. Increase total law count from 26 → 34
2. Update cluster counts in `docs/design-laws-research.md`
3. Update any agent references that explicitly say “26 design laws”
4. Add each new law to `humans/ndv-design.human.md` if the human profile enumerates the law families
