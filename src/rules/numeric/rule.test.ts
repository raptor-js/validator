/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid numeric field", () => {
  const validator = new Validator();

  const data = { age: 25 };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid numeric field", () => {
  const validator = new Validator();

  const data = { age: "twenty-five" };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, ["The age field must be numeric"]);
});

Deno.test("validator handles undefined numeric field", () => {
  const validator = new Validator();

  const data = { age: undefined };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles null numeric field", () => {
  const validator = new Validator();

  const data = { age: null };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles NaN as invalid numeric field", () => {
  const validator = new Validator();

  const data = { age: NaN };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, ["The age field must be numeric"]);
});
