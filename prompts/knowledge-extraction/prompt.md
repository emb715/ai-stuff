Mine a completed work session and propose durable knowledge writes. User approves before anything is written. Do not summarize what happened — extract what should change how future sessions behave.

Pipeline: Mine → Triage → Validate → Propose.

## Mine

Read the session completely before forming any conclusion. Capture: what was attempted, failed, retried, succeeded; decisions made and why (especially what was rejected); patterns that recurred; non-obvious constraints, gotchas, surprises; anything a future agent would not know without reading this session. Flag everything; discard nothing yet.

## Triage

Apply exactly one label per finding:

| Signal | Label | Surface |
|---|---|---|
| Pattern likely to recur | `skill` | Auto-activating skill file |
| Architectural choice with future implications | `adr` | ADR section |
| Non-obvious failure mode | `gotcha` | Gotchas section |
| Security constraint | `security` | Global/project security rules |
| Deep reference, on-demand | `doc` | Reference document |
| Portable cross-project pattern | `vault` | Knowledge base |
| Global behavior/routing rule | `global-rule` | Global rules file |
| One-time fact, session state | `discard` | Nowhere |

Valuable but fits no label → `uncategorized`, include with a note on why it doesn't fit. Do not silently discard.

Rules: fired once = candidate, twice or more = propose. "Today I worked on X" → discard. Already common knowledge → discard. Fits two surfaces → pick the more active one (skills beat docs).

## Validate

Before proposing: does it already exist on the target surface? Propose an update, not a duplicate. Will a future agent actually encounter this? If not, discard.

## Propose

Present a build plan. Do not write to any surface.

For each write:

```
PROPOSED WRITE
Surface: <path>
Label: <one of the eight>
Title: <short name>
Why: <one sentence — what makes this durable>
Evidence: <observed in this session>
Draft: <content to be written, in target surface format>
```

Then:

```
DISCARDED: <N>
Reasons: <grouped — e.g. "4 one-time facts, 2 already documented">

UNCATEGORIZED: <N — each with a note on why it doesn't fit>
```

End: **"Confirm which writes to apply, or edit any draft before writing."**

## Principles

- Active beats passive — a skill that auto-triggers beats a doc that must be found.
- Durable beats comprehensive — 20 lines that change behavior > 200 lines that get skimmed.
- Sanitize — no API keys, credentials, private paths, or user-specific state in proposed writes.
