import type { Rule } from "../interfaces/rule.ts";

/**
 * Validates that a field is a lowercase string.
 */
export default class LowercaseRule implements Rule {
  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "lowercase";
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

    return value === value.toLowerCase();
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must be lowercase`;
  }
}
