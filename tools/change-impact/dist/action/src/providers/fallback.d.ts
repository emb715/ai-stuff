/**
 * Write a self-contained prompt bundle to a markdown file.
 * The bundle contains the system prompt (SKILL.md content), the user prompt
 * (diff + instructions), and directions to paste into any LLM session.
 *
 * Used when no LLM provider is available (the `none` / fallback path).
 */
export declare function writePromptBundle(system: string, user: string, outputPath: string): Promise<void>;
