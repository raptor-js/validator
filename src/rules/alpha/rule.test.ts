/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid alpha field", () => {
  const validator = new Validator();

  const data = { name: "JohnDoe" };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid alpha field with unicode", () => {
  const validator = new Validator();

  const data = { name: "José" };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid alpha field (with numbers)", () => {
  const validator = new Validator();

  const data = { name: "John123" };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.name, [
    "The name field must contain only alphabetic characters",
  ]);
});

Deno.test("validator handles invalid alpha field (with spaces)", () => {
  const validator = new Validator();

  const data = { name: "John Doe" };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.name, [
    "The name field must contain only alphabetic characters",
  ]);
});

Deno.test("validator handles invalid alpha field (with special chars)", () => {
  const validator = new Validator();

  const data = { name: "John-Doe" };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.name, [
    "The name field must contain only alphabetic characters",
  ]);
});

Deno.test("validator handles undefined alpha field", () => {
  const validator = new Validator();

  const data = { name: undefined };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid scalar value alpha field", () => {
  const validator = new Validator();

  const data = { name: 123 };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
});

Deno.test("validator handles invalid empty value alpha field", () => {
  const validator = new Validator();

  const data = { name: "" };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
});

Deno.test("validator handles null alpha field", () => {
  const validator = new Validator();

  const data = { name: null };
  const schema = { name: "alpha" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});
