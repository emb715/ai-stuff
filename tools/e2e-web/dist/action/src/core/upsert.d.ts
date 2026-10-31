export interface UpsertOptions {
    /** PR number */
    prNumber: number;
    /** Repo in org/name format (for gh CLI: --repo flag) */
    repo?: string;
    /** Working directory for gh CLI */
    cwd?: string;
    /** Where to write: the PR body, or a sticky comment */
    destination?: "body" | "comment";
}
/**
 * Splice a marked block into existing text: replace between markers if present,
 * append otherwise. Never touches anything outside the markers.
 *
 * Exported for tests — this is the logic worth pinning, not the gh plumbing.
 */
export declare function spliceBlock(existing: string, block: string): string;
/** Fetch the current PR body. */
export declare function getPRBody(prNumber: number, opts: {
    repo?: string;
    cwd?: string;
}): string;
/**
 * Upsert the verification block onto a PR.
 *
 * Default destination is a sticky comment rather than the PR body: a
 * verification result changes on every run, and rewriting the author's
 * description on each CI run is more intrusive than this tool needs to be.
 * Pass `destination: "body"` to match the change-impact tool's behaviour.
 */
export declare function upsertBlock(block: string, opts: UpsertOptions): void;
