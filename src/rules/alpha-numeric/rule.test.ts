/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid alpha_num field", () => {
  const validator = new Validator();

  const data = { username: "User123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid alpha_num field with unicode", () => {
  const validator = new Validator();

  const data = { username: "José123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid alpha_num field (with spaces)", () => {
  const validator = new Validator();

  const data = { username: "User 123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must contain only letters and numbers",
  ]);
});

Deno.test("validator handles invalid alpha_num field (with special chars)", () => {
  const validator = new Validator();

  const data = { username: "User-123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must contain only letters and numbers",
  ]);
});

Deno.test("validator handles valid null alpha_num field", () => {
  const validator = new Validator();

  const data = { name: null };
  const schema = { name: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid undefined alpha_num field", () => {
  const validator = new Validator();

  const data = { name: undefined };
  const schema = { name: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid scalar type alpha_num field", () => {
  const validator = new Validator();

  const data = { name: 123 };
  const schema = { name: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
});

Deno.test("validator handles invalid empty alpha_dash field", () => {
  const validator = new Validator();

  const data = { name: "" };
  const schema = { name: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
});
