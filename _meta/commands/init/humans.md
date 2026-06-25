# humans.md — init

## Origin

Created as the universal session opener for any LLM tool, not just OpenCode. Works as a paste-in prompt for Claude.ai, Cursor, or any other interface.

## Design decisions

- Does not start work — orients first, then routes. Prevents the LLM from jumping into file creation before understanding the vault structure.
- Reads AGENTS.md first because that file contains the full operating contract. README.md is second because it is the directory map.
- "Do not create files until intent is confirmed" is explicit to prevent premature artifact creation.
- Asks for session classification before anything else — the single most effective way to prevent wrong routing.

## Maintenance notes

- If new folders are added to the vault, update the orientation list in command.md.
- Keep this prompt short — it is loaded at session start and contributes to the context window.
