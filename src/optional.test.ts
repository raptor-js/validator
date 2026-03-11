/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals } from "@std/assert";

import { rules } from "./rules.ts";
import { schema } from "./schema.ts";
import { optional } from "./optional.ts";

Deno.test("optional doesn't throw validation error due to lack of existence", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    metadata: optional(schema({
      age: rules<number>("numeric|min:18"),
    })),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
  });

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value.name, "Dr Malcolm");
});

Deno.test("optional doesn't throw validation error due to being null", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    metadata: optional(schema({
      age: rules<number>("numeric|min:18"),
    })),
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

  assertEquals(result.value.name, "Dr Malcolm");
});
