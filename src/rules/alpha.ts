import type { Rule } from "../interfaces/rule.ts";

/**
 * Validates that a field contains only alphabetic characters.
 */
export default class AlphaRule implements Rule {
  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "alpha";
  }

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

    const alphaRegex = /^[\p{L}\p{M}]+$/u;

    return alphaRegex.test(value);
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must contain only alphabetic characters`;
  }
}
