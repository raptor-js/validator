import type { StandardSchemaV1 } from "@standard-schema/spec";

import RuleParser from "./rule-parser.ts";

/**
 * Creates a validator from a pipe-separated rule string.
 *
 * @param ruleString A pipe-separated rule (e.g., "required|string|min:8")
 *
 * @returns A standard schema validator that runs all rules in sequence.
 */
export function pipe<T = unknown>(ruleString: string): StandardSchemaV1<T> {
  const parser = new RuleParser();

  const validators = parser.parse(ruleString);
  
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
      }
    }
  };
}
