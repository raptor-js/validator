/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid lt field", () => {
  const validator = new Validator();

  const data = { score: 75 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid lt field (equal)", () => {
  const validator = new Validator();

  const data = { score: 100 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be less than 100",
  ]);
});

Deno.test("validator handles invalid lt field (greater)", () => {
  const validator = new Validator();

  const data = { score: 150 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be less than 100",
  ]);
});

Deno.test("validator handles value null value for lt field", () => {
  const validator = new Validator();

  const data = { score: null };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles value undefined value for lt field", () => {
  const validator = new Validator();

  const data = { score: undefined };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for lt field", () => {
  const validator = new Validator();

  const data = { score: 123 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});

Deno.test("validator handles invalid NaN value for lt field", () => {
  const validator = new Validator();

  const data = { score: NaN };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
