import type { StandardSchemaV1 } from "./types/standard-schema-v1.ts";

/**
 * Format standard schema issues into correct format.
 *
 * @param issues Validation issues.
 *
 * @returns Formatted errors.
 */
export default (
  issues: readonly StandardSchemaV1.Issue[],
): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = issue.path && issue.path.length > 0
      ? issue.path.join(".")
      : "unknown";

    errors[field] ??= [];
    errors[field].push(issue.message);
  }

  return errors;
};
