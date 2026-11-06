import assert from "node:assert/strict";
import { test } from "node:test";

import { date } from "./rule.ts";

test("date rule validates Date object successfully", async () => {
  const dateSchema = date();
  const testDate = new Date("2025-01-15");

  const result = await dateSchema["~standard"].validate(testDate);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, testDate);
});

test("date rule validates ISO date string successfully", async () => {
  const dateSchema = date();

  const result = await dateSchema["~standard"].validate("2025-01-15");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "2025-01-15");
});

test("date rule validates timestamp successfully", async () => {
  const dateSchema = date();

  const timestamp = 1705363200000;

  const result = await dateSchema["~standard"].validate(timestamp);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, timestamp);
});

test("date rule rejects invalid Date object", async () => {
  const dateSchema = date();

  const result = await dateSchema["~standard"].validate(new Date("invalid"));

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a valid date",
  );
});

test("date rule rejects invalid date string", async () => {
  const dateSchema = date();

  const result = await dateSchema["~standard"].validate("not a date");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("date rule rejects boolean", async () => {
  const dateSchema = date();

  const result = await dateSchema["~standard"].validate(true);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("date rule allows null/undefined to pass through", async () => {
  const dateSchema = date();

  const nullResult = await dateSchema["~standard"].validate(null);
  const undefinedResult = await dateSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
