export interface DiffResult {
    stat: string;
    full: string;
    truncated: boolean;
    baseSha: string;
    headSha: string;
}
export interface DiffOptions {
    base: string;
    head?: string;
    maxChars?: number;
    cwd?: string;
}
/**
 * Get the git diff between base and head. Truncates if the full diff exceeds
 * maxChars, keeping the stat + file headers + files with >50 line changes.
 */
export declare function getDiff(opts: DiffOptions): DiffResult;
