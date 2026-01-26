/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid alpha_dash field", () => {
  const validator = new Validator();

  const data = { slug: "my-post_123" };
  const schema = { slug: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid alpha_dash field with unicode", () => {
  const validator = new Validator();

  const data = { slug: "José-post_123" };
  const schema = { slug: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid alpha_dash field (with spaces)", () => {
  const validator = new Validator();

  const data = { slug: "my post 123" };
  const schema = { slug: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.slug, [
    "The slug field must contain only letters, numbers, dashes, and underscores",
  ]);
});

Deno.test("validator handles invalid alpha_dash field (with special chars)", () => {
  const validator = new Validator();

  const data = { slug: "my@post" };
  const schema = { slug: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.slug, [
    "The slug field must contain only letters, numbers, dashes, and underscores",
  ]);
});

Deno.test("validator handles valid null alpha_dash field", () => {
  const validator = new Validator();

  const data = { name: null };
  const schema = { name: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid undefined alpha_dash field", () => {
  const validator = new Validator();

  const data = { name: undefined };
  const schema = { name: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid scalar type alpha_dash field", () => {
  const validator = new Validator();

  const data = { name: 123 };
  const schema = { name: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
});

Deno.test("validator handles invalid empty alpha_dash field", () => {
  const validator = new Validator();

  const data = { name: "" };
  const schema = { name: "alpha_dash" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
});
