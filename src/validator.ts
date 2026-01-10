import type { Rule } from "./interfaces/rule.ts";

import RuleParser from "./rule-parser.ts";

type ValidationResult = {
  valid: boolean;
  data?: Record<string, unknown>;
  errors?: Record<string, string[]>;
};

/**
 * Validates data against a schema.
 */
export default class Validator {
  /**
   * The rule parser instance.
   */
  private parser: RuleParser;

  /**
   * Initialize the validator.
   *
   * @param parser Optional custom rule parser.
   */
  constructor(parser?: RuleParser) {
    this.parser = parser ?? new RuleParser();
  }

  /**
   * Get the rule parser instance.
   *
   * @returns The rule parser.
   */
  public getParser(): RuleParser {
    return this.parser;
  }

  /**
   * Validate data against a schema.
   *
   * @param data The data to validate.
   * @param schema The validation schema.
   * @returns The validation result.
   */
  public validate(
    data: Record<string, unknown>,
    schema: Record<string, string>,
  ): ValidationResult {
    const errors: Record<string, string[]> = {};

    for (const field in schema) {
      const rules = this.parser.parse(schema[field]);

      const value = data[field];

      for (const rule of rules) {
        const result = this.validateRule(rule, value, field, data);

        if (result !== true) {
          errors[field] ??= [];
          errors[field].push(result);
        }
      }
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      valid: isValid,
      data: isValid ? data : undefined,
      errors: isValid ? undefined : errors,
    };
  }

  /**
   * Validate a single rule against a value.
   *
   * @param rule The rule to validate.
   * @param value The value to validate.
   * @param field The field name.
   * @param data All data being validated.
   * @returns True if valid, error message if invalid.
   */
  private validateRule(
    rule: Rule,
    value: unknown,
    field: string,
    data: Record<string, unknown>,
  ): true | string {
    const result = rule.validate(value, field, data);

    if (result === true) {
      return true;
    }

    if (typeof result === "string") {
      return result;
    }

    return rule.message(field);
  }
}
