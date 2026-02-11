/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { gt } from "./rule.ts";

Deno.test("gt rule validates number greater than threshold successfully", async () => {
  const gtSchema = gt(10);

  const result = await gtSchema["~standard"].validate(15);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 15);
});

Deno.test("gt rule rejects number equal to threshold", async () => {
  const gtSchema = gt(10);

  const result = await gtSchema["~standard"].validate(10);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be greater than 10");
});

Deno.test("gt rule rejects number less than threshold", async () => {
  const gtSchema = gt(10);

  const result = await gtSchema["~standard"].validate(5);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("gt rule allows null/undefined to pass through", async () => {
  const gtSchema = gt(10);

  const nullResult = await gtSchema["~standard"].validate(null);
  const undefinedResult = await gtSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
