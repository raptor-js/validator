import type { Rule } from "../../interfaces/rule.ts";

/**
 * Validates that a field contains only alphanumeric characters, dashes, and underscores.
 */
export default class AlphaDashRule implements Rule {
  /**
   * Validate a value against this rule.
   *
   * @param value The value to validate.
   *
   * @returns True if valid, error message string if invalid.
   */
  public validate(value: unknown): boolean | string {
    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value !== "string") {
      return false;
    }

    if (value.length === 0) {
      return false;
    }

    const alphaDashRegex = /^[\p{L}\p{M}\p{N}_-]+$/u;

    return alphaDashRegex.test(value);
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must contain only letters, numbers, dashes, and underscores`;
  }
}
