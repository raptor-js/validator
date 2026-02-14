import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is a valid email address.
 *
 * @returns A standard schema validator.
 */
export function email(): StandardSchemaV1<string | null | undefined> {
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
              path: [],
            }],
          };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
          return {
            issues: [{
              message: "The field must be a valid email address",
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
