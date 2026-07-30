export declare const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
/**
 * Call the Anthropic Messages API with a system + user prompt.
 * Returns the concatenated text content from the response.
 *
 * API key is read from process.env.ANTHROPIC_API_KEY (the SDK's default).
 */
export declare function callAnthropic(system: string, user: string, model?: string): Promise<string>;
