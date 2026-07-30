---
title: "MCP Tools"
status: validated
confidence: high
last_tested: 2026-06-27
scope: personal
tooling:
  - "repo-process/v1"
tags:
  - references
  - mcp
  - tools
owner: "@emb715"
---

# MCP Tools

**Source:** https://modelcontextprotocol.io/docs/concepts/tools
**Captured:** 2026-06-27

---

## Tool definition schema

```json
{
  "name": "get_weather",
  "title": "Weather Information Provider",
  "description": "Get current weather information for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or zip code"
      }
    },
    "required": ["location"]
  },
  "outputSchema": { }
}
```

Fields:
- `name` — unique identifier, used in `tools/call`
- `title` — human-readable display name (optional)
- `description` — what it does and when to use it
- `inputSchema` — JSON Schema for input validation
- `outputSchema` — optional JSON Schema for structured output validation

---

## Protocol messages

### List tools

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }
```

### Call a tool

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": { "location": "New York" }
  }
}
```

### Tool response

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [{ "type": "text", "text": "Current weather..." }],
    "isError": false
  }
}
```

---

## Content types in responses

- `text` — plain string
- `image` — base64 encoded, with mimeType
- `audio` — base64 encoded, with mimeType
- `resource_link` — URI to a resource
- `resource` — embedded resource with content inline

For structured output:

```json
{
  "result": {
    "content": [{ "type": "text", "text": "{\"temperature\": 22.5}" }],
    "structuredContent": { "temperature": 22.5 }
  }
}
```

---

## Error handling

**Protocol errors** (unknown tool, invalid args):

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": { "code": -32602, "message": "Unknown tool: invalid_tool_name" }
}
```

**Tool execution errors** (business logic, API failures):

```json
{
  "result": {
    "content": [{ "type": "text", "text": "Failed: API rate limit exceeded" }],
    "isError": true
  }
}
```

---

## Workflow-engine tool schemas

Based on the experiment's state model, the 4 MVP tools map to:

### `get_current_step`

```json
{
  "name": "get_current_step",
  "description": "Return current step type and generated prompt for the active workflow",
  "inputSchema": {
    "type": "object",
    "properties": {
      "workflow_id": { "type": "string", "description": "Workflow identifier" }
    },
    "required": ["workflow_id"]
  }
}
```

### `report_step_output`

```json
{
  "name": "report_step_output",
  "description": "Session posts its output for the current step",
  "inputSchema": {
    "type": "object",
    "properties": {
      "workflow_id": { "type": "string" },
      "step_index": { "type": "integer" },
      "output": { "type": "string", "description": "Session output text" }
    },
    "required": ["workflow_id", "step_index", "output"]
  }
}
```

### `advance_step`

```json
{
  "name": "advance_step",
  "description": "Evaluate step output and advance workflow if conditions are met",
  "inputSchema": {
    "type": "object",
    "properties": {
      "workflow_id": { "type": "string" }
    },
    "required": ["workflow_id"]
  }
}
```

### `get_workflow_status`

```json
{
  "name": "get_workflow_status",
  "description": "Return full workflow state snapshot",
  "inputSchema": {
    "type": "object",
    "properties": {
      "workflow_id": { "type": "string" }
    },
    "required": ["workflow_id"]
  }
}
```
