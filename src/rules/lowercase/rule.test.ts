import assert from "node:assert/strict";
import { test } from "node:test";

import { lowercase } from "./rule.ts";

test("lowercase rule validates lowercase string successfully", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "hello");
});

test("lowercase rule validates lowercase with numbers successfully", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("hello123");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "hello123");
});

test("lowercase rule rejects uppercase string", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("HELLO");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be lowercase",
  );
});

test("lowercase rule rejects mixed case string", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate("Hello");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("lowercase rule rejects number", async () => {
  const lowercaseSchema = lowercase();

  const result = await lowercaseSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a string",
  );
});

test("lowercase rule allows null/undefined to pass through", async () => {
  const lowercaseSchema = lowercase();

  const nullResult = await lowercaseSchema["~standard"].validate(null);
  const undefinedResult =
    await lowercaseSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
