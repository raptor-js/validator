/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { lowercase } from "./rule.ts";

Deno.test("lowercase rule validates lowercase string successfully", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "hello");
});

Deno.test("lowercase rule validates lowercase with numbers successfully", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("hello123");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "hello123");
});

Deno.test("lowercase rule rejects uppercase string", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("HELLO");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be lowercase");
});

Deno.test("lowercase rule rejects mixed case string", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("Hello");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("lowercase rule rejects number", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a string");
});

Deno.test("lowercase rule allows null/undefined to pass through", async () => {
  const lowercaseSchema = lowercase();

  const nullResult = await lowercaseSchema["~standard"].validate(null);
  const undefinedResult = await lowercaseSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
