import * as dapi from './dapi/dapi';
import {EventEmitter} from 'events';
import {DashClient, DashIdentity} from "./types/DashTypes";
import {WhatsDappMessage} from "./dapi/WhatsDappMessage";
import {WhatsDappProfile} from "./dapi/WhatsDappProfile";
import {StructuredStorage, WhatsDappUserData} from "./storage/StructuredStorage";
import {makeClient} from "./dapi/dash_client/DashClient";
import {SignalWrapper} from "./signal/SignalWrapper";
import {IdentityCreateError, WhatsDappError} from "./error/WhatsDappError";
import {Err, Result} from "./types/Result";
type TimerHandle = ReturnType<typeof setTimeout>;

export type WhatsDappSession = {
  //signal: any,
  identity_receiver: string,
  profile_name: string
}

export enum WhatsDappEvent {
  NewMessage = 'new-message',
  NewSession = 'new-session',
  NewMessageSent = 'new-message-sent'
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


/**
 * partial WhatsDappUserData that needs to be completed before it can be used
 * to connect
 */
type LoginInfo = {
  mnemonic: string,
  identityId: string | null,
  dpnsNames: Array<string>,
  displayName: string | null,
}

/**
 * Connecting with locally saved profile: only password needed
 * Connecting with profile that's not saved locally:
 *  - mnemonic & password needed (to save the profile)
 * Connecting with no profile:
 *  - mnemonic & password needed
 *  - displayname & dpns needed
 */
export type ConnectOptions = {
  mnemonic: string,
  identityId: string | null,
  dpnsName: string,
  extraDpnsNames: Array<string>,
  displayName: string,
  lastTimestamp: number,
  password: string,
}

type WhatsDappMessageContent = {
  message: string,
  deleteTime: number
}

export type WhatsDappConnection = {
  identity: any,
  platform: any,
  ownerId: any,
}

const pollInterval = 5000;

export class WhatsDapp extends EventEmitter {
  _connection: WhatsDappConnection = {identity: null, platform: null, ownerId: null};
  _pollTimeout: TimerHandle | null = null;
  _lastPollTime = 0;
  _client: DashClient | null = null;
  _profile: WhatsDappProfile | null = null;
  _sessions: Array<WhatsDappSession> = [];
  initialized: Promise<WhatsDappUserData> | null = null;
  _storage: StructuredStorage;
  _signal: SignalWrapper;

  constructor(storage: StructuredStorage) {
    super();
    this._storage = storage;
    this._signal = new SignalWrapper();
  }

  /**
   * get the stored login from the storage
   */
  async getSavedLogin() : Promise<LoginInfo | null> {
    const savedLogin = await this._storage.getUserData();
    if(savedLogin == null) return null;
    return {
      mnemonic: savedLogin.mnemonic,
      identityId: savedLogin.identityId,
      dpnsNames:  [savedLogin.dpnsName, ...savedLogin.extraDpnsNames],
      displayName: savedLogin.displayName
    };
  }

  /**
   * get a list of the ways the mnemonic could log in
   * by checking its identities and associated dpns names and whatsdapp profiles.
   *  - only mnemonic (to create new identity + new dpns + new profile)
   *  - mnemonic + identity for each identity (create new dpns + profile)
   *  - mnemonic + identity + all dpns for each identity that has dpns
   *  - mnemonic + identity + all dpns + displayname for each identity that has a profile
   */
  static async listLoginInfos(mnemonic: string) : Promise<Array<LoginInfo>> {
    const ret: Array<LoginInfo> = [{mnemonic, identityId: null, dpnsNames: [], displayName: null, }];
    const client = makeClient(mnemonic);
    const account = await client.getWalletAccount();
    // @ts-ignore TODO: this must be fixed in the type declarations of wallet-lib
    const identityIds = await account.identities.getIdentityIds();
    console.log("identities:", identityIds);
    for(let i = 0; i < identityIds.length; i++) {
      const identityId = identityIds[i];
      ret.push({mnemonic, identityId, dpnsNames: [], displayName: null});
      // check for dpns name of identity
      const dpnsNames = await dapi.getDpnsNames(client.platform, identityId);
      console.log("names:", dpnsNames);
      if(dpnsNames.length === 0) continue;
      ret.push({mnemonic, identityId, dpnsNames, displayName: null});

      // check if identity has registered a whatsdapp profile
      const profile = await dapi.getProfile({
        identity: null,
        platform: client.platform,
        ownerId: null
      }, identityId);
      if(profile == null) continue;
      ret.push({mnemonic, identityId, dpnsNames, displayName: profile.data.displayname});
    }
    await client.disconnect();
    return ret;
  }

  async deleteProfile(profile: LoginInfo) : Promise<void> {
    const {mnemonic, identityId, displayName} = profile;
    if(identityId == null || displayName == null) return;
    const client = makeClient(mnemonic);
    const retrievedIdentity = await dapi.getIdentity({platform: client.platform, identity: null, ownerId: identityId}, identityId);
    await dapi.deleteProfile({platform: client.platform, identity: retrievedIdentity, ownerId: identityId});
  }
  /**
   * @param opts {ConnectOptions}
   * @returns {Promise<WhatsDappUserData>}
   */
  async connect(opts: ConnectOptions): Promise<Result<WhatsDappUserData, WhatsDappError>> {
    const {lastTimestamp, displayName, dpnsName, mnemonic} = opts;
    let {identityId} = opts;

    // prepare signal info
    let preKeyBundle;
    const hasPrivateData = await this._storage.hasPrivateData();
    if (!hasPrivateData) {
      const keys = await this._signal.generateSignalKeys();
      await this._storage.setPrivateData(keys.private);
      console.log("saved new priv data");
      preKeyBundle = keys.preKeyBundle;
    }
    const sessionIds = await this._storage.getSessions();
    this._sessions = sessionIds.map(si => ({profile_name: si, identity_receiver: ""}));
    this._lastPollTime = lastTimestamp + 1;
    this._client = makeClient(mnemonic);
    this._connection.platform = this._client.platform;
    if (identityId == null) {
      const newIdentity = await dapi.createIdentity(this._connection);
      const id = newIdentity?.getId().toJSON();
      if (typeof id !== 'string') return Promise.resolve(new IdentityCreateError('created identity is null!'));
      identityId = id;
      console.log(identityId);
    }

    this._connection.identity = await this._connection.platform.identities.get(identityId);

    let dpnsResult: string | null = null;
    if (dpnsName) {
      dpnsResult = (!(await dapi.createDpnsName(this._connection, (dpnsName + ".dash"))) ? null : dpnsName);
    }
    if(typeof dpnsResult !== 'string') throw "unsuccessful dpns name";

    let profile = await dapi.getProfile(this._connection, identityId);

    if (profile == null) {
      console.log("creating new profile!");
      const content = preKeyBundle || {};
      // @ts-ignore
      content.displayname = displayName;
      // @ts-ignore
      content.prekeys = [];
      console.log(content);
      // @ts-ignore
      await dapi.createProfile(this._connection, content);
      profile = await dapi.getProfile(this._connection, identityId);
    }

    this._profile = new WhatsDappProfile(profile);
    const userData : WhatsDappUserData = {
      mnemonic,
      displayName,
      identityId,
      dpnsName,
      extraDpnsNames: []
    };

    this._pollTimeout = setTimeout(() => this._poll(), 0);
    await this._storage.setUserData(userData);
    this.initialized = Promise.resolve(userData);
    return userData;
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

  async getLocalProfile() : Promise<void> {
    return;
  }

  async clearLocalProfile() : Promise<void> {
    return;
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
  emit(ev: string, ...args: unknown[]): boolean {
    return super.emit(ev, ...Array.from(args));
  }

  on(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: WhatsDappSession) => void): this;
  on(ev: WhatsDappEvent.NewSession, listener: (session: WhatsDappSession, bundle: RawPreKeyBundle) => void): this;
  on(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, session: { profile_name: any, identity_receiver: any }) => void): this;
  on(ev: string, listener: (...args: any[]) => void): this {
    return super.on(ev, listener);
  }

  removeListener(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: WhatsDappSession) => void): this;
  removeListener(ev: WhatsDappEvent.NewSession, listener: (session: WhatsDappSession, bundle: RawPreKeyBundle) => void): this;
  removeListener(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, session: { profile_name: any, identity_receiver: any }) => void): this;
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
    await this._storage.addMessageToSession(receiver, wMessage);
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
