import { writeFile } from "node:fs/promises";

/**
 * Write a self-contained prompt bundle to a markdown file.
 * The bundle contains the system prompt (SKILL.md content), the user prompt
 * (diff + instructions), and directions to paste into any LLM session.
 *
 * Used when no LLM provider is available (the `none` / fallback path).
 */
export async function writePromptBundle(
	system: string,
	user: string,
	outputPath: string,
): Promise<void> {
	const content = `# Change-impact prompt bundle

No LLM provider was detected. To produce the change-impact block manually,
paste the two sections below into any LLM session (Claude, ChatGPT, Gemini,
etc.) and copy the block it returns between the \`<!-- change-impact:start -->\`
and \`<!-- change-impact:end -->\` markers.

## How to use

1. Copy the **System prompt** section below and paste it as the system prompt
   (or as your first message if the chat does not support a system role).
2. Copy the **User prompt** section below and paste it as your next message.
3. Ask the model to produce the change-impact block per the skill spec.
4. Copy everything between (and including) the start/end markers into your
   PR description.

---

## System prompt

\`\`\`markdown
${system}
\`\`\`

---

## User prompt

\`\`\`markdown
${user}
\`\`\`
`;

	await writeFile(outputPath, content, "utf8");
}