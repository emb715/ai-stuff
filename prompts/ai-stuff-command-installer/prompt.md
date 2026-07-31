You are an installer. Register a custom command named `/ai-stuff` in your own harness. The command loads the artifact-browsing flow from a public AI knowledge vault.

## What the command does

When the user types `/ai-stuff`, your harness reads a USAGE document from the vault and follows its flow exactly: verify the inventory against a task map, output a numbered menu of available artifacts (prompts, playbooks, skills, tools), wait for the user to pick one or more numbers, then deliver the chosen artifact's consumable file content in a code block.

## Install steps

### 1. Choose the source

The USAGE document lives in a public repo. Two ways to fetch it:

**Remote (default):** Fetch from the public URL:
```
https://raw.githubusercontent.com/emb715/ai-stuff/main/USAGE.md
```

**Local (if a clone exists):** Read the file at `<clone-root>/USAGE.md`. Ask the user for the absolute path to the clone if not already in one.

Ask the user: "Remote install (fetch from GitHub) or local install (read from a clone on disk)?" Default to remote if no answer.

### 2. Read the USAGE document

Fetch the USAGE document from the chosen source and read it fully. It contains:
- Step 0: how to resolve the vault root and prefix paths
- Step 1: how to verify the inventory (`ls prompts/ playbooks/ skills/ tools/`)
- Step 2: the menu output format (markdown, grouped, globally numbered)
- Step 3: wait for selection
- Step 4: deliver the chosen artifact's consumable file
- A task map table for cross-checking

### 3. Register the command

Register `/ai-stuff` in your harness's command system. The command body is:

```
Fetch and follow USAGE.md from the ai-stuff vault exactly. Do not summarize. Do not improvise the flow. Read the full document before producing any output.
```

How you register depends on your harness:
- **OpenCode:** create a `.opencode/command/ai-stuff.md` file in the current project or `~/.config/opencode/command/ai-stuff.md` for global use. The file body is the command text above.
- **Claude Code:** add a slash command via the harness's custom-command mechanism. The command body is the command text above.
- **Cursor / other:** follow the harness's custom-command or prompt-snippet mechanism. The command body is the command text above.

If your harness has no custom-command mechanism, fall back to: instruct the user to paste the USAGE document directly into a fresh session. Provide the raw URL so they can fetch it.

### 4. Verify

After registration, confirm to the user:
- The source chosen (remote URL or local path)
- The command name (`/ai-stuff`)
- The harness location where the command was registered
- A one-line instruction: "Type /ai-stuff to browse and consume vault artifacts."

Do not run `/ai-stuff` yourself during install. The user triggers it after install completes.

## Stop condition

Install is complete when the command is registered and confirmed. If registration fails (harness has no command mechanism, permission denied, fetch error), report the failure and the fallback (paste USAGE.md manually).