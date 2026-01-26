/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles max length for string (valid)", () => {
  const validator = new Validator();

  const data = { username: "john" };
  const schema = { username: "string|max:20" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles max length for string (invalid)", () => {
  const validator = new Validator();

  const data = { username: "thisusernameiswaytoolongforourvalidation" };
  const schema = { username: "string|max:20" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must be less than 20 in length",
  ]);
});

Deno.test("validator handles max value for numeric (valid)", () => {
  const validator = new Validator();

  const data = { score: 95 };
  const schema = { score: "numeric|max:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles max value for numeric (invalid)", () => {
  const validator = new Validator();

  const data = { score: 150 };
  const schema = { score: "numeric|max:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be less than 100 in length",
  ]);
});

Deno.test("validator handles valid null value for numeric field", () => {
  const validator = new Validator();

  const data = { score: null };
  const schema = { score: "numeric|max:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for numeric field", () => {
  const validator = new Validator();

  const data = { score: undefined };
  const schema = { score: "numeric|max:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});
