// Copyright 2026, @briward. All rights reserved. MIT license.

import Validator from "./src/validator.ts";
import RuleParser from "./src/rule-parser.ts";
import helper from "./src/helper.ts";

export type { Rule, RuleFactory } from "./src/interfaces/rule.ts";
export type { InferSchema } from "./src/types/infer-schema.ts";

export { RuleParser, Validator };

export { default as RequiredRule } from "./src/rules/required.ts";
export { default as StringRule } from "./src/rules/string.ts";
export { default as NumericRule } from "./src/rules/numeric.ts";
export { default as BooleanRule } from "./src/rules/boolean.ts";
export { default as DecimalRule } from "./src/rules/decimal.ts";
export { default as IntegerRule } from "./src/rules/integer.ts";
export { default as AlphaRule } from "./src/rules/alpha.ts";
export { default as AlphaNumericRule } from "./src/rules/alpha-numeric.ts";
export { default as AlphaDashRule } from "./src/rules/alpha-dash.ts";
export { default as LowercaseRule } from "./src/rules/lowercase.ts";
export { default as UppercaseRule } from "./src/rules/uppercase.ts";
export { default as EmailRule } from "./src/rules/email.ts";
export { default as UrlRule } from "./src/rules/url.ts";
export { default as ArrayRule } from "./src/rules/array.ts";
export { default as JsonRule } from "./src/rules/json.ts";
export { default as DateRule } from "./src/rules/date.ts";

export { default as MinRule } from "./src/rules/min.ts";
export { default as MaxRule } from "./src/rules/max.ts";
export { default as GreateThanRule } from "./src/rules/greater-than.ts";
export { default as GreaterThanOrEqualRule } from "./src/rules/greater-than-or-equal.ts";
export { default as LessThanRule } from "./src/rules/less-than.ts";
export { default as LessThanOrEqualRule } from "./src/rules/less-than-or-equal.ts";
export { default as StartsWithRule } from "./src/rules/starts-with.ts";
export { default as EndsWithRule } from "./src/rules/ends-with.ts";

export default helper;
