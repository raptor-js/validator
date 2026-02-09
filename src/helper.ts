import type { Middleware } from "@raptor/framework";

import Validator from "./validator.ts";

const validator = new Validator();

/**
 * A convenient helper function for the validator package.
 */
export default validator.handle as Middleware;
