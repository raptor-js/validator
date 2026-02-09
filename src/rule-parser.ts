import type { StandardSchemaV1 } from "@standard-schema/spec";

import { min } from "./rules/min/rule.ts";
import { max } from "./rules/max/rule.ts";
import { string } from "./rules/string/rule.ts";
import { required } from "./rules/required/rule.ts";
import { numeric } from "./rules/numeric/rule.ts";

export type RuleFactory = (...args: unknown[]) => StandardSchemaV1<unknown>;

/**
 * Parses pipe-separated rule strings into standard schema validators.
 */
export default class RuleParser {
  /**
   * Registry of all rule factories.
   */
  private factories: Map<string, RuleFactory> = new Map();

  /**
   * Initialize the rule parser with default rules.
   */
  constructor() {
    this.registerDefaultRules();
  }

  /**
   * Register a validation rule factory.
   *
   * @param name The name of the rule (e.g., "required", "min").
   * @param factory The factory function that creates the validator.
   */
  public register(name: string, factory: RuleFactory): void {
    this.factories.set(name, factory);
  }

  /**
   * Parse a pipe-separated rule string into standard schema validators.
   *
   * @param ruleString A pipe-separated string of rule names (e.g., "required|string|min:8").
   *
   * @returns An array of standard schema validators.
   */
  public parse(ruleString: string): StandardSchemaV1<unknown>[] {
    const ruleNames = ruleString
      .split("|")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const validators: StandardSchemaV1<unknown>[] = [];

    for (const ruleName of ruleNames) {
      const validator = this.parseRule(ruleName);

      validators.push(validator);
    }

    return validators;
  }

  /**
   * Parse a single rule string and create a validator.
   *
   * @param ruleString A rule string (e.g., "required" or "min:8").
   *
   * @returns A standard schema validator.
   */
  private parseRule(ruleString: string): StandardSchemaV1<unknown> {
    if (ruleString.includes(":")) {
      const [name, ...paramParts] = ruleString.split(":");

      const params = paramParts.join(":").split(",").map((p) => p.trim());

      const factory = this.factories.get(name);

      if (!factory) {
        throw new Error(`Unknown validation rule: ${name}`);
      }

      const parsedParams = params.map((p) => {
        const num = parseInt(p, 10);

        return isNaN(num) ? p : num;
      });

      return factory(...parsedParams);
    }

    const factory = this.factories.get(ruleString);

    if (!factory) {
      throw new Error(`Unknown validation rule: ${ruleString}`);
    }

    return factory();
  }

  /**
   * Check if a rule factory exists in the registry.
   *
   * @param ruleName The name of the rule to check.
   *
   * @returns A boolean indicating whether the factory exists.
   */
  public has(ruleName: string): boolean {
    if (ruleName.includes(":")) {
      const [name] = ruleName.split(":");

      return this.factories.has(name);
    }

    return this.factories.has(ruleName);
  }

  /**
   * Register the default validation rules.
   */
  private registerDefaultRules(): void {
    this.register("required", required as RuleFactory);
    this.register("string", string as RuleFactory);
    this.register("numeric", numeric as RuleFactory);
    this.register("min", min as RuleFactory);
    this.register("max", max as RuleFactory);
  }
}

export const defaultRuleParser: RuleParser = new RuleParser();
