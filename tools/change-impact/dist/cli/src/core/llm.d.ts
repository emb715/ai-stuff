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
export declare function detectLLM(opts?: DetectOptions): Promise<LLMProvider | null>;
