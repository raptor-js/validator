import type { Rule, RuleFactory } from "../../interfaces/rule.ts";

/**
 * Validates that a field starts with one of the given values.
 */
class StartsWithRule implements Rule {
  constructor(private prefixes: string[]) {}

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

    return this.prefixes.some((prefix) => value.startsWith(prefix));
  }

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  public message(field: string): string {
    const prefixList = this.prefixes.map((p) => `"${p}"`).join(", ");

    return `The ${field} field must start with one of: ${prefixList}`;
  }
}

/**
 * Factory for creating StartsWithRule instances with parameters.
 */
export class StartsWithRuleFactory implements RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., starts_with:http,https)).
   *
   * @returns A new Rule instance.
   */
  public make(params: string[]): Rule {
    if (params.length === 0) {
      throw new Error(
        "starts_with rule requires at least one parameter (e.g., starts_with:http,https)",
      );
    }

    return new StartsWithRule(params);
  }
}

export default StartsWithRuleFactory;
