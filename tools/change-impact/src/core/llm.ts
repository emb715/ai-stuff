import { callAnthropic } from "../providers/anthropic.js";
import { callOpenAICompat } from "../providers/openai.js";
import { callOllama, isOllamaAvailable, OLLAMA_BASE_URL } from "../providers/ollama.js";
import { callCli, isCliAvailable } from "../providers/cli.js";

/**
 * A detected LLM provider. `call(system, user)` returns the raw model output.
 */
export interface LLMProvider {
	name: string;
	call(system: string, user: string): Promise<string>;
}

export interface DetectOptions {
	/**
	 * Force a specific provider instead of auto-detecting.
	 * Accepted values: "anthropic", "openai", "fuelix", "omniroute",
	 * "ollama", "claude", "none".
	 * "none" returns null so the caller falls back to the prompt-bundle path.
	 */
	force?: string;
}

/**
 * Configuration for an OpenAI-compatible provider (Chat Completions API
 * shape, reachable via the `openai` SDK with a custom baseURL).
 *
 * Anthropic is intentionally NOT in this registry — it has its own SDK and
 * API shape and stays as a separate provider.
 */
interface ProviderConfig {
	name: string;
	envVar: string;
	altEnvVar?: string; // fallback env var name (e.g. FUELX/FUELIX naming variant)
	baseURL: string;
	defaultModel: string;
}

/**
 * Registry of known OpenAI-compatible providers, ordered by detection
 * priority. The first entry whose `envVar` is set in the environment wins.
 *
 * Note: Ollama does not require an API key, so it is detected separately via
 * `isOllamaAvailable` (a localhost reachability check) rather than through
 * this registry. It is still listed here so `--llm ollama` / `force:
 * "ollama"` can resolve its config through the same lookup as the others.
 */
const OPENAI_COMPATIBLE: ProviderConfig[] = [
	{ name: "fuelix", envVar: "FUELX_API_KEY", altEnvVar: "FUELIX_API_KEY", baseURL: "https://api.fuelix.ai/v1", defaultModel: "gpt-4o-mini" },
	{ name: "omniroute", envVar: "OMNIROUTE_API_KEY", baseURL: "https://api.omniroute.ai/v1", defaultModel: "gpt-4o-mini" },
	{ name: "openai", envVar: "OPENAI_API_KEY", baseURL: "https://api.openai.com/v1", defaultModel: "gpt-4o-mini" },
	{ name: "ollama", envVar: "OLLAMA_API_KEY", baseURL: "http://localhost:11434/v1", defaultModel: "gemma3" },
];

/** Find a registered OpenAI-compatible provider config by name. */
function findProviderConfig(name: string): ProviderConfig | undefined {
	return OPENAI_COMPATIBLE.find((p) => p.name === name);
}

/** Build an OpenAI-compatible provider wrapper for the given config. */
function openaiCompatProvider(config: ProviderConfig, apiKey: string): LLMProvider {
	return {
		name: config.name,
		call: (system, user) =>
			callOpenAICompat(system, user, {
				apiKey,
				baseURL: config.baseURL,
				model: config.defaultModel,
			}),
	};
}

/** Build an Anthropic provider wrapper. */
function anthropicProvider(): LLMProvider {
	return {
		name: "anthropic",
		call: (system, user) => callAnthropic(system, user),
	};
}

/** Build a claude-CLI provider wrapper. */
function claudeCliProvider(): LLMProvider {
	return {
		name: "claude",
		call: (_system, user) => {
			// The claude CLI takes a single prompt via --print. We prepend the
			// system prompt so the model sees both, since the CLI has no
			// separate system channel.
			const prompt = `${_system}\n\n${user}`;
			return Promise.resolve(callCli("claude", prompt));
		},
	};
}

/** Build an Ollama provider wrapper (raw /api/chat fetch path). */
function ollamaProvider(): LLMProvider {
	return {
		name: "ollama",
		call: (system, user) => callOllama(system, user),
	};
}

/**
 * Detect an available LLM provider in priority order:
 *   1. ANTHROPIC_API_KEY env (Anthropic SDK)
 *   2. FUELX_API_KEY env (OpenAI-compatible → Fuelix AI)
 *   3. OMNIROUTE_API_KEY env (OpenAI-compatible → Omniroute)
 *   4. OPENAI_API_KEY env (OpenAI-compatible → OpenAI)
 *   5. OPENAI_API_KEY + OPENAI_BASE_URL env (OpenAI-compatible custom endpoint)
 *   6. `claude` CLI in PATH
 *   7. ollama running on localhost:11434
 *   8. null (no provider — caller should use the fallback prompt bundle)
 *
 * If `opts.force` is provided, detection is skipped and that provider is
 * returned (or null for "none"). A forced provider that is not actually
 * available will throw on `call()` — callers get a clear runtime error
 * instead of silently selecting a different provider.
 */
export async function detectLLM(
	opts?: DetectOptions,
): Promise<LLMProvider | null> {
	if (opts?.force) {
		return forceProvider(opts.force);
	}

	// 1. Anthropic API key
	if (process.env.ANTHROPIC_API_KEY) {
		return anthropicProvider();
	}

	// 2-4. OpenAI-compatible providers (registry-based, in priority order)
	for (const config of OPENAI_COMPATIBLE) {
		// Ollama has no key requirement; detect it via reachability below (7).
		if (config.name === "ollama") continue;
		// Check the primary env var, or a fallback (for FUELX/FUELIX naming variant)
		const key = process.env[config.envVar] || process.env[config.altEnvVar || ""];
		if (key) {
			return openaiCompatProvider(config, key);
		}
	}

	// 5. OpenAI with a custom base URL (any OpenAI-compatible gateway)
	if (process.env.OPENAI_API_KEY && process.env.OPENAI_BASE_URL) {
		return openaiCompatProvider(
			{
				name: "openai-custom",
				envVar: "OPENAI_API_KEY",
				baseURL: process.env.OPENAI_BASE_URL,
				defaultModel: "gpt-4o-mini",
			},
			process.env.OPENAI_API_KEY,
		);
	}

	// 6. claude CLI in PATH
	if (isCliAvailable("claude")) {
		return claudeCliProvider();
	}

	// 7. ollama on localhost
	if (await isOllamaAvailable(OLLAMA_BASE_URL)) {
		return ollamaProvider();
	}

	// 8. nothing available
	return null;
}

/** Resolve a forced provider name to a provider object (or null for "none"). */
function forceProvider(force: string): LLMProvider | null {
	switch (force) {
		case "anthropic":
			return anthropicProvider();
		case "openai": {
			const cfg = findProviderConfig("openai")!;
			const key = process.env[cfg.envVar] ?? "";
			return openaiCompatProvider(cfg, key);
		}
		case "fuelix": {
			const key = process.env.FUELX_API_KEY || process.env.FUELIX_API_KEY;
			if (!key) throw new Error("no FUELX_API_KEY or FUELIX_API_KEY in env");
			return openaiCompatProvider(findProviderConfig("fuelix")!, key);
		}
		case "omniroute": {
			const cfg = findProviderConfig("omniroute")!;
			const key = process.env[cfg.envVar] ?? "";
			return openaiCompatProvider(cfg, key);
		}
		case "ollama":
			return ollamaProvider();
		case "claude":
			return claudeCliProvider();
		case "none":
			return null;
		default:
			throw new Error(
				`unknown --llm value "${force}"; expected one of: anthropic, openai, fuelix, omniroute, ollama, claude, none`,
			);
	}
}