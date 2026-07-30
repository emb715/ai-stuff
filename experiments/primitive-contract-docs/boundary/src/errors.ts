/**
 * Unified error model for the boundary tool.
 *
 * Every module that throws a structured error throws a BoundaryError (or a
 * subclass). The CLI catches BoundaryError once and handles all structured
 * errors consistently. ManifestError extends BoundaryError so existing
 * `instanceof ManifestError` checks keep working.
 */

/**
 * Base class for all structured boundary errors.
 */
export class BoundaryError extends Error {
  constructor(
    message: string,
    public code?: string,
    public field?: string,
  ) {
    super(message);
    this.name = "BoundaryError";
  }
}

/**
 * Manifest parse/validation error.
 *
 * Kept as a named subclass so `instanceof ManifestError` still works after
 * the error model unification. Now extends BoundaryError so the CLI can catch
 * the base class once and handle manifest errors through the same path.
 */
export class ManifestError extends BoundaryError {
  constructor(message: string, field?: string) {
    super(message, "MANIFEST_ERROR", field);
    this.name = "ManifestError";
  }
}