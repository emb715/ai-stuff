---
title: "Token efficiency techniques for long sessions"
status: validated
confidence: medium
last_tested: 2026-07-31
scope: personal
tooling:
  - "claude-sonnet-4"
  - "glm-5.2"
tags:
  - tokens
  - efficiency
  - techniques
owner: "@emb715"
---

# Token efficiency techniques for long sessions

## Problem / Context

Long coding sessions with LLMs accumulate token cost rapidly. Context windows fill with redundant file reads, restated instructions, and verbose outputs that don't add signal. The cost is both financial (API billing per token) and cognitive (model attention degrades as context grows — "lost in the middle" degradation).

This note catalogs techniques that measurably reduce token consumption without losing task quality.

## Guidance

### 1. Prefer symbol-level reads over full-file reads

Read the specific function/class, not the entire file. A 2000-line file costs ~8000 tokens to load; the function you need costs ~200.

**Do:** `read_symbol(symbol_id)` or targeted line ranges.
**Don't:** `read_file` "to get context" when you know which symbol you need.

### 2. Use outlines before reading

File outlines (function/class signatures + summaries) cost 5-10x less than full file contents. Read the outline first; only open the full file if the outline is insufficient.

### 3. Batch independent reads

If you need three files, request all three in one message. Three sequential round-trips each carry the full conversation context as input tokens. One round-trip with three reads carries it once.

### 4. Suppress social filler in system prompts

Pleasantries, acknowledgments, "I understand", "Great question" — each instance is 3-15 tokens of pure noise. Over a 50-turn session, this compounds to thousands of tokens with zero information value.

**Rule:** system prompts should explicitly forbid social filler. Example: `"No pleasantries, no acknowledgments, no restating the question."`

### 5. Use bullets over prose in outputs

Paragraphs contain connective tissue ("Furthermore", "In addition to this", "It is worth noting that") that bullets eliminate. A 5-bullet list and a 5-sentence paragraph carry the same information; the paragraph costs ~30% more tokens.

### 6. Cache context across turns, don't re-inject

If a file was read in turn 3 and is still relevant in turn 15, the model retains it in context. Re-reading "to be sure" doubles the cost. Only re-read if the file changed.

### 7. Prefer exact string match over regex when possible

Regex explanation in prompts ("match lines starting with `foo` but not `fooBar`") costs more tokens than the literal string `foo`. Use regex only when the pattern genuinely requires it.

### 8. Scope searches before executing

`grep "function" src/**` across an entire repo returns hundreds of matches. `grep "function" src/auth/**` returns the relevant subset. Narrowing the scope reduces both output tokens and the model's processing load.

## Evidence

Measured on a representative coding session (debugging a Convex mutation across 18 turns):

| Technique | Before | After | Token delta |
|---|---|---|---|
| Symbol reads vs full-file | 8 file reads, ~24,000 tokens | 8 symbol reads, ~3,200 tokens | -87% |
| Outline-first | 5 full files loaded (~15,000) | 5 outlines + 1 full file (~4,500) | -70% |
| Batched reads (3 files) | 3 round-trips, ~45,000 input | 1 round-trip, ~16,000 input | -64% |
| Social filler suppression | ~120 filler tokens/turn | ~0 | -100% filler |
| Bullets over prose (output) | ~180 tokens/answer | ~120 tokens/answer | -33% |

Aggregate: a session that would cost ~180K tokens dropped to ~55K with all techniques applied. ~70% reduction, no observable quality loss on the task (mutation fixed, tests passed).

## Failure modes / boundaries

- **Symbol reads fail when file structure is unknown.** If you don't know which symbol to read, the outline is the right first step — not a full file read, not a guess.
- **Batching backfires when reads are dependent.** If read B depends on what read A returns, batching wastes tokens on a read you might not need. Only batch independent reads.
- **Filler suppression can make output feel abrupt to human readers.** Acceptable for internal/agent-facing output; undesirable for user-facing copy. Match the constraint to the audience.
- **Context caching assumes the model retains perfectly.** In practice, very long contexts (>100K tokens) degrade retrieval. For sessions exceeding that, periodic re-injection of critical context is necessary — but only critical context, not everything.
- **Token reduction is not the goal; signal preservation is.** Cutting tokens by removing necessary information produces worse results at lower cost. Every technique above preserves signal; applying them blindly to signal-bearing content causes quality loss.