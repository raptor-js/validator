/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid url field", () => {
  const validator = new Validator();

  const data = { website: "https://example.com" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid url field with path", () => {
  const validator = new Validator();

  const data = { website: "https://example.com/path/to/page" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid url field with query params", () => {
  const validator = new Validator();

  const data = { website: "https://example.com?search=test&page=1" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid url field with http", () => {
  const validator = new Validator();

  const data = { website: "http://example.com" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid url field (no protocol)", () => {
  const validator = new Validator();

  const data = { website: "example.com" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.website, [
    "The website field must be a valid URL",
  ]);
});

Deno.test("validator handles invalid url field (invalid protocol)", () => {
  const validator = new Validator();

  const data = { website: "ftp://example.com" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.website, [
    "The website field must be a valid URL",
  ]);
});

Deno.test("validator handles invalid url field (malformed)", () => {
  const validator = new Validator();

  const data = { website: "not a url" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.website, [
    "The website field must be a valid URL",
  ]);
});

Deno.test("validator handles valid null value for url field", () => {
  const validator = new Validator();

  const data = { website: null };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for url field", () => {
  const validator = new Validator();

  const data = { website: undefined };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles invalid scalar type value for url field", () => {
  const validator = new Validator();

  const data = { website: 123 };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});

Deno.test("validator handles invalid empty value for url field", () => {
  const validator = new Validator();

  const data = { website: "" };
  const schema = { website: "url" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
});
