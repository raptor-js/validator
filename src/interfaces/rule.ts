/**
 * Base interface for validation rules.
 */
export interface Rule {
  /**
   * Validate a value against this rule.
   *
   * @param value The value to validate.
   * @param field The field name being validated.
   * @param data All data being validated.
   * @returns True if valid, error message string if invalid.
   */
  validate(
    value: unknown,
    field: string,
    data: Record<string, unknown>,
  ): boolean | string;

  /**
   * Get the default error message for this rule.
   *
   * @param field The field name being validated.
   * @returns The error message.
   */
  message(field: string): string;
}

/**
 * Interface for rules that can be instantiated with parameters.
 */
export interface RuleFactory {
  /**
   * Create a new instance of the rule with parameters.
   *
   * @param params Parameters from the rule string (e.g., ["8"] for "min:8").
   * @returns A new Rule instance.
   */
  make(params: string[]): Rule;
}
