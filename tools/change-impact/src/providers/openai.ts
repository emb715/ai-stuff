import OpenAI from "openai";

export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

/** Default OpenAI API base URL when OPENAI_BASE_URL is not set. */
export const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";

/**
 * Options for an OpenAI-compatible chat completions call.
 * Any provider that speaks the OpenAI Chat Completions API shape can be
 * reached through this (OpenAI itself, Fuelix AI, Omniroute, Ollama's /v1
 * endpoint, or any custom OpenAI-compatible gateway).
 */
export interface OpenAICompatOptions {
	apiKey: string;
	baseURL: string;
	model: string;
}

/**
 * Call an OpenAI-compatible Chat Completions endpoint with a system + user
 * prompt. Returns the assistant message content.
 *
 * The caller supplies the API key, base URL, and model so this function is
 * provider-agnostic — the registry in core/llm.ts maps each known provider
 * to these options.
 */
export async function callOpenAICompat(
	system: string,
	user: string,
	opts: OpenAICompatOptions,
): Promise<string> {
	const client = new OpenAI({
		apiKey: opts.apiKey,
		baseURL: opts.baseURL,
	});

	const response = await client.chat.completions.create({
		model: opts.model,
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: user },
		],
		max_tokens: 4096,
	});

	return response.choices[0]?.message?.content ?? "";
}

/**
 * Backward-compatible wrapper: calls the OpenAI Chat Completions API using
 * OPENAI_API_KEY and (optionally) OPENAI_BASE_URL from the environment.
 *
 * Prefer `callOpenAICompat` for new code paths so the provider config is
 * explicit instead of read implicitly from env.
 */
export async function callOpenAI(
	system: string,
	user: string,
	model: string = DEFAULT_OPENAI_MODEL,
): Promise<string> {
	return callOpenAICompat(system, user, {
		apiKey: process.env.OPENAI_API_KEY ?? "",
		baseURL: process.env.OPENAI_BASE_URL ?? DEFAULT_OPENAI_BASE_URL,
		model,
	});
}