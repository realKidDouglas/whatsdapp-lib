import DashSDK from "dash";

export type DashClient = typeof DashSDK.Client.prototype;

export type DashIdentifier = {
  toBuffer: () => Buffer,
  toJSON: () => string,
  encodeCBOR: (encoder: Encoder) => boolean,

}

export type DashIdentity = {
  id: DashIdentifier,
  getProtocolVersion: () => number,
  getId: () => DashIdentifier,
  setPublicKeys: (pk: Array<IdentityPublicKey>) => DashIdentity,
  getPublicKeys: () => Array<IdentityPublicKey>,
  getPublicKeyById: (keyId: number) => IdentityPublicKey,
  toObject: () => RawIdentity,
  toJSON: () => JsonIdentity,
  toBuffer: () => Buffer,
  hash: () => Buffer,
  getBalance: () => number,
  setBalance: (balance: number) => DashIdentity,
  increaseBalance: (amount: number) => number,
  reduceBalance: (amount: number) => number,
  setAssetLock: (assetLock: AssetLock) => DashIdentity,
  getAssetLock: () => AssetLock,
  getRevision: () => number,
}

export type JsonIdentity = {
  protocolVersion: number,
  id: string,
  publicKeys: Array<JsonIdentityPublicKey>,
  balance: number,
  revision: number
}

export type RawIdentity = {
  protocolVersion: number,
  id: Buffer,
  publicKeys: Array<RawIdentityPublicKey>,
  balance: number,
  revision: number,
}

export type InstantLock = any

export type InstantAssetLockProof = RawInstantAssetLockProof & {
  getType: () => number,
  getInstantLock: () => InstantLock,
  toObject: () => RawInstantAssetLockProof,
  toJSON: () => JsonInstantAssetLockProof,
}

export type RawInstantAssetLockProof = {
  type: number,
  instantLock: Buffer,
}

export type JsonInstantAssetLockProof = {
  type: number,
  instantLock: string,
}

export type JsonAssetLock = {
  transaction: string,
  outputIndex: number,
  proof: JsonInstantAssetLockProof
}

export type RawAssetLock = {
  transaction: Buffer,
  outputIndex: number,
  proof: RawInstantAssetLockProof
}

export type Encoder = { pushAny: (buf: Buffer) => void }

// https://github.com/dashevo/dashcore-lib/blob/master/lib/transaction/transaction.js
export type Transaction = any;

//https://github.com/dashevo/dashcore-lib/blob/master/lib/transaction/output.js
export type TransactionOutput = any;

export type AssetLock = {
  getTransaction: () => Transaction,
  getOutputIndex: () => number,
  getOutput: () => TransactionOutput,
  getOutPoint: () => Buffer,
  getProof: () => InstantAssetLockProof,
  createIdentifier: () => DashIdentifier,
  toObject: () => RawAssetLock,
  toJSON: () => JsonAssetLock
}

export type JsonIdentityPublicKey = {
  id: number,
  type: number,
  data: string,
}

export type RawIdentityPublicKey = {
  id: number,
  type: number,
  data: Buffer
}

export type IdentityPublicKey = RawIdentityPublicKey & {
  getId: () => number,
  setId: (id: number) => IdentityPublicKey,
  getType: () => number,
  setType: (type: number) => IdentityPublicKey,
  getData: () => Buffer,
  setData: (data: Buffer) => IdentityPublicKey,
  hash: () => Buffer,
  toObject: () => RawIdentityPublicKey,
  toJSON: () => JsonIdentityPublicKey,
}
