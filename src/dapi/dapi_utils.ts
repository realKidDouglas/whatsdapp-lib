import {
  DashDocument,
  DashIdentity,
  DashPlatform,
  DocumentsBatchTransition,
  FetchOpts,
  StateTransitionBatch
} from "./dash_client/DashClient";
import {err, errAsync, ok, ResultAsync} from "neverthrow";
import {DocumentCreateError} from "../error/DocumentErrors";
import {DapiError, InsufficientCreditsError, isInsufficientCreditsError} from "../error/WhatsDappError";

export function tryDocumentBroadcast(
  platform: DashPlatform,
  identity: DashIdentity,
  document_batch: StateTransitionBatch,
): ResultAsync<DocumentsBatchTransition, DapiError | InsufficientCreditsError> {
  // check that there's actually something to do
  const hasCreate = document_batch.create && document_batch.create.length > 0;
  const hasReplace = document_batch.replace && document_batch.replace.length > 0;
  const hasDelete = document_batch.delete && document_batch.delete.length > 0;
  if (!(hasCreate || hasReplace || hasDelete)) return errAsync(new DapiError('invalid StateTransitionBatch', null));

  return ResultAsync.fromPromise(
    platform.documents.broadcast(document_batch, identity),
    e => {
      if (!(e instanceof Error)) return new DapiError('platform.documents.broadcast', null);
      else if (isInsufficientCreditsError(e as Error & { code: number })) return new InsufficientCreditsError(identity.getId().toJSON(), e);
      return new DapiError('platform.documents.broadcast', e);
    }
  ).andThen(t => t.getTransitions().length === 0
    ? err(new DapiError("platform.documents.broadcast", null))
    : ok(t)
  );
}

/**
 * retrieve an array of documents matching a query
 * @param platform
 * @param locator locator of the documents to retrieve
 * @param opts
 */
export function tryDocumentGet(
  platform: DashPlatform,
  locator: string,
  opts: FetchOpts,
): ResultAsync<Array<DashDocument<unknown>>, DapiError> {
  return ResultAsync.fromPromise(
    platform.documents.get(locator, opts),
    e => new DapiError('platform.documents.get', e instanceof Error ? e : null)
  );
}

/**
 * prepare a document to broadcast.
 * may fail if the document is invalid for the locator
 * @param platform
 * @param identity
 * @param locator
 * @param content
 */
export function tryDocumentCreate<T>(
  platform: DashPlatform,
  identity: DashIdentity,
  locator: string,
  content: T,
): ResultAsync<DashDocument<T>, DocumentCreateError> {
  return ResultAsync.fromPromise(
    platform.documents.create(locator, identity, content),
    e => new DocumentCreateError(locator, e instanceof Error ? e : null)
  );
}
