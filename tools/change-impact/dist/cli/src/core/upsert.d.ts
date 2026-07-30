export interface UpsertOptions {
    /** PR number */
    prNumber: number;
    /** Repo in org/name format (for gh CLI: --repo flag) */
    repo?: string;
    /** Working directory for gh CLI */
    cwd?: string;
    /** Mode: "gh" shells out to gh CLI, "api" uses GitHub API token */
    mode?: "gh" | "api";
    /** GitHub token for API mode (required if mode is "api") */
    token?: string;
}
/**
 * Upsert a change-impact block into a PR description.
 * Replaces content between markers if they exist, appends if not.
 * Never touches text outside the markers.
 *
 * This is a port of skills/change-impact-diagram/scripts/upsert-impact-block.mjs
 * into a shared module. Same splice logic, callable from both Action and CLI.
 */
export declare function upsertBlock(block: string, opts: UpsertOptions): void;
/**
 * Fetch the current PR body. Used for reading before upsert.
 */
export declare function getPRBody(prNumber: number, opts: {
    repo?: string;
    cwd?: string;
}): string;
