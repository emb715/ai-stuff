---
title: "<Prompt Title>"
status: draft # draft | validated | vetted | deprecated
confidence: low # low | medium | high
last_tested: YYYY-MM-DD
scope: personal # personal | team | global
tooling:
  - "<model/version/platform>"
tags:
  - prompt
  # add more: loop | one-shot | planning | review | implementation | ...
owner: "@username"
---

# Purpose

One or two sentences. What job this prompt performs and when to reach for it.

# When to use

Specific conditions. Distinguish it from similar prompts. Name the trigger state that makes this the right tool.

# Inputs

What must be supplied before running. Use `{{VARIABLE}}` notation.
If nothing: "None — copy and run as-is."

# Prompt

```
<prompt body — exactly what gets copied and pasted>
```

# Stop signal

The condition that ends the loop or confirms the one-shot is done.
Separate from the prompt body — stated plainly so it can be checked without re-reading the full prompt.

# Evidence

At least one documented outcome. What was the input, what did the model produce, was the output correct and usable. Quantitative preferred.

# Failure Modes / Boundaries

When this breaks or produces poor output. At least one known boundary.

# Related prompts

Links to prompts that naturally precede or follow this one, or that address the same problem differently.
