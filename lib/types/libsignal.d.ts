declare module 'libsignal' {
  import type {SignalProtocolStore} from '../signal/SignalProtocolStoreWrapper';

  export type SignalSignedPreKey = SignalPreKey & {
    signature: string,
  }

  export type SignalPreKey = {
    keyId: number,
    keyPair: SignalKeyPair,
  }

  export type SignalKeyPair = {
    pubKey: string,
    privateKey: string
  }

  export type SignalSessionRecord = any

  export interface ProtocolStore {
    getOurIdentity: () => Promise<SignalKeyPair>
    getOurRegistrationId: () => Promise<number>
    isTrustedIdentity: (identitifier: string, identityKey: any, _direction: number) => Promise<boolean>
    loadIdentityKey: (identifier: string) => Promise<SignalKeyPair>
    saveIdentity: (identifier: string, identityKey: ArrayBuffer) => Promise<boolean>
    loadPreKey: (keyId: number) => Promise<SignalKeyPair>
    storePreKey: (keyId: number, keyPair: SignalKeyPair) => Promise<void>
    removePreKey: (keyId: number) => Promise<void>
    loadSignedPreKey: (keyId: number) => Promise<SignalKeyPair>
    storeSignedPreKey: (keyId: number, keyPair: SignalSignedPreKey) => Promise<void>
    removeSignedPreKey: (keyId: number) => Promise<void>
    loadSession: (identifier: string) => Promise<SignalSessionRecord>
    storeSession: (identifier: string, record: SignalSessionRecord) => Promise<void>
    get: (id: string) => SignalKeyPair
    remove: (id: string) => void
  }

  export const keyhelper: {
    generateIdentityKeyPair(): SignalKeyPair,
    generateRegistrationId(): any,
    generateSignedPreKey(identityKeyPair: SignalKeyPair, signedPreKeyId: number): SignalSignedPreKey,
    generatePreKey(preKeyId: number): SignalPreKey,
  };

  export class ProtocolAddress {
    constructor(receiverId: string, deviceId: number)
    static from(identifier: string): ProtocolAddress
    getName(): string
    id: string
    deviceId: number
  }

  export class SessionCipher {
    constructor(store: SignalProtocolStore, address: ProtocolAddress)
    encrypt(plaintextBuffer: Buffer): ArrayBuffer
    async decryptPreKeyWhisperMessage(buf: Buffer, encoding: string): Promise<ArrayBuffer>
    async decryptWhisperMessage(buf: Buffer, encoding: string): Promise<ArrayBuffer>
  }

  export class SessionBuilder {
    constructor(store: ProtocolStore, address: ProtocolAddress)
    initOutgoing(SignalPreKeyBundle): Promise<void>
  }
}
