import type { StandardSchemaV1 } from "../../types/standard-schema-v1.ts";

/**
 * Validates that a field is a string.
 *
 * @returns A standard schema validator.
 */
export function string(): StandardSchemaV1<unknown> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value !== "string") {
          return {
            issues: [{
              message: "The field must be a string",
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
