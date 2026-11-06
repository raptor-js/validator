import assert from "node:assert/strict";
import { test } from "node:test";

import { Kernel } from "@raptor-js/kernel";
import type { Context } from "@raptor-js/types";

import { rules } from "./rules.ts";
import validator from "./helper.ts";
import { schema } from "./schema.ts";

const APP_URL = "http://localhost:8000";

test("test validator attaches validate method to request", async () => {
  const app = new Kernel();

  app.use(validator());

  let methodExists = false;

  app.use((context: Context) => {
    methodExists = typeof context.request.validate === "function";
    return "OK";
  });

  await app.respond(new Request(APP_URL, { method: "POST" }));

  assert.deepStrictEqual(methodExists, true);
});

test("test validator attaches safe validation method to request", async () => {
  const app = new Kernel();

  app.use(validator());

  let methodExists = false;

  app.use((context: Context) => {
    methodExists = typeof context.request.validateSafe === "function";

    return "OK";
  });

  await app.respond(new Request(APP_URL, { method: "POST" }));

  assert.deepStrictEqual(methodExists, true);
});

test("test validate returns data on successful validation", async () => {
  const app = new Kernel();

  app.use(validator());

  let receivedData: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      age: rules<number>("required|integer|min:18"),
    });

    receivedData = await context.request.validate(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Dr. Ian Malcolm", age: 37 }),
    }),
  );

  assert.deepStrictEqual(receivedData.name, "Dr. Ian Malcolm");
  assert.deepStrictEqual(receivedData.age, 37);
});

test("test safe validation returns success result on valid data", async () => {
  const app = new Kernel();

  app.use(validator());

  let result: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      email: rules<string>("required|email"),
    });

    result = await context.request.validateSafe(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dr. Ellie Satler",
        email: "john.hammond@ingen.com",
      }),
    }),
  );

  assert.deepStrictEqual(result.issues, undefined);
  assert.deepStrictEqual(result.value.name, "Dr. Ellie Satler");
  assert.deepStrictEqual(result.value.email, "john.hammond@ingen.com");
});

test("test validate throws 422 on validation failure", async () => {
  const app = new Kernel();

  app.use(validator());

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      age: rules<number>("required|integer|min:40"),
    });

    await context.request.validate(userSchema);

    return "OK";
  });

  const response = await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ian", age: 37 }),
    }),
  );

  assert.deepStrictEqual(response.status, 422);
});

test("test validate throws on missing required fields", async () => {
  const app = new Kernel();

  app.use(validator());

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      email: rules<string>("required|email"),
    });

    await context.request.validate(userSchema);

    return "OK";
  });

  const response = await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ian" }),
    }),
  );

  assert.deepStrictEqual(response.status, 422);
});

test("test safe validation returns failure result on invalid data", async () => {
  const app = new Kernel();

  app.use(validator());

  let result: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      email: rules<string>("required|email"),
    });

    result = await context.request.validateSafe(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dr. Ellie Satler",
        email: "not-an-email",
      }),
    }),
  );

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.value, undefined);
});

test("test safe validation does not throw on validation failure", async () => {
  const app = new Kernel();

  app.use(validator());

  let threwError = false;
  let hasIssues = false;

  app.use(async (context: Context) => {
    const userSchema = schema({
      age: rules<number>("required|integer|min:40"),
    });

    try {
      const result = await context.request.validateSafe(userSchema);

      if ("issues" in result) {
        hasIssues = true;
      }
    } catch {
      threwError = true;
    }

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: 37 }),
    }),
  );

  assert.deepStrictEqual(threwError, false);
  assert.deepStrictEqual(hasIssues, true);
});

test("test safe validation handles missing required fields", async () => {
  const app = new Kernel();

  app.use(validator());

  let result: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      email: rules<string>("required|email"),
    });

    result = await context.request.validateSafe(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ian" }),
    }),
  );

  assert.ok(result.issues != null);
  assert.deepStrictEqual(result.value, undefined);
});

test("test safe validation handles empty request body", async () => {
  const app = new Kernel();

  app.use(validator());

  let result: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
    });

    result = await context.request.validateSafe(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }),
  );

  assert.ok(result.issues != null);
});

test("test validate works with nested schemas", async () => {
  const app = new Kernel();

  app.use(validator());

  let receivedData: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      username: rules<string>("required|string"),
      account: schema({
        email: rules<string>("required|email"),
        age: rules<number>("required|integer|min:18"),
      }),
    });

    receivedData = await context.request.validate(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "johnhammond",
        account: {
          email: "john.hammond@ingen.com",
          age: 30,
        },
      }),
    }),
  );

  assert.deepStrictEqual(receivedData.username, "johnhammond");
  assert.deepStrictEqual(receivedData.account.email, "john.hammond@ingen.com");
  assert.deepStrictEqual(receivedData.account.age, 30);
});

test("test safe validation works with nested schemas", async () => {
  const app = new Kernel();

  app.use(validator());

  let result: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      user: schema({
        profile: schema({
          name: rules<string>("required|string"),
          email: rules<string>("required|email"),
        }),
      }),
    });

    result = await context.request.validateSafe(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          profile: {
            name: "John",
            email: "john.hammond@ingen.com",
          },
        },
      }),
    }),
  );

  assert.deepStrictEqual(result.issues, undefined);
  assert.deepStrictEqual(result.value.user.profile.name, "John");
  assert.deepStrictEqual(
    result.value.user.profile.email,
    "john.hammond@ingen.com",
  );
});

test("test validate handles optional fields", async () => {
  const app = new Kernel();

  app.use(validator());

  let receivedData: any = null;

  app.use(async (context: Context) => {
    const userSchema = schema({
      name: rules<string>("required|string"),
      bio: rules<string>("string"),
    });

    receivedData = await context.request.validate(userSchema);

    return "OK";
  });

  await app.respond(
    new Request(APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ian" }),
    }),
  );

  assert.deepStrictEqual(receivedData.name, "Ian");
  assert.deepStrictEqual(receivedData.bio, undefined);
});
