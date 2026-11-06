import assert from "node:assert/strict";
import { test } from "node:test";

import { array } from "./rule.ts";

test("array rule validates array successfully", async () => {
  const arraySchema = array();

  const result = await arraySchema["~standard"].validate([1, 2, 3]);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, [1, 2, 3]);
});

test("array rule validates empty array successfully", async () => {
  const arraySchema = array();

  const result = await arraySchema["~standard"].validate([]);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, []);
});

test("array rule validates array with mixed types successfully", async () => {
  const arraySchema = array();

  const result = await arraySchema["~standard"].validate([
    1,
    "two",
    true,
    null,
  ]);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, [1, "two", true, null]);
});

test("array rule rejects string", async () => {
  const arraySchema = array();

  const result = await arraySchema["~standard"].validate("not an array");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be an array",
  );
});

test("array rule rejects object", async () => {
  const arraySchema = array();

  const result = await arraySchema["~standard"].validate({ length: 3 });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("array rule rejects number", async () => {
  const arraySchema = array();

  const result = await arraySchema["~standard"].validate(42);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("array rule allows null/undefined to pass through", async () => {
  const arraySchema = array();

  const nullResult = await arraySchema["~standard"].validate(null);
  const undefinedResult = await arraySchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
