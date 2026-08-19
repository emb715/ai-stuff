---
title: "MCP TypeScript Server — Scaffold and Patterns"
status: validated
confidence: high
last_tested: 2026-07-28
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - typescript
owner: "@emb715"
---

# MCP TypeScript Server

**Source:** https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server (TypeScript tab)
**Captured:** 2026-07-28

> The TS SDK package was **renamed** in the 2026-07-28 cycle: `@modelcontextprotocol/sdk` → `@modelcontextprotocol/server`. Import paths no longer use `.js` extensions. If you are upgrading an existing project, both the package name and the import statements must change.

---

## Dependencies

```bash
npm install @modelcontextprotocol/server zod
npm install -D @types/node typescript
```

> The 2026-07-28 quickstart pins bare `zod` (the legacy quickstart pinned `zod@3`). Verify the exact version requirement against the SDK's current `package.json` — **not captured in this reference**.

## Project setup

```json
{
  "type": "module",
  "bin": { "server": "./build/index.js" },
  "scripts": { "build": "tsc && chmod 755 build/index.js" }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Server scaffold (stdio)

```typescript
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const server = new McpServer({
  name: "workflow-engine",
  version: "1.0.0",
});

// Register tools here

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Workflow Engine MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

**Critical**: use `console.error()` for all logging. `console.log()` writes to stdout and corrupts JSON-RPC messages. (Under 2026-07-28, the legacy `logging/setLevel` RPC is removed; per-request log level is conveyed via `io.modelcontextprotocol/logLevel` in `_meta`. For a stdio server, `console.error` to stderr is the recommended migration path — see [architecture.md § Deprecations](architecture.md).)

---

## Tool registration pattern

The 2026-07-28 quickstart wraps `inputSchema` in `z.object({...})` — the previous bare-object form (`{ param: z.string() }`) is no longer the documented pattern.

```typescript
server.registerTool(
  "tool_name",
  {
    description: "What this tool does",
    inputSchema: z.object({
      param_one: z.string().describe("Description of param"),
      param_two: z.number().optional().describe("Optional param"),
    }),
  },
  async ({ param_one, param_two }) => {
    // tool logic here
    return {
      content: [{ type: "text", text: "result string" }],
    };
  },
);
```

Verbatim from the 2026-07-28 spec quickstart:

```typescript
server.registerTool(
  "get_alerts",
  {
    description: "Get weather alerts for a state",
    inputSchema: z.object({
      state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
    }),
  },
  async ({ state }) => {
    // ...
    return { content: [{ type: "text", text: alertsText }] };
  },
);
```

Zod schemas map to **JSON Schema 2020-12** (the default dialect as of SEP-2106). `$ref` must not auto-dereference network URIs; composition keywords need resource bounds. See [architecture.md § JSON Schema usage](architecture.md).

### Result shape notes (2026-07-28)

- **`resultType`** is required on all results (`"complete"` or `"input_required"`). The handler return shape above is still valid for the common synchronous case; the SDK is expected to set `resultType: "complete"` on your behalf. **See SDK docs for how the SDK surfaces `resultType` on `McpServer` handlers — not captured in this reference.**
- **`structuredContent`** + **`outputSchema`**: a tool may return typed structured content alongside the `content` array, with an `outputSchema` declaring its shape. **See SDK docs for the `McpServer` API to declare `outputSchema` — not captured in this reference.**
- **`isError`**: tool results may set `isError: true` to signal an execution error (distinct from a JSON-RPC error). **See SDK docs for the handler return field — not captured in this reference.**
- **Tool annotations** (`title`, `annotations`, `icons`): the 2026-07-28 spec allows a `title`, an `annotations` object, and an `icons` array on tools. **See SDK docs for how `registerTool` accepts these — not captured in this reference.**

---

## Workflow-engine scaffold

The scaffold below is updated for the renamed package, the new import paths, and the `z.object({...})` `inputSchema` wrapper. The tool set is unchanged: `get_current_step`, `report_step_output`, `advance_step`, `get_workflow_status`.

```typescript
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { readFileSync, writeFileSync } from "fs";

const server = new McpServer({ name: "workflow-engine", version: "0.1.0" });

const STATE_FILE = "./workflow-state.json";

function loadState() {
  try { return JSON.parse(readFileSync(STATE_FILE, "utf-8")); }
  catch { return {}; }
}

function saveState(state: object) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

server.registerTool(
  "get_current_step",
  {
    description: "Return current step type and generated prompt for the active workflow",
    inputSchema: z.object({
      workflow_id: z.string().describe("Workflow identifier"),
    }),
  },
  async ({ workflow_id }) => {
    const state = loadState();
    const workflow = state[workflow_id];
    if (!workflow) return { content: [{ type: "text", text: `Workflow ${workflow_id} not found` }] };
    const step = workflow.steps[workflow.current_step_index];
    return { content: [{ type: "text", text: JSON.stringify(step, null, 2) }] };
  },
);

server.registerTool(
  "report_step_output",
  {
    description: "Session posts its output for the current step",
    inputSchema: z.object({
      workflow_id: z.string(),
      step_index: z.number(),
      output: z.string().describe("Session output text"),
    }),
  },
  async ({ workflow_id, step_index, output }) => {
    const state = loadState();
    state[workflow_id].steps[step_index].output = output;
    state[workflow_id].steps[step_index].status = "done";
    saveState(state);
    return { content: [{ type: "text", text: "Output recorded" }] };
  },
);

server.registerTool(
  "advance_step",
  {
    description: "Evaluate step output and advance workflow if conditions met",
    inputSchema: z.object({
      workflow_id: z.string(),
    }),
  },
  async ({ workflow_id }) => {
    const state = loadState();
    const workflow = state[workflow_id];
    const current = workflow.steps[workflow.current_step_index];
    if (current.status !== "done") {
      return { content: [{ type: "text", text: "Current step not done yet" }] };
    }
    workflow.current_step_index += 1;
    if (workflow.current_step_index >= workflow.steps.length) {
      workflow.status = "done";
    }
    saveState(state);
    return { content: [{ type: "text", text: `Advanced to step ${workflow.current_step_index}` }] };
  },
);

server.registerTool(
  "get_workflow_status",
  {
    description: "Return full workflow state snapshot",
    inputSchema: z.object({
      workflow_id: z.string(),
    }),
  },
  async ({ workflow_id }) => {
    const state = loadState();
    return { content: [{ type: "text", text: JSON.stringify(state[workflow_id], null, 2) }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Workflow Engine MCP running");
}

main().catch((e) => { console.error(e); process.exit(1); });
```

### Stateless design note (why `workflow_id` is a tool arg)

Under the 2026-07-28 stateless model, the server holds **no connection state**. Every request must be self-contained. The `workflow_id` argument on every tool is therefore **not** a workaround — it is **the required pattern** for any tool that operates on server-side state that must persist across calls.

Normative reference: https://modelcontextprotocol.io/specification/2026-07-28/server/tools.md#stateful-tools — a "stateful tool" under Modern MCP is one that uses an explicit handle (like `workflow_id`) to address server-side state. It is **not** a tool that relies on connection/session state (that model no longer exists).

The `experiments/workflow-engine` scaffold was already correct on this point before the rewrite. The only changes required were mechanical: package name, import paths, and the `z.object({...})` wrapper.

---

## Running

```bash
npm run build
node build/index.js
```

Register in OpenCode or Claude Desktop config:

```json
{
  "mcpServers": {
    "workflow-engine": {
      "command": "node",
      "args": ["/absolute/path/to/workflow-engine/build/index.js"]
    }
  }
}
```

---

## Failure modes / boundaries (NOT FETCHED)

The following SDK surfaces are **not captured** in this reference. Do not infer their shapes from the scaffold above. See the SDK docs at https://github.com/modelcontextprotocol/typescript-sdk — not captured in this reference.

- **`outputSchema`, `annotations`, `title`, `icons`** — the `registerTool` options for these are not captured. See SDK docs.
- **`InputRequiredResult` on `McpServer`** — how the TS SDK surfaces MRTR (`resultType: "input_required"`, `inputRequests`, `requestState`) is not captured. See SDK docs.
- **Low-level `Server` class** — whether a low-level `Server` class exists in the renamed `@modelcontextprotocol/server` package is not captured. See SDK docs.
- **Streamable HTTP server transport** — the class name and import path for an HTTP server transport in the TS SDK are not captured. See SDK docs.
- **`_meta` auto-injection** — whether the SDK automatically injects `io.modelcontextprotocol/protocolVersion` and `clientCapabilities` into `_meta` on outgoing requests is not captured. See SDK docs.
- **`server/discover` auto-implementation** — whether the SDK auto-implements the mandatory `server/discover` RPC is not captured. See SDK docs.
- **Tasks extension SDK helpers** — the TS SDK helpers for the `io.modelcontextprotocol/tasks` extension are not captured. See [extensions.md](extensions.md) and the SDK docs.
- **`zod` version requirement** — the 2026-07-28 quickstart says bare `zod`; the legacy quickstart said `zod@3`. Verify against the SDK's current `package.json`.