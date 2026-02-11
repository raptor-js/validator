import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is an integer (whole number).
 * 
 * @returns A standard schema validator.
 */
export function integer(): StandardSchemaV1<number | null | undefined> {
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
              message: "The field must be an integer",
              path: []
            }]
          };
        }

        if (!Number.isInteger(value)) {
          return {
            issues: [{
              message: "The field must be an integer",
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
