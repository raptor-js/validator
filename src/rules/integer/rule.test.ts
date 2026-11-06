import assert from "node:assert/strict";
import { test } from "node:test";

import { integer } from "./rule.ts";

test("integer rule validates whole number successfully", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(42);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 42);
});

test("integer rule validates negative whole number successfully", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(-10);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, -10);
});

test("integer rule validates zero successfully", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(0);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 0);
});

test("integer rule rejects decimal number", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(3.14);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be an integer",
  );
});

test("integer rule rejects string", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate("42");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be an integer",
  );
});

test("integer rule rejects NaN", async () => {
  const integerSchema = integer();

  const result = await integerSchema["~standard"].validate(NaN);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("integer rule allows null/undefined to pass through", async () => {
  const integerSchema = integer();

  const nullResult = await integerSchema["~standard"].validate(null);
  const undefinedResult = await integerSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
