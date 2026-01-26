/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid ends_with field (single suffix)", () => {
  const validator = new Validator();

  const data = { email: "user@example.com" };
  const schema = { email: "ends_with:.com" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid ends_with field (multiple suffixes)", () => {
  const validator = new Validator();

  const data = { email: "user@example.org" };
  const schema = { email: "ends_with:.com,.org,.net" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid ends_with field", () => {
  const validator = new Validator();

  const data = { email: "user@example.co.uk" };
  const schema = { email: "ends_with:.com,.org" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    'The email field must end with one of: ".com", ".org"',
  ]);
});

Deno.test("validator handles valid null value with ends_with field", () => {
  const validator = new Validator();

  const data = { email: null };
  const schema = { email: "ends_with:.com,.org" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value with ends_with field", () => {
  const validator = new Validator();

  const data = { email: undefined };
  const schema = { email: "ends_with:.com,.org" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value with ends_with field", () => {
  const validator = new Validator();

  const data = { email: 123 };
  const schema = { email: "ends_with:.com,.org" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
