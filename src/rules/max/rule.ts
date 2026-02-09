import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field meets a maximum length (for strings/arrays) or value (for numbers).
 *
 * @param maximum The maximum length or value.
 *
 * @returns A standard schema validator.
 */
export function max(
  maximum: number,
): StandardSchemaV1<unknown> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (typeof value === "string" && value.length > maximum) {
          return {
            issues: [{
              message: `The field must be no more than ${maximum} in length`,
              path: [],
            }],
          };
        }

        if (typeof value === "number" && value > maximum) {
          return {
            issues: [{
              message: `The field must be no more than ${maximum}`,
              path: [],
            }],
          };
        }

        if (Array.isArray(value) && value.length > maximum) {
          return {
            issues: [{
              message: `The field must be no more than ${maximum} in length`,
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
