/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid email field", () => {
  const validator = new Validator();

  const data = { email: "user@example.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid email field with subdomains", () => {
  const validator = new Validator();

  const data = { email: "user@mail.example.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid email field with plus", () => {
  const validator = new Validator();

  const data = { email: "user+tag@example.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid email field (no @)", () => {
  const validator = new Validator();

  const data = { email: "userexample.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    "The email field must be a valid email address",
  ]);
});

Deno.test("validator handles invalid email field (no domain)", () => {
  const validator = new Validator();

  const data = { email: "user@" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    "The email field must be a valid email address",
  ]);
});

Deno.test("validator handles invalid email field (no TLD)", () => {
  const validator = new Validator();

  const data = { email: "user@example" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    "The email field must be a valid email address",
  ]);
});

Deno.test("validator handles valid null value for email field", () => {
  const validator = new Validator();

  const data = { email: null };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for email field", () => {
  const validator = new Validator();

  const data = { email: undefined };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar value for email field", () => {
  const validator = new Validator();

  const data = { email: 123 };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
