---
title: "NRFD: <<feature-name>>"
status: draft
confidence: low
last_tested: 2026-08-10
scope: team
tooling:
  - design
tags:
  - nrfd
  - design-doc
owner: "@emb715"
---

# NRFD: <<feature-name>>

## Context / Problem

### System Context

<<1-2 paragraphs. Describe the runtime environment the architecture (from the RFD) will operate in: deployment topology, load profile, operational ownership, failure blast radius.>>

### Quality Attribute Priorities

Rank the quality attributes for this feature. Not all are equal; the ranking drives trade-offs in the RFD and targets in this document.

1. <<quality attribute 1>> (highest)
2. <<quality attribute 2>>
3. <<quality attribute 3>>
4. <<quality attribute 4>> (lowest of those in scope)

### References RFD

Link: [`./rfd.md`](./rfd.md)

## Scope

### NFR Scope

<<Which quality attributes are in scope for this document. State which are out of scope and why (e.g., "usability out of scope — no UI in this feature").>>

## Procedure / Steps

### Scalability

- **Baseline RPS:** <<requests per second at normal load>>
- **Peak RPS:** <<requests per second at projected peak>>
- **Data growth rate:** <<volume/time, e.g., 10GB/month>>
- **Scaling model:** <<horizontal | vertical | sharded | queue-based>>
- **Scaling ceiling:** <<the point at which the design breaks and a redesign is required>>

### Availability & Reliability

- **Uptime SLA:** <<e.g., 99.9%>>
- **RPO (Recovery Point Objective):** <<max acceptable data loss, e.g., 5 minutes>>
- **RTO (Recovery Time Objective):** <<max acceptable downtime, e.g., 15 minutes>>
- **Failure isolation:** <<how failures in one component are contained>>

### Performance

- **p95 latency budget:** <<value>> for <<operation>>
- **p99 latency budget:** <<value>> for <<operation>>
- **Throughput target:** <<value>>
- **Latency budget breakdown:** <<how the total budget is allocated across components>>

### Security & Compliance

- **Authentication:** <<mechanism>>
- **Authorization:** <<mechanism, granularity>>
- **Encryption at rest:** <<mechanism>>
- **Encryption in transit:** <<mechanism>>
- **Compliance standards:** <<e.g., SOC2, GDPR, HIPAA — or "none applicable">>
- **Audit logging:** <<what is logged, retention period>>

### Observability

- **Log structure:** <<structured | unstructured>>, format: <<e.g., JSON with fields: ts, level, service, traceId>>
- **Metrics:** <<list of key metrics exposed>>
- **Alert thresholds:** <<metric, condition, severity>>
- **Tracing:** <<enabled | disabled>>, sampling: <<rate>>

## Evidence / Results

### SLOs / SLIs

| SLI | SLO | Measurement window |
|---|---|---|
| <<indicator>> | <<objective>> | <<window>> |

### Measurement Strategy

<<How each SLO will be measured: tool, query, cadence. If an SLO cannot be measured today, state what instrumentation is required.>>

### Compliance Evidence

<<For each compliance standard claimed above, state how compliance will be evidenced: audit report, automated scan, policy-as-code check, manual review.>>

## Failure Modes / Boundaries

### Failure Scenarios

- **<<scenario>>** — <<expected behavior>> | detection: <<signal>> | recovery: <<action>>

### Degradation Modes

- <<what degrades gracefully and how>>
- <<what fails hard and why hard failure is acceptable>>

### Limits & Capacity Ceilings

- <<hard limits the design cannot exceed without redesign>>
- <<capacity ceilings with the trigger condition for redesign>>