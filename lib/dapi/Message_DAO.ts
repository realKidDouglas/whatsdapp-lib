/**
 * @author: Panzerknacker, Mr. P
 */

import type {RawMessage, WhatsDappConnection} from "../WhatsDapp";

/**
 * Create a message in form of the message contract and broadcast it to the platform
 * @param connection {WhatsDappConnection}
 * @param receiverid {string} ID in Base58Check of the receiver
 * @param content {string} The content of the message
 * @returns The check, that the message is published
 */
export async function createMessage(connection: WhatsDappConnection, receiverid: string, content: string): Promise<any> {
  const doc_properties = {receiverid, content};
  // Create the message document
  const message_document = await connection.platform.documents.create(
    'message_contract.message',
    connection.identity,
    doc_properties,
  );

  const document_batch = {
    create: [message_document],
  };
  console.log("Sending: ");
  console.log(document_batch);
  return connection.platform.documents.broadcast(document_batch, connection.identity);
}

/**
 * Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
 * wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.
 * @param connection {WhatsDappConnection}
 * @param senderid {string} ID of the owner encoded in HEX and the identifier flag
 * @returns all messages of a specified user
 */
export async function getMessagesFrom(connection: WhatsDappConnection, senderid: string): Promise<Array<RawMessage>> {
  console.log(senderid);
  try {
    return await connection.platform.documents.get(
      'message_contract.message',
      {
        where: [
          ['$ownerId', "==", senderid],
          ['receiverid', "==", connection.identity.getId().toJSON()]

        ],
      },
    );
  } catch (e) {
    console.error('Something went wrong:', e);
    throw e;
  }
}

/**
 * Receive all messages of the user
 * @param connection {WhatsDappConnection}
 * @returns all messages of the user
 */
export async function getMessages(connection: WhatsDappConnection): Promise<Array<RawMessage>> {
  try {
    return await connection.platform.documents.get(
      'message_contract.message',
      {
        where: [
          ['receiverid', "==", connection.identity.getId().toJSON()]
        ],
      },
    );

  } catch (e) {
    console.error('Something went wrong:', e);
    throw e;
  }
}

/**
 * Receive all messages after a specific time. To parse a timestring (Json-Timestring) into a integer (milliseconds)
 * use the following function:
 * <document>.createdAt.getTime()
 * @param connection {WhatsDappConnection}
 * @param time {number} Time in milliseconds
 * @returns the messages since time
 */
export async function getMessagesByTime(connection: WhatsDappConnection, time: number): Promise<Array<RawMessage>> {
  try {
    return await connection.platform.documents.get(
      'message_contract.message',
      {
        where: [
          ['receiverid', "==", connection.identity.getId().toJSON()],
          ['$createdAt', ">=", time]
        ],
      },
    );

  } catch (e) {
    console.error('Something went wrong:', e);
    throw e;
  }
}

/**
 * Delete a message by id
 * @param connection {WhatsDappConnection}
 * @param messageid {string}
 * @returns {Promise<*>}
 */
export async function deleteMessage(connection: WhatsDappConnection, messageid: string): Promise<boolean> {
  try {// Retrieve the existing document
    const [document] = await connection.platform.documents.get(
      'message_contract.message',
      {where: [['$id', '==', messageid]]}
    );

    // Sign and submit the document delete transition
    return connection.platform.documents.broadcast({delete: [document]}, connection.identity);
  } catch (e) {
    console.log('Something went wrong:', e);
    throw e;
  }
}

/**
 *
 * @param connection {WhatsDappConnection}
 * @param time {number}
 * @param senderid {string}
 * @returns {Promise<*>}
 */
export async function getMessageFromByTime(connection: WhatsDappConnection, time: number, senderid: string): Promise<Array<RawMessage>> {
  try {
    const documents = await connection.platform.documents.get(
      'message_contract.message',
      {
        where: [
          ['$ownerId', "==", senderid],
          ['receiverid', "==", connection.identity.getId().toJSON()],
          ['$createdAt', ">=", time],
        ],
      },
    );


    return documents;
  } catch (e) {
    console.log('Something went wrong:', e);
    throw e;
  }
}
