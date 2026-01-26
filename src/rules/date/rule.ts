import type { Rule } from "../../interfaces/rule.ts";

/**
 * Validates that a field is a valid date.
 * Accepts Date objects or valid date strings.
 */
export default class DateRule implements Rule {
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

    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (typeof value !== "string") {
      return false;
    }

    if (value.length === 0) {
      return false;
    }

    const date = new Date(value);

    return !isNaN(date.getTime());
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must be a valid date`;
  }
}
