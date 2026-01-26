/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles min length for string (valid)", () => {
  const validator = new Validator();

  const data = { password: "12345678" };
  const schema = { password: "string|min:8" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles min length for string (invalid)", () => {
  const validator = new Validator();

  const data = { password: "1234" };
  const schema = { password: "string|min:8" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.password, [
    "The password field must be at least 8 in length",
  ]);
});

Deno.test("validator handles min value for numeric (valid)", () => {
  const validator = new Validator();

  const data = { age: 21 };
  const schema = { age: "numeric|min:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles min value for numeric (invalid)", () => {
  const validator = new Validator();

  const data = { age: 16 };
  const schema = { age: "numeric|min:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, [
    "The age field must be at least 18 in length",
  ]);
});

Deno.test("validator handles valid null value for numeric field", () => {
  const validator = new Validator();

  const data = { score: null };
  const schema = { score: "numeric|min:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for numeric field", () => {
  const validator = new Validator();

  const data = { score: undefined };
  const schema = { score: "numeric|min:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});
