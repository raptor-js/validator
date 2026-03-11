import type { StandardSchemaV1 } from "./types/standard-schema-v1.ts";

/**
 * Wraps a validator to allow null or undefined values to pass through.
 *
 * @param validator A standard schema validator to wrap.
 *
 * @returns A standard schema validator that accepts null, undefined, or any value accepted by the wrapped validator.
 */
export function optional<T>(
  validator: StandardSchemaV1<T>,
): StandardSchemaV1<T | null | undefined> {
  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      async validate(
        value,
      ): Promise<StandardSchemaV1.Result<T | null | undefined>> {
        if (value === undefined || value === null) {
          return { value };
        }

        return await validator["~standard"].validate(value);
      },
    },
  };
}
