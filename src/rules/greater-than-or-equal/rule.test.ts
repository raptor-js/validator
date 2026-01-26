/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid gte field", () => {
  const validator = new Validator();

  const data = { age: 18 };
  const schema = { age: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid gte field (greater)", () => {
  const validator = new Validator();

  const data = { age: 25 };
  const schema = { age: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid gte field", () => {
  const validator = new Validator();

  const data = { age: 16 };
  const schema = { age: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, [
    "The age field must be greater than or equal to 18",
  ]);
});

Deno.test("validator handles valid null value for gte field", () => {
  const validator = new Validator();

  const data = { score: null };
  const schema = { score: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for gte field", () => {
  const validator = new Validator();

  const data = { score: undefined };
  const schema = { score: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid string value for gte field", () => {
  const validator = new Validator();

  const data = { score: "123" };
  const schema = { score: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});

Deno.test("validator handles invalid NaN value for gte field", () => {
  const validator = new Validator();

  const data = { score: NaN };
  const schema = { score: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
