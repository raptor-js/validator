/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles required field present", () => {
  const validator = new Validator();

  const data = { email: "test@example.com" };
  const schema = { email: "required|string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles required field missing", () => {
  const validator = new Validator();

  const data = {};
  const schema = { email: "required|string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, ["The email field is required"]);
});

Deno.test("validator handles required field empty string", () => {
  const validator = new Validator();

  const data = { email: "   " };
  const schema = { email: "required" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, ["The email field is required"]);
});
