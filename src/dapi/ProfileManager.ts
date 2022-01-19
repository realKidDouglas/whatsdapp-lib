import { Platform } from "dash/dist/src/SDK/Client/Platform";
import { DashIdentity } from "../types/DashTypes";


import type { WhatsDappProfile } from "../WhatsDapp";

export class ProfileManager {
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
  // PROFILE
  //**********************

  /**
   * Creates the given profile on drive and broadcasts is
   * @param content {WhatsDappProfile}
   * @returns {Promise<*>}
   * @throws {Error}
   */
  async createProfile(content: WhatsDappProfile): Promise<any> {
    // console.log("Create profile");
    const doc_properties = content;

    const message_document = await this.platform.documents.create(
      'profile_contract.profile',
      this.identity,
      doc_properties,
    );

    const document_batch = {
      create: [message_document],
    };

    console.log("-upload profile");
    const transition = await this.platform.documents.broadcast(document_batch, this.identity);

    return transition;
  }

  /**
   * Retrieves a WhatsDappProfile to a given identity
   * @param identityString {string} 
   * @returns the belonging WhatsDappProfile or null if no profile was found for that identity
   * @throws {Error}
   */
  async getProfile(identityString: string): Promise<WhatsDappProfile | null> {
    // Retrieve the existing document
    //by contract there is only one profile per ownerId (unique property)
    const [document] = await this.platform.documents.get(
      //const documents = await this.platform.documents.get(
      'profile_contract.profile',
      {
        where: [['$ownerId', '==', identityString]]
      }
    );
    //by contract there is only one profile per ownerId (unique property)
    //const profileDoc = documents[0];


    if (!document) {
      //if (!profileDoc) {
      return null;
    }

    const profile: WhatsDappProfile = document.getData();
    // const profile: WhatsDappProfile = profileDoc.getData();
    return profile;
  }

  /**
   * Updates a profile on drive
   * @param profile {WhatsDappProfile}
   * @returns 
   * @throws {Error}
   */
  async updateProfile(profile: WhatsDappProfile): Promise<any> {
    const identityString: string = this.identity.getId().toJSON();
    // Retrieve the existing document
    const [document] = await this.platform.documents.get(
      'profile_contract.profile',
      {
        where: [['$ownerId', '==', identityString]]
      }
    );

    // Update document
    document.set('signalKeyBundle', profile.signalKeyBundle);
    document.set('nickname', profile.nickname);

    // Sign and submit the document replace transition
    console.log("-upload profile");
    const transition = await this.platform.documents.broadcast({ replace: [document] }, this.identity);
    console.log("-updated profile");
    return transition;
  }

  /**
   * Delete the WhatsDapp profile so noone can create a signal message.
   * @param connection {WhatsDappConnection}
   * @returns 
   * @throws {Error}
   */
  async deleteProfile(): Promise<boolean> {
    const identityString = this.identity.getId().toJSON();

    // Retrieve the existing document
    const [document] = await this.platform.documents.get(
      'profile_contract.profile',
      {
        where: [['$ownerId', '==', identityString]]
      }
    );

    if (!document) {
      console.log("Failed to get profile");
      return false;
    }

    const document_batch = {
      delete: [document],
    };
    console.log("-delete profile");
    // Sign and submit the document delete transition
    const transsiton = await this.platform.documents.broadcast(document_batch, this.identity);
    if (!transsiton) {
      console.log("Failed to boradcast deletion");
      return false;
    }
    console.log("-deleted profile");

    return true;
  }
}
