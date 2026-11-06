import assert from "node:assert/strict";
import { test } from "node:test";

import { boolean } from "./rule.ts";

test("boolean rule validates true successfully", async () => {
  const booleanSchema = boolean();

  const result = await booleanSchema["~standard"].validate(true);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, true);
});

test("boolean rule validates false successfully", async () => {
  const booleanSchema = boolean();

  const result = await booleanSchema["~standard"].validate(false);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, false);
});

test("boolean rule rejects string", async () => {
  const booleanSchema = boolean();

  const result = await booleanSchema["~standard"].validate("true");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a boolean",
  );
});

test("boolean rule rejects number", async () => {
  const booleanSchema = boolean();

  const result = await booleanSchema["~standard"].validate(1);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("boolean rule rejects object", async () => {
  const booleanSchema = boolean();

  const result = await booleanSchema["~standard"].validate({});

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("boolean rule rejects array", async () => {
  const booleanSchema = boolean();

  const result = await booleanSchema["~standard"].validate([true]);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("boolean rule allows null/undefined to pass through", async () => {
  const booleanSchema = boolean();

  const nullResult = await booleanSchema["~standard"].validate(null);
  const undefinedResult = await booleanSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
