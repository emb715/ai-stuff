---
title: "MCP TypeScript Server — Scaffold and Patterns"
status: validated
confidence: high
last_tested: 2026-06-27
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - typescript
owner: "@ezequielbenitez"
---

# MCP TypeScript Server

**Source:** https://modelcontextprotocol.io/docs/develop/build-server (TypeScript tab)
**Captured:** 2026-06-27

---

## Dependencies

```bash
npm install @modelcontextprotocol/sdk zod@3
npm install -D @types/node typescript
```

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
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

**Critical**: use `console.error()` for all logging. `console.log()` writes to stdout and corrupts JSON-RPC messages.

---

## Tool registration pattern

```typescript
server.registerTool(
  "tool_name",
  {
    description: "What this tool does",
    inputSchema: {
      param_one: z.string().describe("Description of param"),
      param_two: z.number().optional().describe("Optional param"),
    },
  },
  async ({ param_one, param_two }) => {
    // tool logic here
    return {
      content: [{ type: "text", text: "result string" }],
    };
  },
);
```

Zod schemas map directly to JSON Schema for `inputSchema`. Use `.describe()` on each field.

---

## Workflow-engine scaffold

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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
    inputSchema: { workflow_id: z.string().describe("Workflow identifier") },
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
    inputSchema: {
      workflow_id: z.string(),
      step_index: z.number(),
      output: z.string().describe("Session output text"),
    },
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
    inputSchema: { workflow_id: z.string() },
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
    inputSchema: { workflow_id: z.string() },
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
