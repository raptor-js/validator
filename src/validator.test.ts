/// <reference lib="deno.ns" />
// deno-lint-ignore-file

import { assertEquals, assertExists } from "@std/assert";

import { Context, Kernel } from "@raptor/framework";

import { rules } from "./rules.ts";
import validator from "./helper.ts";
import { schema } from "./schema.ts";

const APP_URL = "http://localhost:8000";

Deno.test("test validator attaches validate method to request", async () => {
  const app = new Kernel();

  app.use(validator);

  let methodExists = false;

  app.use((context: Context) => {
    methodExists = typeof context.request.validate === "function";
    return "OK";
  });

  await app.respond(new Request(APP_URL, { method: "POST" }));

  assertEquals(methodExists, true);
});

Deno.test("test validator attaches validateSafe method to request", async () => {
  const app = new Kernel();

  app.use(validator);

  let methodExists = false;

  app.use((context: Context) => {
    methodExists = typeof context.request.validateSafe === "function";
    return "OK";
  });

  await app.respond(new Request(APP_URL, { method: "POST" }));

  assertEquals(methodExists, true);
});

Deno.test("test validate returns data on successful validation", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(receivedData.name, "Dr. Ian Malcolm");
  assertEquals(receivedData.age, 37);
});

Deno.test("test validateSafe returns success result on valid data", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(result.issues, undefined);
  assertEquals(result.value.name, "Dr. Ellie Satler");
  assertEquals(result.value.email, "john.hammond@ingen.com");
});

Deno.test("test validate throws UnprocessableEntity on validation failure", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(response.status, 422);
});

Deno.test("test validate throws on missing required fields", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(response.status, 422);
});

Deno.test("test validateSafe returns failure result on invalid data", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertExists(result.issues);
  assertEquals(result.value, undefined);
});

Deno.test("test validateSafe does not throw on validation failure", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(threwError, false);
  assertEquals(hasIssues, true);
});

Deno.test("test validateSafe handles missing required fields", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertExists(result.issues);
  assertEquals(result.value, undefined);
});

Deno.test("test validateSafe handles empty request body", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertExists(result.issues);
});

Deno.test("test validate works with nested schemas", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(receivedData.username, "johnhammond");
  assertEquals(receivedData.account.email, "john.hammond@ingen.com");
  assertEquals(receivedData.account.age, 30);
});

Deno.test("test validateSafe works with nested schemas", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(result.issues, undefined);
  assertEquals(result.value.user.profile.name, "John");
  assertEquals(result.value.user.profile.email, "john.hammond@ingen.com");
});

Deno.test("test validate handles optional fields", async () => {
  const app = new Kernel();

  app.use(validator);

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

  assertEquals(receivedData.name, "Ian");
  assertEquals(receivedData.bio, undefined);
});
