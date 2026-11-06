import assert from "node:assert/strict";
import { test } from "node:test";

import RuleParser, { type RuleFactory } from "./rule-parser.ts";

test("rule parser parses single non-parameterised rule", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required");

  assert.deepStrictEqual(validators.length, 1);
  assert.ok(validators[0]["~standard"] != null);
  assert.deepStrictEqual(validators[0]["~standard"].vendor, "raptor");
});

test("rule parser parses multiple non-parameterised rules", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|string");

  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser parses single parameterised rule", () => {
  const parser = new RuleParser();

  const validators = parser.parse("min:8");

  assert.deepStrictEqual(validators.length, 1);
  assert.ok(validators[0]["~standard"] != null);
});

test("rule parser parses multiple parameterised rules", () => {
  const parser = new RuleParser();

  const validators = parser.parse("min:8|max:100");

  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser parses mixed parameterised and non-parameterised rules", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|string|min:8|max:100");

  assert.deepStrictEqual(validators.length, 4);
});

test("rule parser parses mixed array of parameterised and non-parameterised rules", () => {
  const parser = new RuleParser();

  const validators = parser.parse(["required", "string", "min:8", "max:100"]);

  assert.deepStrictEqual(validators.length, 4);
});

test("rule parser trims whitespace from rule names", () => {
  const parser = new RuleParser();

  const validators = parser.parse(" required | string | min:8 ");

  assert.deepStrictEqual(validators.length, 3);
});

test("rule parser filters out extra pipes", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required||string");

  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser filters out multiple consecutive pipes", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|||string");

  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser filters out leading pipe", () => {
  const parser = new RuleParser();

  const validators = parser.parse("|required|string");

  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser filters out trailing pipe", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|");

  assert.deepStrictEqual(validators.length, 1);
});

test("rule parser filters out whitespace-only segments", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|  |string");

  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser parses numeric parameter", async () => {
  const parser = new RuleParser();

  const validators = parser.parse("min:8");

  const result = await validators[0]["~standard"].validate("short");

  if ("value" in result) {
    throw new Error("Expected validation to fail");
  }

  assert.ok(result.issues != null);
});

test("rule parser parses multiple parameters", () => {
  const parser = new RuleParser();

  const mockFactory = ((...params: any[]) => ({
    "~standard": {
      version: 1 as const,
      vendor: "test",
      validate: () => ({ value: params }),
    },
  })) as RuleFactory;

  parser.register("multi", mockFactory);

  const validators = parser.parse("multi:1,2,3");

  assert.deepStrictEqual(validators.length, 1);
});

test("RuleParser parses string parameter", () => {
  const parser = new RuleParser();

  const mockFactory = ((param: string) => ({
    "~standard": {
      version: 1 as const,
      vendor: "test",
      validate: () => ({ value: param }),
    },
  })) as RuleFactory;

  parser.register("custom", mockFactory);

  const validators = parser.parse("custom:value");
  assert.deepStrictEqual(validators.length, 1);
});

test("rule parser handles colon in parameter value", () => {
  const parser = new RuleParser();

  const mockFactory = ((param: string) => ({
    "~standard": {
      version: 1 as const,
      vendor: "test",
      validate: () => ({ value: param }),
    },
  })) as RuleFactory;

  parser.register("url", mockFactory);

  const validators = parser.parse("url:https://example.com");
  assert.deepStrictEqual(validators.length, 1);
});

test("rule parser converts numeric string parameters to numbers", async () => {
  const parser = new RuleParser();

  let capturedParam: any;

  const mockFactory = ((param: any) => {
    capturedParam = param;

    return {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: () => ({ value: null }),
      },
    };
  }) as RuleFactory;

  parser.register("test", mockFactory);
  const validators = parser.parse("test:42");

  await validators[0]["~standard"].validate(null);

  assert.deepStrictEqual(typeof capturedParam, "number");
  assert.deepStrictEqual(capturedParam, 42);
});

test("rule parser keeps non-numeric string parameters as strings", async () => {
  const parser = new RuleParser();

  let capturedParam: any;

  const mockFactory = ((param: any) => {
    capturedParam = param;

    return {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: () => ({ value: null }),
      },
    };
  }) as RuleFactory;

  parser.register("test", mockFactory);

  const validators = parser.parse("test:abc");

  await validators[0]["~standard"].validate(null);

  assert.deepStrictEqual(typeof capturedParam, "string");
  assert.deepStrictEqual(capturedParam, "abc");
});

test("rule parser handles empty parameter value", () => {
  const parser = new RuleParser();

  let capturedParams: any[];

  const mockFactory = ((...params: any[]) => {
    capturedParams = params;

    return {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: () => ({ value: null }),
      },
    };
  }) as RuleFactory;

  parser.register("test", mockFactory);
  parser.parse("test:");

  assert.deepStrictEqual(capturedParams![0], "");
});

test("rule parser trims parameter values", () => {
  const parser = new RuleParser();

  let capturedParam: any;

  const mockFactory = ((param: any) => {
    capturedParam = param;

    return {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: () => ({ value: null }),
      },
    };
  }) as RuleFactory;

  parser.register("test", mockFactory);
  parser.parse("test: value ");

  assert.deepStrictEqual(capturedParam, "value");
});

test("rule parser trims multiple parameter values", () => {
  const parser = new RuleParser();

  let capturedParams: any[];

  const mockFactory = ((...params: any[]) => {
    capturedParams = params;

    return {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: () => ({ value: null }),
      },
    };
  }) as RuleFactory;

  parser.register("test", mockFactory);
  parser.parse("test: a , b , c ");

  assert.deepStrictEqual(capturedParams![0], "a");
  assert.deepStrictEqual(capturedParams![1], "b");
  assert.deepStrictEqual(capturedParams![2], "c");
});

test("rule parser throws error for unknown non-parameterised rule", () => {
  const parser = new RuleParser();

  assert.throws(
    () => parser.parse("unknown"),
    (error) =>
      error instanceof Error &&
      error.message.includes("Unknown validation rule: unknown"),
  );
});

test("rule parser throws error for unknown parameterised rule", () => {
  const parser = new RuleParser();

  assert.throws(
    () => parser.parse("unknown:8"),
    (error) =>
      error instanceof Error &&
      error.message.includes("Unknown validation rule: unknown"),
  );
});

test("rule parser throws error for unknown rule in chain", () => {
  const parser = new RuleParser();

  assert.throws(
    () => parser.parse("required|unknown|string"),
    (error) =>
      error instanceof Error &&
      error.message.includes("Unknown validation rule: unknown"),
  );
});

test("rule parser registers custom non-parameterised rule", () => {
  const parser = new RuleParser();

  const customRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("custom", customRule);

  const validators = parser.parse("custom");

  assert.deepStrictEqual(validators.length, 1);
  assert.deepStrictEqual(validators[0]["~standard"].vendor, "custom");
});

test("rule parser registers custom parameterised rule", () => {
  const parser = new RuleParser();

  const customFactory = ((param: number) => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom",
      validate: () => ({ value: param }),
    },
  })) as RuleFactory;

  parser.register("custom", customFactory);

  const validators = parser.parse("custom:42");

  assert.deepStrictEqual(validators.length, 1);
});

test("rule parser allows overriding default rules", () => {
  const parser = new RuleParser();

  const customRequired = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom-required",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("required", customRequired);

  const validators = parser.parse("required");

  assert.deepStrictEqual(validators[0]["~standard"].vendor, "custom-required");
});

test("rule parser can chain custom rules with default rules", () => {
  const parser = new RuleParser();

  const customRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("custom", customRule);

  const validators = parser.parse("required|custom|string");

  assert.deepStrictEqual(validators.length, 3);
  assert.deepStrictEqual(validators[1]["~standard"].vendor, "custom");
});

test("rule parser.has() returns true for registered non-parameterised rule", () => {
  const parser = new RuleParser();

  assert.deepStrictEqual(parser.has("required"), true);
  assert.deepStrictEqual(parser.has("string"), true);
});

test("rule parser.has() returns true for registered parameterised rule", () => {
  const parser = new RuleParser();

  assert.deepStrictEqual(parser.has("min:8"), true);
  assert.deepStrictEqual(parser.has("max:100"), true);
});

test("rule parser.has() returns false for unknown rule", () => {
  const parser = new RuleParser();

  assert.deepStrictEqual(parser.has("unknown"), false);
  assert.deepStrictEqual(parser.has("unknown:8"), false);
});

test("rule parser.has() checks base name for parameterised rules", () => {
  const parser = new RuleParser();

  assert.deepStrictEqual(parser.has("min:8"), true);
  assert.deepStrictEqual(parser.has("min:999"), true);
  assert.deepStrictEqual(parser.has("min:abc"), true);
});

test("rule parser.has() returns true for custom registered rule", () => {
  const parser = new RuleParser();

  const customRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("custom", customRule);

  assert.deepStrictEqual(parser.has("custom"), true);
});

test("rule parser.has() returns true for custom parameterised rule", () => {
  const parser = new RuleParser();

  const customFactory = ((param: any) => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("custom", customFactory);

  assert.deepStrictEqual(parser.has("custom:value"), true);
});

test("rule parser registers default non-parameterised rules", () => {
  const parser = new RuleParser();

  assert.deepStrictEqual(parser.has("required"), true);
  assert.deepStrictEqual(parser.has("string"), true);
});

test("rule parser registers default parameterised rules", () => {
  const parser = new RuleParser();

  assert.deepStrictEqual(parser.has("min"), true);
  assert.deepStrictEqual(parser.has("max"), true);
});

test("rule parser can parse all default rules", () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|string|min:1|max:100");

  assert.deepStrictEqual(validators.length, 4);
});

test("rule parser creates functional validators that can validate", async () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|string|min:3");

  let result = await validators[0]["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error("Expected success for required");
  }

  result = await validators[1]["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error("Expected success for string");
  }

  result = await validators[2]["~standard"].validate("hello");

  if ("issues" in result) {
    throw new Error("Expected success for min");
  }
});

test("rule parser validators work correctly in sequence", async () => {
  const parser = new RuleParser();

  const validators = parser.parse("required|string|min:5");

  let value: any = "test";

  for (const validator of validators) {
    const result = await validator["~standard"].validate(value);

    if ("issues" in result) {
      assert.ok(result.issues != null);
      assert.deepStrictEqual(result.issues[0].message.includes("5"), true);

      return;
    }

    value = result.value;
  }

  throw new Error("Expected validation to fail on min:5");
});

test("rule parser validators maintain independence", async () => {
  const parser = new RuleParser();

  const validators1 = parser.parse("min:5");
  const validators2 = parser.parse("min:10");

  const result1 = await validators1[0]["~standard"].validate(7);
  const result2 = await validators2[0]["~standard"].validate(7);

  if ("issues" in result1) {
    throw new Error("Expected 7 to pass min:5");
  }

  if ("value" in result2) {
    throw new Error("Expected 7 to fail min:10");
  }
});

test("rule parser handles empty string by returning empty array", () => {
  const parser = new RuleParser();

  const validators = parser.parse("");
  assert.deepStrictEqual(validators.length, 0);
});

test("rule parser handles single pipe by returning empty array", () => {
  const parser = new RuleParser();

  const validators = parser.parse("|");
  assert.deepStrictEqual(validators.length, 0);
});

test("rule parser handles only whitespace", () => {
  const parser = new RuleParser();

  const validators = parser.parse("   ");
  assert.deepStrictEqual(validators.length, 0);
});

test("rule parser handles pipes with only whitespace between", () => {
  const parser = new RuleParser();

  const validators = parser.parse("|   |   |");
  assert.deepStrictEqual(validators.length, 0);
});

test("rule parser handles complex whitespace and pipe combinations", () => {
  const parser = new RuleParser();

  const validators = parser.parse("  | required |  | string | |  ");
  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser handles very long rule chains", () => {
  const parser = new RuleParser();

  const validators = parser.parse(
    "required|string|min:1|max:100|required|string|min:1|max:100",
  );
  assert.deepStrictEqual(validators.length, 8);
});

test("rule parser handles rule names with different casings", () => {
  const parser = new RuleParser();

  assert.throws(
    () => parser.parse("REQUIRED"),
    (error) =>
      error instanceof Error &&
      error.message.includes("Unknown validation rule: REQUIRED"),
  );

  assert.throws(
    () => parser.parse("Required"),
    (error) =>
      error instanceof Error &&
      error.message.includes("Unknown validation rule: Required"),
  );
});

test("rule parser handles numeric rule names if registered", () => {
  const parser = new RuleParser();

  const numericRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "test",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("123", numericRule);

  const validators = parser.parse("123");
  assert.deepStrictEqual(validators.length, 1);
});

test("rule parser handles special characters in custom rule names", () => {
  const parser = new RuleParser();

  const specialRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "test",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser.register("my-rule", specialRule);
  parser.register("my_rule", specialRule);

  const validators = parser.parse("my-rule|my_rule");
  assert.deepStrictEqual(validators.length, 2);
});

test("rule parser instances are independent", () => {
  const parser1 = new RuleParser();
  const parser2 = new RuleParser();

  const customRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom1",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  parser1.register("custom", customRule);

  assert.deepStrictEqual(parser1.has("custom"), true);
  assert.deepStrictEqual(parser2.has("custom"), false);
});

test("rule parser can be extended without affecting other instances", () => {
  const baseParser = new RuleParser();
  const extendedParser = new RuleParser();

  const customRule = (() => ({
    "~standard": {
      version: 1 as const,
      vendor: "custom",
      validate: () => ({ value: null }),
    },
  })) as RuleFactory;

  extendedParser.register("custom", customRule);

  const baseValidators = baseParser.parse("required|string");
  assert.deepStrictEqual(baseValidators.length, 2);

  const extendedValidators = extendedParser.parse("required|custom|string");
  assert.deepStrictEqual(extendedValidators.length, 3);
});
