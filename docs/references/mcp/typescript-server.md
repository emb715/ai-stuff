# MCP TypeScript Server

Source: https://modelcontextprotocol.io/quickstart/server (TypeScript tab)
Captured: 2026-06-25

## Scaffold

```bash
mkdir my-server
cd my-server
npm init -y
npm install @modelcontextprotocol/sdk zod@3
npm install -D @types/node typescript
mkdir src
touch src/index.ts
```

## package.json (required fields)

```json
{
  "type": "module",
  "bin": { "my-server": "./build/index.js" },
  "scripts": { "build": "tsc && chmod 755 build/index.js" },
  "files": ["build"]
}
```

## tsconfig.json

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
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Minimal server (src/index.ts)

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});

// Register a tool
server.registerTool(
  "tool_name",
  {
    description: "What this tool does",
    inputSchema: {
      param: z.string().describe("Description of param"),
    },
  },
  async ({ param }) => {
    // tool logic here
    return {
      content: [{ type: "text", text: `Result: ${param}` }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Server running on stdio"); // stderr only — never stdout
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

## Build and run

```bash
npm run build
node build/index.js
```

## Register with OpenCode (opencode.json)

```json
{
  "mcp": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/build/index.js"]
    }
  }
}
```

## Register with Claude Desktop (claude_desktop_config.json)

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/build/index.js"]
    }
  }
}
```

## Critical rules

- Never `console.log()` in stdio servers — writes to stdout, breaks JSON-RPC
- Use `console.error()` for all logging
- All state must be managed externally — MCP provides no persistence
- Tool names must be unique within the server
- `inputSchema` uses Zod validators — required fields must be non-optional
