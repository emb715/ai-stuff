---
title: "Loop Engineering — Addy Osmani"
status: validated
confidence: high
last_tested: 2026-06-24
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - loop-engineering
  - addy-osmani
owner: "@ezequielbenitez"
---

# Loop Engineering — Addy Osmani

**Source:** https://addyosmani.com/blog/loop-engineering/
**Author:** Addy Osmani
**Published:** June 7, 2026
**Captured:** 2026-06-24

---

## Core definition

> Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead.

A loop is a recursive goal: define a purpose, the AI iterates until complete.

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents." — Peter Steinberger
> "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops." — Boris Cherny, head of Claude Code at Anthropic

---

## The five primitives + state

1. **Automations** — scheduled discovery and triage, runs without human triggering
2. **Worktrees** — isolated working directories per agent so parallel agents don't collide
3. **Skills** — project knowledge written down once so the agent doesn't re-derive it every session
4. **Plugins / connectors** — MCP-based connections to real tools (issue trackers, databases, Slack)
5. **Sub-agents** — separate maker and checker; the model that wrote the code must not grade it
6. **State file** — a markdown file (or Linear board) outside the conversation that persists what's done and what's next; the agent forgets between runs, the repo doesn't

---

## Maker/checker split

> The most useful structural thing in a loop, by far, is splitting the one who writes from the one who checks. The model that wrote the code is way too nice grading its own homework.

This is also how `/goal` works internally in Claude Code — a fresh model decides if the loop is done instead of the one that did the work.

Sub-agents burn more tokens. Spend them where a second opinion is worth paying for.

---

## What a loop does not do for you

- **Verification is still on you.** A loop running unattended is also a loop making mistakes unattended. "Done" is a claim, not a proof.
- **Your understanding rots if you allow it.** The faster the loop ships code you didn't write, the bigger the comprehension gap (comprehension debt).
- **Cognitive surrender.** Designing a loop to avoid thinking produces the opposite result from designing it with judgment. Same action, opposite outcome.

---

## Practical shape of one loop

1. Automation runs on a schedule, calls a triage skill, writes findings to a state file
2. For each finding: open an isolated worktree, send a sub-agent to draft a fix
3. A second sub-agent reviews the draft against project skills and existing tests
4. Connectors open the PR and update the ticket
5. Anything the loop can't handle lands in a triage inbox for human review
6. State file is the spine — holds what was tried, what passed, what's still open

---

## Related writing (Addy Osmani)

- Agent harness engineering: https://addyosmani.com/blog/agent-harness-engineering/
- Factory model: https://addyosmani.com/blog/factory-model/
- Long-running agents: https://addyosmani.com/blog/long-running-agents/
- The orchestration tax: https://addyosmani.com/blog/orchestration-tax/
- Agent skills: https://addyosmani.com/blog/agent-skills/
- Intent debt: https://addyosmani.com/blog/intent-debt/
- Code agent orchestra: https://addyosmani.com/blog/code-agent-orchestra/
- Adversarial code review: https://addyosmani.com/blog/adversarial-code-review/
- Comprehension debt: https://addyosmani.com/blog/comprehension-debt/
- Cognitive surrender: https://addyosmani.com/blog/cognitive-surrender/
- Code review in the age of AI: https://addyosmani.com/blog/code-review-ai/
