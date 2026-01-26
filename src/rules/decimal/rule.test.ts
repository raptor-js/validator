/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid decimal field", () => {
  const validator = new Validator();

  const data = { price: 19.99 };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid decimal field (integer)", () => {
  const validator = new Validator();

  const data = { price: 20 };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.price, [
    "The price field must be a decimal number",
  ]);
});

Deno.test("validator handles invalid decimal field (string)", () => {
  const validator = new Validator();

  const data = { price: "19.99" };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.price, [
    "The price field must be a decimal number",
  ]);
});

Deno.test("validator handles undefined decimal field", () => {
  const validator = new Validator();

  const data = { price: undefined };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles null decimal field", () => {
  const validator = new Validator();

  const data = { price: null };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});
