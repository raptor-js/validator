/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { numeric } from "./rule.ts";

Deno.test("numeric rule validates number successfully", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate(18);

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 18);
});

Deno.test("numeric rule validates numeric string successfully", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate("42");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, 42);
});

Deno.test("numeric rule rejects non-numeric string", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate("invalid");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues.length, 1);
  assertEquals(result.issues[0].message, "The field must be numeric");
  assertEquals(result.issues[0].path, []);
});

Deno.test("numeric rule allows null/undefined to pass through", async () => {
  const numericSchema = numeric();

  const nullResult = await numericSchema["~standard"].validate(null);
  const undefinedResult = await numericSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});

Deno.test("numeric rule rejects NaN", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate(NaN);

  if ("value" in result) {
    throw new Error("Expected validation to fail for NaN");
  }

  assertExists(result.issues);
});
