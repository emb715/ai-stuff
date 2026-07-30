export const DEFAULT_OLLAMA_MODEL = "gemma3";
export const OLLAMA_BASE_URL = "http://localhost:11434";

/** Timeout for availability detection (ms). */
export const OLLAMA_DETECT_TIMEOUT_MS = 2000;

interface OllamaChatResponse {
	message?: { content?: string };
}

interface OllamaTagsResponse {
	models?: Array<{ name: string }>;
}

/**
 * Check whether an Ollama server is running locally by hitting /api/tags
 * with a short timeout. Returns true if the server responds ok.
 */
export async function isOllamaAvailable(
	baseUrl: string = OLLAMA_BASE_URL,
): Promise<boolean> {
	try {
		const res = await fetch(`${baseUrl}/api/tags`, {
			signal: AbortSignal.timeout(OLLAMA_DETECT_TIMEOUT_MS),
		});
		return res.ok;
	} catch {
		return false;
	}
}

/**
 * List installed Ollama models. Returns [] if the server is not reachable.
 */
export async function listOllamaModels(
	baseUrl: string = OLLAMA_BASE_URL,
): Promise<string[]> {
	try {
		const res = await fetch(`${baseUrl}/api/tags`, {
			signal: AbortSignal.timeout(OLLAMA_DETECT_TIMEOUT_MS),
		});
		if (!res.ok) return [];
		const data = (await res.json()) as OllamaTagsResponse;
		return (data.models ?? []).map((m) => m.name);
	} catch {
		return [];
	}
}

/**
 * Call a local Ollama server via the /api/chat endpoint.
 * Uses stream: false so the full response is returned in one shot.
 * Model defaults to gemma3.
 */
export async function callOllama(
	system: string,
	user: string,
	model: string = DEFAULT_OLLAMA_MODEL,
	baseUrl: string = OLLAMA_BASE_URL,
): Promise<string> {
	const res = await fetch(`${baseUrl}/api/chat`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model,
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
			stream: false,
		}),
	});

	if (!res.ok) {
		throw new Error(
			`ollama /api/chat failed: ${res.status} ${res.statusText}`,
		);
	}

	const data = (await res.json()) as OllamaChatResponse;
	return data.message?.content ?? "";
}