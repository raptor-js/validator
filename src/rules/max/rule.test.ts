import { assertEquals, assertExists } from "@std/assert";

import { max } from "./rule.ts";

Deno.test("max rule validates string within maximum length", async () => {
  const maxSchema = max(10);

  const result = await maxSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "hello");
});

Deno.test("max rule rejects string exceeding maximum length", async () => {
  const maxSchema = max(3);

  const result = await maxSchema["~standard"].validate("hello");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be no more than 3 in length");
});

Deno.test("max rule validates number within maximum value", async () => {
  const maxSchema = max(100);

  const result = await maxSchema["~standard"].validate(50);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 50);
});

Deno.test("max rule rejects number exceeding maximum value", async () => {
  const maxSchema = max(10);

  const result = await maxSchema["~standard"].validate(20);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be no more than 10");
});

Deno.test("max rule validates array within maximum length", async () => {
  const maxSchema = max(5);

  const result = await maxSchema["~standard"].validate([1, 2]);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, [1, 2]);
});

Deno.test("max rule rejects array exceeding maximum length", async () => {
  const maxSchema = max(2);

  const result = await maxSchema["~standard"].validate([1, 2, 3]);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("max rule allows null/undefined to pass through", async () => {
  const maxSchema = max(5);

  const nullResult = await maxSchema["~standard"].validate(null);
  const undefinedResult = await maxSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
