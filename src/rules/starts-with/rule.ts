import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Validates that a field starts with one of the given values.
 * 
 * @param prefixes Allowed prefix values.
 *
 * @returns A standard schema validator.
 */
export function startsWith(...prefixes: string[]): StandardSchemaV1<string | null | undefined> {
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
              path: []
            }]
          };
        }

        const startsWithAny = prefixes.some(prefix => value.startsWith(prefix));

        if (!startsWithAny) {
          const prefixList = prefixes.join(", ");

          return {
            issues: [{
              message: `The field must start with one of: ${prefixList}`,
              path: []
            }]
          };
        }

        return { value };
      }
    }
  };
}
