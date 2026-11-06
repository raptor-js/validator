import assert from "node:assert/strict";
import { test } from "node:test";

import { rules } from "./rules.ts";
import { schema } from "./schema.ts";
import { optional } from "./optional.ts";

test("optional doesn't throw validation error due to lack of existence", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    metadata: optional(
      schema({
        age: rules<number>("numeric|min:18"),
      }),
    ),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
  });

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value.name, "Dr Malcolm");
});

test("optional doesn't throw validation error due to being null", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    metadata: optional(
      schema({
        age: rules<number>("numeric|min:18"),
      }),
    ),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
    metadata: null,
  });

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value.name, "Dr Malcolm");
});
