import { assertEquals, assertExists } from "@std/assert";

import { min } from "./rule.ts";

Deno.test("min rule validates string meeting minimum length", async () => {
  const minSchema = min(3);

  const result = await minSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "hello");
});

Deno.test("min rule rejects string below minimum length", async () => {
  const minSchema = min(5);

  const result = await minSchema["~standard"].validate("hi");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(
    result.issues[0].message,
    "The field must be at least 5 in length",
  );
});

Deno.test("min rule validates number meeting minimum value", async () => {
  const minSchema = min(18);

  const result = await minSchema["~standard"].validate(25);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, 25);
});

Deno.test("min rule rejects number below minimum value", async () => {
  const minSchema = min(18);

  const result = await minSchema["~standard"].validate(10);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be at least 18");
});

Deno.test("min rule validates array meeting minimum length", async () => {
  const minSchema = min(2);

  const result = await minSchema["~standard"].validate([1, 2, 3]);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, [1, 2, 3]);
});

Deno.test("min rule rejects array below minimum length", async () => {
  const minSchema = min(3);

  const result = await minSchema["~standard"].validate([1]);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("min rule allows null/undefined to pass through", async () => {
  const minSchema = min(5);

  const nullResult = await minSchema["~standard"].validate(null);
  const undefinedResult = await minSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
