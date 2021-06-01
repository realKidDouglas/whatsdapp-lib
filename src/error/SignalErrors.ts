import {WhatsDappError} from "./WhatsDappError";

/**
 * TODO: replace with more specific errors
 */
export class SignalError extends WhatsDappError<void, unknown, "Signal"> {
  constructor(parent: unknown) {
    super("signal failed", undefined, parent, "Signal");
  }
}
