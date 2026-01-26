/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid string field", () => {
  const validator = new Validator();

  const data = { name: "John Doe" };
  const schema = { name: "string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
  assertEquals(result.errors, undefined);
});

Deno.test("validator handles invalid string field", () => {
  const validator = new Validator();

  const data = { name: 123 };
  const schema = { name: "string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
  assertExists(result.errors);
  assertEquals(result.errors?.name, ["The name field must be a string"]);
});
