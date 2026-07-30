export declare const START_MARKER = "<!-- change-impact:start -->";
export declare const END_MARKER = "<!-- change-impact:end -->";
/**
 * Extract the marker-delimited block from LLM output.
 * Returns the block (with markers) or null if not found.
 */
export declare function extractBlock(text: string): string | null;
/**
 * Validate that a block starts with the start marker and ends with the end marker.
 */
export declare function validateBlock(block: string): boolean;
