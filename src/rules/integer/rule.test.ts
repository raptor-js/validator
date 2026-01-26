/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid integer field", () => {
  const validator = new Validator();

  const data = { count: 42 };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid integer field (decimal)", () => {
  const validator = new Validator();

  const data = { count: 42.5 };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.count, ["The count field must be an integer"]);
});

Deno.test("validator handles undefined integer field", () => {
  const validator = new Validator();

  const data = { count: undefined };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles null integer field", () => {
  const validator = new Validator();

  const data = { count: null };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid integer field (string)", () => {
  const validator = new Validator();

  const data = { count: "42" };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.count, ["The count field must be an integer"]);
});
