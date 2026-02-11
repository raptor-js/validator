/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { email } from "./rule.ts";

Deno.test("email rule validates simple email successfully", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate("test@example.com");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "test@example.com");
});

Deno.test("email rule validates email with subdomain successfully", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate("test@mail.example.com");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "test@mail.example.com");
});

Deno.test("email rule validates email with plus sign successfully", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate("test+tag@example.com");

  if ("issues" in result) {
    throw new Error(`Expected success but got issues: ${JSON.stringify(result.issues)}`);
  }

  assertEquals(result.value, "test+tag@example.com");
});

Deno.test("email rule rejects string without @", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate("notanemail");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a valid email address");
});

Deno.test("email rule rejects string without domain", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate("test@");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("email rule rejects string without TLD", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate("test@example");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
});

Deno.test("email rule rejects number", async () => {
  const emailSchema = email();

  const result = await emailSchema["~standard"].validate(123);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assertExists(result.issues);
  assertEquals(result.issues[0].message, "The field must be a string");
});

Deno.test("email rule allows null/undefined to pass through", async () => {
  const emailSchema = email();

  const nullResult = await emailSchema["~standard"].validate(null);
  const undefinedResult = await emailSchema["~standard"].validate(undefined);

  if ("issues" in nullResult || "issues" in undefinedResult) {
    throw new Error("Expected null/undefined to pass through");
  }

  assertEquals(nullResult.value, null);
  assertEquals(undefinedResult.value, undefined);
});
