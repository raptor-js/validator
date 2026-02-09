import { type Context, UnprocessableEntity } from "@raptor/framework";
import type { StandardSchemaV1 } from "@standard-schema/spec";

const kValidate = Symbol.for("raptor.request.validate");

const bodyCache = new WeakMap<Request, unknown>();

/**
 * Validation middleware for Raptor.
 */
export default class Validator {
  /**
   * Handle the validation middleware.
   *
   * @param context The current HTTP context.
   * @param next The next middleware function.
   */
  public handle(context: Context, next: CallableFunction) {
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
    Object.defineProperty(request, kValidate, {
      value: async function <T>(validator: StandardSchemaV1<T, any>) {
        const body = await getRequestBody(this);

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

/**
 * Get and cache the request body.
 *
 * @param request The HTTP request.
 *
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

/**
 * Format Standard Schema issues into Raptor error format.
 *
 * @param issues Validation issues.
 *
 * @returns Formatted errors.
 */
function formatErrors(issues: readonly StandardSchemaV1.Issue[]): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = issue.path?.[0] as string ?? "unknown";

    errors[field] ??= [];
    errors[field].push(issue.message);
  }

  return errors;
}
