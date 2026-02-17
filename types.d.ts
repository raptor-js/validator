// deno-lint-ignore-file no-explicit-any

import type { StandardSchemaV1 } from "./src/types/standard-schema-v1.ts";

declare global {
  interface Request {
    validate<T>(
      validator: StandardSchemaV1<T, any>,
    ): Promise<T>;

    validateSafe<T>(
      validator: StandardSchemaV1<T, any>,
    ): Promise<T>;
  }
}

export {};
