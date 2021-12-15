import libsignal, { SignalKeyPair, SignalPreKey, SignalSignedPreKey } from "libsignal";
import { arrayBufferToString } from "./utils";
import { SignalProtocolStore } from "./SignalProtocolStoreWrapper";
import { StructuredStorage } from "../storage/StructuredStorage";

import { randomInt } from "crypto";

type CipherTextType = number// should probably be an enum or 1 | 2 | 3

type WhatsDappSignalCipherText = {
  type: CipherTextType,
  body: ArrayBuffer,
  registrationId?: number
  // body: {
  //   data: string
  // }
}

export type WhatsDappSignalPrivateKeys = {
  identityKeyPair: SignalKeyPair,
  registrationId: number,
  preKeys: Array<SignalPreKey>,
  signedPreKeys: Array<SignalSignedPreKey>,
}

export type WhatsDappSignalSignedPreKey = WhatsDappSignalPreKey & {
  signature: string,
}

type WhatsDappSignalPreKey = {
  keyId: number,
  keyPair: SignalKeyPair
}

export type WhatsDappSignalPrekeyBundle = {
  preKeys: Array<preKeyPub>,
  identityKey: ArrayBuffer,
  registrationId: number,
  signedPreKey: {
    keyId: number,
    publicKey: ArrayBuffer,
    signature: ArrayBuffer
  }
}
type preKeyPub={
  keyId: number, 
  publicKey: ArrayBuffer 
}

export type WhatsDappSignalKeyBundle = {
  private: WhatsDappSignalPrivateKeys,
  preKeyBundle: WhatsDappSignalPrekeyBundle,
}

export interface ISignalLib {
  generateSignalKeys(preKeyIdStartIndex:number, preKeyCount:number, signedPreKeyId:number): Promise<WhatsDappSignalKeyBundle>;
  encryptMessage(whatsDappStore: StructuredStorage, receiverId: string, plaintext: string): Promise<ArrayBuffer>;
  decryptMessage(whatsDappStore: StructuredStorage, senderId: string, cipherText: ArrayBuffer): Promise<string>;
  //Incoming sessions comes with prekey in initial message
  buildAndPersistOutgoingSession(whatsDappStore: StructuredStorage, identifier: string, preKeyBundle: WhatsDappSignalPrekeyBundle): Promise<void>;
}

export class SignalWrapper implements ISignalLib {

  private deviceId=0;

  /**
   * generate a new WhatsDappSignalKeyBundle containing the public keys of the IdentityKey,
   * PreKey and SignedPreKey and the RegistationID. This bundle will be made publicly available.
   * In addition it also contains all the Keypairs (with private key) which are to be stored locally.
   * @returns {Promise<WhatsDappSignalKeyBundle>}
   */
  async generateSignalKeys(preKeyIdStartIndex:number, preKeyCount:number, signedPreKeyId:number): Promise<WhatsDappSignalKeyBundle> {
    const identityKeyPair = await libsignal.keyhelper.generateIdentityKeyPair();
    const registrationId = await libsignal.keyhelper.generateRegistrationId();

    const preKeys=new Array<SignalPreKey>();
    const preKeysPub=new Array<preKeyPub>();
    for (let i = preKeyIdStartIndex; i < (preKeyIdStartIndex+preKeyCount); i++) {
      const preKey:SignalPreKey = await libsignal.keyhelper.generatePreKey(i);  
      preKeys.push(preKey);
      preKeysPub.push({keyId: preKey.keyId, publicKey:preKey.keyPair.pubKey});
    }

    const signedPreKey:SignalSignedPreKey = await libsignal.keyhelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
    const privKeyBundle:WhatsDappSignalKeyBundle={
      private: { identityKeyPair, registrationId, preKeys, signedPreKeys:[signedPreKey] },
      preKeyBundle: {
        identityKey: identityKeyPair.pubKey,
        registrationId: registrationId,
        preKeys: preKeysPub,
        signedPreKey: {
          keyId: signedPreKey.keyId,
          publicKey: signedPreKey.keyPair.pubKey,
          signature: signedPreKey.signature
        }
      }
    };
    return privKeyBundle;
  }

  /**
   * encrypts a given message for a specific receiver
   * @param whatsDappStore: Storage object that implements the WhatsDappStorage API
   * @param receiverId: Identifier of the receiver
   * @param plaintext
   * @returns {Promise<string>}: The CipherText object converted into JSON and encoded as Base64
   */
  //   async encryptMessage(whatsDappStore: any, receiverId: string, plaintext: string): Promise<string> {
  async encryptMessage(whatsDappStore: StructuredStorage, receiverId: string, plaintext: string): Promise<ArrayBuffer> {
    const deviceId = this.deviceId;
    const store = new SignalProtocolStore(whatsDappStore, receiverId);
    const address = new libsignal.ProtocolAddress(receiverId, deviceId);
    const sessionCipher = new libsignal.SessionCipher(store, address);
    const plaintextBuffer = Buffer.from(plaintext);
    const cipherText = await sessionCipher.encrypt(plaintextBuffer);
    
    const cipherTextBuffer=Buffer.from(JSON.stringify(cipherText));
    //    return Buffer.from(JSON.stringify(cipherText)).toString("base64");
    return cipherTextBuffer;
  }

  /**
   * decrypts a message from a specific receiver
   * @param whatsDappStore: Storage object that implements the WhatsDappStorage API
   * @param senderId: Identifier of the sender
   * @param base64: The CipherText object converted into JSON and encoded as Base64
   * @returns {Promise<string>}: The original plaintext
   */
  async decryptMessage(whatsDappStore: StructuredStorage, senderId: string, cipherTextBuffer: ArrayBuffer): Promise<string> {
    // const cipherText = SignalWrapper._b64toCipherText(base64);
    const cipherText:WhatsDappSignalCipherText=JSON.parse(Buffer.from(cipherTextBuffer).toString('ascii'));
    const deviceId = this.deviceId;
    const store = new SignalProtocolStore(whatsDappStore, senderId);
    const address = new libsignal.ProtocolAddress(senderId, deviceId);
    const sessionCipher = new libsignal.SessionCipher(store, address);

    const messageHasEmbeddedPreKeyBundle = cipherText.type == 3;
    let plaintext;
    if (messageHasEmbeddedPreKeyBundle) {
      plaintext = await sessionCipher.decryptPreKeyWhisperMessage(Buffer.from(cipherText.body), 'binary');
    } else {
      plaintext = await sessionCipher.decryptWhisperMessage(Buffer.from(cipherText.body), 'binary');
    }
    return arrayBufferToString(plaintext, 'utf8');
  }

  /**
   * builds a new outgoing signal session by parsing the preKeyBundle of the
   * communication partner. This signal session is then persisted.
   * @param whatsDappStore: Storage object that implements the WhatsDappStorage API
   * @param identifier: Identifier of the communication partner
   * @param preKeyBundle: preKeyBundle of the communication partner
   */
  async buildAndPersistOutgoingSession(whatsDappStore: StructuredStorage, identifier: string, preKeyBundle: WhatsDappSignalPrekeyBundle): Promise<void> {

    //TOOD: choose one preKey from list
    const preKeysCount:number=preKeyBundle.preKeys.length;
    if(preKeysCount<1)throw new Error("No prekeysd given in preKeyBundle");
    const randomIndex:number=randomInt(preKeysCount);
    const chosenPreKey:preKeyPub|undefined=preKeyBundle.preKeys[randomIndex];
    if(!chosenPreKey)throw new Error("Could not retrieve preKey at index "+randomIndex);
    //TODO: lib counts on only one preKey in keyBundle
    const preKeyBundleWithOnePreKey= {
      identityKey: preKeyBundle.identityKey,
      registrationId: preKeyBundle.registrationId,
      preKey: chosenPreKey,
      signedPreKey: {
        keyId: preKeyBundle.signedPreKey.keyId,
        publicKey: preKeyBundle.signedPreKey.publicKey,
        signature: preKeyBundle.signedPreKey.signature
      }
    };

    const deviceId = this.deviceId;
    const store = new SignalProtocolStore(whatsDappStore, identifier);
    const address = new libsignal.ProtocolAddress(identifier, deviceId);
    const sessionBuilder = new libsignal.SessionBuilder(store, address);
    // await sessionBuilder.initOutgoing(preKeyBundle);
    await sessionBuilder.initOutgoing(preKeyBundleWithOnePreKey);
    await store.saveIdentity(address.toString(), preKeyBundle.identityKey);
  }

  // static _b64toCipherText(b64: string): WhatsDappSignalCipherText {
  //   const obj = JSON.parse(new Buffer(b64, 'base64').toString('ascii'));
  //   if (obj['body'] == null || !Array.isArray(obj.body.data)) throw new Error("ciphertext has no data.");
  //   if (obj['type'] == null || typeof obj.type != 'number') throw new Error("ciphertext has no type.");
  //   return obj;
  // }
}
