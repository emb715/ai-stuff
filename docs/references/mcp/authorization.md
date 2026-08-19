---
title: "MCP Authorization (OAuth 2.1)"
status: draft
confidence: medium
last_tested: 2026-07-28
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - authorization
  - oauth
owner: "@emb715"
---

# MCP Authorization (OAuth 2.1)

**Source:** https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md
**Captured:** 2026-07-28
**Status:** `draft` — not yet validated against a real build. Captured from the specification only.

> This file is split from [architecture.md](architecture.md) because authorization applies **only to HTTP servers**. stdio servers are exempt. If you are building a local stdio server (like the `experiments/workflow-engine` MVP), you can skip this file.

---

## Context / problem

Under the 2026-07-28 spec, an MCP server exposed over Streamable HTTP is an **OAuth 2.1 resource server**. Clients obtain access tokens from an authorization server and present them to the MCP server. The MCP server does not issue tokens itself (unless it also acts as the AS, which is unusual).

The 2026-07-28 revision tightened the model with mandatory RFC 9728 (Protected Resource Metadata), preferred Client ID Metadata Documents over the deprecated RFC 7591 Dynamic Client Registration, and added iss-validation (RFC 9207) and the resource parameter (RFC 8707).

This reference captures the authorization model so a maintainer building a remote MCP server knows which RFCs to implement and where the pitfalls are.

## Scope

Covered:
- The OAuth 2.1 resource server model
- RFC 9728 Protected Resource Metadata (mandatory)
- Authorization Server discovery: RFC 8414 AS metadata or OIDC Discovery
- Client registration: Client ID Metadata Documents (preferred) vs RFC 7591 Dynamic Client Registration (deprecated)
- RFC 9207 `iss` parameter validation
- RFC 8707 `resource` parameter
- Step-up authentication
- stdio exemption

Not covered:
- TS SDK OAuth helper classes — **not captured**, see SDK docs
- Full token validation library recommendations — see RFC 9728 and your JWT library docs
- The legacy (2025-11-25) authorization model — superseded, not documented here

---

## Protected Resource Metadata (RFC 9728, mandatory)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

An MCP server acting as a resource server **MUST** publish a RFC 9728 Protected Resource Metadata document. This tells the client:

- The authorization server(s) it accepts tokens from
- The supported scopes
- The JWKS / token validation metadata

The client fetches this metadata to learn where to send the user for authorization and how the resource server will validate the token.

> RFC 9728 is **mandatory** under 2026-07-28. A remote MCP server that does not publish Protected Resource Metadata is non-compliant.

---

## Authorization Server discovery

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

The client discovers the Authorization Server's metadata via one of:

- **RFC 8414** — OAuth 2.0 Authorization Server Metadata
- **OIDC Discovery** — OpenID Connect Discovery (when the AS is also an OIDC provider)

The Protected Resource Metadata document points the client at the AS URL; the client then fetches AS metadata from that URL.

---

## Client registration

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

Two mechanisms, with a clear preference under 2026-07-28:

| Mechanism | Status | Notes |
|---|---|---|
| **Client ID Metadata Documents** | Preferred | The client publishes a metadata document describing itself; the AS reads it. Avoids the security issues of fully dynamic registration. |
| **RFC 7591 Dynamic Client Registration** | Deprecated | The AS registers the client programmatically. Deprecated under 2026-07-28; prefer Client ID Metadata Documents. |

If you are building a client, prefer publishing a Client ID Metadata Document over calling RFC 7591 registration.

---

## `iss` validation (RFC 9207)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

The authorization response includes an `iss` parameter identifying the AS. The client **MUST** validate `iss` against the AS it initiated the flow with, to prevent mix-up attacks across multiple AS configurations.

---

## `resource` parameter (RFC 8707)

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

The client sends a `resource` parameter in the authorization request identifying the MCP server (resource server) it wants a token for. This binds the issued token to the specific resource, preventing token replay against a different resource server.

---

## Step-up authentication

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

A resource server may require a higher level of assurance for sensitive operations. When a client calls a protected tool without sufficient assurance, the server responds with an error indicating step-up is required, and the client re-runs the authorization flow with the required parameters (e.g. stronger ACR, MFA prompt).

---

## stdio exemption

Normative source: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/index.md

**stdio servers SHOULD NOT follow this specification.** Authorization applies to Streamable HTTP servers. A stdio server runs locally under the user's own account; the transport itself is the trust boundary. Adding OAuth to a stdio server is unnecessary and not expected by clients.

> For the `experiments/workflow-engine` MVP (stdio), this entire file does not apply. It exists for the future remote-server case.

---

## Failure modes / boundaries

- **TS SDK OAuth helpers — NOT FETCHED.** How the `@modelcontextprotocol/server` TS SDK exposes OAuth resource-server middleware, token validation, or Protected Resource Metadata serving is **not captured** in this reference. See the SDK docs at https://github.com/modelcontextprotocol/typescript-sdk — not captured in this reference.
- **Token validation libraries** — this reference does not recommend a specific JWT/validation library. Follow RFC 9728 and your runtime's library guidance.
- **Confidence is `medium`** because this file is captured from the specification only and has not been validated against a real MCP-over-HTTP build with a working AS. Treat the RFC mappings as accurate (they are normative in the spec) but verify the SDK integration points before implementing.
- **Deprecated RFC 7591** — if you have an existing client using RFC 7591, it will keep working, but the spec now prefers Client ID Metadata Documents. Plan the migration.