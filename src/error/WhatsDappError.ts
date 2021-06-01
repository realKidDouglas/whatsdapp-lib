import {DashWalletAccount} from "../dapi/dash_client/DashWalletAccount";

// we need to use branded types since with just WhatsDappError<Context>,
// typescript thinks this is OK:
// const a : DocumentUpdateError = new DocumentCreateError("hello", null);
// (both are WhatsDappError<string>)

export class WhatsDappError<Context, Parent, Brand> extends Error {
  context: Context;
  _brand: Brand;
  parent: Parent;

  constructor(message: string, context: Context, parent: Parent, brand: Brand) {
    super(message);
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
    this.context = context;
    this.parent = parent;
    this._brand = brand;
  }
}

/**
 * Something went wrong during communication with the DAPI
 */
export class DapiError extends WhatsDappError<string, unknown, "Dapi"> {
  constructor(fn: string, parent: unknown) {
    super("dapi access failed", fn, parent, "Dapi");
  }
}

/**
 * issued when some precondition is not fulfilled
 */
export class PreconditionFailedError extends WhatsDappError<void, void, "PreconditionFailed"> {
  constructor() {
    super("some precondition failed", undefined, undefined, "PreconditionFailed");
  }
}

/**
 * issued when the wallet has not enough dash for an operation.
 */
export class InsufficientDashError extends WhatsDappError<Promise<DashWalletAccount>, Error, "InsufficientDash"> {
  constructor(account: Promise<DashWalletAccount>, parent: Error) {
    super("wallet has not enough funds", account, parent, "InsufficientDash");
  }
}

/**
 * issued when identityId has not enough funds for a transition
 */
export class InsufficientCreditsError extends WhatsDappError<string, Error, "InsufficientCredits"> {
  constructor(identityId: string, parent: Error) {
    super("identity has not enough funds", identityId, parent, "InsufficientCredits");
  }
}

export class NotFoundError extends WhatsDappError<void, void, "NotFound"> {
  constructor() {
    super("not found", undefined, undefined, "NotFound");
  }
}

/**
 * issued when any operations requiring signatures were attempted
 * before providing credentials
 */
export class NoCredentialsError extends WhatsDappError<void, void, "NoCredentials"> {
  constructor() {
    super("not yet connected", undefined, undefined, "NoCredentials");
  }
}

export function isInsufficientDashError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  return e.message.startsWith("Not enough balance (") && e.message.includes("to cover burn amount");
}

export function isInsufficientCreditsError(e: unknown): boolean {
  if (!(e instanceof Error && hasOwnProperty(e, 'code'))) return false;
  return e.code === 9 && e.message.includes("Failed precondition: Not enough credits");
}

/**
 * errors that occur when attempting operations on identities that don't exist.
 */
export function isIdentityNotFoundError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  return e.message.startsWith("StateTransition is invalid") && e.message.includes('"message":"Identity not found"');
}

/**
 * returns true for a number of error types that are out of our control that
 * can be thrown together under the type "DapiError"
 */
export function isDapiError(e: Error): boolean {
  return e.message.startsWith("Error: Request failed with status code 502");
}

export function isNameTakenError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  return e.message.includes('Invalid state transition: DuplicateDocumentError: Duplicate Document found');
}

export function isInvalidNameError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  return e.message.includes("Invalid Document: \"should match pattern \"");
}

/**
 * check that an unknown object has a property without ts yelling at us
 * @param obj
 * @param prop
 */
function hasOwnProperty<X, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.entries(obj).find(e => e[0] === prop) != null;
}
