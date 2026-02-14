/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { endsWith } from "./rule.ts";

Deno.test("ends-with rule validates string with single suffix successfully", async () => {
  const endsWithSchema = endsWith(".com");

  const result = await endsWithSchema["~standard"].validate("example.com");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "example.com");
});

Deno.test("ends-with rule validates string with multiple suffixes successfully", async () => {
  const endsWithSchema = endsWith(".com", ".org");

  const result = await endsWithSchema["~standard"].validate("example.org");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assertEquals(result.value, "example.org");
});

Deno.test("ends-with rule rejects string without matching suffix", async () => {
  const endsWithSchema = endsWith(".com", ".org");

  const result = await endsWithSchema["~standard"].validate("example.net");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(
    result.issues[0].message,
    "The field must end with one of: .com, .org",
  );
});

Deno.test("ends-with rule rejects non-string value", async () => {
  const endsWithSchema = endsWith("test");

  const result = await endsWithSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a string");
});

Deno.test("ends-with rule allows null/undefined to pass through", async () => {
  const endsWithSchema = endsWith("test");

  const nullResult = await endsWithSchema["~standard"].validate(null);
  const undefinedResult = await endsWithSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
