export declare const DEFAULT_OLLAMA_MODEL = "gemma3";
export declare const OLLAMA_BASE_URL = "http://localhost:11434";
/** Timeout for availability detection (ms). */
export declare const OLLAMA_DETECT_TIMEOUT_MS = 2000;
/**
 * Check whether an Ollama server is running locally by hitting /api/tags
 * with a short timeout. Returns true if the server responds ok.
 */
export declare function isOllamaAvailable(baseUrl?: string): Promise<boolean>;
/**
 * List installed Ollama models. Returns [] if the server is not reachable.
 */
export declare function listOllamaModels(baseUrl?: string): Promise<string[]>;
/**
 * Call a local Ollama server via the /api/chat endpoint.
 * Uses stream: false so the full response is returned in one shot.
 * Model defaults to gemma3.
 */
export declare function callOllama(system: string, user: string, model?: string, baseUrl?: string): Promise<string>;
