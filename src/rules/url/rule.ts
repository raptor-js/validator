import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is a valid URL.
 *
 * @returns A standard schema validator.
 */
export function url(): StandardSchemaV1<string | null | undefined> {
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

        try {
          new URL(value);
          return { value };
        } catch {
          return {
            issues: [{
              message: "The field must be a valid URL",
              path: [],
            }],
          };
        }
      },
    },
  };
}
