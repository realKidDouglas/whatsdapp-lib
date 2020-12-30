declare module 'libsignal' {
  import type {SignalProtocolStore} from '../signal/SignalProtocolStoreWrapper';

  export type SignalSignedPreKey = SignalPreKey & {
    signature: ArrayBuffer,
  }

  export type SignalPreKey = {
    keyId: number,
    keyPair: SignalKeyPair,
  }

  export type SignalKeyPair = {
    pubKey: ArrayBuffer,
    privKey: ArrayBuffer
  }

  export type SerializedSessionEntry = unknown;
  export type SerializedSessionRecord = unknown;

  export declare class SessionEntry {
    inspect(): string
    addChain(key: Buffer, value: any): void
    getChain(key: Buffer, value: any): void
    deleteChain(key: Buffer): void
    //chains(): Generator
    serialize(): SerializedSessionEntry
    static deserialize(data: SerializedSessionEntry): SessionEntry
  }

  export declare class SessionRecord {
    serialize(): SerializedSessionRecord
    static deserialize(data: SerializedSessionRecord): SessionRecord
    static createEntry(): SessionEntry
    haveOpenSession(): bool
    getSession(key: Buffer): SessionEntry
    getOpenSession(): SessionEntry
    setSession(session: SessionEntry): void
    getSessions(session: SessionEntry): Array<SessionEntry>
    closeSession(session: SessionEntry): void
    openSession(session: SessionEntry): void
    isClosed(session: SessionEntry): boolean
    removeOldSessions(): void
    deleteAllSessions(): void
  }

  export interface ProtocolStore {
    getOurIdentity: () => Promise<SignalKeyPair>
    getOurRegistrationId: () => Promise<number>
    isTrustedIdentity: (identifier: string, identityKey: any, _direction: number) => Promise<boolean>
    loadIdentityKey: (identifier: string) => Promise<SignalKeyPair>
    saveIdentity: (identifier: string, identityKey: ArrayBuffer) => Promise<boolean>
    loadPreKey: (keyId: number) => Promise<SignalKeyPair>
    storePreKey: (keyId: number, keyPair: SignalKeyPair) => Promise<void>
    removePreKey: (keyId: number) => Promise<void>
    loadSignedPreKey: (keyId: number) => Promise<SignalKeyPair>
    storeSignedPreKey: (keyId: number, keyPair: SignalSignedPreKey) => Promise<void>
    removeSignedPreKey: (keyId: number) => Promise<void>
    loadSession: (identifier: string) => Promise<SessionRecord | null>
    storeSession: (identifier: string, record: SessionRecord) => Promise<void>
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
    toString(): string
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
