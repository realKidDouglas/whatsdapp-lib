import * as dapi from './dapi/dapi';
import {EventEmitter} from 'events';
import DashSDK from "dash";
import {DashClient, DashIdentity} from "./types/DashTypes";
import {WhatsDappMessage} from "./dapi/WhatsDappMessage";
import {WhatsDappProfile} from "./dapi/WhatsDappProfile";
import {SignalKeyPair, SignalPreKey, SignalSignedPreKey} from "libsignal";
import {StructuredStorage} from "./storage/StructuredStorage";

type TimerHandle = ReturnType<typeof setTimeout>;

export type WhatsDappSession = {
  //signal: any,
  identity_receiver: string,
  profile_name: string
}

export enum WhatsDappEvent {
  NewMessage = 'new-message',
  NewSession = 'new-session',
  NewMessageSent = 'new-message-sent',
  StorageRead = 'storage-read',
  StorageWrite = 'storage-write',
  StorageDelete = 'storage-delete'
}

export type RawPreKeyBundle = {
  identityKey: Array<string>,
  registrationId: number,
  signedPreKey: SignedPreKey,
  preKey: PreKey,
  prekeys: Array<string>,
  displayname: string,
}

// TODO: get type from contract
export type RawProfile = {
  createdAt: Date,
  updatedAt: Date
  data: RawPreKeyBundle,
}

export type SignedPreKey = {
  keyId: number,
  publicKey: Array<string>
}

export type PreKey = {
  keyId: number,
  publicKey: Array<string>,
  signature: Array<string>
}

export type RawMessage = {
  ownerId: Array<string>,
  createdAt: Date,
  data: {
    receiverId: string,
    content: string
  },
  id: Array<string>
};

export type WhatsDappProfileContent = {
  identityKey: string // content.identityKey,
  registrationId: string // content.registrationId,
  signedPreKey: string // content.signedPreKey,
  preKey: string // content.preKey,
  prekeys: Array<string>// content.prekeys,
  displayname: string //content.displayname
}

type ConnectOptions = {
  mnemonic: string,
  sessions: Array<WhatsDappSession>,
  identity: any,
  displayname: string,
  createDpnsName: string | null,
  lastTimestamp: number,
  preKeyBundle: any
}

type WhatsDappMessageContent = {
  message: string,
  deleteTime: number
}

type ConnectResult = {
  displayName: string,
  createDpnsName: string | null,
  identity: DashIdentity
}

export type WhatsDappConnection = {
  identity: any,
  platform: any,
  ownerId: any,
}

export type WhatsDappUserData = {
  mnemonic: string,
  displayName: string,
  identityAddr: string,
  dpnsName: string
}

export type WhatsDappPrivateData = {
  identityKeyPair: SignalKeyPair,
  registrationId: number,
  preKey: SignalPreKey,
  signedPreKey: SignalSignedPreKey
}

const pollInterval = 5000;

export class WhatsDapp extends EventEmitter {
  _connection: WhatsDappConnection = {identity: null, platform: null, ownerId: null};
  _pollTimeout: TimerHandle | null = null;
  _lastPollTime = 0;
  _client: DashClient | null = null;
  _profile: WhatsDappProfile | null = null;
  _sessions: Array<WhatsDappSession> = [];
  initialized: Promise<ConnectResult> | null = null;
  storage: StructuredStorage;

  constructor() {
    super();
    // TODO: should this be a class?
    const store = {
      get: (key: string) => new Promise(r => this.emit(WhatsDappEvent.StorageRead, key, r)) as Promise<Uint8Array | null>,
      set: (key: string, value: Uint8Array) => this.emit(WhatsDappEvent.StorageWrite, key, value),
      del: (key: string) => this.emit(WhatsDappEvent.StorageDelete, key)
    };
    this.storage = new StructuredStorage(store);
  }

  /**
   * @param opts {}
   * @returns {Promise<{profile_name:string, identity}>}
   */
  async connect(opts: ConnectOptions): Promise<ConnectResult> {
    let {identity} = opts;
    const {mnemonic, sessions, displayname, lastTimestamp, preKeyBundle, createDpnsName} = opts;
    this._lastPollTime = lastTimestamp + 1;
    this._client = makeClient(mnemonic);
    this._connection.platform = this._client.platform;
    this._sessions = sessions;
    if (identity == null) {
      const id = await dapi.createIdentity(this._connection);
      if (id === null) console.log('created identity is null!');
      identity = id?.getId().toJSON();
      console.log(identity);
    }

    this._connection.identity = await this._connection.platform.identities.get(identity);

    let dpnsResult: string | null = null;
    if (createDpnsName) {
      dpnsResult = (!(await dapi.createDpnsName(this._connection, (createDpnsName + ".dash"))) ? null : createDpnsName);
    }

    let profile = await dapi.getProfile(this._connection, identity);

    if (profile == null) {
      console.log("creating new profile!");
      const content = preKeyBundle;
      content.displayname = displayname;
      content.prekeys = [];
      console.log(content);
      await dapi.createProfile(this._connection, content);
      profile = await dapi.getProfile(this._connection, identity);
    }

    this._profile = new WhatsDappProfile(profile);

    // deferred initialization
    this.initialized = Promise.resolve()
      .then(() => this._pollTimeout = setTimeout(() => this._poll(), 0)) // first poll is immediate
      .catch(e => console.log("error", e))
      .then(() => ({displayName: displayname, identity: identity, createDpnsName: dpnsResult}));

    return this.initialized;
  }

  /** _poll is async, if we used an interval we might start a new poll before
   * the last one was done. that's why _poll sets up the next poll after it's done.
   */
  async _poll() {
    console.log("poll new messages since", this._lastPollTime);
    this._pollTimeout = null;
    const pollTime = this._lastPollTime;

    // TODO: it should be possible to do this per session / chat partner.
    const messages: Array<RawMessage> = await dapi.getMessagesByTime(this._connection, pollTime);

    const messagePromises = messages.map((m: RawMessage) => this._broadcastNewMessage(m).catch(e => console.log('broadcast failed!', e)));
    console.log('got', messagePromises.length, 'new messages.');
    if (messages.length > 0) {
      const polledMessage = messages[messages.length - 1];
      if (polledMessage !== undefined)
        this._lastPollTime = polledMessage.createdAt.getTime();
    }

    await Promise.all(messagePromises);

    this._pollTimeout = setTimeout(() => this._poll(), pollInterval);

  }

  async _broadcastNewMessage(rawMessage: RawMessage): Promise<void> {
    const message: WhatsDappMessage = new WhatsDappMessage(rawMessage);
    const session = await this._getOrCreateSession(rawMessage.ownerId, message.senderHandle);
    await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition
    // TODO: Separate Signals for messages sent by us and other people
    this.emit(WhatsDappEvent.NewMessage, message, session);
    // TODO: await this.storage.addMessageToSession(session.profile_name, message);
    this._lastPollTime = Math.max(this._lastPollTime, message.timestamp + 1);
  }

  _getMessageFromContent(content: string): string {
    return JSON.parse(content).message;
  }

  _getDeleteTimeFromContent(content: string): number {
    return JSON.parse(content).deleteTime;
  }

  async _deleteMessages(deleteTime: number, senderid: string): Promise<void> {
    console.log("Delete old Messages, Deltetime " + deleteTime + "SenderID: " + senderid);
    //dapi.deleteMessage(this._connection, deleteTime, senderid);
  }


  async _getOrCreateSession(ownerId: any, senderHandle: string): Promise<WhatsDappSession> {
    let session: WhatsDappSession = this._sessions[ownerId] as WhatsDappSession;
    if (session == null) {
      session = {profile_name: senderHandle, identity_receiver: ownerId};
      const preKeyBundle = (await dapi.getProfile(this._connection, ownerId)).data;
      this._sessions[ownerId] = session;
      this.emit(WhatsDappEvent.NewSession, session, preKeyBundle);
    }
    return session;
  }

  emit(ev: WhatsDappEvent.NewMessage, message: WhatsDappMessage, session: WhatsDappSession): boolean;
  emit(ev: WhatsDappEvent.NewSession, session: WhatsDappSession, bundle: RawPreKeyBundle): boolean;
  emit(ev: WhatsDappEvent.NewMessageSent, wMessage: WhatsDappMessage, session: { profile_name: any, identity_receiver: any }): boolean;
  emit(ev: WhatsDappEvent.StorageRead, storageKey: string, ret: (val: Uint8Array | null) => void): boolean;
  emit(ev: WhatsDappEvent.StorageWrite, storageKey: string, storageValue: Uint8Array): boolean;
  emit(ev: WhatsDappEvent.StorageDelete, storageKey: string): boolean;
  emit(ev: string, ...args: unknown[]): boolean {
    return super.emit(ev, ...Array.from(args));
  }

  on(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: WhatsDappSession) => void): this;
  on(ev: WhatsDappEvent.NewSession, listener: (session: WhatsDappSession, bundle: RawPreKeyBundle) => void): this;
  on(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, session: { profile_name: any, identity_receiver: any }) => void): this;
  on(ev: WhatsDappEvent.StorageRead, listener: (storageKey: string, ret: (val: Uint8Array | null) => void) => void): this;
  on(ev: WhatsDappEvent.StorageWrite, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: WhatsDappEvent.StorageDelete, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: string, listener: (...args: any[]) => void): this {
    return super.on(ev, listener);
  }

  removeListener(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: WhatsDappSession) => void): this;
  removeListener(ev: WhatsDappEvent.NewSession, listener: (session: WhatsDappSession, bundle: RawPreKeyBundle) => void): this;
  removeListener(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, session: { profile_name: any, identity_receiver: any }) => void): this;
  removeListener(ev: WhatsDappEvent.StorageRead, listener: (storageKey: string, ret: (val: Uint8Array | null) => void) => void): this;
  removeListener(ev: WhatsDappEvent.StorageWrite, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  removeListener(ev: WhatsDappEvent.StorageDelete, listener: (storageKey: string) => void): this;
  removeListener(ev: string, listener: (...args: any[]) => void): this {
    return super.removeListener(ev, listener);
  }

  removeAllListeners(ev?: WhatsDappEvent): this;
  removeAllListeners(ev?: string): this {
    return super.removeAllListeners(ev);
  }


  /**
   * TODO: instead of indefinitely awaiting init, set
   * TODO: timeout and reject after some amount
   * TODO: of time and mark message for retry in GUI
   * @param receiver {string} B58?
   * @param ciphertext {string}
   * @param plaintext {string}
   * @returns {Promise<boolean>}
   */
  async sendMessage(receiver: string, ciphertext: string, plaintext: string) {
    console.log("start init sending");
    await this.initialized;
    console.log("end init sending");

    /*const batch = */
    const sentMessage: any = await dapi.createMessage(this._connection, receiver, ciphertext);

    console.log("sentmessage");
    console.log(sentMessage);

    const rIdentity = await this._connection.platform.identities.get(receiver);

    const rMessage: RawMessage = {
      ownerId: sentMessage.ownerId,
      createdAt: sentMessage.transitions[0].createdAt,
      data: {
        receiverId: receiver,
        content: plaintext
      },
      id: sentMessage.transitions[0].id
    };

    console.log(rMessage);

    const wMessage: WhatsDappMessage = new WhatsDappMessage(rMessage);
    //await dapi.createMessage(this._connection, receiver, ciphertext);
    //const message = transitionToMessage(batch.transitions[0], this._connection.identity)

    // GUI listens to this, can then remove send-progressbar or w/e
    // storage also listens and will save the message.
    console.log({profile_name: receiver, identity_receiver: rIdentity.getId()});
    this.emit(WhatsDappEvent.NewMessageSent, wMessage, {profile_name: receiver, identity_receiver: rIdentity.getId()});
    await this.storage.addMessageToSession(receiver, wMessage);
    console.log("sent");
  }

  createInputMessage(plaintext: string): string {
    const inputMessage: WhatsDappMessageContent = {message: plaintext, deleteTime: new Date().getTime()};
    const inputMessageJson = JSON.stringify(inputMessage);
    return inputMessageJson;
  }

  getSessions() {
    return this._sessions;
  }

  disconnect() {
    if (this._pollTimeout) clearTimeout(this._pollTimeout);
    this._pollTimeout = null;
    console.log("WhatsDapp: Disconnect!");
  }


  async getProfileByName(name: string): Promise<WhatsDappSession | null> {
    // Resolve DPNS-Name to Identity
    const dpnsName: string = name + ".dash";
    const identity: DashIdentity | null = await dapi.findIdentityByName(this._connection, dpnsName);
    if (identity == null) {
      console.log("no identity found for " + name);
      return null;
    }
    //TODO: Es sollte nicht bei jedem suchen eine Session erzeugt werden
    const session = await this._getOrCreateSession(identity.getId(), identity.getId().toString()); // TODO: Was soll der Anzeigename sein
    return session;
  }
}


function makeClient(mnemonic?: string): DashClient {
  const clientOpts = {
    network: 'evonet',
    wallet: {mnemonic},
    apps: {
      message_contract: {
        contractId: '5RNvuFQjFQXZLUDJ4dJdagULLeqsKbHTvh6dUR3LQqbC'
      },
      profile_contract: {
        contractId: 'EZasUKrqisqKx9UrorWs37LU8pxcgnTv7Nbf4o4geNDL'
      }
    }
  };
  return new DashSDK.Client(clientOpts);
}
