/**
 * Check whether a CLI binary is available in PATH.
 * Uses `command -v` (POSIX, works on macOS and Linux).
 */
export declare function isCliAvailable(command: string): boolean;
/**
 * Shell out to a CLI binary with `--print <prompt>` and return its stdout.
 * The `claude` CLI supports `claude --print "<prompt>"` for non-interactive runs.
 *
 * The prompt is passed as a single argv element — never interpolated into the
 * command string — so shell injection is not possible.
 */
export declare function callCli(command: string, prompt: string): string;
