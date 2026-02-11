import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field is a valid date.
 * 
 * @returns A standard schema validator.
 */
export function date(): StandardSchemaV1<Date | string | number | null | undefined> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      validate(value) {
        if (value === undefined || value === null) {
          return { value };
        }

        if (value instanceof Date) {
          if (isNaN(value.getTime())) {
            return {
              issues: [{
                message: "The field must be a valid date",
                path: []
              }]
            };
          }
          return { value };
        }

        if (typeof value === "string") {
          const parsed = new Date(value);

          if (isNaN(parsed.getTime())) {
            return {
              issues: [{
                message: "The field must be a valid date",
                path: []
              }]
            };
          }
          return { value };
        }

        if (typeof value === "number") {
          const parsed = new Date(value);

          if (isNaN(parsed.getTime())) {
            return {
              issues: [{
                message: "The field must be a valid date",
                path: []
              }]
            };
          }
          return { value };
        }

        return {
          issues: [{
            message: "The field must be a valid date",
            path: []
          }]
        };
      }
    }
  };
}
