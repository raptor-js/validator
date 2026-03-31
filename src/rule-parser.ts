import { ServerError } from "@raptor/kernel";
import type { StandardSchemaV1 } from "./types/standard-schema-v1.ts";

import { gt } from "./rules/gt/rule.ts";
import { lt } from "./rules/lt/rule.ts";
import { min } from "./rules/min/rule.ts";
import { max } from "./rules/max/rule.ts";
import { url } from "./rules/url/rule.ts";
import { gte } from "./rules/gte/rule.ts";
import { lte } from "./rules/lte/rule.ts";
import { date } from "./rules/date/rule.ts";
import { json } from "./rules/json/rule.ts";
import { array } from "./rules/array/rule.ts";
import { alpha } from "./rules/alpha/rule.ts";
import { email } from "./rules/email/rule.ts";
import { string } from "./rules/string/rule.ts";
import { boolean } from "./rules/boolean/rule.ts";
import { numeric } from "./rules/numeric/rule.ts";
import { integer } from "./rules/integer/rule.ts";
import { decimal } from "./rules/decimal/rule.ts";
import { required } from "./rules/required/rule.ts";
import { alphaNum } from "./rules/alpha-num/rule.ts";
import { endsWith } from "./rules/ends-with/rule.ts";
import { lowercase } from "./rules/lowercase/rule.ts";
import { uppercase } from "./rules/uppercase/rule.ts";
import { alphaDash } from "./rules/alpha-dash/rule.ts";
import { startsWith } from "./rules/starts-with/rule.ts";

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
   * Parse a set of rules into standard schema validators.
   *
   * @param rules A set of rules to validate against.
   *
   * @returns An array of standard schema validators.
   */
  public parse(
    rules: string | Array<string | StandardSchemaV1>,
  ): StandardSchemaV1<unknown>[] {
    if (typeof rules === "string") {
      const ruleNames = rules
        .split("|")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      return ruleNames.map((ruleName) => this.parseRule(ruleName));
    }

    if (Array.isArray(rules)) {
      const validators: StandardSchemaV1<unknown>[] = [];

      for (const item of rules) {
        if (typeof item === "string") {
          validators.push(this.parseRule(item));
          continue;
        }

        if (this.isStandardSchema(item)) {
          validators.push(item);
          continue;
        }

        throw new ServerError(
          "Array items must be rule strings or standard-schema validators",
        );
      }

      return validators;
    }

    throw new ServerError("Rules must be a string or array");
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
        throw new ServerError(`Unknown validation rule: ${name}`);
      }

      const parsedParams = params.map((p) => {
        const num = parseInt(p, 10);

        return isNaN(num) ? p : num;
      });

      return factory(...parsedParams);
    }

    const factory = this.factories.get(ruleString);

    if (!factory) {
      throw new ServerError(`Unknown validation rule: ${ruleString}`);
    }

    return factory();
  }

  /**
   * Check if a value is a StandardSchemaV1 validator.
   *
   * @param value The value to check.
   *
   * @returns True if the value is a StandardSchemaV1 validator.
   */
  private isStandardSchema(value: unknown): value is StandardSchemaV1<unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      "~standard" in value &&
      // deno-lint-ignore no-explicit-any
      typeof (value as any)["~standard"] === "object"
    );
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
    this.register("gt", gt as RuleFactory);
    this.register("lt", lt as RuleFactory);
    this.register("url", url as RuleFactory);
    this.register("min", min as RuleFactory);
    this.register("max", max as RuleFactory);
    this.register("gte", gte as RuleFactory);
    this.register("lte", lte as RuleFactory);
    this.register("date", date as RuleFactory);
    this.register("json", json as RuleFactory);
    this.register("array", array as RuleFactory);
    this.register("alpha", alpha as RuleFactory);
    this.register("email", email as RuleFactory);
    this.register("string", string as RuleFactory);
    this.register("boolean", boolean as RuleFactory);
    this.register("numeric", numeric as RuleFactory);
    this.register("integer", integer as RuleFactory);
    this.register("decimal", decimal as RuleFactory);
    this.register("required", required as RuleFactory);
    this.register("alpha_num", alphaNum as RuleFactory);
    this.register("ends_with", endsWith as RuleFactory);
    this.register("lowercase", lowercase as RuleFactory);
    this.register("uppercase", uppercase as RuleFactory);
    this.register("alpha_dash", alphaDash as RuleFactory);
    this.register("starts_with", startsWith as RuleFactory);
  }
}

export const ruleParser: RuleParser = new RuleParser();
