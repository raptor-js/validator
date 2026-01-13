type InferRule<R extends string> = R extends `${string}string${string}` ? string
  : R extends `${string}number${string}` ? number
  : R extends `${string}boolean${string}` ? boolean
  : unknown;

export type InferSchema<T extends Record<string, string>> = {
  [K in keyof T]: InferRule<T[K]>;
};
