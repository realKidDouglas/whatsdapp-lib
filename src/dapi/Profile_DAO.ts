import type {RawProfile, WhatsDappProfileContent} from "../WhatsDapp";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {DashIdentity, DashPlatform, DocumentsBatchTransition, StateTransitionBatch} from "./dash_client/DashClient";
import {tryDocumentBroadcast, tryDocumentCreate, tryDocumentGet} from "./dapi_utils";
import {downcast} from "../types/downcast";
import {DapiError, InsufficientCreditsError, NotFoundError} from "../error/WhatsDappError";
import {DocumentCreateError} from "../error/DocumentErrors";

/**
 * retrieve a WhatsDapp profile
 * @param platform {DashPlatform}
 * @param ownerId {string} The ownerId in HEX
 * @returns Returns a document, that the profile was created
 * TODO: Maybe its better to use the DashIdentity Type instead of the ownerid as a string
 */
export function get(
  platform: DashPlatform,
  ownerId: string
): ResultAsync<RawProfile, DapiError | NotFoundError> {
  return tryDocumentGet(
    platform,
    'profile_contract.profile',
    {where: [['$ownerId', '==', ownerId]]}
  ).andThen(res => res[0] == null
    ? errAsync<RawProfile, NotFoundError>(new NotFoundError())
    : okAsync(downcast(res[0]))
  );
}

/**
 * Create a profile
 */
export function create(
  platform: DashPlatform,
  identity: DashIdentity,
  content: WhatsDappProfileContent
): ResultAsync<DocumentsBatchTransition, DocumentCreateError | DapiError | InsufficientCreditsError> {
  return tryDocumentCreate(platform, identity, 'profile_contract.profile', content)
    .map(message_document => ({create: [message_document]}))
    .andThen(d => tryDocumentBroadcast(platform, identity, d));
}

/**
 * update an existing WhatsDapp Profile
 */
export function updateProfile(
  platform: DashPlatform,
  identity: DashIdentity,
  content: WhatsDappProfileContent
): ResultAsync<DocumentsBatchTransition, DapiError | InsufficientCreditsError | NotFoundError> {
  const id = identity.getId().toJSON();

  // get the profile, error if it doesn't exist
  const profile_res: ResultAsync<RawProfile, DapiError | NotFoundError> = get(platform, id)
    .andThen(rawProfile => rawProfile == null
      ? errAsync(new NotFoundError())
      : okAsync(rawProfile)
    );

  // update it with the new profile content
  const modify_res = profile_res.andThen(rawProfile => {
    rawProfile.set('identityKey', content.identityKey);
    rawProfile.set('registrationId', content.registrationId);
    rawProfile.set('signedPreKey', content.signedPreKey);
    rawProfile.set('preKey', content.preKey);
    rawProfile.set('prekeys', content.prekeys);
    return okAsync<StateTransitionBatch, DapiError | NotFoundError>({replace: [rawProfile]} as StateTransitionBatch);
  });

  // broadcast the new profile
  return modify_res.andThen(stateTransitionBatch => tryDocumentBroadcast(platform, identity, stateTransitionBatch));
}

/**
 * deletes a whatsdapp profile
 */
export function remove(
  platform: DashPlatform,
  identity: DashIdentity,
): ResultAsync<DocumentsBatchTransition, DapiError | NotFoundError | InsufficientCreditsError> {
  const id = identity.getId().toJSON();
  // get the profile, error if it doesn't exist
  const profile_res: ResultAsync<RawProfile, NotFoundError | DapiError> = get(platform, id).andThen(rawProfile => rawProfile == null
    ? errAsync(new NotFoundError())
    : okAsync(rawProfile)
  );
  // pack it into a document batch
  const delete_res = profile_res.map(rawProfile => ({delete: [rawProfile]}));
  // broadcast the batch
  return delete_res.andThen(stateTransitionBatch => tryDocumentBroadcast(platform, identity, stateTransitionBatch));
}
