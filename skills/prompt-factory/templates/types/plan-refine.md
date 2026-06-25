# type: plan-refine

Generate a loop prompt that drives a planning doc to implementation readiness through iterative rounds.

Output contract (inside one fenced markdown code block):

Opening line (required):
- Must frame this as a loop, not a one-shot task.
- Example: "Drive `<plan-path>` to implementation readiness through iterative rounds. Run each round until the stop condition fires."
- Do not use imperative one-shot language ("implement", "execute", "do this now").

1. **Source doc**
   - Explicit path to the plan/spec being refined

2. **Round instructions**
   - Each round: identify highest-risk gap, conflict, or partial section
   - Resolve with smallest doc change that reduces build ambiguity
   - Keep assumptions explicit
   - Log contradictions — do not resolve product decisions unilaterally
   - Recheck cross-doc consistency each round

3. **Independent reviews (after each round)**
   Two reviews must each cover:
   - Components
   - Data model
   - Dependencies and contracts
   - Definition of done

4. **Stop condition**
   Both reviews materially agree AND no P0/P1 unknowns remain AND every requirement is testable.
   State this explicitly so the agent knows when to stop.

5. **Blocked behavior**
   If a blocker requires a product decision: stop, surface the exact decision needed, do not continue unilaterally.

Constraint:
- Opening line must frame this as a loop — not an action-once instruction.
- The agent runs multiple rounds until the stop condition fires.
- Do not collapse into a one-shot review. The iterative structure is the point.
