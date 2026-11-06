// biome-ignore-all lint/suspicious/noExplicitAny: a schema may declare any input type

import type { StandardSchemaV1 } from "./standard-schema-v1.ts";

declare global {
  interface Request {
    validate<T>(validator: StandardSchemaV1<T, any>): Promise<T>;

    validateSafe<T>(validator: StandardSchemaV1<T, any>): Promise<T>;
  }
}

export {};
