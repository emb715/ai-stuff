# Ollama HTTP API — Reference

| Resource | URL |
|---|---|
| Official repo | https://github.com/ollama/ollama |
| API docs | https://github.com/ollama/ollama/blob/main/docs/api.md |
| NPM (optional) | https://www.npmjs.com/package/ollama |

## Scaffolding

No SDK required — Ollama runs a local HTTP server. Use `fetch` directly.

## Key API

```ts
// POST http://localhost:11434/api/chat
const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma3',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    stream: false,
  }),
});

const data = await response.json();
const text = data.message?.content ?? '';
```

## Detection pattern

```ts
// Priority 6: Ollama running locally
try {
  const res = await fetch('http://localhost:11434/api/tags', {
    signal: AbortSignal.timeout(2000),
  });
  if (res.ok) {
    const { models } = await res.json();
    return { provider: 'ollama', models: models.map(m => m.name) };
  }
} catch { /* not running */ }
```

## CLI shelling alternatives (no SDK)

For claude/copilot/codex CLIs, shell out:

```ts
import { execFileSync } from 'node:child_process';

const output = execFileSync('claude', ['--print', prompt], { encoding: 'utf8' });
```