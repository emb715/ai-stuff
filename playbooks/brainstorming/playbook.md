Facilitate an interactive brainstorming session using structured creativity techniques. Keep the user in generative exploration mode. Aim for 100+ ideas before organizing. The user decides when to stop exploring and start converging.

## Trigger

User says "help me brainstorm" or "help me ideate" — or you have a topic that needs divergent idea generation before convergence.

## Preconditions

- A topic or challenge to brainstorm about
- Time for an interactive session (30-60+ minutes)
- User is ready for generative exploration, not seeking a quick answer

## Facilitation principles

- **Keep the user in generative mode.** Resist organizing or concluding prematurely. When in doubt, ask another question or try another technique.
- **Quantity first.** Aim for 100+ ideas before organization. The first 20 are obvious; the magic is in ideas 50-100.
- **Anti-bias pivot.** Every 10 ideas, review themes and consciously shift to an orthogonal domain (technical → UX → business → edge cases → social impact). LLMs cluster semantically — force divergence.
- **One element at a time.** Present one technique prompt, wait for response, build on it. Depth over breadth.
- **User controls pacing.** At any time the user can say "next technique" or "organize" — honor it immediately.
- **Propose, don't push.** The user approves before moving to organization.

## Step 1 — Session setup

Ask:

1. What are we brainstorming about?
2. What outcomes are you hoping for? (types of ideas, solutions, insights)
3. Any constraints? (time, scope, things to avoid)
4. How much time do you have?

Summarize back: "We're focusing on [topic] with goals around [objectives], constraints: [constraints], ~[duration]. Correct?"

Then offer technique selection:

- **[1] You pick** — browse the technique library
- **[2] I recommend** — I match techniques to your goals
- **[3] Random** — serendipitous selection from different categories
- **[4] Progressive** — broad exploration → pattern recognition → idea development → action planning

## Step 2 — Technique selection

Load `brain-techniques.csv` from this folder. Parse: `category, technique_name, description, best_for, facilitation_prompts`. 61 techniques across 10 categories.

### Mode 1 — User picks

Present categories with technique counts and brief descriptions. Let user browse by category, see techniques with their `best_for`, and select. Don't recommend — be a librarian, not a matchmaker.

### Mode 2 — AI recommends

Analyze session context against technique metadata:

- **Goal type → categories:** innovation/new ideas → creative, wild; problem-solving → deep, structured; team alignment → collaborative; personal insight → introspective_delight; strategic planning → structured, deep
- **Complexity:** abstract/complex → deep, structured; familiar/concrete → creative, wild; emotional/personal → introspective_delight
- **Time:** <30min → 1-2 techniques; 30-60min → 2-3; 60+ → multi-phase flow

Recommend 2-3 techniques. For each, state: technique name, why it fits (linked to their goals via `best_for`), and what it will accomplish. Let user modify or swap.

### Mode 3 — Random

Pick 3 techniques from different categories. Present them. Offer reshuffle if user wants a different combination.

### Mode 4 — Progressive flow

Map techniques to 4 phases:

1. **Expansive Exploration** → creative or wild techniques
2. **Pattern Recognition** → deep or structured techniques
3. **Idea Development** → structured or collaborative techniques
4. **Action Planning** → structured or analytical techniques

Present the full journey. Let user customize any phase.

### After selection

Confirm: "Selected: [techniques]. Ready to start with [first technique]?"

## Step 3 — Technique execution

For each selected technique:

### Frame it

"[Technique Name] — [description]. Focus: [what we're exploring]."

### Facilitate one prompt at a time

Present one question from the technique's `facilitation_prompts`. Wait for response. Build on it:

- **Basic response** → "Tell me more about [aspect]. What would that look like in practice?"
- **Detailed response** → "I like [insight]. What if we took that further? How would [expand idea]?"
- **Stuck** → "Try this angle: [next prompt from the technique]"

### Capture ideas as they emerge

Format each idea:

```
[#N]: [Mnemonic Title]
Concept: [2-3 sentences]
Novelty: [what makes this different from obvious solutions]
```

### Anti-bias check (every 10 ideas)

Review themes so far. Name the dominant domain. Pivot to an unexplored one. State the pivot explicitly: "We've been heavy on [domain]. Let me shift to [orthogonal domain] — [new prompt]."

### Energy check (every 4-5 exchanges)

- Keep pushing this angle?
- Switch techniques for a fresh perspective?
- Thoroughly explored this space?

**Default: keep exploring.** Only offer organization when:
- User explicitly asks to wrap up, OR
- 100+ ideas generated AND 45+ minutes elapsed, OR
- User energy is clearly depleted (short responses, "I don't know", disengaged)

### Technique transition

When user says "next" or "move on":

1. Summarize key ideas from current technique (3-5 bullets)
2. Connect: "This builds on [insight] by [what next technique adds]"
3. Begin next technique with a fresh framing

## Step 4 — Idea organization

### Theme identification

Cluster all ideas into 3-5 themes:

```
Theme: [name] — [focus]
  Ideas: [3-5 related ideas]
  Pattern: [what connects them]
```

Also flag: cross-cutting ideas, breakthrough concepts, implementation-ready ideas.

### Prioritization

Ask user to identify:
- Top 3 high-impact ideas (greatest potential effect)
- Easiest quick wins (fastest to implement)
- Most innovative approaches (true breakthroughs)

### Action plans

For each priority idea:

- **Next steps:** what to do this week
- **Resources needed:** what's required to move forward
- **Potential obstacles:** what could get in the way
- **Success metrics:** how to know it's working

### Session summary

- Total ideas generated
- Themes identified
- Prioritized concepts with action plans
- Key insights and breakthroughs

## Verification

- 100+ ideas generated before organization (or user explicitly chose to stop earlier)
- Ideas captured in the format above throughout the session
- User drove the stop decision, not the agent
- At least 2 techniques explored (single-technique sessions rarely produce breakthroughs)
- Action plans are specific, not generic ("do X this week" not "consider X")
- Anti-bias pivot happened at least once if session exceeded 30 ideas

## Rollback / Fallback

- If a technique feels forced or unproductive → switch techniques mid-session, don't push through
- If user is stuck → try a random technique for fresh perspective
- If session runs long → offer to organize what you have rather than pushing for more
- If ideas cluster in one domain → invoke anti-bias pivot explicitly
- If user wants to save output → suggest copying the conversation or key sections; the output lives in the conversation, not a file

## References

- `brain-techniques.csv` — technique library (61 techniques across 10 categories: collaborative, creative, deep, introspective_delight, structured, theatrical, wild, biomimetic, quantum, cultural)
- Based on bmad brainstorming workflow — rewritten standalone, no framework dependencies
