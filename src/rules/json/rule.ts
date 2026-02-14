import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is valid JSON string.
 *
 * @returns A standard schema validator.
 */
export function json(): StandardSchemaV1<string | null | undefined> {
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
          JSON.parse(value);

          return { value };
        } catch {
          return {
            issues: [{
              message: "The field must be valid JSON",
              path: [],
            }],
          };
        }
      },
    },
  };
}
