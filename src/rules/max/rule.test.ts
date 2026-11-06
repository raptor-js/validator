import assert from "node:assert/strict";
import { test } from "node:test";

import { max } from "./rule.ts";

test("max rule validates string within maximum length", async () => {
  const maxSchema = max(10);

  const result = await maxSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "hello");
});

test("max rule rejects string exceeding maximum length", async () => {
  const maxSchema = max(3);

  const result = await maxSchema["~standard"].validate("hello");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be no more than 3 in length",
  );
});

test("max rule validates number within maximum value", async () => {
  const maxSchema = max(100);

  const result = await maxSchema["~standard"].validate(50);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 50);
});

test("max rule rejects number exceeding maximum value", async () => {
  const maxSchema = max(10);

  const result = await maxSchema["~standard"].validate(20);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be no more than 10",
  );
});

test("max rule validates array within maximum length", async () => {
  const maxSchema = max(5);

  const result = await maxSchema["~standard"].validate([1, 2]);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, [1, 2]);
});

test("max rule rejects array exceeding maximum length", async () => {
  const maxSchema = max(2);

  const result = await maxSchema["~standard"].validate([1, 2, 3]);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("max rule allows null/undefined to pass through", async () => {
  const maxSchema = max(5);

  const nullResult = await maxSchema["~standard"].validate(null);
  const undefinedResult = await maxSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
