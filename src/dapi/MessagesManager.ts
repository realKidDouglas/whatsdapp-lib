import { Platform } from "dash/dist/src/SDK/Client/Platform";
import { DashIdentity } from "../types/DashTypes";

import type { DriveMessage } from "../WhatsDapp";

export class MessagesManager {
  private platform: Platform;
  private identity: DashIdentity;

  constructor(platform: Platform, identity: DashIdentity) {
    this.platform = platform;
    this.identity = identity;
  }


  //**********************
  // MESSAGES
  //**********************

  /**
   * Creates a document in form of the message contract and broadcast it to the platform
   * @param recipientId {string} ID in Base58Check of the receiver
   * @param payload {ArrayBuffer} The encrypted WhatsDappInternalMessage
   * @returns a DriveMessage object containing the transition info or null
   * @throws {Error} 
   */
  async createAndBroadcastMessage(recipientId: string, payload: ArrayBuffer): Promise<DriveMessage | null> {
    console.log("-create msg");
    const doc_properties = {
      recipientId: recipientId,
      payload: payload
    };
    // Create the message document
    const raw_message_document = await this.platform.documents.create(
      'message_contract.message',
      this.identity,
      doc_properties,
    );

    const document_batch = {
      create: [raw_message_document],
    };

    console.log("-broadcast msg");
    const sentmessage = await this.platform.documents.broadcast(document_batch, this.identity);
    if (sentmessage == null) {
      return null;
    }
    const driveMessage: DriveMessage = {
      id: sentmessage.transitions[0].id,
      ownerId: sentmessage.ownerId,
      createdAt: sentmessage.transitions[0].createdAt,
      updatedAt: sentmessage.transitions[0].updatedAt,

      recipientId: sentmessage.transitions[0].data.recipientId,
      payload: sentmessage.transitions[0].data.payload
    };
    return driveMessage;
  }

  /**
   * Receives all messages after a specific timestamp.
   * @param time Unix timestamp, choose 0 for all messages
   * @returns list of DriveMessages containing encrypted messages since timestamp
   * @throws {Error} 
   */
  async getMessagesByTime(time: number): Promise<Array<DriveMessage>> {
    const driveMessages: Array<DriveMessage> = [];
    const rawMessages: any[] = await this.platform.documents.get(
      'message_contract.message',
      {
        where: [
          ['recipientId', "==", this.identity.getId().toJSON()],
          //note this crazy gt ;)
          // ['$createdAt', "=>", time]
          ['$updatedAt', ">=", time],
        ],
      },
    );

    rawMessages.forEach((rawMessage: any) => {
      const driveMessage: DriveMessage = {
        id: rawMessage.id.toString(),
        ownerId: rawMessage.ownerId.toString(),
        recipientId: rawMessage.data.recipientId.toString(),
        createdAt: Date.parse(rawMessage.createdAt),
        updatedAt: Date.parse(rawMessage.updatedAt),
        payload: rawMessage.data.payload
      };
      driveMessages.push(driveMessage);
    });
    return driveMessages;
  }

  async deleteAllSentMessages(): Promise<boolean> {
    const identityString: string = this.identity.getId().toJSON();
    
    const document = await this.platform.documents.get(
      'message_contract.message',
      {
        where: [
          ['$ownerId', "==", identityString],
        ]
      }
    );
    if (!document) {
      console.log("Failed to get messages");
      return false;
    }

    if (document.length == 0) {
      console.log("No messages on drive for identity", identityString);
      return true;
    }

    console.log("-found",document.length,"messages to delete");
    const document_batch = {
      //no square braces since it's already an array
      delete: document,
    };
    console.log("-delete...");
    const transsiton = await this.platform.documents.broadcast(document_batch, this.identity);
    if (!transsiton) {
      console.log("Failed to boradcast deletion");
      return false;
    }
    console.log("-deleted");

    return true;
  }

  // /**
  //  * Delete a message by id
  //  * @param time: {number}
  //  * @returns {Promise<*>}
  //  */
  // async deleteMessage(time: number, senderid: string): Promise<boolean> {
  //   console.log("vergleichswerte:");
  //   console.log(this.identity.getId());
  //   console.log(senderid);
  //   console.log(time);
  //   try {// Retrieve the existing document
  //     console.log("vergleichswerte:");
  //     console.log(this.identity.getId());
  //     console.log(senderid);
  //     console.log(time);
  //     let document = [];
  //     do {
  //       [document] = await this.platform.documents.get(
  //         'message_contract.message',
  //         {
  //           where: [
  //             ['$ownerId', "==", this.identity.getId()],
  //             ['receiverid', "==", senderid],
  //             ['$createdAt', "<=", time]
  //           ]
  //         }
  //       );

  //       // Sign and submit the document delete transition
  //       console.log("Delete Messages:");
  //       console.log(document);
  //       if (document != undefined) {
  //         const document_batch = {
  //           delete: [document],
  //         };
  //         console.log("Sending: ");
  //         console.log(document_batch);
  //         console.log(this.platform.documents.broadcast(document_batch, this.identity));
  //       }
  //     } while (document != undefined);
  //     return true;
  //   } catch (e) {
  //     console.log('Something went wrong:', e);
  //     throw e;
  //   }
  // }

  // /**
  //  *
  //  * @param connection {WhatsDappConnection}
  //  * @param time {number}
  //  * @param senderid {string}
  //  * @returns {Promise<*>}
  //  */
  // async getMessageFromByTime(time: number, senderid: string): Promise<Array<DriveMessage>> {
  //   //TODO: make sure time remote is the same as local
  //   //eg. lastPollTime retrieved from last get()
  //   try {
  //     const documents = await this.platform.documents.get(
  //       'message_contract.message',
  //       {
  //         where: [
  //           ['$ownerId', "==", senderid],
  //           ['receiverid', "==", this.identity.getId().toJSON()],
  //           ['$createdAt', "=>", time],
  //         ],
  //       },
  //     );


  //     return documents;
  //   } catch (e) {
  //     console.log('Something went wrong:', e);
  //     throw e;
  //   }
  // }

  //   /**
  //  * Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
  //  * wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.
  //  * @param connection {WhatsDappConnection}
  //  * @param senderid {string} ID of the owner encoded in HEX and the identifier flag
  //  * @returns all messages of a specified user
  //  */
  //    async getMessagesFrom(senderid: string): Promise<Array<DriveMessage>> {
  //     console.log(senderid);
  //     try {
  //       return await this.platform.documents.get(
  //         'message_contract.message',
  //         {
  //           where: [
  //             ['$ownerId', "==", senderid],
  //             ['recipientId', "==", this.identity.getId().toJSON()]

  //           ],
  //         },
  //       );
  //     } catch (e) {
  //       console.error('Something went wrong:', e);
  //       throw e;
  //     }
  //   }

  //   /**
  //    * Receive all messages of the user
  //    * @param connection {WhatsDappConnection}
  //    * @returns all messages of the user
  //    */
  //   async getMessages(): Promise<Array<DriveMessage>> {
  //     try {
  //       return await this.platform.documents.get(
  //         'message_contract.message',
  //         {
  //           where: [
  //             ['recipientId', "==", this.identity.getId().toJSON()]
  //           ],
  //         },
  //       );

  //     } catch (e) {
  //       console.error('Something went wrong:', e);
  //       throw e;
  //     }
  //   }

}
