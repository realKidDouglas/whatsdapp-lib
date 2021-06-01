import contracts from "./Contracts";
import DashSDK from "dash";
import {IPlatformStateProof} from "dash/dist/src/SDK/Client/Platform/IPlatformStateProof";
import type {PrivateKey} from "@dashevo/dashcore-lib/typings/PrivateKey";
import type {PublicKey} from "@dashevo/dashcore-lib/typings/PublicKey";
import {DashWalletAccount} from "./DashWalletAccount";
import {DashWallet} from "./DashWallet";
import {err, ok, Result} from "neverthrow";
import {DapiError} from "../../error/WhatsDappError";

export type DashPrivateKey = PrivateKey;
export type DashPublicKey = PublicKey;

export type FetchOpts = {
  where?: Array<[string, string, unknown]>,
  orderBy?: Array<[string, string, unknown]>,
  limit?: number,
  startAt?: number,
  startAfter?: number,
}

type IdentityPublicKey = {
  getId: () => number,
  setId: (id: number) => IdentityPublicKey,
  getType: () => number,
  setType: (type: number) => IdentityPublicKey,
  getData: () => Buffer,
  setData: (data: Buffer) => IdentityPublicKey,
  hash: () => Buffer,
  toObject: () => unknown,
  toJSON: () => unknown,
}

export type DashIdentifier = {
  toBuffer: () => Buffer,
  toJSON: () => string,
  encodeCBOR: (encoder: unknown) => boolean,
}

export type DashIdentity = {
  id: DashIdentifier,
  getProtocolVersion: () => number,
  getId: () => DashIdentifier,
  setPublicKeys: (pk: Array<IdentityPublicKey>) => DashIdentity,
  getPublicKeys: () => Array<IdentityPublicKey>,
  getPublicKeyById: (keyId: number) => IdentityPublicKey,
  toObject: () => unknown,
  toJSON: () => unknown,
  toBuffer: () => Buffer,
  hash: () => Buffer,
  getBalance: () => number,
  setBalance: (balance: number) => DashIdentity,
  increaseBalance: (amount: number) => number,
  reduceBalance: (amount: number) => number,
  setAssetLock: (assetLock: unknown) => DashIdentity,
  getAssetLock: () => unknown,
  getRevision: () => number,
}

export type DashDataContract = {
  protocolVersion: number,
  id: DashIdentifier,
  ownerId: DashIdentifier,
  documents: Record<string, unknown>,
  definitions: unknown,
  schema: string,
  binaryProperties: Record<string, unknown>,
}

export interface DashDocument<T> {
  dataContract: DashDataContract,
  protocolVersion: number,
  id: DashIdentifier,
  type: string,
  dataContractId: DashIdentifier,
  ownerId: DashIdentifier,
  revision: number,
  createdAt: Date,
  updatedAt: Date,
  data: T,

  set(path: string, value: unknown): this;
}

export type DpnsNameDocument = DashDocument<{
  label: string,
  records: DashNameRecord,
  normalizedLabel: string,
  normalizedParentDomainName: string,
}>;

export type StateTransitionBatch = {
  create?: Array<DashDocument<unknown>>,
  replace?: Array<DashDocument<unknown>>,
  delete?: Array<DashDocument<unknown>>,
}

type TransitionExportOptions = {
  skipSignature?: boolean,
  skipIdentifiersConversion?: boolean,
}

interface AbstractStateTransition {
  getProtocolVersion: () => number,
  getType: () => number,
  getSignature: () => Uint8Array,
  setSignature: (signature: Uint8Array) => this,
  toObject: (opts: TransitionExportOptions) => unknown,
  toJSON: () => unknown,
  toBuffer: (opts: TransitionExportOptions) => Uint8Array,
  hash: (opts: TransitionExportOptions) => Uint8Array,
  signByPrivateKey: (privateKey: string | Uint8Array | DashPrivateKey) => this,
  verifySignatureByPublicKey: (publicKey: string | Uint8Array | DashPublicKey) => boolean,
  calculateFee: () => number,
  getModifiedDataIds: () => Array<DashIdentifier>,
  isDocumentStateTransition: () => boolean,
  isDataContractStateTransition: () => boolean,
  isIdentityStateTransition: () => boolean,
}

interface AbstractStateTransitionIdentitySigned extends AbstractStateTransition {
  setSignaturePublicKeyId: (id: number) => this,
  getSignaturePublicKeyId: () => number,
  sign: (identityPublicKey: IdentityPublicKey, privateKey: DashPrivateKey) => this,
  verifySignature: (identityPublicKey: IdentityPublicKey) => boolean,
}

interface DataContractCreateTransition extends AbstractStateTransitionIdentitySigned {
  getEntropy: () => Uint8Array,
  getDataContract: () => DashDataContract,
  setDataContract: (contract: DashDataContract) => this,
}

export interface AbstractDocumentTransition {
  getId: () => DashIdentifier,
  getType: () => number,
  getAction: () => number,
  getDataContractId: () => DashIdentifier,
  get: (propertyPath: string) => unknown,
  toObject: (opts: TransitionExportOptions) => unknown,
  toJSON: () => unknown,
}

export interface AbstractDataDocumentTransition extends AbstractDocumentTransition {
  getData: () => unknown,
}

export interface DocumentCreateTransition extends AbstractDataDocumentTransition {
  getAction: () => 0,
  getEntropy: () => Uint8Array,
  getCreatedAt: () => Date,
  getUpdatedAt: () => Date,
}

export interface DocumentReplaceTransition extends AbstractDataDocumentTransition {
  getAction: () => 1,
  getRevision: () => number,
  getUpdatedAt: () => Date,
}

export interface DocumentDeleteTransition extends AbstractDataDocumentTransition {
  getAction: () => 3,
}

export interface DocumentsBatchTransition extends AbstractStateTransitionIdentitySigned {
  getOwnerId: () => DashIdentifier,
  getTransitions: () => Array<DocumentCreateTransition | DocumentReplaceTransition | DocumentDeleteTransition>,
}

export type DashNameRecord = {
  dashUniqueIdentityId?: DashIdentifier | string,
  dashAliasIdentityId?: DashIdentifier | string
}

type DashContractsFacade = {
  broadcast(dataContract: DashDataContract, identity: DashIdentity): Promise<DataContractCreateTransition>,
  create(contractDefinitions: unknown, identity: DashIdentity): Promise<DashDataContract>,
  get(identifier: DashIdentifier | string): Promise<DashDataContract>,
};

type DashDocumentsFacade = {
  broadcast(documents: StateTransitionBatch, identity: DashIdentity): Promise<DocumentsBatchTransition>,
  create<T>(typeLocator: string, identity: DashIdentity, data: T): Promise<DashDocument<T>>,
  get(typeLocator: string, opts: FetchOpts): Promise<Array<DashDocument<unknown>>>,
};

type DashNamesFacade = {
  register(name: string, records: DashNameRecord, identity: DashIdentity): Promise<DpnsNameDocument>,
  resolve(name: string): Promise<DpnsNameDocument | null>,
  resolveByRecord(record: string, value: unknown): Promise<Array<DpnsNameDocument>>,
  search(labelPrefix: string, parentDomainName: string): Promise<Array<DpnsNameDocument>>,
};

type DashIdentitiesFacade = {
  register: (fundingAmount?: number) => Promise<DashIdentity>,
  get: (id: DashIdentifier | string) => Promise<DashIdentity>,
  topUp: (id: DashIdentifier | string, amount: number) => Promise<boolean>,
};

export type DashPlatform = {
  contracts: DashContractsFacade,
  documents: DashDocumentsFacade,
  names: DashNamesFacade,
  identities: DashIdentitiesFacade,
  client: DashClient,
  dpp: {
    stateRepository: unknown,
    jsonSchemaValidator: unknown,
    dataContract: unknown,
    document: unknown,
    stateTransition: unknown,
    identity: unknown,
  },
  broadcastStateTransition: (platform: DashPlatform, stateTransition: AbstractStateTransition | AbstractDocumentTransition) => Promise<IPlatformStateProof | void>,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DashClient = {
  network: unknown,
  wallet: DashWallet,
  platform: DashPlatform,
  getWalletAccount: () => Promise<DashWalletAccount>,
  getDAPIClient: unknown,
  getApps: unknown,
  disconnect: () => Promise<void>;
}

/**
 * create a properly configured dash client
 * @param mnemonic
 */
export function makeClient(mnemonic: string | null): Result<DashClient, DapiError> {
  try {
    const apps = Object.fromEntries(Object.entries(contracts)
      .map(([key, {contractId}]) => [key, {contractId}]));
    const clientOpts = {
      network: 'testnet',
      wallet: {
        mnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: 491290, // only sync from 2021-05-01
        },
      },
      apps
    };
    const client = new DashSDK.Client(clientOpts);
    if (!client.platform) throw new Error("no platform in client!");
    return ok((client as unknown) as DashClient);

  } catch (e) {
    return err(new DapiError('new DashSDK.Client', e));
  }
}
