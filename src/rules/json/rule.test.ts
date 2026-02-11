/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { json } from "./rule.ts";

Deno.test("json rule validates JSON object string successfully", async () => {
  const jsonSchema = json();

  const result = await jsonSchema["~standard"].validate('{"name":"John","age":30}');

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, '{"name":"John","age":30}');
});

Deno.test("json rule validates JSON array string successfully", async () => {
  const jsonSchema = json();

  const result = await jsonSchema["~standard"].validate('[1,2,3]');

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, '[1,2,3]');
});

Deno.test("json rule validates JSON string value successfully", async () => {
  const jsonSchema = json();

  const result = await jsonSchema["~standard"].validate('"hello"');

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, '"hello"');
});

Deno.test("json rule validates JSON number successfully", async () => {
  const jsonSchema = json();

  const result = await jsonSchema["~standard"].validate('42');

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, '42');
});

Deno.test("json rule rejects invalid JSON", async () => {
  const jsonSchema = json();

  const result = await jsonSchema["~standard"].validate('{name: "John"}');

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be valid JSON");
});

Deno.test("json rule rejects non-string value", async () => {
  const jsonSchema = json();

  const result = await jsonSchema["~standard"].validate({ name: "John" });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a string");
});

Deno.test("json rule allows null/undefined to pass through", async () => {
  const jsonSchema = json();

  const nullResult = await jsonSchema["~standard"].validate(null);
  const undefinedResult = await jsonSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
