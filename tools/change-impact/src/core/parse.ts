export const START_MARKER = "<!-- change-impact:start -->";
export const END_MARKER = "<!-- change-impact:end -->";

/**
 * Extract the marker-delimited block from LLM output.
 * Returns the block (with markers) or null if not found.
 */
export function extractBlock(text: string): string | null {
	const startIndex = text.indexOf(START_MARKER);
	const endIndex = text.indexOf(END_MARKER);

	if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
		return null;
	}

	// Include the end marker's length
	const block = text.slice(startIndex, endIndex + END_MARKER.length);
	return block.trim();
}

/**
 * Validate that a block starts with the start marker and ends with the end marker.
 */
export function validateBlock(block: string): boolean {
	const trimmed = block.trim();
	return (
		trimmed.startsWith(START_MARKER) && trimmed.endsWith(END_MARKER)
	);
}