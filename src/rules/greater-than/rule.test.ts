/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid gt field", () => {
  const validator = new Validator();

  const data = { score: 85 };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid gt field (equal)", () => {
  const validator = new Validator();

  const data = { score: 50 };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be greater than 50",
  ]);
});

Deno.test("validator handles invalid gt field (less)", () => {
  const validator = new Validator();

  const data = { score: 30 };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be greater than 50",
  ]);
});

Deno.test("validator handles valid null value for gt field", () => {
  const validator = new Validator();

  const data = { score: null };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for gt field", () => {
  const validator = new Validator();

  const data = { score: undefined };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid string value for gt field", () => {
  const validator = new Validator();

  const data = { score: "123" };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});

Deno.test("validator handles invalid NaN value for gt field", () => {
  const validator = new Validator();

  const data = { score: NaN };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
