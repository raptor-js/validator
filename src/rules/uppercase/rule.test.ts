import assert from "node:assert/strict";
import { test } from "node:test";

import { uppercase } from "./rule.ts";

test("uppercase rule validates uppercase string successfully", async () => {
  const uppercaseSchema = uppercase();

  const result = await uppercaseSchema["~standard"].validate("HELLO");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "HELLO");
});

test("uppercase rule validates uppercase with numbers successfully", async () => {
  const uppercaseSchema = uppercase();

  const result = await uppercaseSchema["~standard"].validate("HELLO123");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "HELLO123");
});

test("uppercase rule rejects lowercase string", async () => {
  const uppercaseSchema = uppercase();

  const result = await uppercaseSchema["~standard"].validate("hello");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be uppercase",
  );
});

test("uppercase rule rejects mixed case string", async () => {
  const uppercaseSchema = uppercase();

  const result = await uppercaseSchema["~standard"].validate("Hello");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("uppercase rule allows null/undefined to pass through", async () => {
  const uppercaseSchema = uppercase();

  const nullResult = await uppercaseSchema["~standard"].validate(null);
  const undefinedResult =
    await uppercaseSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
