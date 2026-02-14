/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { alphaNum } from "./rule.ts";

Deno.test("alpha-num rule validates alphanumeric string successfully", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello123");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "hello123");
});

Deno.test("alpha-num rule validates only letters successfully", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "hello");
});

Deno.test("alpha-num rule validates only numbers successfully", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("123");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "123");
});

Deno.test("alpha-num rule rejects string with spaces", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello 123");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(
    result.issues[0].message,
    "The field must contain only letters and numbers",
  );
});

Deno.test("alpha-num rule rejects string with special characters", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello-123");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha-num rule rejects empty string", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha-num rule allows null/undefined to pass through", async () => {
  const alphaNumSchema = alphaNum();

  const nullResult = await alphaNumSchema["~standard"].validate(null);
  const undefinedResult = await alphaNumSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
