/**
 * Shared JSON-read helper — the common preamble of every `--apply` path.
 *
 * Both `generate --apply` (generate.ts) and `lint --phase 2 --apply`
 * (llm-lint.ts) start the same way: read a file, JSON.parse it, and wrap
 * any parse failure in a structured error that names the file and the
 * underlying message. The shape validation and per-item coercion that
 * follow are specific to each command, so they stay in their modules;
 * only the read+parse+error-wrap preamble is genuinely duplicated.
 */

import { readFileSync } from "node:fs";
import { BoundaryError } from "./errors.ts";

/**
 * Read `path` as UTF-8 and parse it as JSON.
 *
 * Throws a BoundaryError when the file cannot be parsed, with a message of
 * the form: `<context>: failed to parse JSON at <path>: <reason>`. `context`
 * identifies the calling command (e.g. "applyGeneratedDrafts",
 * "applyLintResults") so the user knows which apply pass failed.
 *
 * Does NOT validate the parsed shape — that is the caller's responsibility.
 */
export function readJsonFile(path: string, context: string): unknown {
  const raw = readFileSync(path, "utf-8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new BoundaryError(
      `${context}: failed to parse JSON at ${path}: ${(e as Error).message}`,
      "JSON_PARSE_ERROR",
    );
  }

  return parsed;
}