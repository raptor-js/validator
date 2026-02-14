import type { StandardSchemaV1 } from "@standard-schema/spec";

import { ruleParser } from "./rule-parser.ts";

/**
 * Creates a validator from a pipe-separated rule string or array of rule strings.
 *
 * @param rules A pipe-separated rule (e.g., "required|string|min:8") or array of rule strings or validators.
 *
 * @returns A standard schema validator that runs all rules in sequence.
 */
export function rules<T = unknown>(
  rules: string | Array<string | StandardSchemaV1>,
): StandardSchemaV1<T> {
  const validators = ruleParser.parse(rules);

  return {
    "~standard": {
      version: 1,
      vendor: "raptor",
      async validate(value): Promise<StandardSchemaV1.Result<T>> {
        let current = value;

        for (const validator of validators) {
          const result = await validator["~standard"].validate(current);

          if ("issues" in result) {
            return result as StandardSchemaV1.FailureResult;
          }

          current = result.value;
        }

        return { value: current as T };
      },
    },
  };
}
