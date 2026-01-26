import type { Rule, RuleFactory } from "../../interfaces/rule.ts";

/**
 * Validates that a field meets a maximum length (for strings) or value (for numbers).
 */
class MaxRule implements Rule {
  constructor(private maximum: number) {}

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

    if (typeof value === "string") {
      return value.length <= this.maximum;
    }

    if (typeof value === "number") {
      return value <= this.maximum;
    }

    if (Array.isArray(value)) {
      return value.length <= this.maximum;
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
    return `The ${field} field must be less than ${this.maximum} in length`;
  }
}

/**
 * Factory for creating MaxRule instances with parameters.
 */
export class MaxRuleFactory implements RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., max:8)).
   *
   * @returns A new Rule instance.
   */
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error("max rule requires a parameter (e.g., max:8)");
    }

    const maximum = parseInt(params[0], 10);

    if (isNaN(maximum)) {
      throw new Error(
        `max rule requires a numeric parameter, got: ${params[0]}`,
      );
    }

    return new MaxRule(maximum);
  }
}

export default MaxRuleFactory;
