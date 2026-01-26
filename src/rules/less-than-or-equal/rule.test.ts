/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid lte field", () => {
  const validator = new Validator();

  const data = { percentage: 100 };
  const schema = { percentage: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid lte field (less)", () => {
  const validator = new Validator();

  const data = { percentage: 75 };
  const schema = { percentage: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid lte field", () => {
  const validator = new Validator();

  const data = { percentage: 150 };
  const schema = { percentage: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.percentage, [
    "The percentage field must be less than or equal to 100",
  ]);
});

Deno.test("validator handles value null value for lt field", () => {
  const validator = new Validator();

  const data = { score: null };
  const schema = { score: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles value undefined value for lte field", () => {
  const validator = new Validator();

  const data = { score: undefined };
  const schema = { score: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for lte field", () => {
  const validator = new Validator();

  const data = { score: 123 };
  const schema = { score: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});

Deno.test("validator handles invalid NaN value for lte field", () => {
  const validator = new Validator();

  const data = { score: NaN };
  const schema = { score: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
