import { Platform } from "dash/dist/src/SDK/Client/Platform";
import { DashIdentity } from "../types/DashTypes";

export class IdentityManager {
  private platform: Platform;
  private identity: DashIdentity;

  constructor(platform: Platform, identity: DashIdentity) {
    this.platform = platform;
    this.identity = identity;
  }

  //**********************
  // IDENTITY
  //**********************

  /**
   * Creates a new identity
   * @returns the resolved identity or null on error
   * @throws {Error}
   */
  async createNewIdentity(): Promise<DashIdentity | null> {
    return await this.platform.identities.register();
  }

  /**
   * 
   * @param identityString 
   * @param topUpAmountInDuffs 
   * @returns 
   */
  async topUpIdentity(identityString: string, topUpAmountInDuffs = 1000): Promise<boolean> {
    const topup = await this.platform.identities.topUp(identityString, topUpAmountInDuffs); //returns true or false
    return topup;
  }

  async getIdentityById(identityString: string):Promise<DashIdentity>{
    return await this.platform.identities.get(identityString);
  }

  async updateIdentityFromRemote(): Promise<void> {
    const identityString: string = this.identity.getId().toJSON();
    this.identity = this.platform.identities.get(identityString);
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
  async findIdentityByDPNS(name: string): Promise<DashIdentity | null> {
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
      await this.updateIdentityFromRemote();
      return this.identity.getBalance();
    } catch (e) {
      console.log('Failed identity balance check:', e);
      throw e;
    }
  }
}
