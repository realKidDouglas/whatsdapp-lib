import { EventEmitter } from 'events';
import { DashClient, DashIdentity } from "./types/DashTypes";
import { SignalKeyPair, SignalPreKey, SignalSignedPreKey } from "libsignal";
import { KVStore, StructuredStorage } from "./storage/StructuredStorage";
import { getWhatsDappDashClient } from "./dapi/dash_client/WhatsDappDashClient";
import { ISignalLib, SignalWrapper, WhatsDappSignalKeyBundle, WhatsDappSignalPrekeyBundle } from "./signal/SignalWrapper";


import { Platform } from 'dash/dist/src/SDK/Client/Platform';
import { DAPICommunicator } from './dapi/DAPICommunicator';


/**
 * place lists of received messages per chat (foreign identity) in store
 * give with next message in chat and clear list
 * 
 * Sorting all messages by identity (chat)
 */


/**
 *  
 * TOOD:
 *  -  internal message-format
    -  all infos about a message internally
    -  EACH message needs an id per session (or global id)
    -  or just take session-id plus message-id as global identifier
 */
export type WhatsDappMessage = {
  //global or per session?
  //either sessionId or senderId and recevierId
  id: string,
  //plaintext message content
  content: string,

  createdAt: number,
  updatedAt: number,

  //Dash Identities-IDs
  senderId: string, //same as ownerId
  recipientId: string,

  referenceToMessageId?: string,

  //only for client?
  read?: boolean,
  //TODO: CANT THESE TWO BE ONE? ;)
  newMessage?: boolean,
}

export type WhatsDappInternalMessage = {
  //retrieved from DriveMessage
  //id: string,
  content: string,
  //retrieved from DriveMessage
  //timestamp: number,

  //retrieved from DriveMessage
  //senderId: string,
  //recipientId: string,

  listOfReadMessageIds?: string[],
  referenceToMessageId?: string,
  //maybe this is useful for messages that cannot be decrypted anymore?
  internal?: boolean
}

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
  createdAt: number, //Date,
  updatedAt: number, //Date,
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
  private pollInterval = 5000;
  //TODO: bring to capicommunicator
  _lastPollTime = 0;

  _profile: WhatsDappProfile | null = null;

  //contains all identityStrings of interlocutors
  private sessions: Array<string> = [];
  //private initialized: Promise<ConnectResult> | null = null;
  private initialized = false;


  static async createWhatsDapp(mnemonic: string, identityString: string | null, storeObj?: KVStore, signalLib?: ISignalLib) {
    console.log("create WhatsDapp client");
    //synchronous stuff here
    const whatsDapp = new this(storeObj, signalLib);
    //asnychronous stuff here
    await whatsDapp.init(mnemonic, identityString);
    return whatsDapp;
  }

  private constructor(storeObj?: KVStore, signalLib?: ISignalLib) {
    super();

    //TODO: similar for storage: choose default if no one was given
    if (!(storeObj === undefined)) {
      console.log("store object was given");//,storeObj);
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
    if (!(signalLib == undefined)) {
      this.signal = signalLib;
    } else {
      this.signal = new SignalWrapper();
    }
  }


  async init(mnemonic: string, identityString: string | null) {
    console.log("creating client with mnemonic: ", mnemonic, " and identity: ", identityString);
    this.client = getWhatsDappDashClient(mnemonic);
    //TODO if !client
    if (!this.client) {
      throw new Error("Client undefined");
    }
    //console.log("client: ", this.client);

    //const {platform}= this.client;
    this.platform = this.client.platform;
    //this.platform = platform;

    //TODO troubleshooting?
    if (!this.platform) {
      throw new Error("Platform undefined");
    }

    //if no identity was given, register a new one
    if (identityString == null) {
      const newIdentity = await this.createNewIdentity();
      const identityString = newIdentity.getId().toJSON();
      console.log(identityString);

      //TODO: return newIdentrity somehow to user of lib
      //getCurIdentity() or something

      //TODO: Topup identity
    }

    console.log("retrieving identity (", identityString, ")");
    const retrievedIdentity = await this.platform.identities.get(identityString);
    console.log("-done");
    //console.log("retrieved identity:", retrievedIdentity);
    this.identity = retrievedIdentity;
    //this.identity = await this.client.platform!.identities.get(identityString);

    //TODO if !identity
    if (!this.identity) {
      throw new Error("Identity undefined");
    }
    //console.log("identity: ", this.identity);


    this.dAPICommunicator = new DAPICommunicator(this.platform, this.identity);

    //first step is done

    //TODO: flag for init is done (boolean or something)

    //TODO: clean dapi
    console.log("retrieving profile");
    let profile: WhatsDappProfile|null = await this.dAPICommunicator.getProfile(this.identity.getId().toJSON());
    console.log("-done");
    //console.log("profile: ", profile);
    //console.dir(profile);

    if (profile == null) {
      //TODO: maybe something else went wrong?
      console.log("No profile for identity was found. Do you have one?");
      profile = await this.createNewRawProfile();
    }
    this._profile = profile;

    this.initialized = true;
    console.log("-done initialization");
  }

  async createDpnsName(desiredDpnsNameWithoutPostfix: string): Promise<boolean> {
    const desiredDpnsNameWithPostfix: string = desiredDpnsNameWithoutPostfix + '.dash';
    return await this.dAPICommunicator.createDpnsName(desiredDpnsNameWithPostfix);
  }

  async getProfile() {
    const profile: WhatsDappProfile|null = await this.dAPICommunicator.getProfile(this.identity!.getId().toJSON());
    return profile;
  }
  async createNewRawProfile(/*profile: WhatsDappProfile*/): Promise<WhatsDappProfile> {
    //let profile = await this.dAPICommunicator.getProfile(this.identity!.getId().toJSON());

    //TODO ;)

    // if (profile == null) {
    console.log("creating new profile (will take a while");

    const keysBundle: WhatsDappSignalKeyBundle = await this.createKeys();
    const preKeyBundle: WhatsDappSignalPrekeyBundle = keysBundle.preKeyBundle;

    const profileDoc: WhatsDappProfile = {
      signalKeyBundle: preKeyBundle,
    };

    // const content = profile.data.preKeyBundle;
    //const content: RawPreKeyBundle = (await this.createKeys()).preKeyBundle;

    //content.displayname = profile.data.displayname;

    //content.prekeys = [];
    //console.log(content);

    await this.dAPICommunicator.createProfile(profileDoc);

    const profile = await this.dAPICommunicator.getProfile(this.identity!.getId().toJSON());

    return profile!;
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
    //TODO: give parameter since when messages should be retrieved
    //eg. since 0, since registration, since last_visit or smthg

    //TODO: check if everything is initialized
    //kind of:
    //if(!messenger_initialized)console.log("try again later"); return false
    //else do stuff and return true or pollIntervall

    if (!this.initialized) {
      console.log("messenger is not initilalized yet");
      return false;
    }
    console.log("start polling for new messages");

    if (pollIntervalMilliseconds !== undefined) {
      this.pollInterval = pollIntervalMilliseconds;
    }

    //start polling immediately
    this.pollTimeout = setTimeout(() => this._poll(), 0);

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

    const messagePromises = messages.map((m: DriveMessage) => {
      this._incomingNewMessage(m)
        .catch(e => console.log('retrieving message failed!', e));
    });
    console.log('got', messagePromises.length, 'new messages.');
    if (messages.length > 0) {
      const polledMessage = messages[messages.length - 1];
      if (polledMessage !== undefined)
        this._lastPollTime = polledMessage.createdAt;//.getTime();
    }

    await Promise.all(messagePromises);

    this.pollTimeout = setTimeout(() => this._poll(), this.pollInterval);
  }

  async _incomingNewMessage(driveMessage: DriveMessage): Promise<void> {

    let interlocutor:string = driveMessage.ownerId;
    //interlocutor=interlocutor.substr(3)+"KD";
    interlocutor = await this._getOrCreateSession(interlocutor);//driveMessage.ownerId;//
    await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition

    console.log("-decrypt message");
    // console.log("driveMsg: ", driveMessage);
    const plainJson:string=await this.signal.decryptMessage(this.storage, interlocutor, driveMessage.payload);
    console.log("decrypted: ",plainJson);
    const plainInternalMessage: WhatsDappInternalMessage = JSON.parse(plainJson);
    console.log("-done decrypt message");


    //TODO: react on listOfReadMessages, internal, etc.

    const plainMessage:WhatsDappMessage={
      content: plainInternalMessage.content,
      referenceToMessageId: plainInternalMessage.referenceToMessageId,
      id: driveMessage.id,
      createdAt: driveMessage.createdAt,
      updatedAt: driveMessage.updatedAt,
      senderId: driveMessage.ownerId,
      recipientId: driveMessage.recipientId //me ;)
    }

    console.log("recipientId");
    console.log(plainMessage.recipientId);
    console.log("MSG");
    console.log(plainMessage.content);
    this.emit(WhatsDappEvent.NewMessage, plainMessage, interlocutor);
    await this.storage.addMessageToSession(interlocutor, plainMessage);
    // TODO: await this.storage.addMessageToSession(session.profile_name, cipherMessage);
    this._lastPollTime = Math.max(this._lastPollTime, plainMessage.updatedAt + 1);
  }


  async _deleteMessages(deleteTime: number, senderid: string): Promise<void> {
    console.log("Delete old Messages, Deltetime " + deleteTime + "SenderID: " + senderid);
    //dapi.deleteMessage(this._connection, deleteTime, senderid);
  }


  async _getOrCreateSession(interlocutor: string/*, senderHandle: string*/): Promise<string> {
    //let session: Interlocutor = this.sessions[interlocutor] as Interlocutor;
    //if (session == null || session == undefined) {
    if (!this.sessions.includes(interlocutor)) {
      console.log("create session");
      // session = { identityString: interlocutor };

      //TODO: undefined signalKeyBundle?

      const profile=await this.dAPICommunicator.getProfile(interlocutor);
      //TODO !
      const preKeyBundle: WhatsDappSignalPrekeyBundle = profile!.signalKeyBundle;
      //this.sessions[interlocutor] = session;
      this.sessions.push(interlocutor);
      console.log("sessions: ",this.sessions);

      /* TODO: This is only necessary when a new session is established by searching a contact.
      If a session is established by a new incoming message, this is a waste of time, since the
      signal lib will tear it down and rebuild it, because buildAndPersistSession establishes an
      outgoing session. Incoming sessions are created by the signal lib and don't require explicit
      session establishment by us. */
      // TODO: Fix types. WhatsDappSignalPrekeyBundle and RawPreKeyBundle could be one type
      //await this.signal.buildAndPersistSession(this.storage, session.identityString, preKeyBundle);
      await this.signal.buildAndPersistSession(this.storage, interlocutor, preKeyBundle);
      this.emit(WhatsDappEvent.NewSession, interlocutor, preKeyBundle);
    }
    return interlocutor;
  }

  emit(ev: WhatsDappEvent.NewMessage, message: WhatsDappMessage, interlocutor: string): boolean;
  emit(ev: WhatsDappEvent.NewSession, interlocutor: string, bundle: WhatsDappSignalPrekeyBundle): boolean;
  emit(ev: WhatsDappEvent.NewMessageSent, wMessage: WhatsDappMessage, interlocutor: string): boolean;
  emit(ev: WhatsDappEvent.StorageRead, storageKey: string, ret: (val: Uint8Array | null) => void): boolean;
  emit(ev: WhatsDappEvent.StorageWrite, storageKey: string, storageValue: Uint8Array): boolean;
  emit(ev: WhatsDappEvent.StorageDelete, storageKey: string): boolean;
  emit(ev: string, ...args: unknown[]): boolean {
    return super.emit(ev, ...Array.from(args));
  }

  on(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, interlocutor: string) => void): this;
  on(ev: WhatsDappEvent.NewSession, listener: (interlocutor: string, bundle: WhatsDappSignalPrekeyBundle) => void): this;
  on(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, interlocutor: string) => void): this;
  on(ev: WhatsDappEvent.StorageRead, listener: (storageKey: string, ret: (val: Uint8Array | null) => void) => void): this;
  on(ev: WhatsDappEvent.StorageWrite, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: WhatsDappEvent.StorageDelete, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: string, listener: (...args: any[]) => void): this {
    return super.on(ev, listener);
  }

  removeListener(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, interlocutor: string) => void): this;
  removeListener(ev: WhatsDappEvent.NewSession, listener: (interlocutor: string, bundle: WhatsDappSignalPrekeyBundle) => void): this;
  removeListener(ev: WhatsDappEvent.NewMessageSent, listener: (wMessage: WhatsDappMessage, interlocutor: string) => void): this;
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
    //TODO: if you can't find anything build new session
    /*const session:Interlocutor=*/await this._getOrCreateSession(receiver);

    //TODO: set timeout
    //return false if init fails
    //await this.initialized;
    if (!this.initialized) {
      return false;
    }
    console.log("end init sending");


    const whatsDappInternalMessage:WhatsDappInternalMessage={
      content: plaintext,
      listOfReadMessageIds:[]
    };

    /*const batch = */
    //const ciphertextB64 = await this.signal.encryptMessage(this.storage, receiver, plaintext);

    //TODO: retuzrn types, it has registrationId etc. but for now we only need body
    //TODO: but sure it has a body (always ;)
    const encryptedMsg: any = await this.signal.encryptMessage(this.storage, receiver, JSON.stringify(whatsDappInternalMessage));
    const ciphertext: ArrayBuffer = Buffer.from(encryptedMsg.body);

    //const sentMessage: any = await this.dAPICommunicator.createMessage(receiver, ciphertextB64);
    //const sentMessage: DriveMessage = await this.dAPICommunicator.createMessage(receiver, ciphertext);
    const sentMessage = await this.dAPICommunicator.createMessage(receiver, ciphertext);

    if(!sentMessage)return false;

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

    const msg: WhatsDappMessage = {
      id: sentMessage.id,
      content: plaintext,
      createdAt: sentMessage.createdAt,
      updatedAt: sentMessage.updatedAt,
      senderId: sentMessage.ownerId,
      recipientId: sentMessage.recipientId,
      newMessage: false, //since it was sent ;)
      read: true, //since it was sent ;)
      //referenceToMessageId: 
    };
    

    //await this.storage.addMessageToSession(receiver, plaintext);
    await this.storage.addMessageToSession(receiver, msg);
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

  // getSessions() {
  //   return this._sessions;
  // }

  disconnect() {
    if (this.pollTimeout) clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
    console.log("WhatsDapp: Disconnect!");
  }


  async getIdentityStringByDPNS(name: string): Promise<string | null> {
//TODO: is this tested for null? (check caller functions)

    // Resolve DPNS-Name to Identity
    const dpnsName: string = name + ".dash";
    const identity: DashIdentity | null = await this.dAPICommunicator.findIdentityByName(dpnsName);
    if (identity == null) {
      console.log("no identity found for " + name);
      return null;
    }
    const identityString:string=identity.getId().toJSON();
    //TODO: Es sollte nicht bei jedem suchen eine Session erzeugt werden
    //const interlocutor = 
    await this._getOrCreateSession(identityString);
    return identityString;
  }
}
