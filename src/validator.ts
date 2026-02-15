// deno-lint-ignore-file

import type { StandardSchemaV1 } from "./types/standard-schema-v1.ts";

import {
  type Context,
  type Middleware,
  UnprocessableEntity,
} from "@raptor/framework";

import RuleParser from "./rule-parser.ts";
import BodyParser from "./body-parser.ts";
import formatErrors from "./format-errors.ts";

const kValidate = Symbol.for("raptor.request.validate");
const kValidateSafe = Symbol.for("raptor.request.validateSafe");

/**
 * Validation middleware for Raptor.
 */
export default class Validator {
  /**
   * Global rule parser instance used by all validators.
   */
  private static parser: RuleParser = new RuleParser();

  /**
   * The request body parser.
   */
  private bodyParser: BodyParser;

  /**
   * Initialize the validation middleware.
   *
   * @param bodyParser Optional custom body parser instance.
   */
  constructor(bodyParser?: BodyParser) {
    this.bodyParser = bodyParser ?? new BodyParser();
  }

  /**
   * Set the global rule parser instance.
   * This affects all subsequent validations using the rules() function.
   *
   * @param parser The rule parser instance to use globally.
   */
  public static setParser(parser: RuleParser): void {
    Validator.parser = parser;
  }

  /**
   * Get the global rule parser instance.
   *
   * @returns The global rule parser.
   */
  public static getParser(): RuleParser {
    return Validator.parser;
  }

  /**
   * Get the body parser instance for customization.
   *
   * @returns The body parser instance.
   */
  public getBodyParser(): BodyParser {
    return this.bodyParser;
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
  public handleValidation(context: Context, next: CallableFunction): unknown {
    const { request } = context;

    if (!(kValidate in request)) {
      this.attachValidateMethods(request);
    }

    return next();
  }

  /**
   * Attach the validate and validateSafe methods to the request object.
   *
   * @param request The HTTP request.
   */
  private attachValidateMethods(request: Request): void {
    const bodyParser = this.bodyParser;

    Object.defineProperty(request, kValidate, {
      value: async function <T>(validator: StandardSchemaV1<T, any>) {
        const body = await bodyParser.parse(this);

        const result = await validator["~standard"].validate(body);

        if ("issues" in result) {
          throw new UnprocessableEntity(formatErrors(result.issues ?? []));
        }

        return result.value;
      },
      writable: false,
      configurable: false,
    });

    Object.defineProperty(request, kValidateSafe, {
      value: async function <T>(
        validator: StandardSchemaV1<T, any>,
      ): Promise<StandardSchemaV1.Result<T>> {
        const body = await bodyParser.parse(this);

        return await validator["~standard"].validate(body);
      },
      writable: false,
      configurable: false,
    });

    Object.defineProperty(request, "validate", {
      get() {
        return (this as any)[kValidate];
      },
      configurable: false,
    });

    Object.defineProperty(request, "validateSafe", {
      get() {
        return (this as any)[kValidateSafe];
      },
      configurable: false,
    });
  }
}
