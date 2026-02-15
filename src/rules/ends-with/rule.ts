import type { StandardSchemaV1 } from "../../types/standard-schema-v1.ts";

/**
 * Validates that a field ends with one of the given values.
 *
 * @param suffixes Allowed suffix values.
 *
 * @returns A standard schema validator.
 */
export function endsWith(
  ...suffixes: string[]
): StandardSchemaV1<string | null | undefined> {
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

        const endsWithAny = suffixes.some((suffix) => value.endsWith(suffix));

        if (!endsWithAny) {
          const suffixList = suffixes.join(", ");

          return {
            issues: [{
              message: `The field must end with one of: ${suffixList}`,
              path: [],
            }],
          };
        }

        return { value };
      },
    },
  };
}
