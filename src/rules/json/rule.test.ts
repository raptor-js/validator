/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid json field", () => {
  const validator = new Validator();

  const data = { config: '{"key": "value"}' };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid json field (array)", () => {
  const validator = new Validator();

  const data = { config: '["item1", "item2"]' };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid json field", () => {
  const validator = new Validator();

  const data = { config: "not json" };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.config, ["The config field must be valid JSON"]);
});

Deno.test("validator handles invalid json field (malformed)", () => {
  const validator = new Validator();

  const data = { config: '{"key": "value"' };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.config, ["The config field must be valid JSON"]);
});

Deno.test("validator handles invalid json field (empty string)", () => {
  const validator = new Validator();

  const data = { config: "" };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.config, ["The config field must be valid JSON"]);
});

Deno.test("validator handles valid null json field", () => {
  const validator = new Validator();

  const data = { config: null };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined json field", () => {
  const validator = new Validator();

  const data = { config: undefined };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for json field", () => {
  const validator = new Validator();

  const data = { config: 123 };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});

Deno.test("validator handles invalid empty value for json field", () => {
  const validator = new Validator();

  const data = { config: "" };
  const schema = { config: "json" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
