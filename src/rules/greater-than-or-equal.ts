import type { Rule, RuleFactory } from "../interfaces/rule.ts";

/**
 * Validates that a field is greater than or equal to a given value.
 */
class GreaterThanOrEqualRule implements Rule {
  constructor(private threshold: number) {}

  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "gte";
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

    if (typeof value !== "number" || isNaN(value)) {
      return false;
    }

    return value >= this.threshold;
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must be greater than or equal to ${this.threshold}`;
  }
}

/**
 * Factory for creating GteRule instances with parameters.
 */
export class GreaterThanOrEqualRuleFactory implements RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., gte:10)).
   *
   * @returns A new Rule instance.
   */
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error("gte rule requires a parameter (e.g., gte:10)");
    }

    const threshold = parseFloat(params[0]);

    if (isNaN(threshold)) {
      throw new Error(
        `gte rule requires a numeric parameter, got: ${params[0]}`,
      );
    }

    return new GreaterThanOrEqualRule(threshold);
  }
}

export default GreaterThanOrEqualRuleFactory;
