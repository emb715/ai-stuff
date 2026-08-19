---
title: "MCP Architecture"
status: validated
confidence: high
last_tested: 2026-07-28
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - architecture
owner: "@emb715"
---

# MCP Architecture

**Source:** https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
**Normative spec:** https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md
**Captured:** 2026-07-28

> This document reflects the **2026-07-28** spec revision. The previous capture (2026-06-27) described the legacy stateful protocol and is superseded. If a claim here conflicts with older MCP material you have read, this document is the current one.

---

## Participants

- **MCP Host** — AI application (Claude Desktop, OpenCode, VS Code). Creates and manages one or more clients.
- **MCP Client** — Issues JSON-RPC requests to one MCP server. Under statelessness, there is no dedicated long-lived connection; each request is self-contained.
- **MCP Server** — Exposes context and tools to clients. Can be local (stdio) or remote (HTTP).

One host, many clients, many servers.

---

## Statelessness (core principle)

The 2026-07-28 revision made MCP **stateless**. Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md#statelessness

Consequences:

- **No `initialize` handshake.** The legacy `initialize` → `notifications/initialized` exchange is removed.
- **No session.** There is no `Mcp-Session-Id`, no server-held connection state, no session-scoped capability cache.
- **Every request is self-contained.** Each request carries `_meta.io.modelcontextprotocol/protocolVersion` (required) and `_meta.clientCapabilities` (required). The server reads version and capabilities from the request, not from a prior handshake.
- **Cross-call state needs explicit handles.** If a server must remember something across calls (a workflow, a task, a cursor), the client passes an opaque handle (e.g. `workflow_id`) as a tool argument. The handle is the state; the connection is not.

> **Migration note (Legacy → Modern):** any design that relied on the server remembering per-session state must move that state into an explicit handle passed by the client on every call.

---

## Per-request `_meta`

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md#meta

Every request includes a `_meta` object:

| Field | Direction | Required | Purpose |
|---|---|---|---|
| `io.modelcontextprotocol/protocolVersion` | request | yes | Protocol version string, e.g. `"2026-07-28"` |
| `clientCapabilities` | request | yes | What the client supports this request |
| `clientInfo` | request | no | Client name + version |
| `serverInfo` | response | — | Server name + version (in the result) |
| `progressToken` | request | no | For `notifications/progress` correlation |

Capabilities are declared **per request**, not once at init. This is the replacement for the legacy capability-negotiation handshake.

---

## `server/discover` (new capability negotiation)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/server/discover.md

- Servers **MUST** implement `server/discover`.
- Clients **MAY** call `server/discover` before any other request to learn the server's capabilities, primitives, and metadata.
- This replaces the capability block previously returned by `initialize`.

`server/discover` is how a client learns what tools/resources/prompts/extensions a server exposes, without a handshake.

---

## Two layers

### Data layer
JSON-RPC 2.0 protocol. Defines:
- **Stateless request/response** — every request self-contained (see § Statelessness)
- **`server/discover`** — capability and primitive negotiation (replaces init handshake)
- **Per-request `_meta`** — carries `protocolVersion` + `clientCapabilities`
- Server primitives: **Tools**, **Resources**, **Prompts**
- Client primitives: **Elicitation** (remains); **Sampling** and **Logging** deprecated (SEP-2577)
- Utility: **MRTR** (multi round-trip requests), **subscriptions/listen**, progress, cancellation
- Optional features moved to **extensions** (e.g. Tasks → `io.modelcontextprotocol/tasks`)

### Transport layer
Communication channels:
- **Stdio** — stdin/stdout, local only, zero network overhead. Best for local servers.
- **Streamable HTTP** — redesigned for statelessness (see § Streamable HTTP below).

---

## Three server primitives

| Primitive | What it is | Discovery | Execution |
|---|---|---|---|
| Tools | Executable functions (file ops, API calls, DB queries) | `tools/list` | `tools/call` |
| Resources | Data sources (file contents, DB records) | `resources/list` | `resources/read` |
| Prompts | Reusable interaction templates | `prompts/list` | `prompts/get` |

> Note: the legacy `resources/get` is renamed to `resources/read` in Modern MCP.

---

## Client primitives (2026-07-28 status)

| Primitive | Status | Notes |
|---|---|---|
| Elicitation | Active | Server asks client to elicit input from the user/model |
| Sampling | **Deprecated** (SEP-2577) | Migrate: integrate with LLM provider APIs directly |
| Logging | **Deprecated** (SEP-2577) | Migrate: stderr or OpenTelemetry. Per-request log level now via `io.modelcontextprotocol/logLevel` in `_meta` (the legacy `logging/setLevel` RPC is removed) |

**Tasks** are no longer a client primitive and no longer experimental-in-core. They are now the `io.modelcontextprotocol/tasks` extension. See [extensions.md](extensions.md).

---

## Transport: Streamable HTTP (redesigned)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports.md

What changed from Legacy:

- **No sessions.** No `Mcp-Session-Id` header. No `Initialize` → `Initialized` exchange.
- **No GET endpoint.** The legacy SSE GET endpoint for server-initiated messages and resumability is removed. `Last-Event-ID` resumability is gone.
- **Required headers** on every POST: `MCP-Protocol-Version`, `Mcp-Method`, `Mcp-Name`.
- Server-initiated messages (notifications) now flow through `subscriptions/listen` (see below), not through a GET stream.

stdio is unchanged in shape (stdin/stdout, JSON-RPC framed by newlines) but is also stateless — each line is a self-contained request.

---

## JSON-RPC 2.0 message structure

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "_meta": {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28",
    "clientCapabilities": { "tools": {}, "elicitation": {} }
  }
}
```

Notifications (no response expected) omit `id`:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "_meta": { "io.modelcontextprotocol/protocolVersion": "2026-07-28" }
}
```

> The legacy `notifications/tools/list_changed` still exists as a method name, but its **delivery** now requires an opt-in `subscriptions/listen` stream (see below). Servers do not broadcast it on a GET channel.

---

## `resultType` (required on all results)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md#resulttype

Every result object MUST include `resultType`, one of:

- `"complete"` — the request is finished; the result is final.
- `"input_required"` — the server needs more input from the client to continue (see MRTR).

Legacy results that omitted `resultType` are invalid under 2026-07-28.

---

## Multi Round-Trip Requests (MRTR)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr.md (SEP-2322)

MRTR replaces server-initiated requests (the legacy model where the server sends a request to the client mid-call). Under statelessness the server cannot initiate, so:

1. Server returns an `InputRequiredResult` with `resultType: "input_required"`, an `inputRequests` array, and a `requestState` handle.
2. Client gathers input and sends a **new request** (same method) carrying `inputResponses` + the `requestState` handle.
3. Server resumes and either completes or requests more input.

Use MRTR when a tool needs to ask the user (or model) a question mid-execution. This is the stateless replacement for the legacy Sampling/Elicitation-as-server-request pattern.

---

## `subscriptions/listen`

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/subscriptions.md

Replaces `resources/subscribe` and the HTTP GET notification endpoint.

- Client opts in by calling `subscriptions/listen` with the URIs (or topics) it wants notifications for.
- The server returns a stream of notifications relevant to those subscriptions.
- This is the **only** delivery path for server-to-client notifications under 2026-07-28.

---

## Cancellation

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/cancellation.md

Split by transport:

- **stdio:** `notifications/cancelled` (the client sends a cancellation notification referencing the request id).
- **Streamable HTTP:** closing the SSE stream **is** the cancellation — there is no separate cancel message.

---

## Progress

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/progress.md

- Client provides a `progressToken` in `_meta` on the request.
- Server emits `notifications/progress` with that token as the work proceeds.

---

## JSON Schema usage (2020-12 dialect)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md#json-schema-usage (SEP-2106)

- **JSON Schema 2020-12** is the default dialect for `inputSchema`, `outputSchema`, and resource templates.
- `$ref` must **not** auto-dereference network URIs (no fetching remote schemas).
- Composition keywords (`allOf`, `anyOf`, `oneOf`) need resource bounds (e.g. a max depth or count).

---

## Error codes (renumbered)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md#error-codes

| Code | Meaning |
|---|---|
| `-32020` | HeaderMismatch (Streamable HTTP header missing/wrong) |
| `-32021` | MissingRequiredClientCapability |
| `-32022` | UnsupportedProtocolVersion |
| `-32602` | Resource not found (moved from legacy `-32002`) |

Standard JSON-RPC codes (`-32700` parse error, `-32600` invalid request, `-32601` method not found, `-32603` internal error) are unchanged.

---

## CacheableResult

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/changelog.md (minor change 5)

`tools/list`, `prompts/list`, `resources/list`, `resources/read`, and `resources/templates/list` results MUST include a `CacheableResult` with `ttlMs` and `cacheScope`. Clients may cache these responses up to `ttlMs`.

---

## Icons

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md#icons

Tool, Resource, Prompt, and Implementation objects MAY carry an `icons` array. See SDK docs for the exact icon object shape — not captured in this reference.

---

## `x-mcp-header` (SEP-2243)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/server/tools.md#x-mcp-header

Tool parameters can be mirrored to `Mcp-Param-{Name}` HTTP headers. Clients MUST support this on Streamable HTTP. Useful when a tool argument should also be an HTTP header (auth, tracing).

---

## Deprecations (SEP-2577)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/deprecated.md

| Feature | Deprecated | Earliest removal | Migrate to |
|---|---|---|---|
| Roots | 2026-07-28 | first revision on/after 2027-07-28 | Pass dirs/files via tool params or resource URIs |
| Sampling | 2026-07-28 | first revision on/after 2027-07-28 | Integrate directly with LLM provider APIs |
| Logging (as RPC) | 2026-07-28 | first revision on/after 2027-07-28 | stderr or OpenTelemetry; per-request level via `io.modelcontextprotocol/logLevel` in `_meta` |

Also removed in 2026-07-28 (not just deprecated):
- `initialize` / `notifications/initialized` handshake
- `ping` (no heartbeat RPC)
- `logging/setLevel`
- `notifications/roots/list_changed`

---

## Relevant to workflow-engine

The `experiments/workflow-engine` experiment exposes workflow state over MCP. Under the 2026-07-28 stateless model:

- **The `workflow_id` tool-arg pattern is correct and now required.** Every tool (`get_current_step`, `report_step_output`, `advance_step`, `get_workflow_status`) takes `workflow_id` as an explicit argument. This is the stateless pattern: the handle is the state, the connection is not. Normative: https://modelcontextprotocol.io/specification/2026-07-28/server/tools.md#stateful-tools — a "stateful tool" under Modern MCP is one that uses an explicit handle, not one that relies on connection state.
- **stdio is the right transport for the MVP.** Local, no auth complexity (stdio servers are exempt from OAuth — see [authorization.md](authorization.md)).
- **`server/discover` is mandatory** — the workflow-engine server must implement it so clients can discover the four tools. See SDK docs for whether the TS SDK auto-implements this — not captured in this reference.
- **`subscriptions/listen` could replace polling** for workflow state changes. Instead of the client repeatedly calling `get_workflow_status`, the client could subscribe to the workflow's state URI and receive `notifications/*` when the step advances. Future enhancement.
- **Tasks extension is a future fit** for long-running workflows. A workflow that runs for minutes/hours maps naturally onto `CreateTaskResult` (`resultType: "task"`) with `tasks/get` polling and durable handles that survive reconnects. See [extensions.md](extensions.md). Not adopted yet — the current scaffold uses synchronous tools.

---

## Failure modes / boundaries

- This reference captures the **specification** level, not a specific SDK's API surface. SDK helper class names, auto-injection of `_meta` fields, and auto-implementation of `server/discover` are **not captured** — see the SDK docs for those.
- Streamable HTTP server transport class name/import for the TS SDK is **not captured**. See SDK docs.
- The deprecation timeline (2027-07-28 earliest removal) is the spec's current statement; verify against the latest spec before relying on it.
- This reference does not cover the OAuth flow end-to-end — see [authorization.md](authorization.md) for the authorization model.