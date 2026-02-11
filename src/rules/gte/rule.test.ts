/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { gte } from "./rule.ts";

Deno.test("gte rule validates number greater than threshold successfully", async () => {
  const gteSchema = gte(10);

  const result = await gteSchema["~standard"].validate(15);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 15);
});

Deno.test("gte rule validates number equal to threshold successfully", async () => {
  const gteSchema = gte(10);

  const result = await gteSchema["~standard"].validate(10);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 10);
});

Deno.test("gte rule rejects number less than threshold", async () => {
  const gteSchema = gte(10);

  const result = await gteSchema["~standard"].validate(5);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be greater than or equal to 10");
});

Deno.test("gte rule allows null/undefined to pass through", async () => {
  const gteSchema = gte(10);

  const nullResult = await gteSchema["~standard"].validate(null);
  const undefinedResult = await gteSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
