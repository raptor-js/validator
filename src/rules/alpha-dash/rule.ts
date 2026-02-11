import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field contains only letters, numbers, dashes, and underscores.
 * 
 * @returns A standard schema validator.
 */
export function alphaDash(): StandardSchemaV1<string | null | undefined> {
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

        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return {
            issues: [{
              message: "The field must contain only letters, numbers, dashes, and underscores",
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
