/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { integer } from "./rule.ts";

Deno.test("integer rule validates whole number successfully", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(42);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 42);
});

Deno.test("integer rule validates negative whole number successfully", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(-10);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, -10);
});

Deno.test("integer rule validates zero successfully", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(0);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 0);
});

Deno.test("integer rule rejects decimal number", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(3.14);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be an integer");
});

Deno.test("integer rule rejects string", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate("42");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be an integer");
});

Deno.test("integer rule rejects NaN", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(NaN);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("integer rule allows null/undefined to pass through", async () => {
  const integerSchema = integer();

  const nullResult = await integerSchema["~standard"].validate(null);
  const undefinedResult = await integerSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
