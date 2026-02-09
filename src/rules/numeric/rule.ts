import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is numeric (either a number or a numeric string).
 *
 * @returns A standard schema validator.
 */
export function numeric(): StandardSchemaV1<unknown> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value === "number" && !isNaN(value)) {
          return {
            value,
          };
        }

        if (typeof value === "string") {
          const num = Number(value);

          if (!isNaN(num)) {
            return { value: num };
          }
        }

        return {
          issues: [{
            message: "The field must be numeric",
            path: [],
          }],
        };
      },
    },
  };
}
