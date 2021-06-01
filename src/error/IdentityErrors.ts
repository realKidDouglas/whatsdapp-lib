import {DapiError, InsufficientDashError, NotFoundError, WhatsDappError} from "./WhatsDappError";

type IdentityCreateErrorParent = DapiError | InsufficientDashError;

export class IdentityCreateError extends WhatsDappError<void, IdentityCreateErrorParent, "IdentityCreate"> {
  constructor(parent: IdentityCreateErrorParent) {
    super("failed to create Identity", undefined, parent, "IdentityCreate");
  }
}

type IdentityGetErrorParent = DapiError | NotFoundError;

export class IdentityGetError extends WhatsDappError<string, IdentityGetErrorParent, "IdentityGet"> {
  constructor(identityId: string, parent: IdentityGetErrorParent) {
    super("failed to get Identity", identityId, parent, "IdentityGet");
  }
}

type IdentityTopUpErrorParent = DapiError | NotFoundError | InsufficientDashError;

export class IdentityTopUpError extends WhatsDappError<string, IdentityTopUpErrorParent, "IdentityTopUp"> {
  constructor(identityId: string, parent: IdentityTopUpErrorParent) {
    super("failed to top up Identity", identityId, parent, "IdentityTopUp");
  }
}
