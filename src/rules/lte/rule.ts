import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is less than or equal to the given value.
 *
 * @param threshold The value to compare against.
 *
 * @returns A standard schema validator.
 */
export function lte(threshold: number): StandardSchemaV1<unknown> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value === "number" && value > threshold) {
          return {
            issues: [{
              message: `The field must be less than or equal to ${threshold}`,
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
