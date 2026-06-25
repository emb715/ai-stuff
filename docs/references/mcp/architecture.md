# MCP Architecture

Source: https://modelcontextprotocol.io/docs/concepts/architecture
Captured: 2026-06-25

## Participants

| Role | Description |
|---|---|
| MCP Host | AI application (e.g. Claude Code, OpenCode) — manages one or more MCP clients |
| MCP Client | Component inside the host — maintains a dedicated connection to one MCP server |
| MCP Server | Program that provides context to MCP clients |

One host → many clients → one server each.

## Two layers

**Data layer** — JSON-RPC 2.0 protocol:
- Lifecycle management (initialize, negotiate capabilities, terminate)
- Server primitives: Tools, Resources, Prompts
- Client primitives: Sampling, Elicitation, Logging

**Transport layer** — communication channel:
- `stdio` — standard I/O, local only, single client, no network overhead
- Streamable HTTP — remote, multiple clients, supports OAuth

## Server primitives

| Primitive | Description | Discovery |
|---|---|---|
| Tools | Executable functions the LLM can call | `tools/list` → `tools/call` |
| Resources | Data sources (files, DB records, API responses) | `resources/list` → `resources/read` |
| Prompts | Reusable templates | `prompts/list` → `prompts/get` |

## Tool schema

```json
{
  "name": "tool_name",
  "description": "What it does",
  "inputSchema": {
    "type": "object",
    "properties": {
      "param": { "type": "string", "description": "..." }
    },
    "required": ["param"]
  }
}
```

## Lifecycle (initialize handshake)

```json
// Client → Server
{ "jsonrpc": "2.0", "id": 1, "method": "initialize",
  "params": { "protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": { "name": "...", "version": "..." } } }

// Server → Client
{ "jsonrpc": "2.0", "id": 1, "result": { "protocolVersion": "2025-06-18", "capabilities": { "tools": {} }, "serverInfo": { "name": "...", "version": "..." } } }

// Client notification
{ "jsonrpc": "2.0", "method": "notifications/initialized" }
```

## Tool call pattern

```json
// Request
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call",
  "params": { "name": "tool_name", "arguments": { "param": "value" } } }

// Response
{ "jsonrpc": "2.0", "id": 3, "result": { "content": [{ "type": "text", "text": "result" }] } }
```

## Important constraints

- MCP is stateful (requires lifecycle management) but provides no built-in state persistence
- State between sessions must be handled externally
- STDIO servers must never write to stdout — corrupts JSON-RPC stream
- Notifications are one-way (no response): `{ "jsonrpc": "2.0", "method": "notifications/..." }`
