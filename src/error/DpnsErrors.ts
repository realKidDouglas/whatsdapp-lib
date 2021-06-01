import {DapiError, InsufficientCreditsError, NotFoundError, WhatsDappError} from "./WhatsDappError";
import {IdentityGetError} from "./IdentityErrors";

export enum DpnsUnavailableReason {
  Taken,
  Invalid
}

export class DpnsUnavailableError extends WhatsDappError<DpnsUnavailableReason, unknown, "DpnsUnavailable"> {
  constructor(reason: DpnsUnavailableReason, parent: unknown) {
    super("name is unavailable", reason, parent, "DpnsUnavailable");
  }
}

type DpnsRegisterErrorParent = DapiError | InsufficientCreditsError | DpnsUnavailableError;

export class DpnsRegisterError extends WhatsDappError<string, DpnsRegisterErrorParent, "DpnsRegister"> {
  constructor(name: string, parent: DpnsRegisterErrorParent) {
    super("failed to register dpns name", name, parent, "DpnsRegister");
  }
}

type DpnsGetErrorParent = DapiError | NotFoundError;

export class DpnsGetError extends WhatsDappError<string, DpnsGetErrorParent, "DpnsGet"> {
  constructor(identityId: string, parent: DpnsGetErrorParent) {
    super("failed to get dpns names for", identityId, parent, "DpnsGet");
  }
}

type DpnsResolveErrorParent = DapiError | NotFoundError | IdentityGetError;

export class DpnsResolveError extends WhatsDappError<string, DpnsResolveErrorParent, "DpnsResolve"> {
  constructor(name: string, parent: DpnsResolveErrorParent) {
    super("failed to resolve name", name, parent, "DpnsResolve");
  }
}
