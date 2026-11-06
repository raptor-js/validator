import assert from "node:assert/strict";
import { test } from "node:test";

import { required } from "./rule.ts";

test("required rule validates non-empty value successfully", async () => {
  const requiredSchema = required();

  const result = await requiredSchema["~standard"].validate("test");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "test");
});

test("required rule rejects null", async () => {
  const requiredSchema = required();

  const result = await requiredSchema["~standard"].validate(null);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues[0].message, "The field is required");
});

test("required rule rejects undefined", async () => {
  const requiredSchema = required();

  const result = await requiredSchema["~standard"].validate(undefined);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("required rule rejects empty string", async () => {
  const requiredSchema = required();

  const result = await requiredSchema["~standard"].validate("");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("required rule rejects whitespace-only string", async () => {
  const requiredSchema = required();

  const result = await requiredSchema["~standard"].validate("   ");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});
