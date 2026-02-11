/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { alphaDash } from "./rule.ts";

Deno.test("alpha-dash rule validates string with letters, numbers, dashes successfully", async () => {
  const alphaDashSchema = alphaDash();

  const result = await alphaDashSchema["~standard"].validate("hello-world-123");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "hello-world-123");
});

Deno.test("alpha-dash rule validates string with underscores successfully", async () => {
  const alphaDashSchema = alphaDash();

  const result = await alphaDashSchema["~standard"].validate("hello_world_123");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "hello_world_123");
});

Deno.test("alpha-dash rule validates string with mixed dashes and underscores successfully", async () => {
  const alphaDashSchema = alphaDash();

  const result = await alphaDashSchema["~standard"].validate("hello-world_123");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "hello-world_123");
});

Deno.test("alpha-dash rule rejects string with spaces", async () => {
  const alphaDashSchema = alphaDash();

  const result = await alphaDashSchema["~standard"].validate("hello world");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must contain only letters, numbers, dashes, and underscores");
});

Deno.test("alpha-dash rule rejects string with special characters", async () => {
  const alphaDashSchema = alphaDash();

  const result = await alphaDashSchema["~standard"].validate("hello@world");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha-dash rule rejects empty string", async () => {
  const alphaDashSchema = alphaDash();

  const result = await alphaDashSchema["~standard"].validate("");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("alpha-dash rule allows null/undefined to pass through", async () => {
  const alphaDashSchema = alphaDash();

  const nullResult = await alphaDashSchema["~standard"].validate(null);
  const undefinedResult = await alphaDashSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
