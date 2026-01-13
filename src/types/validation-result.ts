export type ValidationResult = {
  valid: boolean;
  data?: Record<string, unknown>;
  errors?: Record<string, string[]>;
};
