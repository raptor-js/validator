/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid lowercase field", () => {
  const validator = new Validator();

  const data = { username: "johndoe" };
  const schema = { username: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid lowercase field", () => {
  const validator = new Validator();

  const data = { username: "JohnDoe" };
  const schema = { username: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must be lowercase",
  ]);
});
Deno.test("validator handles valid null value for lowercase field", () => {
  const validator = new Validator();

  const data = { code: null };
  const schema = { code: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for lowercase field", () => {
  const validator = new Validator();

  const data = { code: undefined };
  const schema = { code: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for lowercase field", () => {
  const validator = new Validator();

  const data = { code: 123 };
  const schema = { code: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
