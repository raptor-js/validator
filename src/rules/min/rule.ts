import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field meets a minimum length (for strings/arrays) or value (for numbers).
 * 
 * @param minimum The minimum length or value.
 *
 * @returns A standard schema validator.
 */
export function min(minimum: number): StandardSchemaV1<string | number | unknown[]> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value: value as any };
        }

        if (typeof value === "string" && value.length < minimum) {
          return {
            issues: [{
              message: `The field must be at least ${minimum} in length`,
              path: []
            }]
          };
        }

        if (typeof value === "number" && value < minimum) {
          return {
            issues: [{
              message: `The field must be at least ${minimum}`,
              path: []
            }]
          };
        }

        if (Array.isArray(value) && value.length < minimum) {
          return {
            issues: [{
              message: `The field must be at least ${minimum} in length`,
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
