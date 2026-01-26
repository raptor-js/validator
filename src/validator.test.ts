/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { Context } from "@raptor/framework";
import { assertEquals, assertExists } from "@std/assert";

import Validator from "./validator.ts";
import RuleParser from "./rule-parser.ts";

Deno.test("validator handles multiple fields with mixed validity", () => {
  const validator = new Validator();

  const data = {
    name: "John",
    age: "not-a-number",
    email: "john@example.com",
  };

  const schema = {
    name: "required|string",
    age: "required|numeric",
    email: "required|string",
  };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, ["The age field must be numeric"]);
  assertEquals(result.errors?.name, undefined);
  assertEquals(result.errors?.email, undefined);
});

Deno.test("validator handles multiple validation errors on single field", () => {
  const validator = new Validator();

  const data = { password: 5 };

  const schema = { password: "required|string|min:8" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.password?.length, 2);
  assertEquals(result.errors?.password, [
    "The password field must be a string",
    "The password field must be at least 8 in length",
  ]);
});

Deno.test("validator handles optional field can be undefined", () => {
  const validator = new Validator();

  const data = { name: "John" };

  const schema = { name: "string", bio: "string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles optional field can be null", () => {
  const validator = new Validator();

  const data = { name: "John", bio: null };

  const schema = { name: "string", bio: "string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles complex valid scenario", () => {
  const validator = new Validator();

  const data = {
    username: "johndoe",
    email: "john@example.com",
    age: 25,
    subscribed: true,
    bio: "Hello world",
  };

  const schema = {
    username: "required|string|min:3|max:20",
    email: "required|string|email",
    age: "required|numeric|min:18|max:120",
    subscribed: "boolean",
    bio: "string|max:500",
  };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
  assertEquals(result.errors, undefined);
});

Deno.test("validator handles complex scenario with new rules", () => {
  const validator = new Validator();

  const data = {
    name: "JohnDoe",
    username: "johndoe",
    code: "ABC123",
    email: "john@example.com",
    website: "https://example.com",
    price: 19.99,
    quantity: 5,
  };

  const schema = {
    name: "required|alpha",
    username: "required|string|lowercase",
    code: "required|uppercase",
    email: "required|email|ends_with:.com,.org",
    website: "required|starts_with:http,https",
    price: "required|decimal",
    quantity: "required|integer",
  };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
  assertEquals(result.errors, undefined);
});

Deno.test("validator handles comprehensive scenario with all new rules", () => {
  const validator = new Validator();

  const data = {
    username: "user123",
    slug: "my-awesome-post_2025",
    tags: ["javascript", "typescript", "deno"],
    config: '{"theme": "dark"}',
    website: "https://example.com",
    created_at: "2025-12-23T10:30:00Z",
    age: 25,
    score: 85.5,
  };

  const schema = {
    username: "required|alpha_num|lowercase",
    slug: "required|alpha_dash",
    tags: "required|array|min:1|max:5",
    config: "required|json",
    website: "required|url",
    created_at: "required|date",
    age: "required|integer|gte:18|lte:100",
    score: "required|decimal|gt:0|lt:100",
  };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
  assertEquals(result.errors, undefined);
});

Deno.test("validator accepts custom parser", () => {
  const customParser = new RuleParser();

  const validator = new Validator(customParser);

  assertEquals(validator.getParser(), customParser);
});

Deno.test("validator returns parser instance", () => {
  const validator = new Validator();

  const parser = validator.getParser();

  assertExists(parser);
  assertEquals(parser instanceof RuleParser, true);
});

Deno.test("validator middleware attaches validate method to request", async () => {
  const validator = new Validator();

  const middleware = validator.handle;

  const request = new Request("http://localhost/test", {
    method: "POST",
    body: JSON.stringify({
      name: "Dr Alan Grant",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const context = { request } as Context;

  let nextCalled = false;

  const next = () => {
    nextCalled = true;
  };

  await middleware(context, next);

  assertEquals(nextCalled, true);
  assertExists((request as any).validate);
});
