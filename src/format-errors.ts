import type { StandardSchemaV1 } from "@standard-schema/spec";

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
    const field = issue.path?.[0] as string ?? "unknown";

    errors[field] ??= [];
    errors[field].push(issue.message);
  }

  return errors;
};
