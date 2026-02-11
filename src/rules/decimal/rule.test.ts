/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { decimal } from "./rule.ts";

Deno.test("decimal rule validates floating-point number successfully", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(3.14);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 3.14);
});

Deno.test("decimal rule validates negative decimal successfully", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(-2.5);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, -2.5);
});

Deno.test("decimal rule rejects integer", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(42);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a decimal (not an integer)");
});

Deno.test("decimal rule rejects string", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate("3.14");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a decimal");
});

Deno.test("decimal rule rejects NaN", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(NaN);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("decimal rule allows null/undefined to pass through", async () => {
  const decimalSchema = decimal();

  const nullResult = await decimalSchema["~standard"].validate(null);
  const undefinedResult = await decimalSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
