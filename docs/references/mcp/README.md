---
title: "MCP References Index"
status: validated
confidence: high
last_tested: 2026-07-28
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
owner: "@emb715"
---

# MCP References

Reference documentation captured from the Model Context Protocol official docs. Grounds the `experiments/workflow-engine/` experiment.

**Spec version:** Captured against MCP specification **2026-07-28** (previous: 2025-11-25). The 2026-07-28 revision is a breaking rewrite — MCP is now **stateless**, the `initialize` handshake is removed, and several features moved to extensions or were deprecated. If you learned MCP from older material, assume your mental model is stale until you read [architecture.md](architecture.md).

## Sources

| File | Source | Purpose |
|---|---|---|
| [architecture.md](architecture.md) | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | Protocol architecture, primitives, transport, statelessness, `server/discover`, MRTR, subscriptions |
| [typescript-server.md](typescript-server.md) | https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server | TypeScript SDK scaffold (`@modelcontextprotocol/server`), tool registration, stdio transport |
| [authorization.md](authorization.md) | https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md | OAuth 2.1 resource server model, RFC 9728 Protected Resource Metadata, client registration |
| [extensions.md](extensions.md) | https://modelcontextprotocol.io/extensions/overview.md + https://modelcontextprotocol.io/extensions/tasks/overview.md | Extensions system, `io.modelcontextprotocol/` prefix, Tasks extension, MCP Apps |
| (specification root) | https://modelcontextprotocol.io/specification/2026-07-28/basic/index.md | Normative protocol specification — the authoritative source for every claim in this folder |

Note: tool schemas specific to `workflow-engine` live in `experiments/workflow-engine/tool-schemas.md`, not here.

## Key takeaways (2026-07-28)

- MCP is **client-server, JSON-RPC 2.0, and stateless**. Every request is self-contained — it carries its own protocol version and client capabilities in `_meta`. There is no `initialize` handshake and no session. See [architecture.md § Statelessness](architecture.md).
- **Capability negotiation is per-request**, not per-connection. Clients declare capabilities in `_meta.clientCapabilities`; servers declare theirs in `server/discover` responses. A server MUST implement `server/discover`; a client MAY call it before any other request. See [architecture.md § server/discover](architecture.md).
- Three **server primitives** remain: **Tools** (executable functions), **Resources** (data), **Prompts** (templates). The old **client primitives** list is reduced: **Elicitation** remains; **Sampling** and **Logging** are **deprecated** (SEP-2577). **Tasks** moved out of core into the `io.modelcontextprotocol/tasks` extension. See [extensions.md](extensions.md).
- Two **transports**: **stdio** (local, zero overhead) and **Streamable HTTP** (remote, redesigned — no sessions, no GET endpoint, requires `MCP-Protocol-Version` / `Mcp-Method` / `Mcp-Name` headers). See [architecture.md § Transport](architecture.md).
- Tool `inputSchema` uses **JSON Schema 2020-12** as the default dialect (SEP-2106). `$ref` must not auto-dereference network URIs; composition keywords need resource bounds.
- stdio transport: **never write to stdout** — only stderr is safe for logging.
- Cross-call state requires **explicit handles** (e.g. a `workflow_id` tool argument) because the server holds no connection state. The `experiments/workflow-engine` scaffold already follows this pattern correctly — see the Stateless design note in [typescript-server.md](typescript-server.md).
- Tool results require a `resultType` field (`"complete"` or `"input_required"`) and may include `structuredContent` + `outputSchema`.
- **Authorization** (OAuth 2.1) applies to HTTP servers only; stdio servers are exempt. See [authorization.md](authorization.md).
- **Deprecation timeline:** Roots, Sampling, and Logging are deprecated as of 2026-07-28. Earliest removal is the first spec revision on/after **2027-07-28**. Migrate now: pass dirs/files via tool params or resource URIs (Roots); integrate with LLM provider APIs directly (Sampling); use stderr or OpenTelemetry (Logging).

## Era terms used across this folder

- **Modern** — 2026-07-28 and later (stateless, `server/discover`, `@modelcontextprotocol/server`).
- **Legacy** — 2025-11-25 and earlier (stateful, `initialize` handshake, `@modelcontextprotocol/sdk`).
- **Dual-era** — code or prose that must handle both. This reference targets Modern only.