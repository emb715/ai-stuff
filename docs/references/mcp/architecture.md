---
title: "MCP Architecture"
status: validated
confidence: high
last_tested: 2026-06-27
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - architecture
owner: "@ezequielbenitez"
---

# MCP Architecture

**Source:** https://modelcontextprotocol.io/docs/concepts/architecture
**Captured:** 2026-06-27

---

## Participants

- **MCP Host** — AI application (Claude Desktop, OpenCode, VS Code). Creates and manages one or more clients.
- **MCP Client** — Maintains a dedicated connection to one MCP server.
- **MCP Server** — Exposes context and tools to clients. Can be local (stdio) or remote (HTTP).

One host, many clients, many servers. Each client-server connection is dedicated.

---

## Two layers

### Data layer
JSON-RPC 2.0 protocol. Defines:
- Lifecycle management (init, capability negotiation, termination)
- Server primitives: **Tools**, **Resources**, **Prompts**
- Client primitives: **Sampling**, **Elicitation**, **Logging**
- Utility: notifications, progress tracking, Tasks (experimental)

### Transport layer
Communication channels:
- **Stdio** — stdin/stdout, local only, zero network overhead. Best for local servers.
- **Streamable HTTP** — HTTP POST + SSE, supports remote servers, supports OAuth.

---

## Three server primitives

| Primitive | What it is | Discovery | Execution |
|---|---|---|---|
| Tools | Executable functions (file ops, API calls, DB queries) | `tools/list` | `tools/call` |
| Resources | Data sources (file contents, DB records) | `resources/list` | `resources/get` |
| Prompts | Reusable interaction templates | `prompts/list` | `prompts/get` |

---

## Lifecycle

1. Client sends `initialize` with `protocolVersion` and `capabilities`
2. Server responds with its own `protocolVersion` and `capabilities`
3. Client sends `notifications/initialized`
4. Session is live

Capabilities declared at init determine what each party can do. Server must declare `tools` capability to expose tools.

---

## JSON-RPC 2.0 message structure

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

Notifications (no response expected) omit `id`:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

---

## Relevant to workflow-engine

- Server holds state (workflow state file) between sessions — correct model
- stdio transport is right for local MVP (no network, no auth complexity)
- `tools/list` → client discovers available tools at session start
- `tools/call` → client invokes a tool with typed arguments
- Tool list can change dynamically via `notifications/tools/list_changed` — useful for future workflow state changes
