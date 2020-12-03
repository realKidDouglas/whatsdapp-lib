import libsignal, {SignalKeyPair, SignalPreKey, SignalSignedPreKey} from "libsignal";
import {arrayBufferToString} from "./utils";
import {SignalProtocolStore} from "./SignalProtocolStoreWrapper";

type CipherTextType = number// should probably be an enum or 1 | 2 | 3

type WhatsDappSignalCipherText = {
  type: CipherTextType,
  body: {
    data: string
  }
}

export type WhatsDappSignalPrivateKeys = {
  identityKeyPair: any,
  registrationId: any,
  preKey: any
  signedPreKey: any,
}

export type WhatsDappSignalSignedPreKey = WhatsDappSignalPreKey & {
  signature: string,
}

type WhatsDappSignalPreKey = {
  keyId: number,
  keyPair: SignalKeyPair
}

export type WhatsDappSignalPrekeyBundle = {
  preKey: { keyId: number, publicKey: string },
  identityKey: string,
  registrationId: string,
  signedPreKey: {
    keyId: number,
    publicKey: string,
    signature: string
  }
}

export type WhatsDappSignalKeyBundle = {
  private: WhatsDappSignalPrivateKeys,
  preKeyBundle: WhatsDappSignalPrekeyBundle,
}

export class SignalWrapper {
  //this.createSignalProtocolStoreWrapper('./methods/createSignalProtocolStoreWrapper.js')

  async generateSignalKeys(): Promise<WhatsDappSignalKeyBundle> {
    const identityKeyPair = await libsignal.keyhelper.generateIdentityKeyPair();
    const registrationId = await libsignal.keyhelper.generateRegistrationId();
    const preKey = this._generatePreKey();
    const signedPreKey = await this._generateSignedPreKey(identityKeyPair);
    return {
      private: {identityKeyPair, registrationId, preKey, signedPreKey},
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

  async encryptMessage(whatsDappStore: any, receiverId: string, plaintext: string): Promise<string> {
    const deviceId = 1; // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, receiverId);
    const address = new libsignal.ProtocolAddress(receiverId, deviceId);
    const sessionCipher = new libsignal.SessionCipher(store, address);
    const plaintextBuffer = Buffer.from(plaintext);
    const cipherText = await sessionCipher.encrypt(plaintextBuffer);
    return Buffer.from(JSON.stringify(cipherText)).toString("base64");
  }

  async decryptMessage(whatsDappStore: any, senderId: string, base64: string): Promise<string> {
    if (base64 == "hallo") return base64;
    const cipherText = SignalWrapper._b64ToCypherText(base64);
    const deviceId = 1; // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, senderId);
    const address = new libsignal.ProtocolAddress(senderId, deviceId);
    const sessionCipher = new libsignal.SessionCipher(store, address);

    const messageHasEmbeddedPreKeyBundle = cipherText.type == 3;

    let plaintext;
    if (messageHasEmbeddedPreKeyBundle) {
      plaintext = await sessionCipher.decryptPreKeyWhisperMessage(Buffer.from(cipherText.body.data), 'binary');
    } else {
      plaintext = await sessionCipher.decryptWhisperMessage(Buffer.from(cipherText.body.data), 'binary');
    }
    return arrayBufferToString(plaintext, 'binary');
  }

  async buildAndPersistSession(whatsDappStore: any, identifier: string, preKeyBundle: WhatsDappSignalPrekeyBundle): Promise<void> {
    const deviceId = 1; // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, identifier);
    const address = new libsignal.ProtocolAddress(identifier, deviceId);
    const sessionBuilder = await new libsignal.SessionBuilder(store, address);
    await sessionBuilder.initOutgoing(preKeyBundle);
  }

  _generatePreKey(): SignalPreKey {
    const preKeyId = 42; // TODO: replace
    return libsignal.keyhelper.generatePreKey(preKeyId);
  }

  _generateSignedPreKey(identityKeyPair: SignalKeyPair): SignalSignedPreKey {
    const signedPreKeyId = 1337; // TODO: replace
    return libsignal.keyhelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
  }

  static _b64ToCypherText(b64: string): WhatsDappSignalCipherText {
    // TODO: ascii probably will mess up unicode chars
    const obj = JSON.parse(new Buffer(b64, 'base64').toString('ascii'));
    if (obj['body'] == null || typeof obj.body.data != 'string') throw new Error("ciphertext has no data.");
    if (obj['type'] == null || typeof obj.type != 'number') throw new Error("ciphertext has no type.");
    return obj;
  }
}
