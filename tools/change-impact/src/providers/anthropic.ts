import Anthropic from "@anthropic-ai/sdk";

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

/**
 * Call the Anthropic Messages API with a system + user prompt.
 * Returns the concatenated text content from the response.
 *
 * API key is read from process.env.ANTHROPIC_API_KEY (the SDK's default).
 */
export async function callAnthropic(
	system: string,
	user: string,
	model: string = DEFAULT_ANTHROPIC_MODEL,
): Promise<string> {
	const client = new Anthropic({
		apiKey: process.env.ANTHROPIC_API_KEY,
	});

	const message = await client.messages.create({
		max_tokens: 4096,
		system,
		messages: [{ role: "user", content: user }],
		model,
	});

	const text = message.content
		.filter((b) => b.type === "text")
		.map((b) => {
			if (b.type === "text") {
				return b.text;
			}
			return "";
		})
		.join("");

	return text;
}