import assert from "node:assert/strict";
import { test } from "node:test";

import { gt } from "./rule.ts";

test("gt rule validates number greater than threshold successfully", async () => {
  const gtSchema = gt(10);

  const result = await gtSchema["~standard"].validate(15);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 15);
});

test("gt rule rejects number equal to threshold", async () => {
  const gtSchema = gt(10);

  const result = await gtSchema["~standard"].validate(10);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be greater than 10",
  );
});

test("gt rule rejects number less than threshold", async () => {
  const gtSchema = gt(10);

  const result = await gtSchema["~standard"].validate(5);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("gt rule allows null/undefined to pass through", async () => {
  const gtSchema = gt(10);

  const nullResult = await gtSchema["~standard"].validate(null);
  const undefinedResult = await gtSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
