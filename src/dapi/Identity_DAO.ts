import type {WhatsDappConnection} from "../WhatsDapp";
import {DashIdentity} from "../types/DashTypes";
import {Platform} from "dash/dist/src/SDK/Client/Platform";

/**
 * @author: Panzerknacker, Mr. P
 */

/**
 * Create a new identity
 * @param connection :{
 *     identity: resolved identity by id -- Can be undefined
 *     platform: Dash Platform object
 * }
 * @returns the resolved identity
 */
export async function createIdentity(connection: WhatsDappConnection): Promise<DashIdentity | null> {
  try {
    return await connection.platform.identities.register();
  } catch (e) {
    console.log('Something went wrong:', e);
  }

  return null;
}

export async function getIdentity(connection: WhatsDappConnection, identityId: string) : Promise<DashIdentity | null> {
  try {
    return await connection.platform.identities.get(identityId);
  } catch(e) {
    console.log("something went wrong:", e);
  }

  return null;
}

/**
 * Top up the given identity in the connection with extra credits
 * @param connection: {WhatsDappConnection}
 * @param topUpAmount {number} in credits
 * @returns check if everything is fine
 */
export async function topUpIdentity(connection: WhatsDappConnection, topUpAmount: number): Promise<boolean> {
  try {
    return await connection.platform.identities.topUp(connection.identity.getId().toJSON(), topUpAmount);
  } catch (e) {
    console.log('Something went wrong:', e);
  }
  return false;
}

/**
 * Register a name at dash platform
 * @param connection: {WhatsDappConnection}
 * @param name: The name for the dpns-name registration (name+.dash)
 * @returns check if everything is fine
 */
export async function createDpnsName(connection: WhatsDappConnection, name: string): Promise<boolean> {
  try {
    return await connection.platform.names.register(
      name,
      {dashUniqueIdentityId: connection.identity.getId()},
      connection.identity,
    );

  } catch (e) {
    console.log('Something went wrong:', e);
  }
  return false;
}

/**
 * get a list of dpns names that are registered for an identity
 * @param platform {Platform} dapi access object
 * @param identity {string} identity for which to retrieve the registered dpns names
 */
export async function getDpnsNames(platform: Platform, identity: string) : Promise<Array<string>> {
  const records = await platform.names.resolveByRecord('dashUniqueIdentityId', identity);
  return records.map((r: { data: { normalizedLabel: string, normalizedParentDomainName: string } }) => `${r.data.normalizedLabel}.${r.data.normalizedParentDomainName}`);
}

/**
 * Resolve a dpns-name to an identity
 * @param connection: {WhatsDappConnection}
 * @param name: The dpns name (name+.dash)
 * @returns The identity which belongs to the name
 */
export async function findIdentityByName(connection: WhatsDappConnection, name: string): Promise<DashIdentity  | null> {
  try {
    const dpnsContract = await connection.platform.names.resolve(name);

    return connection.platform.identities.get(dpnsContract.ownerId.toString());
  } catch (e) {
    console.log('Something went wrong:', e);
  }
  return null;
}

/**
 * Return the identity balance
 * @param connection {WhatsDappConnection}
 * @returns Credits
 */
export async function getIdentityBalance(connection: WhatsDappConnection): Promise<number> {
  try {
    return connection.identity.balance;
  } catch (e) {
    console.log('Something went wrong:', e);
    throw e;
  }
}
