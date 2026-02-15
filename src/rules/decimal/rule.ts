import type { StandardSchemaV1 } from "../../types/standard-schema-v1.ts";

/**
 * Validates that a field is a decimal (floating-point number).
 *
 * @returns A standard schema validator.
 */
export function decimal(): StandardSchemaV1<number | null | undefined> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value !== "number" || isNaN(value)) {
          return {
            issues: [{
              message: "The field must be a decimal",
              path: [],
            }],
          };
        }

        if (Number.isInteger(value)) {
          return {
            issues: [{
              message: "The field must be a decimal (not an integer)",
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
