import type { Rule, RuleFactory } from "../interfaces/rule.ts";

/**
 * Validates that a field meets a minimum length (for strings) or value (for numbers).
 */
class MinRule implements Rule {
  constructor(private minimum: number) {}

  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "min";
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

    if (typeof value === "string") {
      return value.length >= this.minimum;
    }

    if (typeof value === "number") {
      return value >= this.minimum;
    }

    if (Array.isArray(value)) {
      return value.length >= this.minimum;
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
    return `The ${field} field must be at least ${this.minimum} in length`;
  }
}

/**
 * Factory for creating MinRule instances with parameters.
 */
export class MinRuleFactory implements RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., min:8)).
   * 
   * @returns A new Rule instance.
   */
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error("min rule requires a parameter (e.g., min:8)");
    }

    const minimum = parseInt(params[0], 10);

    if (isNaN(minimum)) {
      throw new Error(
        `min rule requires a numeric parameter, got: ${params[0]}`,
      );
    }

    return new MinRule(minimum);
  }
}

export default MinRuleFactory;
