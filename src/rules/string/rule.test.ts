import { assertEquals, assertExists } from "@std/assert";

import { string } from "./rule.ts";

Deno.test("string rule validates string successfully", async () => {
  const stringSchema = string();

  const result = await stringSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "hello");
});

Deno.test("string rule rejects number", async () => {
  const stringSchema = string();

  const result = await stringSchema["~standard"].validate(42);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a string");
});

Deno.test("string rule rejects boolean", async () => {
  const stringSchema = string();

  const result = await stringSchema["~standard"].validate(true);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("string rule rejects array", async () => {
  const stringSchema = string();

  const result = await stringSchema["~standard"].validate([]);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("string rule allows null/undefined to pass through", async () => {
  const stringSchema = string();

  const nullResult = await stringSchema["~standard"].validate(null);
  const undefinedResult = await stringSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
