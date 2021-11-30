import { Platform } from "dash/dist/src/SDK/Client/Platform";
import { DashIdentity } from "../types/DashTypes";

import type { DriveMessage, WhatsDappProfile } from "../WhatsDapp";

export class DAPICommunicator {

  // protected readyObject:DAPICommunicator;

  private platform: Platform;
  private identity: DashIdentity;

  // private identityManager:IdentityManager;
  // private profileManager:ProfileManager;
  // private walletManager:WalletManager;
  // private messagesManager:MessagesManager;

  constructor(platform: Platform, identity: DashIdentity) {
    this.platform = platform;
    this.identity = identity;
  }


  //**********************
  // MESSAGES
  //**********************

  /**
   * Create a message in form of the message contract and broadcast it to the platform
   * @param connection {WhatsDappConnection}
   * @param receiverid {string} ID in Base58Check of the receiver
   * @param content {string} The content of the message
   * @returns The check, that the message is published
   */
  //async createMessage(receiverid: string, content: string): Promise<any> {
  async createMessage(receiverid: string, content: ArrayBuffer): Promise<any> {
    const doc_properties = { receiverid, content };
    // Create the message document
    const message_document = await this.platform.documents.create(
      'message_contract.message',
      this.identity,
      doc_properties,
    );

    const document_batch = {
      create: [message_document],
    };
    console.log("Sending: ");
    console.log(document_batch);
    return this.platform.documents.broadcast(document_batch, this.identity);
  }

  /**
   * Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
   * wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.
   * @param connection {WhatsDappConnection}
   * @param senderid {string} ID of the owner encoded in HEX and the identifier flag
   * @returns all messages of a specified user
   */
  async getMessagesFrom(senderid: string): Promise<Array<DriveMessage>> {
    console.log(senderid);
    try {
      return await this.platform.documents.get(
        'message_contract.message',
        {
          where: [
            ['$ownerId', "==", senderid],
            ['receiverid', "==", this.identity.getId().toJSON()]

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
  async getMessages(): Promise<Array<DriveMessage>> {
    try {
      return await this.platform.documents.get(
        'message_contract.message',
        {
          where: [
            ['receiverid', "==", this.identity.getId().toJSON()]
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
  async getMessagesByTime(time: number): Promise<Array<DriveMessage>> {
    try {
      return await this.platform.documents.get(
        'message_contract.message',
        {
          where: [
            ['receiverid', "==", this.identity.getId().toJSON()],
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
   * @param time: {number}
   * @returns {Promise<*>}
   */
  async deleteMessage(time: number, senderid: string): Promise<boolean> {
    console.log("vergleichswerte:");
    console.log(this.identity.getId());
    console.log(senderid);
    console.log(time);
    try {// Retrieve the existing document
      console.log("vergleichswerte:");
      console.log(this.identity.getId());
      console.log(senderid);
      console.log(time);
      let document = [];
      do {
        [document] = await this.platform.documents.get(
          'message_contract.message',
          {
            where: [
              ['$ownerId', "==", this.identity.getId()],
              ['receiverid', "==", senderid],
              ['$createdAt', "<=", time]
            ]
          }
        );

        // Sign and submit the document delete transition
        console.log("Delete Messages:");
        console.log(document);
        if (document != undefined) {
          const document_batch = {
            delete: [document],
          };
          console.log("Sending: ");
          console.log(document_batch);
          console.log(this.platform.documents.broadcast(document_batch, this.identity));
        }
      } while (document != undefined);
      return true;
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
  async getMessageFromByTime(time: number, senderid: string): Promise<Array<DriveMessage>> {
    //TODO: make sure time remote is the same as local
    //eg. lastPollTime retrieved from last get()
    try {
      const documents = await this.platform.documents.get(
        'message_contract.message',
        {
          where: [
            ['$ownerId', "==", senderid],
            ['receiverid', "==", this.identity.getId().toJSON()],
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

  //**********************
  // IDENTITY
  //**********************

  /**
   * Create a new identity
   * @param connection :{
   *     identity: resolved identity by id -- Can be undefined
   *     platform: Dash Platform object
   * }
   * @returns the resolved identity
   */
  async createIdentity(): Promise<DashIdentity | null> {
    try {
      return await this.platform.identities.register();
    } catch (e) {
      console.log('Failed identity registration:', e);
    }

    return null;
  }

  /**
   * Top up the given identity in the connection with extra credits
   * @param connection: {WhatsDappConnection}
   * @param topUpAmount {number} in credits
   * @returns check if everything is fine
   */
  async topUpIdentity(topUpAmount: number): Promise<boolean> {
    try {
      return await this.platform.identities.topUp(this.identity.getId().toJSON(), topUpAmount);
    } catch (e) {
      console.log('Failed identity topup:', e);
    }
    return false;
  }

  /**
   * Register a name at dash platform
   * @param connection: {WhatsDappConnection}
   * @param name: The name for the dpns-name registration (name+.dash)
   * @returns check if everything is fine
   */
  async createDpnsName(name: string): Promise<boolean> {
    try {
      return await this.platform.names.register(
        name,
        { dashUniqueIdentityId: this.identity.getId() },
        this.identity,
      );

    } catch (e) {
      console.log('Failed creation DPNS name:', e);
    }
    return false;
  }

  /**
   * Resolve a dpns-name to an identity
   * @param connection: {WhatsDappConnection}
   * @param name: The dpns name (name+.dash)
   * @returns The identity which belongs to the name
   */
  async findIdentityByName(name: string): Promise<DashIdentity | null> {
    try {
      const dpnsContract = await this.platform.names.resolve(name);

      return this.platform.identities.get(dpnsContract.ownerId.toString());
    } catch (e) {
      console.log('Failed search for identity:', e);
    }
    return null;
  }

  /**
   * Return the identity balance
   * @param connection {WhatsDappConnection}
   * @returns Credits
   */
  async getIdentityBalance(): Promise<number> {
    try {
      return this.identity.getBalance();
    } catch (e) {
      console.log('Failed identity balance check:', e);
      throw e;
    }
  }


  //**********************
  // PROFILE
  //**********************

  /**
   * Create a profile
   * @param connection {WhatsDappConnection}
   * @param content {WhatsDappProfileContent}
   * @returns {Promise<*>}
   */
  async createProfile(content: WhatsDappProfile): Promise<any> {
    console.log("Start create_profile");

    
    const doc_properties = content;

    // Create the note document
    try {
      const message_document = await this.platform.documents.create(
        'profile_contract.profile',
        this.identity,
        doc_properties,
      );
      console.log("After message_document");

      const document_batch = {
        create: [message_document],
      };

      console.log("End create_profile");
      return this.platform.documents.broadcast(document_batch, this.identity);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Create a WhatsDapp profile
   * @param connection {WhatsDappConnection}
   * @param ownerid {string} The ownerId in HEX
   * @returns Returns a document, that the profile was created
   * TODO: Maybe its better to use the DashIdentity Type instead of the ownerid as a string
   */
  async getProfile(ownerid: string): Promise<WhatsDappProfile> {
    try {
      // Retrieve the existing document
      const documents = await this.platform.documents.get(
        'profile_contract.profile',
        { where: [['$ownerId', '==', ownerid]] }
      );
      // Sign and submit the document replace transition
      return documents[0];
    } catch (e) {
      console.log('Something went wrong:', e);
      throw e;
    }
  }

  /**
   *
   * @param connection {WhatsDappConnection}
   * @param content {WhatsDappProfileContent}
   * @returns Returns a document, that the profile was updated
   */
  async updateProfile(content: WhatsDappProfile): Promise<any> {
    try {
      // Retrieve the existing document
      const [document] = await this.platform.documents.get(
        'profile_contract.profile',
        { where: [['$ownerId', '==', this.identity.getId().toJSON()]] }
      );

      // Update document
      document.set('signalKeyBundle', content.signalKeyBundle);
      document.set('nickname', content.nickname);

      // Sign and submit the document replace transition
      return this.platform.documents.broadcast({ replace: [document] }, this.identity);
    } catch (e) {
      console.error('Something went wrong:', e);
      throw e;
    }
  }

  /**
   * Delte the WhatsDapp profile so noone can create a signal message.
   * @param connection {WhatsDappConnection}
   * @returns Returns a document, that the profile was updated
   */
  async deleteProfile(): Promise<any> {
    try {
      // Retrieve the existing document
      const [document] = await this.platform.documents.get(
        'profile_contract.profile',
        { where: [['$ownerId', '==', this.identity.getId().toJSON()]] }
      );

      // Sign and submit the document delete transition
      return this.platform.documents.broadcast({ delete: [document] }, this.identity);
    } catch (e) {
      console.error('Something went wrong:', e);
      throw e;
    }
  }

}
