import type { Rule } from "../interfaces/rule.ts";

/**
 * Validates that a field is present and not null/undefined.
 */
export default class RequiredRule implements Rule {
  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "required";
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
      return false;
    }

    if (typeof value === "string" && value.trim() === "") {
      return false;
    }

    return true;
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field is required`;
  }
}
