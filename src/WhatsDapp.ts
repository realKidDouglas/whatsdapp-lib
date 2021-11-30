import { EventEmitter } from 'events';
import { DashClient, DashIdentity } from "./types/DashTypes";
import { SignalKeyPair, SignalPreKey, SignalSignedPreKey } from "libsignal";
import { KVStore, StructuredStorage } from "./storage/StructuredStorage";
import { getWhatsDappDashClient } from "./dapi/dash_client/WhatsDappDashClient";
import { ISignalLib, SignalWrapper, WhatsDappSignalKeyBundle, WhatsDappSignalPrekeyBundle } from "./signal/SignalWrapper";


import { Platform } from 'dash/dist/src/SDK/Client/Platform';
import { DAPICommunicator } from './dapi/DAPICommunicator';

/**
 *  
 * TOOD:
 *  -  internal message-format
    -  all infos about a message internally
    -  EACH message needs an id per session (or global id)
    -  or just take session-id plus message-id as global identifier
 */
export type WhatsDappMessage = {
  //message: string,
  // deleteTime: number,

  //global or per session?
  //either sessionId or senderId and recevierId
  id: string;
  //plaintext message content
  content: string;

  timestampSent: number;
  //atPlatform: boolean|null;
  timestampAtPlatform: number | undefined;

  updatedAt: number;

  //Dash Identities-IDs
  senderId: string; //same as ownerId
  recipientId: string;

  listOfReadMessageIds: string[];
  referenceToMessageId?: string;

  //only for client?
  read?: boolean;
  newMessage?: boolean;
}
// export type WhatsDappMessageContent = {
//   message: string,
//   deleteTime: number
// }

export type Interlocutor={
  identityString: string;
}
// export type WhatsDappSession = {
//   identity_receiver: string,
//   profile_name: string
// }

export enum WhatsDappEvent {
  NewMessage = 'new-message',
  NewSession = 'new-session',
  NewMessageSent = 'new-message-sent',
  StorageRead = 'storage-read',
  StorageWrite = 'storage-write',
  StorageDelete = 'storage-delete'
}

export type DriveMessage = {
  id: string,
  //aka: senderId
  ownerId: string,
  recipientId: string,
  createdAt: Date,
  updatedAt: Date,
  //TODO: whatsDapp protocol version ;)
  kindOfInternalVersion?: number;
  //payload: base64 string containing encrypted WhatsDappMessage
  payload: ArrayBuffer,
  // data: {
  //   receiverId: string,
  //   content: string
  // },
};

export type WhatsDappProfile = {
  signalKeyBundle: WhatsDappSignalPrekeyBundle,
  // signalKeyBundle: {
  //   preKey: {
  //     keyId: number,
  //     publicKey: ArrayBuffer,
  //   },
  //   identityKey: ArrayBuffer,
  //   registrationId: number,
  //   signedPreKey: {
  //     keyId: number,
  //     publicKey: ArrayBuffer,
  //     signature: ArrayBuffer,
  //   },
  // },
  //optional
  nickname?: string,
  // identityKey: string // content.identityKey,
  // registrationId: string // content.registrationId,
  // signedPreKey: string // content.signedPreKey,
  // preKey: string // content.preKey,
  // prekeys: Array<string>// content.prekeys,
  // displayname: string //content.displayname
}
// export type WhatsDappProfileContent = {
//   identityKey: string // content.identityKey,
//   registrationId: string // content.registrationId,
//   signedPreKey: string // content.signedPreKey,
//   preKey: string // content.preKey,
//   prekeys: Array<string>// content.prekeys,
//   displayname: string //content.displayname
// }

// export type ConnectOptions = {
//   mnemonic: string,
//   sessions: Array<WhatsDappSession>,
//   identity: any,
//   displayname: string,
//   createDpnsName: string | null,
//   lastTimestamp: number,
//   preKeyBundle: any
// }

// export type ConnectResult = {
//   displayName: string,
//   createDpnsName: string | null,
//   identity: DashIdentity
// }

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

type TimerHandle = ReturnType<typeof setTimeout>;
// const pollInterval = 5000;

export class WhatsDapp extends EventEmitter {

  private identity: DashIdentity | undefined;
  private platform: Platform | undefined;

  private client: DashClient | undefined;
  private dAPICommunicator!: DAPICommunicator;

  private storage: StructuredStorage;
  private signal: ISignalLib;


  private pollTimeout: TimerHandle | null = null;
  private pollInterval: number = 5000;
  //TODO: bring to capicommunicator
  _lastPollTime = 0;

  _profile: WhatsDappProfile | null = null;
  _sessions: Array<Interlocutor> = [];
  //private initialized: Promise<ConnectResult> | null = null;
  private initialized: boolean=false;


  static async createWhatsDapp(mnemonic: string, identityString: string | null, storeObj?: KVStore, signalLib?: ISignalLib) {
    //synchronous stuff here
    const whatsDapp = new this(storeObj, signalLib);
    //asnychronous stuff here
    await whatsDapp.init(mnemonic, identityString);
    return whatsDapp;
  }

  private constructor(storeObj?: KVStore, signalLib?: ISignalLib) {
    super();

    //TODO: similar for storage: choose default if no one was given
    if (storeObj) {
      this.storage = new StructuredStorage(storeObj);
    } else {
      //TODO: whatsDappStore? localstorage or IDK...
      const store: KVStore = {
        get: (key: string) => new Promise(r => this.emit(WhatsDappEvent.StorageRead, key, r)) as Promise<Uint8Array | null>,
        set: (key: string, value: Uint8Array) => this.emit(WhatsDappEvent.StorageWrite, key, value),
        del: (key: string) => this.emit(WhatsDappEvent.StorageDelete, key)
      };
      this.storage = new StructuredStorage(store);
    }

    //if no signal implementation was given, choose default one
    if (signalLib) {
      this.signal = signalLib
    } else {
      this.signal = new SignalWrapper();
    }
  }


  async init(mnemonic: string, identityString: string | null) {
    this.client = getWhatsDappDashClient(mnemonic);
    //TODO if !client
    if (!this.client) {
      throw new Error("Client undefined");
    }

    this.platform = this.client.platform;

    //TODO troubleshooting?
    if (!this.platform) {
      throw new Error("Platform undefined");
    }

    //if no identity was given, register a new one
    if (identityString == null) {
      const newIdentity = await this.createNewIdentity()
      const identityString = newIdentity.getId().toJSON();
      console.log(identityString);

      //TODO: return newIdentrity somehow to user of lib
      //getCurIdentity() or something
    }

    this.identity = await this.platform.identities.get(identityString);

    //TODO if !identity
    if (!this.identity) {
      throw new Error("Identity undefined");
    }

    this.dAPICommunicator = new DAPICommunicator(this.platform, this.identity);

    //first step is done

    //TODO: flag for init is done (boolean or something)

    //TODO: clean dapi
    let profile: WhatsDappProfile = await this.dAPICommunicator.getProfile(this.identity.getId().toJSON());

    if (profile == null) {
      //TODO: maybe something else went wrong?
      console.log("No profile for identity was found. Do you have one?")
      profile=await this.createNewRawProfile()
    }
    this._profile = profile;

    this.initialized=true;
  }

  async createDpnsName(desiredDpnsNameWithoutPostfix: string): Promise<boolean> {
    const desiredDpnsNameWithPostfix: string = desiredDpnsNameWithoutPostfix + '.dash';
    return await this.dAPICommunicator.createDpnsName(desiredDpnsNameWithPostfix);
  }

  async getProfile() {
    let profile: WhatsDappProfile = await this.dAPICommunicator.getProfile(this.identity!.getId().toJSON());
    return profile;
  }
  async createNewRawProfile(/*profile: WhatsDappProfile*/):Promise<WhatsDappProfile>{
    //let profile = await this.dAPICommunicator.getProfile(this.identity!.getId().toJSON());

    //TODO ;)

    // if (profile == null) {
    console.log("creating new profile!");

    const keysBundle: WhatsDappSignalKeyBundle = await this.createKeys()
    const preKeyBundle: WhatsDappSignalPrekeyBundle = keysBundle.preKeyBundle;

    const profileDoc:WhatsDappProfile={
      signalKeyBundle: preKeyBundle,
    }

    // const content = profile.data.preKeyBundle;
    //const content: RawPreKeyBundle = (await this.createKeys()).preKeyBundle;

    //content.displayname = profile.data.displayname;

    //content.prekeys = [];
    //console.log(content);

    await this.dAPICommunicator.createProfile(profileDoc);

    let profile = await this.dAPICommunicator.getProfile(this.identity!.getId().toJSON());
    
    return profile;
  }

  async createNewIdentity(): Promise<DashIdentity> {
    const newIdentity: DashIdentity | null = await this.dAPICommunicator.createIdentity();
    if (newIdentity === null) {
      console.log('created identity is null!');
      throw new Error("new identity is null");
    }
    return newIdentity;
  }

  startPolling(pollIntervalMilliseconds?: number): boolean {

    //TODO: check if everything is initialized
    //kind of:
    //if(!messenger_initialized)console.log("try again later"); return false
    //else do stuff and return true or pollIntervall

    if (pollIntervalMilliseconds) {
      this.pollInterval = pollIntervalMilliseconds;
    }

    return true;
  }
  stopPolling() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    }
    this.pollTimeout = null;
  }

  setPollIntervall(pollIntervalMilliseconds: number) {
    this.pollInterval = pollIntervalMilliseconds;
    if (this.pollTimeout) {
      //if poll is not currently running, reset timeout, otherwise it will take pollInterval from above
      clearTimeout(this.pollTimeout);
      this.pollTimeout = setTimeout(() => this._poll(), this.pollInterval);
    }
  }

  /** _poll is async, if we used an interval we might start a new poll before
   * the last one was done. that's why _poll sets up the next poll after it's done.
   */
  async _poll() {
    console.log("poll new messages since", this._lastPollTime);
    this.pollTimeout = null;
    const pollTime = this._lastPollTime;

    // TODO: it should be possible to do this per session / chat partner.
    //const messages: Array<RawMessage> = await dapi.getMessagesByTime(this._connection, pollTime);
    const messages: Array<DriveMessage> = await this.dAPICommunicator!.getMessagesByTime(pollTime);

    const messagePromises = messages.map((m: DriveMessage) => this._broadcastNewMessage(m).catch(e => console.log('broadcast failed!', e)));
    console.log('got', messagePromises.length, 'new messages.');
    if (messages.length > 0) {
      const polledMessage = messages[messages.length - 1];
      if (polledMessage !== undefined)
        this._lastPollTime = polledMessage.createdAt.getTime();
    }

    await Promise.all(messagePromises);

    this.pollTimeout = setTimeout(() => this._poll(), this.pollInterval);
  }

  async _broadcastNewMessage(rawMessage: DriveMessage): Promise<void> {


    //const cipherMessage: WhatsDappCipherMessage = new WhatsDappCipherMessage(rawMessage);
    //TODO: Here's something wrng with the session
    //TODO: why it's not a WhatsDappSession
    const session = await this._getOrCreateSession(rawMessage.ownerId, rawMessage.recipientId);
    await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition

    
    const plainMessage:WhatsDappMessage = JSON.parse(await this.signal.decryptMessage(this.storage, rawMessage.ownerId, rawMessage.payload));


    console.log("recipientId");
    console.log(plainMessage.recipientId);
    console.log("MSG");
    console.log(plainMessage.content);
    this.emit(WhatsDappEvent.NewMessage, plainMessage, session);
    await this.storage.addMessageToSession(session.identityString, plainMessage);
    // TODO: await this.storage.addMessageToSession(session.profile_name, cipherMessage);
    this._lastPollTime = Math.max(this._lastPollTime, plainMessage.updatedAt + 1);
  }


  async _deleteMessages(deleteTime: number, senderid: string): Promise<void> {
    console.log("Delete old Messages, Deltetime " + deleteTime + "SenderID: " + senderid);
    //dapi.deleteMessage(this._connection, deleteTime, senderid);
  }


  async _getOrCreateSession(ownerId: any, senderHandle: string): Promise<Interlocutor> {
    let session: Interlocutor = this._sessions[ownerId] as Interlocutor;
    if (session == null) {
      session = { identityString: ownerId };
      const preKeyBundle = (await this.dAPICommunicator.getProfile(ownerId)).signalKeyBundle;
      this._sessions[ownerId] = session;
      /* TODO: This is only necessary when a new session is established by searching a contact.
      If a session is established by a new incoming message, this is a waste of time, since the
      signal lib will tear it down and rebuild it, because buildAndPersistSession establishes an
      outgoing session. Incoming sessions are created by the signal lib and don't require explicit
      session establishment by us. */
      // TODO: Fix types. WhatsDappSignalPrekeyBundle and RawPreKeyBundle could be one type
      await this.signal.buildAndPersistSession(this.storage, session.identityString, preKeyBundle as unknown as WhatsDappSignalPrekeyBundle);
      this.emit(WhatsDappEvent.NewSession, session, preKeyBundle);
    }
    return session;
  }

  emit(ev: WhatsDappEvent.NewMessage, message: WhatsDappMessage, session: Interlocutor): boolean;
  emit(ev: WhatsDappEvent.NewSession, session: Interlocutor, bundle: WhatsDappSignalPrekeyBundle): boolean;
  emit(ev: WhatsDappEvent.NewMessageSent, wMessage: WhatsDappMessage, session: Interlocutor): boolean;
  emit(ev: WhatsDappEvent.StorageRead, storageKey: string, ret: (val: Uint8Array | null) => void): boolean;
  emit(ev: WhatsDappEvent.StorageWrite, storageKey: string, storageValue: Uint8Array): boolean;
  emit(ev: WhatsDappEvent.StorageDelete, storageKey: string): boolean;
  emit(ev: string, ...args: unknown[]): boolean {
    return super.emit(ev, ...Array.from(args));
  }

  on(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: Interlocutor) => void): this;
  on(ev: WhatsDappEvent.NewSession, listener: (session: Interlocutor, bundle: WhatsDappSignalPrekeyBundle) => void): this;
  on(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, session: Interlocutor) => void): this;
  on(ev: WhatsDappEvent.StorageRead, listener: (storageKey: string, ret: (val: Uint8Array | null) => void) => void): this;
  on(ev: WhatsDappEvent.StorageWrite, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: WhatsDappEvent.StorageDelete, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: string, listener: (...args: any[]) => void): this {
    return super.on(ev, listener);
  }

  removeListener(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: Interlocutor) => void): this;
  removeListener(ev: WhatsDappEvent.NewSession, listener: (session: Interlocutor, bundle: WhatsDappSignalPrekeyBundle) => void): this;
  removeListener(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, session: Interlocutor) => void): this;
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
  async sendMessage(receiver: string, plaintext: string): Promise<boolean> {
    //TODO: get wd-message as parameter

    console.log("start init sending");
    //TODO: set timeout
    //return false if init fails
    //await this.initialized;
    if(!this.initialized){
      return false;
    }
    console.log("end init sending");

    /*const batch = */
    //const ciphertextB64 = await this.signal.encryptMessage(this.storage, receiver, plaintext);
    const ciphertext: ArrayBuffer = await this.signal.encryptMessage(this.storage, receiver, plaintext);

    //const sentMessage: any = await this.dAPICommunicator.createMessage(receiver, ciphertextB64);
    const sentMessage: any = await this.dAPICommunicator.createMessage(receiver, ciphertext);


    //TODO: return a wd-message, that I can parse ;)

    console.log("sentmessage");
    console.log(sentMessage);

    const rIdentity = await this.platform!.identities.get(receiver);

    // const rMessage: DriveMessage = {
    //   ownerId: sentMessage.ownerId,
    //   createdAt: sentMessage.transitions[0].createdAt,
    //   updatedAt: sentMessage.transitions[0].updatedAt,
    //   recipientId: receiver,
    //   payload: plaintext,
    //   id: sentMessage.transitions[0].id
    // };

    // console.log(rMessage);
    // //TODO: Geht schöner
    // const wMessage: WhatsDappCipherMessage = new WhatsDappCipherMessage(rMessage);
    // const pMessage: WhatsDappPlainMessage = new WhatsDappPlainMessage(wMessage);
    // //await dapi.createMessage(this._connection, receiver, ciphertext);
    //const message = transitionToMessage(batch.transitions[0], this._connection.identity)

    // GUI listens to this, can then remove send-progressbar or w/e
    // storage also listens and will save the message.
    console.log({ profile_name: receiver, identity_receiver: rIdentity.getId() });

    //TODO: emit event!
    // this.emit(WhatsDappEvent.NewMessageSent, wMessage, { profile_name: receiver, identity_receiver: rIdentity.getId() });
    await this.storage.addMessageToSession(receiver, plaintext);
    console.log("sent");

    //if eveything went well
    return true;
  }

  async createKeys(): Promise<WhatsDappSignalKeyBundle> {
    const keys = await this.signal.generateSignalKeys();

    //TODO: sideeffects?
    await this.storage.setPrivateData(keys.private);
    return keys;
  }

  getSessions() {
    return this._sessions;
  }

  disconnect() {
    if (this.pollTimeout) clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
    console.log("WhatsDapp: Disconnect!");
  }


  async getProfileByName(name: string): Promise<Interlocutor | null> {
    // Resolve DPNS-Name to Identity
    const dpnsName: string = name + ".dash";
    const identity: DashIdentity | null = await this.dAPICommunicator.findIdentityByName(dpnsName);
    if (identity == null) {
      console.log("no identity found for " + name);
      return null;
    }
    //TODO: Es sollte nicht bei jedem suchen eine Session erzeugt werden
    const session = await this._getOrCreateSession(identity.getId(), identity.getId().toString()); // TODO: Was soll der Anzeigename sein
    return session;
  }
}
