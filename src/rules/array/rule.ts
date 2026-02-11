import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is an array.
 * 
 * @returns A standard schema validator.
 */
export function array(): StandardSchemaV1<unknown[] | null | undefined> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (!Array.isArray(value)) {
          return {
            issues: [{
              message: "The field must be an array",
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
