import type { StandardSchemaV1 } from "../../types/standard-schema-v1.ts";

/**
 * Validates that a field is a boolean.
 *
 * @returns A standard schema validator.
 */
export function boolean(): StandardSchemaV1<boolean | null | undefined> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value !== "boolean") {
          return {
            issues: [{
              message: "The field must be a boolean",
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
