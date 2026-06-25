---
title: "Vetting Rubric"
status: vetted
confidence: high
last_tested: 2026-06-23
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - standards
  - quality
owner: "@ezequielbenitez"
---

# Vetting Rubric

Use this rubric to decide whether an artifact can be promoted to `vetted/`.

## Context / Problem

Without a strict rubric, promotion decisions become subjective, inconsistent, and low-trust.

## Scope

This rubric applies to artifacts considered for lifecycle promotion, especially `validated -> vetted`.
It does not replace sanitization checks or metadata checks; it complements them.

## Procedure / Steps

1. Score each axis from 0 to 2.
2. Verify no axis is 0.
3. Sum total score.
4. Compare against the threshold.
5. Record decision and required fixes if threshold is missed.

## Scoring

Score each axis 0–2.

- **0** = missing
- **1** = partial
- **2** = complete

Maximum score: 14.

Promotion threshold:
- Minimum total: **12/14**
- No axis can be **0**

## Axes

1. **Problem clarity**
   - Is the problem statement concrete and bounded?

2. **Reproducibility**
   - Can another person replicate the process from the document alone?

3. **Evidence quality**
   - Are outcomes supported by examples, logs, metrics, or before/after comparisons?

4. **Operational utility**
   - Is the artifact actionable in real work (not just conceptual)?

5. **Failure awareness**
   - Are limitations, failure cases, and boundaries documented?

6. **Sanitization**
   - Are secrets, private identifiers, and sensitive details removed?

7. **Maintenance viability**
   - Is owner, last-tested date, and tooling context recorded?

## Decision outcomes

- **Vetted**: meets threshold and no zeroes
- **Validated only**: useful but incomplete evidence or weak failure analysis
- **Draft**: exploratory, early, or unverified
- **Deprecated**: superseded or no longer reliable

## Evidence / Results

Observed outcome in this repository: applying the rubric + hard gates prevented publishing artifacts that were structurally incomplete.

## Failure Modes / Boundaries

- High score does not guarantee universal applicability across teams/projects.
- A document can pass rubric quality yet still fail sanitization.
- If evidence is stale (`last_tested` old), rerun validation before promotion.
