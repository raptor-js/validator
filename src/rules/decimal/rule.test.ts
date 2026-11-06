import assert from "node:assert/strict";
import { test } from "node:test";

import { decimal } from "./rule.ts";

test("decimal rule validates floating-point number successfully", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(3.14);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 3.14);
});

test("decimal rule validates negative decimal successfully", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(-2.5);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, -2.5);
});

test("decimal rule rejects integer", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(42);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a decimal (not an integer)",
  );
});

test("decimal rule rejects string", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate("3.14");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a decimal",
  );
});

test("decimal rule rejects NaN", async () => {
  const decimalSchema = decimal();

  const result = await decimalSchema["~standard"].validate(NaN);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("decimal rule allows null/undefined to pass through", async () => {
  const decimalSchema = decimal();

  const nullResult = await decimalSchema["~standard"].validate(null);
  const undefinedResult = await decimalSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
