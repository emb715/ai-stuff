---
title: "MCP Extensions — System and Tasks"
status: draft
confidence: medium
last_tested: 2026-07-28
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - extensions
  - tasks
owner: "@emb715"
---

# MCP Extensions — System and Tasks

**Sources:**
- https://modelcontextprotocol.io/extensions/overview.md
- https://modelcontextprotocol.io/extensions/tasks/overview.md

**Captured:** 2026-07-28
**Status:** `draft` — not yet validated against a real build. Captured from the specification only.

> The 2026-07-28 revision introduced an **extensions system**. Optional features that were previously core (or core-experimental) are now moved out of the core protocol and into named extensions. The most significant is **Tasks**, which was experimental-in-core under 2025-11-25 and is now the `io.modelcontextprotocol/tasks` extension.

---

## Context / problem

Before 2026-07-28, optional features like Tasks lived inside the core protocol (marked "experimental"). This coupled the core spec to features not every implementation needed. The extensions system moves them out: an extension is a named, versioned capability that a client and server negotiate via the `extensions` field in their capabilities.

This reference captures the extensions negotiation mechanism and the current official extension inventory so a maintainer can decide whether to implement or depend on an extension.

## Scope

Covered:
- The extensions negotiation mechanism (`extensions` field in `ClientCapabilities` / `ServerCapabilities`)
- The `io.modelcontextprotocol/` official prefix and the `{vendor-prefix}/{name}` identifier format
- The **Tasks** extension (`io.modelcontextprotocol/tasks`): `CreateTaskResult`, `tasks/get`, `tasks/update`, `tasks/cancel`, durable handles
- **MCP Apps** (`io.modelcontextprotocol/ui`): interactive UI elements inline in conversations
- Auth extensions
- The Extension Support Matrix (where to check client compatibility)

Not covered:
- TS SDK helpers for any extension — **not captured**, see SDK docs
- Non-official (third-party) extensions — out of scope; the mechanism is the same but the identifiers differ

---

## Extensions negotiation

Normative source: https://modelcontextprotocol.io/extensions/overview.md

- `ClientCapabilities` and `ServerCapabilities` each include an `extensions` map.
- Each key in the map is an extension identifier of the form `{vendor-prefix}/{name}`.
- The **official** vendor prefix is `io.modelcontextprotocol/`. Official extensions use identifiers like `io.modelcontextprotocol/tasks`.
- Third-party extensions use their own vendor prefix (reverse-DNS or similar) to avoid collisions.
- Under statelessness, this negotiation happens **per request** via `_meta.clientCapabilities` and via `server/discover` for server capabilities — not at an init handshake. See [architecture.md § Per-request _meta](architecture.md) and [§ server/discover](architecture.md).

---

## Tasks extension (`io.modelcontextprotocol/tasks`)

Normative source: https://modelcontextprotocol.io/extensions/tasks/overview.md (SEP-2663)

Tasks moved out of core in 2026-07-28. A Task represents a long-running server-side operation with a durable handle.

### Result type

A server returns `CreateTaskResult` with `resultType: "task"` (a third `resultType` value, alongside `"complete"` and `"input_required"`). The result includes a task handle.

### RPCs

| Method | Purpose |
|---|---|
| `tasks/get` | Poll a task's current state (handle-based) |
| `tasks/update` | Update a task (e.g. client provides partial input) |
| `tasks/cancel` | Cancel a task |

### Durable handles

Task handles **survive reconnects**. Because the protocol is stateless and there is no session, a task handle is an opaque string the client persists and re-presents on future requests. The server keeps the task state under that handle. This is the same explicit-handle pattern as the `workflow_id` tool arg — see the Stateless design note in [typescript-server.md](typescript-server.md).

> **Fit for workflow-engine:** a multi-step workflow that runs for minutes or hours maps naturally onto a Task. The current `experiments/workflow-engine` scaffold uses synchronous tools with a `workflow_id` handle; adopting the Tasks extension would give durable handles, `tasks/get` polling, and `tasks/cancel` semantics for free. Not adopted yet — flagged as a future enhancement.

---

## MCP Apps (`io.modelcontextprotocol/ui`)

Normative source: https://modelcontextprotocol.io/extensions/overview.md

MCP Apps is an extension for **interactive UI elements inline in conversations**. A server can declare UI elements that the client renders alongside the tool result, enabling richer interaction than text-only content.

> The exact UI element schema and client rendering contract are defined by the extension spec. See the extension overview URL above for the current shape.

---

## Auth extensions

Normative source: https://modelcontextprotocol.io/extensions/overview.md

Authorization (OAuth 2.1) also has extension points — e.g. additional grant types or token formats beyond the core OAuth 2.1 model. These are negotiated via the same `extensions` mechanism. See [authorization.md](authorization.md) for the core authorization model.

---

## Extension Support Matrix

Not every client supports every extension. Before depending on an extension (especially Tasks or MCP Apps), check the Extension Support Matrix on the official docs for current client compatibility. The matrix is maintained alongside the extensions overview:

- https://modelcontextprotocol.io/extensions/overview.md

> The matrix content is **not captured** in this reference — it changes as clients add support. Consult the live page before deciding to depend on an extension.

---

## Failure modes / boundaries

- **TS SDK helpers for Tasks — NOT FETCHED.** How the `@modelcontextprotocol/server` TS SDK exposes Task creation, `tasks/get`, `tasks/update`, and `tasks/cancel` is **not captured** in this reference. See the SDK docs at https://github.com/modelcontextprotocol/typescript-sdk — not captured in this reference.
- **Extension Support Matrix — NOT FETCHED.** The live compatibility matrix is not captured here; consult the URL above.
- **MCP Apps UI schema — partially captured.** The concept (inline interactive UI) is captured; the exact element schema is not. See the extension overview URL.
- **Confidence is `medium`** because this file is captured from the specification only and has not been validated against a real implementation that uses the Tasks or MCP Apps extensions. Treat the RPC names and the `resultType: "task"` value as accurate (normative in the spec) but verify the SDK integration points before implementing.
- **workflow-engine adoption of Tasks is a future plan, not current behavior.** Do not assume the `experiments/workflow-engine` scaffold uses Tasks — it uses synchronous tools with a `workflow_id` handle.