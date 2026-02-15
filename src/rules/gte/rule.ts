import type { StandardSchemaV1 } from "../../types/standard-schema-v1.ts";

/**
 * Validates that a field is greater than or equal to the given value.
 *
 * @param threshold The value to compare against.
 *
 * @returns A standard schema validator.
 */
export function gte(threshold: number): StandardSchemaV1<unknown> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value === "number" && value < threshold) {
          return {
            issues: [{
              message:
                `The field must be greater than or equal to ${threshold}`,
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
