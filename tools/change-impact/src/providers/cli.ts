import { execFileSync } from "node:child_process";

/**
 * Check whether a CLI binary is available in PATH.
 * Uses `command -v` (POSIX, works on macOS and Linux).
 */
export function isCliAvailable(command: string): boolean {
	try {
		execFileSync("command", ["-v", command], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
			shell: true,
		});
		return true;
	} catch {
		return false;
	}
}

/**
 * Shell out to a CLI binary with `--print <prompt>` and return its stdout.
 * The `claude` CLI supports `claude --print "<prompt>"` for non-interactive runs.
 *
 * The prompt is passed as a single argv element — never interpolated into the
 * command string — so shell injection is not possible.
 */
export function callCli(command: string, prompt: string): string {
	const stdout = execFileSync(command, ["--print", prompt], {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
		maxBuffer: 10 * 1024 * 1024,
	});
	return stdout.trim();
}