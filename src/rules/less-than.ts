import type { Rule, RuleFactory } from "../interfaces/rule.ts";

/**
 * Validates that a field is less than a given value.
 */
class LessThanRule implements Rule {
  constructor(private threshold: number) {}

  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "lt";
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

    return value < this.threshold;
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    return `The ${field} field must be less than ${this.threshold}`;
  }
}

/**
 * Factory for creating LessThanRule instances with parameters.
 */
export class LessThanRuleFactory implements RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., lt:100)).
   *
   * @returns A new Rule instance.
   */
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error("lt rule requires a parameter (e.g., lt:100)");
    }

    const threshold = parseFloat(params[0]);

    if (isNaN(threshold)) {
      throw new Error(
        `lt rule requires a numeric parameter, got: ${params[0]}`,
      );
    }

    return new LessThanRule(threshold);
  }
}

export default LessThanRuleFactory;
