import type { Rule, RuleFactory } from "../interfaces/rule.ts";

/**
 * Validates that a field ends with one of the given values.
 */
class EndsWithRule implements Rule {
  constructor(private suffixes: string[]) {}

  /**
   * The name identifier for this rule (without parameters).
   */
  public name(): string {
    return "ends_with";
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

    return this.suffixes.some((suffix) => value.endsWith(suffix));
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    const suffixList = this.suffixes.map((s) => `"${s}"`).join(", ");
    return `The ${field} field must end with one of: ${suffixList}`;
  }
}

/**
 * Factory for creating EndsWithRule instances with parameters.
 */
export class EndsWithRuleFactory implements RuleFactory {
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error(
        "ends_with rule requires at least one parameter (e.g., ends_with:.com,.org)",
      );
    }

    return new EndsWithRule(params);
  }
}

export default EndsWithRuleFactory;
