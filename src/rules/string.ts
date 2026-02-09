import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is a string.
 * 
 * @returns A Standard Schema validator.
 */
export function string(): StandardSchemaV1<string> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value: value as any };
        }

        if (typeof value !== "string") {
          return {
            issues: [{
              message: "The field must be a string",
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
