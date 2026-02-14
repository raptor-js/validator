/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { lte } from "./rule.ts";

Deno.test("lte rule validates number less than threshold successfully", async () => {
  const lteSchema = lte(10);

  const result = await lteSchema["~standard"].validate(5);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, 5);
});

Deno.test("lte rule validates number equal to threshold successfully", async () => {
  const lteSchema = lte(10);

  const result = await lteSchema["~standard"].validate(10);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, 10);
});

Deno.test("lte rule rejects number greater than threshold", async () => {
  const lteSchema = lte(10);

  const result = await lteSchema["~standard"].validate(15);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(
    result.issues[0].message,
    "The field must be less than or equal to 10",
  );
});

Deno.test("lte rule allows null/undefined to pass through", async () => {
  const lteSchema = lte(10);

  const nullResult = await lteSchema["~standard"].validate(null);
  const undefinedResult = await lteSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
