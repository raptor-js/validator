import type { Rule, RuleFactory } from "./interfaces/rule.ts";

import StringRule from "./rules/string.ts";
import NumericRule from "./rules/numeric.ts";
import BooleanRule from "./rules/boolean.ts";
import RequiredRule from "./rules/required.ts";
import AlphaRule from "./rules/alpha.ts";
import DecimalRule from "./rules/decimal.ts";
import IntegerRule from "./rules/integer.ts";
import LowercaseRule from "./rules/lowercase.ts";
import UppercaseRule from "./rules/uppercase.ts";
import EmailRule from "./rules/email.ts";
import ArrayRule from "./rules/array.ts";
import JsonRule from "./rules/json.ts";
import AlphaNumRule from "./rules/alpha-numeric.ts";
import AlphaDashRule from "./rules/alpha-dash.ts";
import UrlRule from "./rules/url.ts";
import DateRule from "./rules/date.ts";

import MinRuleFactory from "./rules/min.ts";
import MaxRuleFactory from "./rules/max.ts";
import StartsWithRuleFactory from "./rules/starts-with.ts";
import EndsWithRuleFactory from "./rules/ends-with.ts";
import GreaterThanRuleFactory from "./rules/greater-than.ts";
import GreaterThanOrEqualRuleFactory from "./rules/greater-than-or-equal.ts";
import LessThanRuleFactory from "./rules/less-than.ts";
import LessThanOrEqualRuleFactory from "./rules/less-than-or-equal.ts";

/**
 * Parses and manages validation rules.
 */
export default class RuleParser {
  /**
   * Registry of available rules (non-parameterized).
   */
  private rules: Map<string, Rule> = new Map();

  /**
   * Registry of rule factories (parameterized rules).
   */
  private factories: Map<string, RuleFactory> = new Map();

  /**
   * Initialize the rule parser with default rules.
   */
  constructor() {
    this.registerDefaultRules();
    this.registerDefaultFactories();
  }

  /**
   * Register a non-parameterized validation rule.
   *
   * @param rule The rule instance to register.
   */
  public register(rule: Rule): void {
    this.rules.set(rule.name(), rule);
  }

  /**
   * Register a parameterized rule factory.
   *
   * @param name The base name of the rule (e.g., "min" for "min:8").
   * @param factory The factory instance to register.
   */
  public registerFactory(name: string, factory: RuleFactory): void {
    this.factories.set(name, factory);
  }

  /**
   * Parse a pipe-separated rule string into Rule instances.
   *
   * @param ruleString A pipe-separated string of rule names (e.g., "required|string|min:8").
   * @returns An array of Rule instances.
   */
  public parse(ruleString: string): Rule[] {
    const ruleNames = ruleString.split("|").map((r) => r.trim());

    const parsedRules: Rule[] = [];

    for (const ruleName of ruleNames) {
      if (ruleName.includes(":")) {
        const rule = this.parseParameterizedRule(ruleName);

        parsedRules.push(rule);

        continue;
      }

      const rule = this.rules.get(ruleName);

      if (!rule) {
        throw new Error(`Unknown validation rule: ${ruleName}`);
      }

      parsedRules.push(rule);
    }

    return parsedRules;
  }

  /**
   * Parse a parameterized rule string and create an instance.
   *
   * @param ruleString A rule string with parameters (e.g., "min:8").
   * @returns A Rule instance.
   */
  private parseParameterizedRule(ruleString: string): Rule {
    const [name, ...paramParts] = ruleString.split(":");

    const params = paramParts.join(":").split(",").map((p) => p.trim());

    const factory = this.factories.get(name);

    if (!factory) {
      throw new Error(
        `Unknown parameterized rule: ${name}. Did you forget to register the factory?`,
      );
    }

    return factory.make(params);
  }

  /**
   * Check if a rule or factory exists in the registry.
   *
   * @param ruleName The name of the rule to check.
   * @returns True if the rule or factory exists.
   */
  public has(ruleName: string): boolean {
    if (ruleName.includes(":")) {
      const [name] = ruleName.split(":");

      return this.factories.has(name);
    }

    return this.rules.has(ruleName);
  }

  /**
   * Register the default validation rules.
   */
  private registerDefaultRules(): void {
    this.register(new RequiredRule());
    this.register(new StringRule());
    this.register(new NumericRule());
    this.register(new BooleanRule());
    this.register(new DecimalRule());
    this.register(new IntegerRule());
    this.register(new AlphaRule());
    this.register(new LowercaseRule());
    this.register(new UppercaseRule());
    this.register(new EmailRule());
    this.register(new ArrayRule());
    this.register(new JsonRule());
    this.register(new AlphaNumRule());
    this.register(new AlphaDashRule());
    this.register(new UrlRule());
    this.register(new DateRule());
  }

  /**
   * Register the default rule factories.
   */
  private registerDefaultFactories(): void {
    this.registerFactory("min", new MinRuleFactory());
    this.registerFactory("max", new MaxRuleFactory());
    this.registerFactory("starts_with", new StartsWithRuleFactory());
    this.registerFactory("ends_with", new EndsWithRuleFactory());
    this.registerFactory("gt", new GreaterThanRuleFactory());
    this.registerFactory("gte", new GreaterThanOrEqualRuleFactory());
    this.registerFactory("lt", new LessThanRuleFactory());
    this.registerFactory("lte", new LessThanOrEqualRuleFactory());
  }
}
