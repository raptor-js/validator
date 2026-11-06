import assert from "node:assert/strict";
import { test } from "node:test";

import { alpha } from "./rule.ts";

test("alpha rule validates alphabetic string successfully", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "hello");
});

test("alpha rule validates uppercase letters successfully", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("HELLO");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "HELLO");
});

test("alpha rule validates mixed case successfully", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("HeLLo");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "HeLLo");
});

test("alpha rule rejects string with numbers", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello123");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must contain only alphabetic characters",
  );
});

test("alpha rule rejects string with spaces", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello world");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("alpha rule rejects string with special characters", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("hello!");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("alpha rule rejects empty string", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate("");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("alpha rule rejects number", async () => {
  const alphaSchema = alpha();

  const result = await alphaSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a string",
  );
});

test("alpha rule allows null/undefined to pass through", async () => {
  const alphaSchema = alpha();

  const nullResult = await alphaSchema["~standard"].validate(null);
  const undefinedResult = await alphaSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
