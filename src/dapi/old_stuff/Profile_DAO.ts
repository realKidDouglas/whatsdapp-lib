/**
 * @author Panzerknacker, Mr. P
 */

import type {RawProfile, WhatsDappProfileContent} from "../../WhatsDapp";

/**
 * Create a profile
 * @param connection {WhatsDappConnection}
 * @param content {WhatsDappProfileContent}
 * @returns {Promise<*>}
 */
export async function createProfile(connection: WhatsDappConnection, content: WhatsDappProfileContent): Promise<any> {
  console.log("Start create_profile");

  const doc_properties = {
    identityKey: content.identityKey,
    registrationId: content.registrationId,
    signedPreKey: content.signedPreKey,
    preKey: content.preKey,
    prekeys: content.prekeys,
    displayname: content.displayname
  };

  // Create the note document
  try {
    const message_document = await connection.platform.documents.create(
      'profile_contract.profile',
      connection.identity,
      doc_properties,
    );
    console.log("After message_document");

    const document_batch = {
      create: [message_document],
    };

    console.log("End create_profile");
    return connection.platform.documents.broadcast(document_batch, connection.identity);
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
export async function getProfile(connection: WhatsDappConnection, ownerid: string): Promise<RawProfile> {
  try {
    // Retrieve the existing document
    const documents = await connection.platform.documents.get(
      'profile_contract.profile',
      {where: [['$ownerId', '==', ownerid]]}
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
export async function updateProfile(connection: WhatsDappConnection, content: WhatsDappProfileContent): Promise<any> {
  try {
    // Retrieve the existing document
    const [document] = await connection.platform.documents.get(
      'profile_contract.profile',
      {where: [['$ownerId', '==', connection.identity.getId().toJSON()]]}
    );

    // Update document
    document.set('identityKey', content.identityKey);
    document.set('registrationId', content.registrationId);
    document.set('signedPreKey', content.signedPreKey);
    document.set('preKey', content.preKey);
    document.set('prekeys', content.prekeys);
    // Sign and submit the document replace transition
    return connection.platform.documents.broadcast({replace: [document]}, connection.identity);
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
export async function deleteProfile(connection: WhatsDappConnection): Promise<any> {
  try {
    // Retrieve the existing document
    const [document] = await connection.platform.documents.get(
      'profile_contract.profile',
      {where: [['$ownerId', '==', connection.identity.getId().toJSON()]]}
    );

    // Sign and submit the document delete transition
    return connection.platform.documents.broadcast({delete: [document]}, connection.identity);
  } catch (e) {
    console.error('Something went wrong:', e);
    throw e;
  }
}
