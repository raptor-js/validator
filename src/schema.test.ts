import assert from "node:assert/strict";
import { test } from "node:test";

import { rules } from "./rules.ts";
import { schema } from "./schema.ts";

test("schema validates multiple fields successfully", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    age: rules<number>("required|numeric|min:18"),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
    age: 42,
  });

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value.name, "Dr Malcolm");
  assert.deepStrictEqual(result.value.age, 42);
});

test("schema validates empty object when all fields are optional", async () => {
  const optionalSchema = schema({
    name: rules<string>("string"),
    age: rules<number>("numeric"),
  });

  const result = await optionalSchema["~standard"].validate({});

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value.name, undefined);
  assert.deepStrictEqual(result.value.age, undefined);
});

test("schema validates with extra fields in data", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
    extraField: "should be ignored",
  });

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  assert.deepStrictEqual(result.value.name, "Dr Malcolm");
});

test("schema rejects non-object string input", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
  });

  const result = await userSchema["~standard"].validate("not an object");

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues.length, 1);
  assert.deepStrictEqual(result.issues[0].message, "Expected an object");
  assert.deepStrictEqual(result.issues[0].path, []);
});

test("schema rejects null input", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
  });

  const result = await userSchema["~standard"].validate(null);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].message, "Expected an object");
  assert.deepStrictEqual(result.issues[0].path, []);
});

test("schema rejects array input", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
  });

  const result = await userSchema["~standard"].validate([1, 2, 3]);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].message, "Expected an object");
  assert.deepStrictEqual(result.issues[0].path, []);
});

test("schema rejects primitive number input", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
  });

  const result = await userSchema["~standard"].validate(42);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].message, "Expected an object");
});

test("schema rejects undefined input", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
  });

  const result = await userSchema["~standard"].validate(undefined);

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].message, "Expected an object");
});

test("schema collects single field validation error", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    age: rules<number>("required|numeric|min:18"),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
    // age is missing
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues.length, 1);
  assert.deepStrictEqual(result.issues[0].path, ["age"]);
  assert.deepStrictEqual(result.issues[0].message, "The field is required");
});

test("schema collects multiple field validation errors", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    email: rules<string>("required|string"),
    age: rules<number>("required|numeric|min:18"),
  });

  const result = await userSchema["~standard"].validate({
    // All fields missing
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues.length, 3);

  const paths = result.issues.map((i) => i.path?.[0]);

  assert.deepStrictEqual(paths.includes("name"), true);
  assert.deepStrictEqual(paths.includes("email"), true);
  assert.deepStrictEqual(paths.includes("age"), true);
});

test("schema collects multiple errors from same field", async () => {
  const userSchema = schema({
    password: rules<string>("required|string|min:8"),
  });

  const result = await userSchema["~standard"].validate({
    password: "short",
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues.length, 1);
  assert.deepStrictEqual(result.issues[0].path, ["password"]);
  assert.deepStrictEqual(
    result.issues[0].message,
    "The field must be at least 8 in length",
  );
});

test("schema includes field name in issue path", async () => {
  const userSchema = schema({
    username: rules<string>("required|string|min:3"),
  });

  const result = await userSchema["~standard"].validate({
    username: "ab", // Too short
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].path, ["username"]);
});

test("schema preserves nested paths from validators", async () => {
  // This tests that if a validator returns a path like ["nested", "field"],
  // schema prepends the field name to get ["fieldName", "nested", "field"]

  // We'll create a mock validator that returns a nested path
  const mockValidator: any = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: () => ({
        issues: [
          {
            message: "Nested error",
            path: ["nested", "field"],
          },
        ],
      }),
    },
  };

  const testSchema = schema({
    data: mockValidator,
  });

  const result = await testSchema["~standard"].validate({
    data: "anything",
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].path, ["data", "nested", "field"]);
});

test("schema validates some fields while failing others", async () => {
  const userSchema = schema({
    name: rules<string>("required|string"),
    age: rules<number>("required|numeric|min:18"),
    email: rules<string>("string"),
  });

  const result = await userSchema["~standard"].validate({
    name: "Dr Malcolm",
    email: "test@example.com",
    // age is missing
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  // Should only have error for age
  assert.deepStrictEqual(result.issues.length, 1);
  assert.deepStrictEqual(result.issues[0].path, ["age"]);
});

test("schema handles empty schema definition", async () => {
  const emptySchema = schema({});

  const result = await emptySchema["~standard"].validate({
    anything: "goes",
  });

  if ("issues" in result) {
    throw new Error(
      `Expected success but got issues: ${JSON.stringify(result.issues)}`,
    );
  }

  // Should succeed with empty object
  assert.deepStrictEqual(Object.keys(result.value).length, 0);
});

test("schema handles validators that return undefined path", async () => {
  const mockValidator: any = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: () => ({
        issues: [
          {
            message: "Error without path",
            // path is undefined
          },
        ],
      }),
    },
  };

  const testSchema = schema({
    field: mockValidator,
  });

  const result = await testSchema["~standard"].validate({
    field: "test",
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.deepStrictEqual(result.issues[0].path, ["field"]);
});

test("schema catches type mismatch errors", async () => {
  const userSchema = schema({
    age: rules<number>("required|numeric"),
  });

  const result = await userSchema["~standard"].validate({
    age: "not a number",
  });

  if ("value" in result) {
    throw new Error("Expected validation to fail but it succeeded");
  }

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.issues[0].path, ["age"]);
});
