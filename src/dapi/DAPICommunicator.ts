import { Platform } from "dash/dist/src/SDK/Client/Platform";
import { DashIdentity } from "../types/DashTypes";

import type { DriveMessage, WhatsDappProfile } from "../WhatsDapp";
import { IdentityManager } from "./IdentityManager";
import { MessagesManager } from "./MessagesManager";
import { ProfileManager } from "./ProfileManager";
import { retryFunctionXTimes } from "./utils";

export class DAPICommunicator {
  private identityManager: IdentityManager;
  private profileManager: ProfileManager;
  private messagesManager: MessagesManager;
  // private walletManager:WalletManager;

  constructor(platform: Platform, identity: DashIdentity) {
    this.identityManager = new IdentityManager(platform, identity);
    this.profileManager = new ProfileManager(platform, identity);
    this.messagesManager = new MessagesManager(platform, identity);
  }


  //**********************
  // MESSAGES
  //**********************

  /**
   * Creates a document in form of the message contract and broadcast it to the platform
   * @param recipientId {string} ID in Base58Check of the receiver
   * @param payload {ArrayBuffer} The encrypted WhatsDappInternalMessage
   * @returns a DriveMessage object containing the transition info or null
   */
  async createAndBroadcastMessage(recipientId: string, payload: ArrayBuffer): Promise<DriveMessage | null> {
    //retry 3 times
    return retryFunctionXTimes(() => {
      return this.messagesManager.createAndBroadcastMessage(recipientId, payload);
    }, 3)();
  }

  /**
   * Receives all messages after a specific timestamp.
   * @param time Unix timestamp, choose 0 for all messages
   * @returns list of DriveMessages containing encrypted messages since timestamp
   * @throws {Error} 
   */
  async getMessagesByTime(time: number): Promise<Array<DriveMessage>> {
    return this.messagesManager.getMessagesByTime(time);
  }

  //**********************
  // IDENTITY
  //**********************

  /**
   * Creates a new identity
   * @returns the resolved identity or null on error
   */
  async createNewIdentity(): Promise<DashIdentity | null> {
    //retry 3 times
    return retryFunctionXTimes(() => {
      return this.identityManager.createNewIdentity();
    }, 3)();
  }

  /**
   * 
   * @param identityString 
   * @param topUpAmountInDuffs 
   * @returns 
   */
  async topUpIdentity(identityString: string, topUpAmountInDuffs = 1000): Promise<boolean> {
    //retry 5 times
    return retryFunctionXTimes(() => {
      return this.identityManager.topUpIdentity(identityString, topUpAmountInDuffs);
    }, 5)();
  }

  async getIdentityById(indentityString: string): Promise<DashIdentity> {
    //retry 3 times
    return retryFunctionXTimes(() => {
      return this.identityManager.getIdentityById(indentityString);
    }, 3)();
  }

  /**
   * Register a name at dash platform
   * @param connection: {WhatsDappConnection}
   * @param name: The name for the dpns-name registration (name+.dash)
   * @returns check if everything is fine
   */
  async createDpnsName(name: string): Promise<boolean> {
    return this.identityManager.createDpnsName(name);
  }

  /**
   * Resolve a dpns-name to an identity
   * @param connection: {WhatsDappConnection}
   * @param name: The dpns name (name+.dash)
   * @returns The identity which belongs to the name
   */
  async findIdentityByDPNS(name: string): Promise<DashIdentity | null> {
    return this.identityManager.findIdentityByDPNS(name);
  }

  /**
   * Return the identity balance
   * @param connection {WhatsDappConnection}
   * @returns Credits
   */
  async getIdentityBalance(): Promise<number> {
    return this.identityManager.getIdentityBalance();
  }


  //**********************
  // PROFILE
  //**********************

  /**
   * Creates the given profile on drive and broadcasts is
   * @param content {WhatsDappProfile}
   * @returns {Promise<*>}
   * @throws {Error}
   */
  async createProfile(profile: WhatsDappProfile): Promise<any> {
    //retry 3 times
    return retryFunctionXTimes(() => {
      return this.profileManager.createProfile(profile);
    }, 3)();
  }

  /**
   * Retrieves a WhatsDappProfile to a given identity
   * @param identityString {string} 
   * @returns the belonging WhatsDappProfile or null if no profile was found for that identity
   * @throws {Error}
   */
  async getProfile(ownerid: string): Promise<WhatsDappProfile | null> {
    return this.profileManager.getProfile(ownerid);
  }

  /**
   * Updates a profile on drive
   * @param profile {WhatsDappProfile}
   * @returns 
   * @throws {Error}
   */
  async updateProfile(profile: WhatsDappProfile): Promise<any> {
    //retry 3 times
    return retryFunctionXTimes(() => {
      return this.profileManager.updateProfile(profile);
    }, 3)();
  }

  /**
   * Delte the WhatsDapp profile so noone can create a signal message.
   * @returns Returns a document, that the profile was updated
   */
  async deleteProfile(): Promise<any> {
    return this.profileManager.deleteProfile();
  }

}

