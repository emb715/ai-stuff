# Anthropic SDK TypeScript — Reference

| Resource | URL |
|---|---|
| Official repo | https://github.com/anthropics/anthropic-sdk-typescript |
| NPM | https://www.npmjs.com/package/@anthropic-ai/sdk |
| Docs | https://docs.anthropic.com/en/api |

## Scaffolding

```bash
bun add @anthropic-ai/sdk
```

## Key API (from Context7)

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // default env var
});

const message = await client.messages.create({
  max_tokens: 4096,
  system: systemPrompt,  // SKILL.md content
  messages: [{ role: 'user', content: userPrompt }],  // diff + context
  model: 'claude-sonnet-4-20250514',
});

// Response is in message.content (array of content blocks)
const text = message.content
  .filter(b => b.type === 'text')
  .map(b => b.text)
  .join('');
```

## Detection pattern

```ts
// Priority 1: ANTHROPIC_API_KEY env
if (process.env.ANTHROPIC_API_KEY) {
  return { provider: 'anthropic', client: new Anthropic() };
}
```

## Cost-optimized model for this use case

- `claude-sonnet-4-20250514` — good balance of quality + cost
- `claude-3-5-haiku-20241022` — cheapest, acceptable for small diffs