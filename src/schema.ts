import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Creates a validator for an object with multiple fields.
 * Accepts any Standard Schema compliant validators (Zod, Valibot, Raptor pipe(), etc.)
 * 
 * @param fields Object mapping field names to validators
 * @returns A Standard Schema validator for the entire object
 */
export function schema<T extends Record<string, StandardSchemaV1<any>>>(
  fields: T
): StandardSchemaV1<{
  [K in keyof T]: T[K] extends StandardSchemaV1<infer V> ? V : never
}> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      async validate(value) {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
          return {
            issues: [{
              message: "Expected an object",
              path: []
            }]
          };
        }

        const data = value as Record<string, unknown>;

        const result: any = {};

        const issues: StandardSchemaV1.Issue[] = [];

        for (const [fieldName, validator] of Object.entries(fields)) {
          const fieldResult = await validator["~standard"].validate(data[fieldName]);
          
          if ("value" in fieldResult) {
            result[fieldName] = fieldResult.value;

            continue;
          }
          
          for (const issue of fieldResult.issues) {
            issues.push({
              ...issue,
              path: [
                fieldName,
                ...(issue.path ?? [])
              ]
            });
          }
        }

        if (issues.length > 0) {
          return {
            issues
          };
        }

        return {
          value: result
        };
      }
    }
  };
}
