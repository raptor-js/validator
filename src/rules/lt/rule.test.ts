import assert from "node:assert/strict";
import { test } from "node:test";

import { lt } from "./rule.ts";

test("lt rule validates number less than threshold successfully", async () => {
  const ltSchema = lt(10);

  const result = await ltSchema["~standard"].validate(5);

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, 5);
});

test("lt rule rejects number equal to threshold", async () => {
  const ltSchema = lt(10);

  const result = await ltSchema["~standard"].validate(10);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be less than 10",
  );
});

test("lt rule rejects number greater than threshold", async () => {
  const ltSchema = lt(10);

  const result = await ltSchema["~standard"].validate(15);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("lt rule allows null/undefined to pass through", async () => {
  const ltSchema = lt(10);

  const nullResult = await ltSchema["~standard"].validate(null);
  const undefinedResult = await ltSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
