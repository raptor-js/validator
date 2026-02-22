import type BodyParser from "./body-parser.ts";
import type { RuleFactory } from "./rule-parser.ts";

export interface Config {
  /**
   * A custom body parser instance to use for parsing request bodies.
   */
  bodyParser?: BodyParser;

  /**
   * Custom validation rules to register with the global rule parser.
   */
  rules?: Record<string, RuleFactory>;
}
