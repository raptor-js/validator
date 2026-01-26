/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid boolean field", () => {
  const validator = new Validator();

  const data = { active: true };
  const schema = { active: "boolean" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid boolean field", () => {
  const validator = new Validator();

  const data = { active: "yes" };
  const schema = { active: "boolean" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.active, ["The active field must be a boolean"]);
});

Deno.test("validator handles undefined boolean field", () => {
  const validator = new Validator();

  const data = { active: undefined };
  const schema = { active: "boolean" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles null boolean field", () => {
  const validator = new Validator();

  const data = { active: null };
  const schema = { active: "boolean" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});
