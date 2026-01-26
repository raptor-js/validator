import type { Rule, RuleFactory } from "../../interfaces/rule.ts";

/**
 * Validates that a field is less than or equal to a given value.
 */
class LessThanOrEqualRule implements Rule {
  constructor(private threshold: number) {}

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

    if (typeof value !== "number" || isNaN(value)) {
      return false;
    }

    return value <= this.threshold;
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must be less than or equal to ${this.threshold}`;
  }
}

/**
 * Factory for creating LessThanOrEqualRule instances with parameters.
 */
export class LessThanOrEqualRuleFactory implements RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., lte:100)).
   *
   * @returns A new Rule instance.
   */
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error("lte rule requires a parameter (e.g., lte:100)");
    }

    const threshold = parseFloat(params[0]);

    if (isNaN(threshold)) {
      throw new Error(
        `lte rule requires a numeric parameter, got: ${params[0]}`,
      );
    }

    return new LessThanOrEqualRule(threshold);
  }
}

export default LessThanOrEqualRuleFactory;
