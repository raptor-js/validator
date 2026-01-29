import {
  type Context,
  type Middleware,
  UnprocessableEntity,
} from "@raptor/framework";

import type { Rule } from "./interfaces/rule.ts";
import type { InferSchema } from "./types/infer-schema.ts";
import type { ValidationResult } from "./types/validation-result.ts";

import RuleParser from "./rule-parser.ts";

const kValidate = Symbol.for("raptor.request.validate");

const bodyCache = new WeakMap<Request, unknown>();

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
   * Wrapper to pre-bind this to the validation handler method.
   */
  public get handle(): Middleware {
    return (context: Context, next: CallableFunction) => {
      return this.handleValidation(context, next);
    };
  }

  /**
   * Handle the validation middleware.
   *
   * @param context The current HTTP context.
   * @param next The next middleware function.
   */
  public handleValidation(
    context: Context,
    next: CallableFunction,
  ): unknown {
    const { request } = context;

    if (!(kValidate in request)) {
      this.attachValidateMethod(request);
    }

    return next();
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

  /**
   * Attach the validate method to the request object.
   *
   * @param request The HTTP request.
   */
  private attachValidateMethod(request: Request): void {
    Object.defineProperty(request, kValidate, {
      value: async <T extends Record<string, string>>(schema: T) => {
        const body = await getRequestBody(request);

        const result = this.validate(
          body as Record<string, unknown>,
          schema,
        );

        if (!result.valid && result.errors) {
          throw new UnprocessableEntity(result.errors);
        }

        return result.data as InferSchema<T>;
      },
      writable: false,
      configurable: false,
    });

    Object.defineProperty(request, "validate", {
      get(this: Request) {
        return (this as unknown as Record<symbol, unknown>)[kValidate];
      },
      configurable: false,
    });
  }
}

/**
 * Get and cache the request body.
 *
 * @param request The HTTP request.
 * @returns The parsed body.
 */
async function getRequestBody(request: Request): Promise<unknown> {
  let body = bodyCache.get(request);

  if (body !== undefined) {
    return body;
  }

  try {
    body = await request.json();
  } catch (e) {
    if (e instanceof SyntaxError) {
      body = {};
    } else {
      throw e;
    }
  }

  bodyCache.set(request, body);

  return body;
}
