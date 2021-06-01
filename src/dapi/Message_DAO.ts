import type {RawMessage} from "../WhatsDapp";
import {err, ok, Result, ResultAsync} from "neverthrow";
import {DashIdentity, DashPlatform, DocumentsBatchTransition} from "./dash_client/DashClient";
import {tryDocumentBroadcast, tryDocumentCreate, tryDocumentGet} from "./dapi_utils";
import {downcast} from "../types/downcast";
import {DocumentCreateError} from "../error/DocumentErrors";
import {DapiError, InsufficientCreditsError, NotFoundError} from "../error/WhatsDappError";

/**
 * Create a message in form of the message contract and broadcast it to the platform
 * @param platform {DashPlatform}
 * @param identity {DashIdentity}
 * @param receiverid {string} ID in Base58Check of the receiver
 * @param content {string} The content of the message
 * @returns {DocumentsBatchTransition}
 */
export function create(
  platform: DashPlatform,
  identity: DashIdentity,
  receiverid: string,
  content: string
): ResultAsync<DocumentsBatchTransition, DocumentCreateError | DapiError | InsufficientCreditsError> {
  const doc_properties = {receiverid, content};
  // Create the message document
  const createRes = tryDocumentCreate(platform, identity, 'message_contract.message', doc_properties)
    .map(message_document => ({create: [message_document]}));
  return createRes.andThen(d => tryDocumentBroadcast(platform, identity, d));
}

/**
 * Delete messages by sender id older than a given timestamp
 */
export async function deleteMessages(
  platform: DashPlatform,
  identity: DashIdentity,
  time: number,
  senderid: string
): Promise<Result<boolean, InsufficientCreditsError | DapiError | NotFoundError>> {
  console.log("vergleichswerte:");
  console.log(identity.getId());
  console.log(senderid);
  console.log(time);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const get_res = await tryDocumentGet(
      platform,
      'message_contract.message',
      {
        where: [
          ['$ownerId', "==", identity.getId()],
          ['receiverid', "==", senderid],
          ['$createdAt', "<=", time]
        ]
      }
    ).map(t => downcast<Array<RawMessage>>(t));
    if (get_res.isErr()) return err(get_res.error);
    const document = get_res.value;
    if (document.length == 0) break;
    // Sign and submit the document delete transition
    console.log("Delete Messages:");
    console.log(document);
    const del_res = await tryDocumentBroadcast(platform, identity, {delete: get_res.value});
    if (del_res.isErr()) return err(del_res.error);
  }
  return ok(true);
}

/**
 * Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
 * wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.
 * @param platform
 * @param identity
 * @param senderid {string} ID of the owner encoded in HEX and the identifier flag
 * @returns all messages of a specified user
 */
export function getMessagesFrom(
  platform: DashPlatform,
  identity: DashIdentity,
  senderid: string): ResultAsync<Array<RawMessage>, DapiError> {
  console.log("get msg from", senderid);
  return tryDocumentGet(platform, 'message_contract.message', {
    where: [
      ['$ownerId', "==", senderid],
      ['receiverid', "==", identity.getId().toJSON()],
    ],
  }).map(t => downcast(t));
}

/**
 * Receive all messages of the user
 * @returns all messages of the user
 */
export function getMessages(
  platform: DashPlatform,
  identity: DashIdentity,
): ResultAsync<Array<RawMessage>, DapiError> {
  return tryDocumentGet(
    platform,
    'message_contract.message',
    {where: [['receiverid', "==", identity.getId().toJSON()]],}
  ).map(t => downcast(t));
}

/**
 * Receive all messages after a specific time. To parse a timestring (Json-Timestring) into a integer (milliseconds)
 * use the following function:
 * <document>.createdAt.getTime()
 * @param platform
 * @param identity
 * @param time {number} Time in milliseconds
 * @returns the messages since time
 */
export function getByTime(
  platform: DashPlatform,
  identity: DashIdentity,
  time: number
): ResultAsync<Array<RawMessage>, DapiError> {
  return tryDocumentGet(
    platform,
    'message_contract.message',
    {
      where: [
        ['receiverid', "==", identity.getId().toJSON()],
        ['$createdAt', ">=", time]
      ],
    }
  ).map(t => downcast(t));
}

/**
 *
 * @param platform
 * @param identity
 * @param time {number}
 * @param senderid {string}
 * @returns {Promise<*>}
 */
export function getMessageFromByTime(
  platform: DashPlatform,
  identity: DashIdentity,
  time: number,
  senderid: string
): ResultAsync<Array<RawMessage>, DapiError> {
  return tryDocumentGet(
    platform,
    'message_contract.message',
    {
      where: [
        ['$ownerId', "==", senderid],
        ['receiverid', "==", identity.getId().toJSON()],
        ['$createdAt', ">=", time],
      ],
    }
  ).map(t => downcast(t));
}
