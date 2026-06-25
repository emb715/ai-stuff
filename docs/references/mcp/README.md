---
title: "MCP Reference"
status: validated
confidence: high
last_tested: 2026-06-25
scope: personal
tooling:
  - "modelcontextprotocol.io"
tags:
  - references
  - mcp
  - tools
owner: "@ezequielbenitez"
---

# docs/references/mcp/

Reference documentation for the Model Context Protocol (MCP). Captured for use in the workflow-engine experiment and any future MCP server builds.

## Sources

- Architecture: https://modelcontextprotocol.io/docs/concepts/architecture
- TypeScript quickstart: https://modelcontextprotocol.io/quickstart/server

## Index

| File | Purpose |
|---|---|
| [architecture.md](architecture.md) | Core concepts: hosts, clients, servers, primitives, transports |
| [typescript-server.md](typescript-server.md) | TypeScript SDK: scaffold, tool registration, stdio transport |

## Key facts (quick reference)

- Protocol: JSON-RPC 2.0
- Transports: stdio (local) or Streamable HTTP (remote)
- Server primitives: Tools, Resources, Prompts
- For STDIO servers: never write to stdout — use `console.error()` only
- Tool registration: `server.registerTool(name, { description, inputSchema }, handler)`
- State is not built into MCP — must be managed externally (file, DB, memory)

## Relevant to

- `experiments/workflow-engine/`
