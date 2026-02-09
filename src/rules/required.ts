import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is present and not null/undefined/empty.
 * 
 * @returns A standard schema validator.
 */
export function required(): StandardSchemaV1<unknown> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return {
            issues: [{
              message: "The field is required",
              path: []
            }]
          };
        }

        if (typeof value === "string" && value.trim() === "") {
          return {
            issues: [{
              message: "The field is required",
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
