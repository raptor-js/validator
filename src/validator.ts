// deno-lint-ignore-file

import type { StandardSchemaV1 } from "@standard-schema/spec";

import {
  type Context,
  type Middleware,
  UnprocessableEntity,
} from "@raptor/framework";

import BodyParser from "./body-parser.ts";
import formatErrors from "./format-errors.ts";

const kValidate = Symbol.for("raptor.request.validate");

/**
 * Validation middleware for Raptor.
 */
export default class Validator {
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
      this.attachValidateMethod(request);
    }

    return next();
  }

  /**
   * Attach the validate method to the request object.
   *
   * @param request The HTTP request.
   */
  private attachValidateMethod(request: Request): void {
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

    Object.defineProperty(request, "validate", {
      get() {
        return (this as any)[kValidate];
      },
      configurable: false,
    });
  }
}
