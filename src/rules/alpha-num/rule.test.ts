import assert from "node:assert/strict";
import { test } from "node:test";

import { alphaNum } from "./rule.ts";

test("alpha-num rule validates alphanumeric string successfully", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello123");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "hello123");
});

test("alpha-num rule validates only letters successfully", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "hello");
});

test("alpha-num rule validates only numbers successfully", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("123");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "123");
});

test("alpha-num rule rejects string with spaces", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello 123");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must contain only letters and numbers",
  );
});

test("alpha-num rule rejects string with special characters", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("hello-123");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("alpha-num rule rejects empty string", async () => {
  const alphaNumSchema = alphaNum();

  const result = await alphaNumSchema["~standard"].validate("");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("alpha-num rule allows null/undefined to pass through", async () => {
  const alphaNumSchema = alphaNum();

  const nullResult = await alphaNumSchema["~standard"].validate(null);
  const undefinedResult = await alphaNumSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
