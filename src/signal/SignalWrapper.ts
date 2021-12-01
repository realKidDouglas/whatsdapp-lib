import libsignal, { SignalKeyPair, SignalPreKey, SignalSignedPreKey } from "libsignal";
import { arrayBufferToString } from "./utils";
import { SignalProtocolStore } from "./SignalProtocolStoreWrapper";
import { StructuredStorage } from "../storage/StructuredStorage";

type CipherTextType = number// should probably be an enum or 1 | 2 | 3

type WhatsDappSignalCipherText = {
  type: CipherTextType,
  body: {
    data: string
  }
}

export type WhatsDappSignalPrivateKeys = {
  identityKeyPair: SignalKeyPair,
  registrationId: number,
  preKey: SignalPreKey,
  signedPreKey: SignalSignedPreKey,
}

export type WhatsDappSignalSignedPreKey = WhatsDappSignalPreKey & {
  signature: string,
}

type WhatsDappSignalPreKey = {
  keyId: number,
  keyPair: SignalKeyPair
}

export type WhatsDappSignalPrekeyBundle = {
  preKey: { keyId: number, publicKey: ArrayBuffer },
  identityKey: ArrayBuffer,
  registrationId: number,
  signedPreKey: {
    keyId: number,
    publicKey: ArrayBuffer,
    signature: ArrayBuffer
  }
}

export type WhatsDappSignalKeyBundle = {
  private: WhatsDappSignalPrivateKeys,
  preKeyBundle: WhatsDappSignalPrekeyBundle,
}

export interface ISignalLib {
  generateSignalKeys(): Promise<WhatsDappSignalKeyBundle>;
  //  encryptMessage(whatsDappStore: any, receiverId: string, plaintext: string): Promise<string>;
  encryptMessage(whatsDappStore: any, receiverId: string, plaintext: string): Promise<ArrayBuffer>;
  decryptMessage(whatsDappStore: any, senderId: string, cipherText: ArrayBuffer): Promise<string>;
  buildAndPersistSession(whatsDappStore: any, identifier: string, preKeyBundle: WhatsDappSignalPrekeyBundle): Promise<void>;
}

export class SignalWrapper implements ISignalLib {
  //this.createSignalProtocolStoreWrapper('./methods/createSignalProtocolStoreWrapper.js')

  /**
   * generate a new WhatsDappSignalKeyBundle containing the public keys of the IdentityKey,
   * PreKey and SignedPreKey and the RegistationID. This bundle will be made publicly available.
   * In addition it also contains all the Keypairs (with private key) which are to be stored locally.
   * @returns {Promise<WhatsDappSignalKeyBundle>}
   */
  async generateSignalKeys(): Promise<WhatsDappSignalKeyBundle> {
    const identityKeyPair = await libsignal.keyhelper.generateIdentityKeyPair();
    const registrationId = await libsignal.keyhelper.generateRegistrationId();
    const preKey = this._generatePreKey();
    const signedPreKey = await this._generateSignedPreKey(identityKeyPair);
    return {
      private: { identityKeyPair, registrationId, preKey, signedPreKey },
      preKeyBundle: {
        identityKey: identityKeyPair.pubKey,
        registrationId: registrationId,
        preKey: {
          keyId: preKey.keyId,
          publicKey: preKey.keyPair.pubKey
        },
        signedPreKey: {
          keyId: signedPreKey.keyId,
          publicKey: signedPreKey.keyPair.pubKey,
          signature: signedPreKey.signature
        }
      }
    };
  }

  /**
   * encrypts a given message for a specific receiver
   * @param whatsDappStore: Storage object that implements the WhatsDappStorage API
   * @param receiverId: Identifier of the receiver
   * @param plaintext
   * @returns {Promise<string>}: The CipherText object converted into JSON and encoded as Base64
   */
  //   async encryptMessage(whatsDappStore: any, receiverId: string, plaintext: string): Promise<string> {
  async encryptMessage(whatsDappStore: any, receiverId: string, plaintext: string): Promise<ArrayBuffer> {
    const deviceId = 1; // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, receiverId);
    const address = new libsignal.ProtocolAddress(receiverId, deviceId);
    const sessionCipher = new libsignal.SessionCipher(store, address);
    const plaintextBuffer = Buffer.from(plaintext);
    const cipherText = await sessionCipher.encrypt(plaintextBuffer);
    //    return Buffer.from(JSON.stringify(cipherText)).toString("base64");
    return cipherText;
  }

  /**
   * decrypts a message from a specific receiver
   * @param whatsDappStore: Storage object that implements the WhatsDappStorage API
   * @param senderId: Identifier of the sender
   * @param base64: The CipherText object converted into JSON and encoded as Base64
   * @returns {Promise<string>}: The original plaintext
   */
  async decryptMessage(whatsDappStore: any, senderId: string, cipherText: ArrayBuffer): Promise<string> {
    // const cipherText = SignalWrapper._b64toCipherText(base64);

    // const cipherText = SignalWrapper._b64toCipherText(base64);

    const deviceId = 1; // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, senderId);
    const address = new libsignal.ProtocolAddress(senderId, deviceId);
    const sessionCipher = new libsignal.SessionCipher(store, address);

    //TODO: there is no other payload anymore :/
    const messageHasEmbeddedPreKeyBundle = true;//cipherText.type == 3;

    let plaintext;
    if (messageHasEmbeddedPreKeyBundle) {
      //plaintext = await sessionCipher.decryptPreKeyWhisperMessage(Buffer.from(cipherText.body.data), 'binary');
      plaintext = await sessionCipher.decryptPreKeyWhisperMessage(Buffer.from(cipherText), 'binary');
    } else {
      plaintext = await sessionCipher.decryptWhisperMessage(Buffer.from(cipherText), 'binary');
      //plaintext = await sessionCipher.decryptWhisperMessage(Buffer.from(cipherText.body.data), 'binary');
      //plaintext = await sessionCipher.decryptPreKeyWhisperMessage(Buffer.from(cipherText), 'binary');
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
  async buildAndPersistSession(whatsDappStore: StructuredStorage, identifier: string, preKeyBundle: WhatsDappSignalPrekeyBundle): Promise<void> {
    const deviceId = 1; // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, identifier);
    const address = new libsignal.ProtocolAddress(identifier, deviceId);
    const sessionBuilder = new libsignal.SessionBuilder(store, address);
    await sessionBuilder.initOutgoing(preKeyBundle);
    await store.saveIdentity(address.toString(), preKeyBundle.identityKey);
  }

  _generatePreKey(): SignalPreKey {
    const preKeyId = 42; // TODO: replace
    return libsignal.keyhelper.generatePreKey(preKeyId);
  }

  _generateSignedPreKey(identityKeyPair: SignalKeyPair): SignalSignedPreKey {
    const signedPreKeyId = 1337; // TODO: replace
    return libsignal.keyhelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
  }

  static _b64toCipherText(b64: string): WhatsDappSignalCipherText {
    const obj = JSON.parse(new Buffer(b64, 'base64').toString('ascii'));
    if (obj['body'] == null || !Array.isArray(obj.body.data)) throw new Error("ciphertext has no data.");
    if (obj['type'] == null || typeof obj.type != 'number') throw new Error("ciphertext has no type.");
    return obj;
  }
}
