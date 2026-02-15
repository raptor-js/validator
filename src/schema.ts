import type { StandardSchemaV1 } from "./types/standard-schema-v1.ts";

/**
 * Create a validation schema for an object with multiple fields.
 *
 * @param definition An object where each key is a field name and value is a standard schema validator.
 *
 * @returns A standard schema validator for the entire object.
 */
export function schema<T extends Record<string, StandardSchemaV1>>(
  definition: T,
): StandardSchemaV1<InferSchemaOutput<T>> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      async validate(
        data,
      ): Promise<StandardSchemaV1.Result<InferSchemaOutput<T>>> {
        if (typeof data !== "object" || data === null || Array.isArray(data)) {
          return {
            issues: [{
              message: "Expected an object",
              path: [],
            }],
          };
        }

        const validatedData: Record<string, unknown> = {};

        const issues: StandardSchemaV1.Issue[] = [];

        for (const [field, validator] of Object.entries(definition)) {
          const value = (data as Record<string, unknown>)[field];

          const result = await validator["~standard"].validate(value);

          if (result.issues) {
            for (const issue of result.issues) {
              issues.push({
                ...issue,
                path: [
                  field,
                  ...(issue.path || []),
                ],
              });
            }

            continue;
          }

          validatedData[field] = result.value;
        }

        if (issues.length > 0) {
          return { issues: issues };
        }

        return { value: validatedData as InferSchemaOutput<T> };
      },
    },
  };
}

/**
 * Infer the output type from a schema definition.
 */
type InferSchemaOutput<T extends Record<string, StandardSchemaV1>> = {
  // deno-lint-ignore no-explicit-any
  [K in keyof T]: T[K] extends StandardSchemaV1<any, infer Output> ? Output
    : never;
};
