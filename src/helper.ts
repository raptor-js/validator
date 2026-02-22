import type { Middleware } from "@raptor/framework";

import Validator from "./validator.ts";
import type { Config } from "./config.ts";

export default function validator(config?: Config): Middleware {
  const instance = new Validator(config);

  return instance.handle;
}
