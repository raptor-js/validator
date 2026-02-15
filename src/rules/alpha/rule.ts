import type { StandardSchemaV1 } from "../../types/standard-schema-v1.ts";

/**
 * Validates that a field contains only alphabetic characters.
 *
 * @returns A standard schema validator.
 */
export function alpha(): StandardSchemaV1<string | null | undefined> {
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

        if (!/^[a-zA-Z]+$/.test(value)) {
          return {
            issues: [{
              message: "The field must contain only alphabetic characters",
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
