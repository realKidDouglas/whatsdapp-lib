import {WhatsDappError} from "./WhatsDappError";

export class DocumentCreateError extends WhatsDappError<string, unknown, "DocumentCreate"> {
  constructor(locator: string, parent: unknown) {
    super("failed to create document", locator, parent, "DocumentCreate");
  }
}

export class DocumentBroadcastError extends WhatsDappError<void, unknown, "DocumentBroadcast"> {
  constructor(parent: unknown) {
    super("failed to broadcast document", undefined, parent, "DocumentBroadcast");
  }
}
