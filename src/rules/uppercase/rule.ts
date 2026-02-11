import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is uppercase.
 * 
 * @returns A standard schema validator.
 */
export function uppercase(): StandardSchemaV1<string | null | undefined> {
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
              path: []
            }]
          };
        }

        if (value !== value.toUpperCase()) {
          return {
            issues: [{
              message: "The field must be uppercase",
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
