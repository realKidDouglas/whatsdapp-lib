import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {
  DapiError,
  InsufficientDashError,
  isIdentityNotFoundError,
  isInsufficientDashError,
  NotFoundError,
} from "../error/WhatsDappError";
import {DashIdentity, DashPlatform} from "./dash_client/DashClient";
import {IdentityCreateError, IdentityGetError, IdentityTopUpError} from "../error/IdentityErrors";

export function create(
  platform: DashPlatform
): ResultAsync<DashIdentity, IdentityCreateError> {
  return ResultAsync.fromPromise(
    platform.identities.register(),
    e => {
      if (!(e instanceof Error)) return new DapiError("platform.identities.register", null);
      if (isInsufficientDashError(e)) return new InsufficientDashError(platform.client.getWalletAccount(), e);
      return new DapiError("platform.identities.register", e);
    }
  ).mapErr(e => new IdentityCreateError(e));
}

export function get(
  platform: DashPlatform,
  identityId: string
): ResultAsync<DashIdentity, IdentityGetError> {
  const resAsync = ResultAsync.fromPromise(
    platform.identities.get(identityId),
    e => new DapiError("platform.identities.get", e instanceof Error ? e : null)
  ).mapErr(e => new IdentityGetError(identityId, e));

  return resAsync.andThen(identity => identity == null
    ? errAsync(new IdentityGetError(identityId, new NotFoundError()))
    : okAsync(identity)
  );
}

/**
 * get a list of identity Ids that are associated with the current wallet.
 * @param platform
 */
export function getWalletIdentityIds(platform: DashPlatform): ResultAsync<Array<string>, DapiError> {
  return ResultAsync.fromPromise(
    platform.client.getWalletAccount(),
    e => new DapiError('platform.client.getWalletAccount', e instanceof Error ? e : null)
  ).map(account => account.identities.getIdentityIds());
}

/**
 * Top up the given identity in the connection with extra credits
 * @param platform
 * @param identityId
 * @param topUpAmount {number} in credits
 * @returns check if everything is fine
 */
export function topUpIdentity(
  platform: DashPlatform,
  identityId: string,
  topUpAmount: number
): ResultAsync<boolean, IdentityTopUpError> {
  return ResultAsync.fromPromise(
    platform.identities.topUp(identityId, topUpAmount),
    e => {
      if (!(e instanceof Error)) return new DapiError('platform.identities.topUp', null);
      else if (isInsufficientDashError(e)) return new InsufficientDashError(platform.client.getWalletAccount(), e);
      else if (isIdentityNotFoundError(e)) return new NotFoundError();
      return new DapiError('platform.identities.topUp', e as Error);
    }
  ).mapErr(e => new IdentityTopUpError(identityId, e));
}
