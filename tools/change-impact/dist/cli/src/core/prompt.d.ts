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
export declare function assemblePrompt(skillContent: string, diff: DiffResult, repoContext?: string): AssembledPrompt;
