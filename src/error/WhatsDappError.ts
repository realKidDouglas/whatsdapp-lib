
export class WhatsDappError extends Error {
  constructor(message?: string) {
    super(message);
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }
}

export class IdentityCreateError extends WhatsDappError {
  constructor(message?: string) {
    super(message);
  }
}
