/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid array field", () => {
  const validator = new Validator();

  const data = { tags: ["tag1", "tag2", "tag3"] };
  const schema = { tags: "array" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid empty array field", () => {
  const validator = new Validator();

  const data = { tags: [] };
  const schema = { tags: "array" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid array field (string)", () => {
  const validator = new Validator();

  const data = { tags: "not an array" };
  const schema = { tags: "array" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.tags, ["The tags field must be an array"]);
});

Deno.test("validator handles invalid array field (object)", () => {
  const validator = new Validator();

  const data = { tags: { key: "value" } };
  const schema = { tags: "array" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.tags, ["The tags field must be an array"]);
});

Deno.test("validator handles valid min length for array", () => {
  const validator = new Validator();

  const data = { tags: ["tag1", "tag2", "tag3"] };
  const schema = { tags: "array|min:2" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid min length for array", () => {
  const validator = new Validator();

  const data = { tags: ["tag1"] };
  const schema = { tags: "array|min:2" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.tags, [
    "The tags field must be at least 2 in length",
  ]);
});

Deno.test("validator handles valid max length for array", () => {
  const validator = new Validator();

  const data = { tags: ["tag1", "tag2"] };
  const schema = { tags: "array|max:5" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid max length for array", () => {
  const validator = new Validator();

  const data = { tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"] };
  const schema = { tags: "array|max:5" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.tags, [
    "The tags field must be less than 5 in length",
  ]);
});

Deno.test("validator handles valid null value for array field", () => {
  const validator = new Validator();

  const data = { tags: null };
  const schema = { tags: "array|max:5" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});
