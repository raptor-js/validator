import assert from "node:assert/strict";
import { test } from "node:test";

import { url } from "./rule.ts";

test("url rule validates HTTP URL successfully", async () => {
  const urlSchema = url();

  const result = await urlSchema["~standard"].validate("http://example.com");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "http://example.com");
});

test("url rule validates HTTPS URL successfully", async () => {
  const urlSchema = url();

  const result = await urlSchema["~standard"].validate("https://example.com");

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "https://example.com");
});

test("url rule validates URL with path successfully", async () => {
  const urlSchema = url();

  const result = await urlSchema["~standard"].validate(
    "https://example.com/path/to/page",
  );

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "https://example.com/path/to/page");
});

test("url rule validates URL with query parameters successfully", async () => {
  const urlSchema = url();

  const result = await urlSchema["~standard"].validate(
    "https://example.com?foo=bar&baz=qux",
  );

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value, "https://example.com?foo=bar&baz=qux");
});

test("url rule rejects string without protocol", async () => {
  const urlSchema = url();

  const result = await urlSchema["~standard"].validate("example.com");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be a valid URL",
  );
});

test("url rule rejects invalid URL", async () => {
  const urlSchema = url();

  const result = await urlSchema["~standard"].validate("not a url");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
});

test("url rule allows null/undefined to pass through", async () => {
  const urlSchema = url();

  const nullResult = await urlSchema["~standard"].validate(null);
  const undefinedResult = await urlSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assert.deepStrictEqual(nullResult.value, null);
  assert.deepStrictEqual(undefinedResult.value, undefined);
});
