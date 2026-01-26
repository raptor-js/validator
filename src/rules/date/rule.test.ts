/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "../../validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid date field (Date object)", () => {
  const validator = new Validator();

  const data = { created_at: new Date("2025-12-23") };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid date field (ISO string)", () => {
  const validator = new Validator();

  const data = { created_at: "2025-12-23T10:30:00Z" };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid date field (date string)", () => {
  const validator = new Validator();

  const data = { created_at: "December 23, 2025" };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid date field (string)", () => {
  const validator = new Validator();

  const data = { created_at: "not a date" };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.created_at, [
    "The created_at field must be a valid date",
  ]);
});

Deno.test("validator handles invalid date field (invalid date)", () => {
  const validator = new Validator();

  const data = { created_at: "2023-13-45" };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.created_at, [
    "The created_at field must be a valid date",
  ]);
});

Deno.test("validator handles invalid date field (number)", () => {
  const validator = new Validator();

  const data = { created_at: 12345 };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.created_at, [
    "The created_at field must be a valid date",
  ]);
});

Deno.test("validator handles valid null value for date field", () => {
  const validator = new Validator();

  const data = { created_at: null };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles valid undefined value for date field", () => {
  const validator = new Validator();

  const data = { created_at: undefined };
  const schema = { created_at: "date" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});
