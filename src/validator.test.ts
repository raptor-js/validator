/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import Validator from "./validator.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("validator handles valid string field", () => {
  const validator = new Validator();

  const data = { name: "John Doe" };
  const schema = { name: "string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
  assertEquals(result.errors, undefined);
});

Deno.test("validator handles invalid string field", () => {
  const validator = new Validator();

  const data = { name: 123 };
  const schema = { name: "string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertEquals(result.data, undefined);
  assertExists(result.errors);
  assertEquals(result.errors?.name, ["The name field must be a string"]);
});

Deno.test("validator handles valid numeric field", () => {
  const validator = new Validator();

  const data = { age: 25 };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid numeric field", () => {
  const validator = new Validator();

  const data = { age: "twenty-five" };
  const schema = { age: "numeric" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, ["The age field must be numeric"]);
});

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

Deno.test("validator handles valid integer field", () => {
  const validator = new Validator();

  const data = { count: 42 };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid integer field (decimal)", () => {
  const validator = new Validator();

  const data = { count: 42.5 };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.count, ["The count field must be an integer"]);
});

Deno.test("validator handles invalid integer field (string)", () => {
  const validator = new Validator();

  const data = { count: "42" };
  const schema = { count: "integer" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.count, ["The count field must be an integer"]);
});

Deno.test("validator handles valid decimal field", () => {
  const validator = new Validator();

  const data = { price: 19.99 };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid decimal field (integer)", () => {
  const validator = new Validator();

  const data = { price: 20 };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.price, [
    "The price field must be a decimal number",
  ]);
});

Deno.test("validator handles invalid decimal field (string)", () => {
  const validator = new Validator();

  const data = { price: "19.99" };
  const schema = { price: "decimal" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.price, [
    "The price field must be a decimal number",
  ]);
});

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

Deno.test("validator handles valid alpha_num field", () => {
  const validator = new Validator();

  const data = { username: "User123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid alpha_num field with unicode", () => {
  const validator = new Validator();

  const data = { username: "José123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid alpha_num field (with spaces)", () => {
  const validator = new Validator();

  const data = { username: "User 123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must contain only letters and numbers",
  ]);
});

Deno.test("validator handles invalid alpha_num field (with special chars)", () => {
  const validator = new Validator();

  const data = { username: "User-123" };
  const schema = { username: "alpha_num" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must contain only letters and numbers",
  ]);
});

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

Deno.test("validator handles valid lowercase field", () => {
  const validator = new Validator();

  const data = { username: "johndoe" };
  const schema = { username: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid lowercase field", () => {
  const validator = new Validator();

  const data = { username: "JohnDoe" };
  const schema = { username: "lowercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.username, [
    "The username field must be lowercase",
  ]);
});

Deno.test("validator handles valid uppercase field", () => {
  const validator = new Validator();

  const data = { code: "ABC123" };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid uppercase field", () => {
  const validator = new Validator();

  const data = { code: "Abc123" };
  const schema = { code: "uppercase" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.code, ["The code field must be uppercase"]);
});

Deno.test("validator handles valid email field", () => {
  const validator = new Validator();

  const data = { email: "user@example.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid email field with subdomains", () => {
  const validator = new Validator();

  const data = { email: "user@mail.example.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid email field with plus", () => {
  const validator = new Validator();

  const data = { email: "user+tag@example.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid email field (no @)", () => {
  const validator = new Validator();

  const data = { email: "userexample.com" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    "The email field must be a valid email address",
  ]);
});

Deno.test("validator handles invalid email field (no domain)", () => {
  const validator = new Validator();

  const data = { email: "user@" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    "The email field must be a valid email address",
  ]);
});

Deno.test("validator handles invalid email field (no TLD)", () => {
  const validator = new Validator();

  const data = { email: "user@example" };
  const schema = { email: "email" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    "The email field must be a valid email address",
  ]);
});

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

Deno.test("validator handles min length for array (valid)", () => {
  const validator = new Validator();

  const data = { tags: ["tag1", "tag2", "tag3"] };
  const schema = { tags: "array|min:2" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles min length for array (invalid)", () => {
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

Deno.test("validator handles max length for array (valid)", () => {
  const validator = new Validator();

  const data = { tags: ["tag1", "tag2"] };
  const schema = { tags: "array|max:5" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles max length for array (invalid)", () => {
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

Deno.test("validator handles valid gt field", () => {
  const validator = new Validator();

  const data = { score: 85 };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid gt field (equal)", () => {
  const validator = new Validator();

  const data = { score: 50 };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be greater than 50",
  ]);
});

Deno.test("validator handles invalid gt field (less)", () => {
  const validator = new Validator();

  const data = { score: 30 };
  const schema = { score: "numeric|gt:50" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be greater than 50",
  ]);
});

Deno.test("validator handles valid gte field", () => {
  const validator = new Validator();

  const data = { age: 18 };
  const schema = { age: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid gte field (greater)", () => {
  const validator = new Validator();

  const data = { age: 25 };
  const schema = { age: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid gte field", () => {
  const validator = new Validator();

  const data = { age: 16 };
  const schema = { age: "numeric|gte:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, [
    "The age field must be greater than or equal to 18",
  ]);
});

Deno.test("validator handles valid lt field", () => {
  const validator = new Validator();

  const data = { score: 75 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid lt field (equal)", () => {
  const validator = new Validator();

  const data = { score: 100 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be less than 100",
  ]);
});

Deno.test("validator handles invalid lt field (greater)", () => {
  const validator = new Validator();

  const data = { score: 150 };
  const schema = { score: "numeric|lt:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.score, [
    "The score field must be less than 100",
  ]);
});

Deno.test("validator handles valid lte field", () => {
  const validator = new Validator();

  const data = { percentage: 100 };
  const schema = { percentage: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid lte field (less)", () => {
  const validator = new Validator();

  const data = { percentage: 75 };
  const schema = { percentage: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid lte field", () => {
  const validator = new Validator();

  const data = { percentage: 150 };
  const schema = { percentage: "numeric|lte:100" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.percentage, [
    "The percentage field must be less than or equal to 100",
  ]);
});

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

Deno.test("validator handles valid ends_with field (single suffix)", () => {
  const validator = new Validator();

  const data = { email: "user@example.com" };
  const schema = { email: "ends_with:.com" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles valid ends_with field (multiple suffixes)", () => {
  const validator = new Validator();

  const data = { email: "user@example.org" };
  const schema = { email: "ends_with:.com,.org,.net" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
  assertEquals(result.data, data);
});

Deno.test("validator handles invalid ends_with field", () => {
  const validator = new Validator();

  const data = { email: "user@example.co.uk" };
  const schema = { email: "ends_with:.com,.org" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, [
    'The email field must end with one of: ".com", ".org"',
  ]);
});

Deno.test("validator handles required field present", () => {
  const validator = new Validator();

  const data = { email: "test@example.com" };
  const schema = { email: "required|string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles required field missing", () => {
  const validator = new Validator();

  const data = {};
  const schema = { email: "required|string" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, ["The email field is required"]);
});

Deno.test("validator handles required field empty string", () => {
  const validator = new Validator();

  const data = { email: "   " };
  const schema = { email: "required" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.email, ["The email field is required"]);
});

Deno.test("validator handles min length for string (valid)", () => {
  const validator = new Validator();

  const data = { password: "12345678" };
  const schema = { password: "string|min:8" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles min length for string (invalid)", () => {
  const validator = new Validator();

  const data = { password: "1234" };
  const schema = { password: "string|min:8" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.password, [
    "The password field must be at least 8 in length",
  ]);
});

Deno.test("validator handles min value for numeric (valid)", () => {
  const validator = new Validator();

  const data = { age: 21 };
  const schema = { age: "numeric|min:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, true);
});

Deno.test("validator handles min value for numeric (invalid)", () => {
  const validator = new Validator();

  const data = { age: 16 };
  const schema = { age: "numeric|min:18" };

  const result = validator.validate(data, schema);

  assertEquals(result.valid, false);
  assertExists(result.errors);
  assertEquals(result.errors?.age, [
    "The age field must be at least 18 in length",
  ]);
});

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
