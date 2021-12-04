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
    const documents = await this.platform.documents.get(
      'profile_contract.profile',
      {
        where: [['$ownerId', '==', identityString]]
      }
    );
    //by contract there is only one profile per ownerId (unique property)
    const profileDoc = documents[0];

    if (!profileDoc) {
      return null;
    }

    const profile: WhatsDappProfile = profileDoc.getData();
    return profile;
  }

  /**
   * Updates a profile on drive
   * @param profile {WhatsDappProfile}
   * @returns 
   * @throws {Error}
   */
  async updateProfile(profile: WhatsDappProfile): Promise<any> {
    const identityString:string=this.identity.getId().toJSON();
    console.log("Update profile");
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
    const transition = this.platform.documents.broadcast({ replace: [document] }, this.identity);
    console.log("-updated profile");
    return transition;
  }

  /**
   * Delte the WhatsDapp profile so noone can create a signal message.
   * @param connection {WhatsDappConnection}
   * @returns Returns a document, that the profile was updated
   */
  async deleteProfile(): Promise<any> {
    const identityString = this.identity.getId().toJSON();
    try {
      // Retrieve the existing document
      const [document] = await this.platform.documents.get(
        'profile_contract.profile',
        {
          where: [['$ownerId', '==', identityString]]
        }
      );

      // Sign and submit the document delete transition
      return this.platform.documents.broadcast({ delete: [document] }, this.identity);
    } catch (e) {
      console.error('Something went wrong:', e);
      throw e;
    }
  }

}
