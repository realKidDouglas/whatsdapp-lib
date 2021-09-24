import {DashIdentity} from "../../types/DashTypes";
import { Platform } from "dash/dist/src/SDK/Client/Platform";

/**
 * @author: Panzerknacker, Mr. P, Kid Douglas
 */

/**
 * Create a new identity
 * @param connection :{
 *     identity: resolved identity by id -- Can be undefined
 *     platform: Dash Platform object
 * }
 * @returns the resolved identity
 */
export async function createIdentity(platform: Platform,): Promise<DashIdentity | null> {
  try {
    return await platform.identities.register();
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
export async function topUpIdentity(identity: DashIdentity, platform: Platform, topUpAmount: number): Promise<boolean> {
  try {
    return await platform.identities.topUp(identity.getId().toJSON(), topUpAmount);
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
export async function createDpnsName(identity: DashIdentity, platform: Platform, name: string): Promise<boolean> {
  try {
    return await platform.names.register(
      name,
      {dashUniqueIdentityId: identity.getId()},
      identity,
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
export async function findIdentityByName(platform: Platform, name: string): Promise< DashIdentity  | null> {
  try {
    const dpnsContract = await platform.names.resolve(name);

    return platform.identities.get(dpnsContract.ownerId.toString());
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
export async function getIdentityBalance(identity: DashIdentity,): Promise<number> {
  try {
    return identity.getBalance();
  } catch (e) {
    console.log('Failed identity balance check:', e);
    throw e;
  }
}
