// deno-lint-ignore-file

import type { StandardSchemaV1 } from "./types/standard-schema-v1.ts";

import {
  type Context,
  type Middleware,
  UnprocessableEntity,
} from "@raptor/kernel";

import { Config } from "./config.ts";
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
   * Optional configuration for the validator.
   */
  private config: Config;

  /**
   * Initialize the validation middleware.
   *
   * @param config Optional configuration for the validator.
   */
  constructor(config?: Config) {
    this.config = {
      ...this.initialiseDefaultConfig(),
      ...config,
    };

    if (this.config.rules) {
      const parser = Validator.getParser();

      for (const [name, factory] of Object.entries(this.config.rules)) {
        parser.register(name, factory);
      }
    }
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
    return this.config.bodyParser!;
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
    const bodyParser = this.config.bodyParser!;

    Object.defineProperty(request, kValidate, {
      value: async function <T>(validator: StandardSchemaV1<T, any>) {
        const clone = this.clone();

        const body = await bodyParser.parse(clone);

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
        const clone = this.clone();

        const body = await bodyParser.parse(clone);

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

  /**
   * Initialise the middleware config.
   *
   * @returns An initialise set of config.
   */
  private initialiseDefaultConfig(): Config {
    return {
      bodyParser: new BodyParser(),
    };
  }
}
