import {DashIdentity, DashPlatform, DpnsNameDocument} from "./dash_client/DashClient";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {DpnsRegisterError, DpnsResolveError, DpnsUnavailableError, DpnsUnavailableReason} from "../error/DpnsErrors";
import {DapiError, isInvalidNameError, isNameTakenError, NotFoundError} from "../error/WhatsDappError";
import {get} from "./Identity_DAO";

/**
 * Register a name at dash platform
 * @param platform
 * @param identity
 * @param name: The name for the dpns-name registration (name+.dash)
 * @returns check if everything is fine
 */
export function create(
  platform: DashPlatform,
  identity: DashIdentity,
  name: string
): ResultAsync<DpnsNameDocument, DpnsRegisterError> {
  return ResultAsync.fromPromise(
    platform.names.register(name, {dashUniqueIdentityId: identity.getId()}, identity),
    e => {
      if (isNameTakenError(e)) return new DpnsUnavailableError(DpnsUnavailableReason.Taken, e);
      else if (isInvalidNameError(e)) return new DpnsUnavailableError(DpnsUnavailableReason.Invalid, e);
      return new DapiError('platform.names.register', e);
    }
  ).mapErr(e => new DpnsRegisterError(name, e));
}

/**
 * get a list of dpns names that are registered for an identity
 * @param platform {Platform} dapi access object
 * @param identityId {string} identityId for which to retrieve the registered dpns names
 */
export function getByIdentity(
  platform: DashPlatform,
  identityId: string
): ResultAsync<Array<string>, DapiError> {
  const convertDocuments = (documents: Array<DpnsNameDocument>): Array<string> => documents
    .map(r => `${r.data.normalizedLabel}.${r.data.normalizedParentDomainName}`);

  return ResultAsync.fromPromise(
    platform.names.resolveByRecord('dashUniqueIdentityId', identityId),
    e => new DapiError('platform.names.resolveByRecord', e)
  ).map(convertDocuments);
}

/**
 * get the documents belonging to a list of DPNS names
 */
export function getAll(
  platform: DashPlatform,
  names: Array<string>
): ResultAsync<Array<DpnsNameDocument | null>, DapiError> {
  const resolvePromises = names.map(n => platform.names.resolve(n));

  return ResultAsync.fromPromise(
    Promise.all(resolvePromises),
    e => new DapiError('platform.names.resolve', e instanceof Error ? e : null)
  );
}

/**
 * Resolve a dpns-name to an identity
 * @param platform
 * @param name: The dpns name (name+.dash)
 * @returns The identity which belongs to the name
 */
export function resolve(
  platform: DashPlatform,
  name: string
): ResultAsync<DashIdentity, DpnsResolveError> {
  // first, get the name document
  const nameGetRes = ResultAsync.fromPromise(
    platform.names.resolve(name),
    e => new DapiError('platform.names.resolve', e instanceof Error ? e : null)
  ).andThen(dpnsContract => dpnsContract == null
    ? errAsync<DpnsNameDocument, NotFoundError | DapiError>(new NotFoundError())
    : okAsync<DpnsNameDocument, NotFoundError | DapiError>(dpnsContract)
  );

  // find its owning identity
  const identityGetRes = nameGetRes.andThen(dpnsContract => {
    const id = typeof dpnsContract.ownerId === 'string'
      ? dpnsContract.ownerId
      : dpnsContract.ownerId.toJSON();
    return get(platform, id);
  });

  // map errors
  return identityGetRes.mapErr(e => new DpnsResolveError(name, e));
}
