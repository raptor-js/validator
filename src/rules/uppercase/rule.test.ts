/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid uppercase field", () => {
  const validator = new Validator();

  const data = { code: "ABC123" };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid uppercase field", () => {
  const validator = new Validator();

  const data = { code: "Abc123" };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.code, ["The code field must be uppercase"]);
});

Deno.test("validator handles valid null value for uppercase field", () => {
  const validator = new Validator();

  const data = { code: null };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for uppercase field", () => {
  const validator = new Validator();

  const data = { code: undefined };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for uppercase field", () => {
  const validator = new Validator();

  const data = { code: 123 };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
