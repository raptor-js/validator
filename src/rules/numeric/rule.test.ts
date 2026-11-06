import assert from "node:assert/strict";
import { test } from "node:test";

import { numeric } from "./rule.ts";

test("numeric rule validates number successfully", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate(18);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 18);
});

test("numeric rule validates numeric string successfully", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate("42");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 42);
});

test("numeric rule rejects non-numeric string", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate("invalid");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues.length, 1);
  assert.deepStrictEqual(result.issues[0].message, "The field must be numeric");
  assert.deepStrictEqual(result.issues[0].path, []);
});

test("numeric rule allows null/undefined to pass through", async () => {
  const numericSchema = numeric();

  const nullResult = await numericSchema["~standard"].validate(null);
  const undefinedResult = await numericSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});

test("numeric rule rejects NaN", async () => {
  const numericSchema = numeric();

  const result = await numericSchema["~standard"].validate(NaN);

  if ("value" in result) {
    throw new Error("Expected validation to fail for NaN");
  }

  assert.ok(result.issues != null);
});
