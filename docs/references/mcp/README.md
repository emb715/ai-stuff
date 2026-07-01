---
title: "MCP References Index"
status: validated
confidence: high
last_tested: 2026-06-27
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
owner: "@ezequielbenitez"
---

# MCP References

Reference documentation captured from the Model Context Protocol official docs. Grounds the `experiments/workflow-engine/` experiment.

## Sources

| File | Source | Purpose |
|---|---|---|
| [architecture.md](architecture.md) | modelcontextprotocol.io/docs/concepts/architecture | Protocol architecture, primitives, transport, lifecycle |
| [typescript-server.md](typescript-server.md) | modelcontextprotocol.io/docs/develop/build-server | TypeScript SDK scaffold, tool registration, stdio transport |

Note: tool schemas specific to `workflow-engine` live in `experiments/workflow-engine/tool-schemas.md`, not here.

## Key takeaways

- MCP is client-server, JSON-RPC 2.0, stateful protocol
- Three server primitives: **Tools** (executable functions), **Resources** (data), **Prompts** (templates)
- Two transports: **stdio** (local, zero overhead) and **Streamable HTTP** (remote)
- Tool schema uses JSON Schema for `inputSchema`
- stdio transport: **never write to stdout** — only stderr safe for logging
- State is held server-side; clients discover tools via `tools/list` then call via `tools/call`
- Tool results return `content` array (text, image, resource links) and optional `structuredContent`
