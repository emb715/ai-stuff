# @clack/prompts — Reference

| Resource | URL |
|---|---|
| Official repo | https://github.com/bombshell-dev/clack |
| NPM | https://www.npmjs.com/package/@clack/prompts |
| Docs | https://github.com/bombshell-dev/clack/blob/main/packages/prompts/README.md |

## Scaffolding

```bash
bun add @clack/prompts
```

## Key API (from Context7)

- `intro(message)` — start a prompt session
- `outro(message)` — end a prompt session
- `text({ message, placeholder, initialValue, validate })` — single-line input
- `select({ message, options: [{ value, label, hint?, disabled? }] })` — single choice
- `confirm({ message })` — boolean
- `group({ key: () => prompt, ... }, { onCancel })` — multi-prompt with cancel handling
- `multiselect({ message, options })` — multiple choice
- `isCancel(value)` — check if user cancelled a prompt

## Usage pattern for change-impact CLI

```ts
import * as p from '@clack/prompts';

intro('change-impact');

const llm = await p.select({
  message: 'Which LLM?',
  options: [
    { value: 'auto', label: 'Auto-detect', hint: 'default' },
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'ollama', label: 'Ollama (local)' },
    { value: 'none', label: 'None — output prompt bundle' },
  ],
});

if (p.isCancel(llm)) {
  p.cancel('Cancelled');
  process.exit(0);
}

outro(`Running with ${llm}...`);
```