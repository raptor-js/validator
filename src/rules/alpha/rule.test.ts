/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { alpha } from "./rule.ts";

Deno.test("alpha rule validates alphabetic string successfully", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "hello");
});

Deno.test("alpha rule validates uppercase letters successfully", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("HELLO");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "HELLO");
});

Deno.test("alpha rule validates mixed case successfully", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("HeLLo");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "HeLLo");
});

Deno.test("alpha rule rejects string with numbers", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello123");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(
    result.issues[0].message,
    "The field must contain only alphabetic characters",
  );
});

Deno.test("alpha rule rejects string with spaces", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello world");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha rule rejects string with special characters", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello!");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha rule rejects empty string", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha rule rejects number", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a string");
});

Deno.test("alpha rule allows null/undefined to pass through", async () => {
  const alphaSchema = alpha();

  const nullResult = await alphaSchema["~standard"].validate(null);
  const undefinedResult = await alphaSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
