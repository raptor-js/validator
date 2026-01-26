/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid starts_with field (single prefix)", () => {
  const validator = new Validator();

  const data = { url: "https://example.com" };
  const schema = { url: "starts_with:https" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid starts_with field (multiple prefixes)", () => {
  const validator = new Validator();

  const data = { url: "http://example.com" };
  const schema = { url: "starts_with:http,https" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid starts_with field", () => {
  const validator = new Validator();

  const data = { url: "ftp://example.com" };
  const schema = { url: "starts_with:http,https" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.url, [
    'The url field must start with one of: "http", "https"',
  ]);
});

Deno.test("validator handles valid null value for starts_with field", () => {
  const validator = new Validator();

  const data = { url: null };
  const schema = { url: "starts_with:http,https" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for starts_with field", () => {
  const validator = new Validator();

  const data = { url: undefined };
  const schema = { url: "starts_with:http,https" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for starts_with field", () => {
  const validator = new Validator();

  const data = { url: 123 };
  const schema = { url: "starts_with:http,https" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
