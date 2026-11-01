# Round 3: runs and deviations

The plan is in `plan.md`, committed before any run. This file records what happened while running it.

## Deviation: the loop condition names the skill

The plan had the loop run triggered by the brief alone. That did not happen.

- **First try:** 0 of 4 runs used `taste-loop`. All four used only `design-laws` and built one page. One run said it skipped `taste-loop` because the skill ends by asking the user to pick, which conflicts with the brief's "do not ask questions".
- **Fix:** step 5 of the skill was reworded as a hand-off: the three concepts are the deliverable, so presenting them is not a question. Then the loop runs were redone once, as the plan allows.
- **Second try:** again 0 of 4.
- **Third try:** the loop prompt starts with "Use the taste-loop skill." and is otherwise the same brief. 4 of 4 runs produced three concepts and stopped at the hand-off without picking.

So the round now tests what the plan asked (are the loop's options better than three single shots?) with the loop invoked by name. Triggering on its own is a separate finding: **0 of 8**. With `design-laws` installed, the model prefers the cheaper skill.

## Runs

- `costs.txt`: turns and cost per run, including the failed tries.
- `audits.txt`: taste-audit score per page. Every loop concept scored 18/18. The single shots scored 6 to 13 of 18.
- `key.json`: the blind mapping from page ids to conditions. **Do not open it until the picks are done.**
- `shots.js`: regenerates the screenshots.
- `page.html`: the picks page source.
