import type { DiffResult } from "./diff.js";

export interface AssembledPrompt {
	system: string;
	user: string;
}

/**
 * Assemble the system prompt (skill content) and user prompt (diff + context).
 * The system prompt is the SKILL.md content — the skill IS the prompt.
 * The user prompt is the diff + instructions to produce the block.
 */
export function assemblePrompt(
	skillContent: string,
	diff: DiffResult,
	repoContext?: string,
): AssembledPrompt {
	const truncationNote = diff.truncated
		? "\n\n> **Note:** The diff was truncated for token budget. Only files with >50 line changes are included in full. The `--stat` output above shows all changed files."
		: "";

	const contextSection = repoContext
		? `\n\n## Repo context\n${repoContext}`
		: "";

	const user = `## Diff context

- **Base:** \`${diff.baseSha}\`
- **Head:** \`${diff.headSha}\`

## Diff stat

\`\`\`\n${diff.stat}\n\`\`\`${truncationNote}${contextSection}

## Diff

\`\`\`diff\n${diff.full}\n\`\`\`

## Instructions

Produce the change-impact block following the skill's block format spec exactly. The block must be wrapped in \`<!-- change-impact:start -->\` and \`<!-- change-impact:end -->\` markers. Include the \`### Change impact\` heading, the shields badges line, and the \`<details>\` wrapper per the spec. Use the real base/head SHAs provided above in the block's \`**Base:**\` and \`**Head:**\` fields — do not invent placeholder SHAs. Omit any diagram that has no grounded edges.`;

	return {
		system: skillContent,
		user,
	};
}