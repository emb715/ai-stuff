export declare const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
/** Default OpenAI API base URL when OPENAI_BASE_URL is not set. */
export declare const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
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
export declare function callOpenAICompat(system: string, user: string, opts: OpenAICompatOptions): Promise<string>;
/**
 * Backward-compatible wrapper: calls the OpenAI Chat Completions API using
 * OPENAI_API_KEY and (optionally) OPENAI_BASE_URL from the environment.
 *
 * Prefer `callOpenAICompat` for new code paths so the provider config is
 * explicit instead of read implicitly from env.
 */
export declare function callOpenAI(system: string, user: string, model?: string): Promise<string>;
