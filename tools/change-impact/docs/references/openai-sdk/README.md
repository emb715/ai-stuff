# OpenAI SDK — Reference

| Resource | URL |
|---|---|
| Official repo | https://github.com/openai/openai-node |
| NPM | https://www.npmjs.com/package/openai |
| Docs | https://platform.openai.com/docs/api-reference |

## Scaffolding

```bash
bun add openai
```

## Key API

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // default env var
});

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },  // SKILL.md content
    { role: 'user', content: userPrompt },       // diff + context
  ],
  max_tokens: 4096,
});

const text = response.choices[0]?.message?.content ?? '';
```

## Detection pattern

```ts
// Priority 2: OPENAI_API_KEY env
if (process.env.OPENAI_API_KEY) {
  return { provider: 'openai', client: new OpenAI() };
}
```

## Cost-optimized models

- `gpt-4o-mini` — cheapest capable model
- `gpt-4o` — higher quality, higher cost