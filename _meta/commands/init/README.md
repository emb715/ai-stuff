# init — Session Initializer

Universal session opener. Paste into any LLM interface at the start of a vault session.

## When to use

Every session. Works in OpenCode, Claude.ai, Cursor, or any other interface.

## What it does

1. Reads `AGENTS.md` and `README.md`
2. Orients the LLM to vault taxonomy and lifecycle model
3. Classifies session intent
4. Routes to the correct framebook procedure
5. Enforces "check before building"

## File

`command.md` — copy the contents and paste as your first message.

## Related

- `vault-start/` — OpenCode slash command version of this flow
- `_meta/framebook/start-session/` — the underlying procedure
