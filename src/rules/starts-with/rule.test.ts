import assert from "node:assert/strict";
import { test } from "node:test";

import { startsWith } from "./rule.ts";

test("starts-with rule validates string with single prefix successfully", async () => {
  const startsWithSchema = startsWith("http");

  const result =
    await startsWithSchema["~standard"].validate("http://example.com");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "http://example.com");
});

test("starts-with rule validates string with multiple prefixes successfully", async () => {
  const startsWithSchema = startsWith("http", "https");

  const result = await startsWithSchema["~standard"].validate(
    "https://example.com",
  );

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "https://example.com");
});

test("starts-with rule rejects string without matching prefix", async () => {
  const startsWithSchema = startsWith("http", "https");

  const result =
    await startsWithSchema["~standard"].validate("ftp://example.com");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must start with one of: http, https",
  );
});

test("starts-with rule rejects non-string value", async () => {
  const startsWithSchema = startsWith("test");

  const result = await startsWithSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a string",
  );
});

test("starts-with rule allows null/undefined to pass through", async () => {
  const startsWithSchema = startsWith("test");

  const nullResult = await startsWithSchema["~standard"].validate(null);
  const undefinedResult =
    await startsWithSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
