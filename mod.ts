// Copyright 2026, @raptor-http. All rights reserved. MIT license.

import Validator from "./src/validator.ts";
import RuleParser from "./src/rule-parser.ts";
import helper from "./src/helper.ts";

export type { Rule, RuleFactory } from "./src/interfaces/rule.ts";
export type { InferSchema } from "./src/types/infer-schema.ts";

export { RuleParser, Validator };

export { default as RequiredRule } from "./src/rules/required/rule.ts";
export { default as StringRule } from "./src/rules/string/rule.ts";
export { default as NumericRule } from "./src/rules/numeric/rule.ts";
export { default as BooleanRule } from "./src/rules/boolean/rule.ts";
export { default as DecimalRule } from "./src/rules/decimal/rule.ts";
export { default as IntegerRule } from "./src/rules/integer/rule.ts";
export { default as AlphaRule } from "./src/rules/alpha/rule.ts";
export { default as AlphaNumericRule } from "./src/rules/alpha-numeric/rule.ts";
export { default as AlphaDashRule } from "./src/rules/alpha-dash/rule.ts";
export { default as LowercaseRule } from "./src/rules/lowercase/rule.ts";
export { default as UppercaseRule } from "./src/rules/uppercase/rule.ts";
export { default as EmailRule } from "./src/rules/email/rule.ts";
export { default as UrlRule } from "./src/rules/url/rule.ts";
export { default as ArrayRule } from "./src/rules/array/rule.ts";
export { default as JsonRule } from "./src/rules/json/rule.ts";
export { default as DateRule } from "./src/rules/date/rule.ts";

export { default as MinRule } from "./src/rules/min/rule.ts";
export { default as MaxRule } from "./src/rules/max/rule.ts";
export { default as GreateThanRule } from "./src/rules/greater-than/rule.ts";
export { default as GreaterThanOrEqualRule } from "./src/rules/greater-than-or-equal/rule.ts";
export { default as LessThanRule } from "./src/rules/less-than/rule.ts";
export { default as LessThanOrEqualRule } from "./src/rules/less-than-or-equal/rule.ts";
export { default as StartsWithRule } from "./src/rules/starts-with/rule.ts";
export { default as EndsWithRule } from "./src/rules/ends-with/rule.ts";

export default helper;
