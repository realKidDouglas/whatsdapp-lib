import { EventEmitter } from 'events';
import { DashClient, DashIdentity } from "./types/DashTypes";
import { KVStore, StructuredStorage } from "./storage/StructuredStorage";
import { getWhatsDappDashClient } from "./dapi/dash_client/WhatsDappDashClient";
import { ISignalLib, SignalWrapper, WhatsDappSignalKeyBundle, WhatsDappSignalPrekeyBundle } from "./signal/SignalWrapper";

import { DAPICommunicator } from './dapi/DAPICommunicator';
import { Platform } from 'dash/dist/src/SDK/Client/Platform';
import { retryFunctionXTimes } from './dapi/utils';


/**
 * place lists of received messages per chat (foreign identity) in store
 * give with next message in chat and clear list
 * 
 * Sorting all messages by identity (chat)
 */


/**
 * The message format a client can create and retrive by this library. 
 */
export type WhatsDappMessage = {
  //global 32B ID derived from document on drive
  id: string,
  //plaintext message content
  content: string,
  //timestamps
  createdAt: number,
  updatedAt: number,
  //Dash identity-IDs
  senderId: string, //same as ownerId
  recipientId: string,
  referenceToMessageId?: string,
  //marks new messages as unread
  read?: boolean,
}

/**
 * This is the actual payload of the document on drive.
 * Keep this as small as possible to safe bytes on drive.
 * So other info (as id, senderId, recipientId, etc.) can be derived from DriveMessage.
 */
type WhatsDappInternalMessage = {
  content: string,
  //TODO: whatsDapp protocol version ;)
  //idea: you could use contract-ids...
  kindOfInternalVersion?: number;

  listOfReadMessageIds?: string[],
  referenceToMessageId?: string,
  //maybe this is useful for messages that cannot be decrypted anymore? use internal messages to reorder "lost" messages...
  internal?: boolean,
}

/**
 * Stores document info temporarily containing all info drive needs.
 */
export type DriveMessage = {
  id: string,
  ownerId: string, //aka: senderId
  recipientId: string,
  createdAt: number,
  updatedAt: number,
  //encrypted WhatsDappInternalMessage
  payload: ArrayBuffer,
};

export enum WhatsDappEvent {
  NewMessage = 'new-message',
  NewSession = 'new-session',
  NewMessageSent = 'new-message-sent',
  StorageRead = 'storage-read',
  StorageWrite = 'storage-write',
  StorageDelete = 'storage-delete'
}


/**
 * Content of a profile document on drive
 */
export type WhatsDappProfile = {
  signalKeyBundle: WhatsDappSignalPrekeyBundle,
  nickname?: string,
}

/**
 * Userdata to store
 */
export type WhatsDappUserData = {
  mnemonic: string,
  identityString: string,
  dpnsName: string,
  profile: WhatsDappProfile
}

type TimerHandle = ReturnType<typeof setTimeout>;

export class WhatsDapp extends EventEmitter {

  private identityString!: string;
  private profile: WhatsDappProfile | null = null;

  private client: DashClient | undefined;
  private dAPICommunicator!: DAPICommunicator;

  private storage: StructuredStorage;
  private signal: ISignalLib;

  private pollTimeout: TimerHandle | null = null;
  private pollInterval = 5000;
  private lastPollTime = 0;
  //TODO: Better with an ID per message and still the same timestamp :/
  private pollTimeOffsetDueToMongoDbInprecision=1000;

  //contains all identityStrings of interlocutors
  private sessions: Set<string>=new Set();

  private initialized = false;

  //factory function
  static async createWhatsDapp(mnemonic: string, identityString: string | null, storeObj: KVStore, signalLib?: ISignalLib): Promise<WhatsDapp> {
    console.log("create WhatsDapp client (the first time)");
    //synchronous stuff here
    const whatsDapp = new this(storeObj, signalLib);
    //asnychronous stuff here
    await whatsDapp.init(mnemonic, identityString);
    return whatsDapp;
  }
  static async createWhatsDappSecondTime(storeObj: KVStore, signalLib?: ISignalLib): Promise<WhatsDapp> {
    console.log("create WhatsDapp client (not the first time)");
    //synchronous stuff here
    const whatsDapp = new this(storeObj, signalLib);

    const storage = whatsDapp.storage;

    console.log("retrieving storage data");
    //get userdata
    if (!await storage.hasUserData()) throw new Error("No userdata available in this store");
    const userData: WhatsDappUserData | null = await storage.getUserData();
    if (!userData) throw new Error("No userdata available in this store");

    const mnemonic: string = userData.mnemonic;
    const identityString: string = userData.identityString;
    const profile: WhatsDappProfile = userData.profile;
    if (!mnemonic || !identityString || !profile) throw new Error("Incomplete userdata in storage");
    //TODO dpns?
    //const dpnsName: string = userData.dpnsName;

    //PrivateData is done by SignalProtocolStore ;)

    //get last poll timestamp
    let lastPollTime = await storage.getLastTimestamp();
    if (isNaN(lastPollTime)) lastPollTime = 0;
    whatsDapp.lastPollTime = lastPollTime + whatsDapp.pollTimeOffsetDueToMongoDbInprecision;

    //TODO: Define somewhere what these "sessions" are and what they are used for
    const sessions = await storage.getSessions();
    whatsDapp.sessions = new Set(sessions);

    //asnychronous stuff here
    await whatsDapp.init(mnemonic, identityString);

    return whatsDapp;
  }

  private constructor(storeObj: KVStore, signalLib?: ISignalLib) {
    super();

    //TODO: check for node or browser and choose libs accordingly

    if (storeObj !== undefined) {
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
    if (signalLib !== undefined) {
      this.signal = signalLib;
    } else {
      this.signal = new SignalWrapper();
    }
  }

  /**
   * 
   * @param mnemonic 
   * @param identityString 
   * @throws {Error}
   */
  async init(mnemonic: string, identityString: string | null): Promise<void> {
    console.log("Creating client with mnemonic: ", mnemonic, " and identity: ", identityString);
    this.client = getWhatsDappDashClient(mnemonic);
    if (!this.client) throw new Error("Client undefined");
    const platform: Platform | undefined = this.client.platform;
    if (!platform) throw new Error("Platform undefined");


    //if no identity was given, register a new one
    if (!identityString) {
      console.log("No idetity string was given. Creating new identity...");
      identityString = await this.createNewIdentity(); //throws Error
      console.log("-created identity:", identityString);
      console.log("-tops up identity");
      await this.topUpIdentity(identityString, 1000); //throws Error
    }
    console.log("Retrieving identity (", identityString, ")");
    const retrievedIdentity = await platform.identities.get(identityString); //throws Error
    const identity: DashIdentity | undefined = retrievedIdentity;
    //this.identity = await this.client.platform!.identities.get(identityString);
    if (!identity) throw new Error("Identity undefined. Cannot retrieve or create one.");
    this.identityString = identity.getId().toJSON();

    this.dAPICommunicator = new DAPICommunicator(platform, identity);

    console.log("Retrieving profile");
    let profile: WhatsDappProfile | null = await this.dAPICommunicator.getProfile(this.identityString); //throws error
    if (profile == null) {
      //other error should be thrown, so at this point a profile==null means "no profile on drive"
      console.log("-no profile for identity was found.");
      //TODO: be sure, that it's not an error of DAPI! If there are connection errors our (old) profile will be overwritten by createKeys ;)
      profile = await this.createAndUploadNewProfile(); //throws error
    }
    if (!profile) throw new Error("Profile undefined. Cannot retrieve or create one.");
    this.profile = profile;


    //save data
    const userdata: WhatsDappUserData = {
      mnemonic: mnemonic,
      identityString: identityString,
      dpnsName: '',
      profile: profile
    };
    await this.storage.setUserData(userdata);

    //We got everything we need to start ;)
    this.initialized = true;
    console.log("-done initialization");
  }

  //TODO
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
  stopPolling(): void {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    }
    this.pollTimeout = null;
    console.log("Stopped polling.");
  }

  setPollIntervall(pollIntervalMilliseconds: number): void {
    this.pollInterval = pollIntervalMilliseconds;
    if (this.pollTimeout) {
      //if poll is not currently running, reset timeout, otherwise it will take pollInterval from above
      clearTimeout(this.pollTimeout);
      this.pollTimeout = setTimeout(() => this._poll(), this.pollInterval);
    }
  }


  //**********************
  // MESSAGES
  //**********************

  /** _poll is async, if we used an interval we might start a new poll before
   * the last one was done. that's why _poll sets up the next poll after it's done.
   */
  //TODO
  async _poll(): Promise<void> {
    console.log("poll new messages since", this.lastPollTime);
    this.pollTimeout = null;
    const pollTime = this.lastPollTime;

    let messages: Array<DriveMessage>;
    try {
      messages = await this.dAPICommunicator.getMessagesByTime(pollTime);
    } catch (e) {
      console.error('Error retrieving message documents:', e);
      //console.dir(e, {depth:15});
      return;
    }

    const messagePromises = messages.map((m: DriveMessage) => {
      this._incomingNewMessage(m)
        //TODO catch
        .catch(e => console.log('retrieving message failed!', e));
    });
    console.log('got', messagePromises.length, 'new messages.');

    // if (messages.length > 0) {
    //   const polledMessage = messages[messages.length - 1];
    //   if (polledMessage !== undefined)
    //     this.lastPollTime = polledMessage.createdAt + 10;//.getTime();
    //   console.error("TIEM POLL", this.lastPollTime);
    // }

    await Promise.all(messagePromises);

    this.pollTimeout = setTimeout(() => this._poll(), this.pollInterval);
  }

  //TODO
  async _incomingNewMessage(driveMessage: DriveMessage): Promise<void> {
    console.log("lastPollTime:",this.lastPollTime,"driveMessage.updatedAt:",driveMessage.updatedAt);

    let interlocutor: string = driveMessage.ownerId;
    //interlocutor=interlocutor.substr(3)+"KD";
    interlocutor = await this._getOrCreateSession(interlocutor);//driveMessage.ownerId;//
    await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition

    console.log("-decrypt message");
    // console.log("driveMsg: ", driveMessage);

    //TODO: catch MessageCounterError('Key used already or never filled'); //session_cipher.js l.234
    let plainInternalMessage: WhatsDappInternalMessage;
    try {
      const plainJson: string = await this.signal.decryptMessage(this.storage, interlocutor, driveMessage.payload);
      console.log("decrypted: ", plainJson);
      plainInternalMessage = JSON.parse(plainJson);
      console.log("-done decrypt message");
    } catch (e) {
      //TODO
      console.log(e);
      throw e;
    }


    //TODO: react on listOfReadMessages, internal, etc.

    const plainMessage: WhatsDappMessage = {
      content: plainInternalMessage.content,
      id: driveMessage.id,
      createdAt: driveMessage.createdAt,
      updatedAt: driveMessage.updatedAt,
      senderId: driveMessage.ownerId,
      recipientId: driveMessage.recipientId, //me ;)
      read: false //since it is new
    };
    if (plainInternalMessage.referenceToMessageId) plainMessage.referenceToMessageId = plainInternalMessage.referenceToMessageId;


    console.log("recipientId");
    console.log(plainMessage.recipientId);
    console.log("MSG");
    console.log(plainMessage.content);
    this.emit(WhatsDappEvent.NewMessage, plainMessage, interlocutor);
    await this.storage.addMessageToSession(interlocutor, plainMessage);

    this.lastPollTime = Math.max(this.lastPollTime, plainMessage.updatedAt + this.pollTimeOffsetDueToMongoDbInprecision);
    console.error("TIEM INCOMING", this.lastPollTime);

  }

  /**
 * TODO: instead of indefinitely awaiting init, set
 * TODO: timeout and reject after some amount
 * TODO: of time and mark message for retry in GUI
 * @param recipientId {string} B58?
 * @param ciphertext {string}
 * @param plaintext {string}
 * @returns {Promise<boolean>}
 */
  async sendMessage(recipientId: string, plaintext: string, referenceToMessageId?: string): Promise<boolean> {
    //TODO: get wd-message as parameter

    if (recipientId == this.identityString) {
      //TODO: You cannot write to yourself
      //Error("Tried to lookup a session using our basekey"); session_record.js l.242
      console.log("You cannot write yourself");
      return false;
    }

    if (!this.initialized) {
      console.log("WhatsDapp is not initialized yet");
      return false;
    }

    console.log("Send message...");
    console.log("-lookup session");
    //TODO: if you can't find anything build new session
    /*const session:Interlocutor=*/
    await this._getOrCreateSession(recipientId);

    const whatsDappInternalMessage: WhatsDappInternalMessage = {
      content: plaintext,
      listOfReadMessageIds: [],
    };
    if (referenceToMessageId) whatsDappInternalMessage.referenceToMessageId = referenceToMessageId;

    //TODO: done: return type is not really an ArrayBuffer. It is a JSON containing ArrayBuffer in property body
    const ciphertext: ArrayBuffer = await this.signal.encryptMessage(this.storage, recipientId, JSON.stringify(whatsDappInternalMessage));

    // let ciphertext: ArrayBuffer;
    // if (encryptedMsg.body) ciphertext = Buffer.from(encryptedMsg.body);
    // else if (encryptedMsg instanceof ArrayBuffer) ciphertext = encryptedMsg;
    // else {
    //   console.error("Could not handle type of ciphertext given by signal");
    //   return false;
    // }

    let sentMessage: DriveMessage | null;
    try {
      sentMessage = await this.dAPICommunicator.createAndBroadcastMessage(recipientId, ciphertext);
      if (!sentMessage) {
        throw new Error("Message is null");
      }
    } catch (e) {
      console.log("Sending failed: ", e);
      return false;
    }

    console.log("-sent message");

    const msg: WhatsDappMessage = {
      id: sentMessage.id,
      content: plaintext,
      createdAt: sentMessage.createdAt,
      updatedAt: sentMessage.updatedAt,
      senderId: sentMessage.ownerId,
      recipientId: sentMessage.recipientId,
      read: true, //since it was sent ;)
    };
    if (referenceToMessageId) msg.referenceToMessageId = referenceToMessageId;

    this.emit(WhatsDappEvent.NewMessageSent, msg, recipientId);

    await this.storage.addMessageToSession(recipientId, msg);

    //if eveything went well
    return true;
  }

  //TODO
  // async _deleteMessages(deleteTime: number, senderid: string): Promise<void> {
  //   console.log("Delete old Messages, Deltetime " + deleteTime + "SenderID: " + senderid);
  //   //dapi.deleteMessage(this._connection, deleteTime, senderid);
  // }

  //TODO: now I need ond for updating the profile and we can reset an identity for use of whatsDapp
  //case of "burned identites"
  async deleteAllSentMessages(): Promise<void> {
    console.log("Delete all messages on drive of identity:", this.identityString);
    try {
      const deleted: boolean = await this.dAPICommunicator.deleteAllSentMessages();
      if (!deleted) {
        throw new Error("Error deleting messages.");
      }
    } catch (e) {
      console.error("Error deleting messages:", e);
    }
    //TODO: delete messages locally, too
  }


  //**********************
  // IDENTITY
  //**********************


  /**
   * Registers a new identity and returns its string
   * @returns 
   * @throws {Error}
   */
  async createNewIdentity(): Promise<string> {
    let newIdentity: DashIdentity | null;
    try {
      //TODO: can we make thisstep with the dapicommunicator? If not we dont need that funtions there
      const platform = this.client!.platform;
      const fn = async function (): Promise<DashIdentity | null> {
        //retry 3 times
        return retryFunctionXTimes(() => {
          return platform.identities.register();
        }, 3)();
      };
      //retry 3 times
      newIdentity = await fn();
      // newIdentity=await this.client!.platform.identities.register();
      //newIdentity = await this.dAPICommunicator.createNewIdentity();

      if (newIdentity == null) {
        throw new Error("new identity is null");
      }
    } catch (e) {
      console.error("Error creating new identity:", e);
      throw e;
    }
    const identityString = newIdentity.getId().toJSON();
    return identityString;
  }

  async topUpIdentity(identityString: string, topUpAmountInDuffs = 1000): Promise<boolean> {
    try {
      //TODO: keep this in DAPICommunicator... Maybe static?
      const platform = this.client!.platform;
      const fn = async function (): Promise<boolean> {
        //retry 5 times
        return retryFunctionXTimes(() => {
          return platform.identities.topUp(identityString, topUpAmountInDuffs); //returns true or false
        }, 5)();
      };
      const toppedUp = await fn();

      //const toppedUp = this.dAPICommunicator.topUpIdentity(identityString, topUpAmountInDuffs);
      if (!toppedUp) throw new Error("Identity could not topped up");
      return toppedUp;
    } catch (e) {
      console.error("Error topping up identity");
      throw e;
    }
  }

  //TODO
  async createDpnsName(desiredDpnsNameWithoutPostfix: string): Promise<boolean> {
    const desiredDpnsNameWithPostfix: string = desiredDpnsNameWithoutPostfix + '.dash';
    return await this.dAPICommunicator.createDpnsName(desiredDpnsNameWithPostfix);
  }

  //TODO
  async getIdentityStringByDPNS(name: string): Promise<string | null> {
    //TODO: is this tested for null? (check caller functions)

    // Resolve DPNS-Name to Identity
    const dpnsName: string = name + ".dash";
    const identity: DashIdentity | null = await this.dAPICommunicator.findIdentityByDPNS(dpnsName);
    if (identity == null) {
      console.log("no identity found for " + name);
      return null;
    }
    const identityString: string = identity.getId().toJSON();
    //TODO: Es sollte nicht bei jedem suchen eine Session erzeugt werden
    //const interlocutor = 
    await this._getOrCreateSession(identityString);
    return identityString;
  }


  //**********************
  // PROFILE
  //**********************

  /**
   * @throws {Error}
   */
  async getProfileFromDrive(): Promise<WhatsDappProfile | null> {
    const profile: WhatsDappProfile | null = await this.dAPICommunicator.getProfile(this.identityString);
    return profile;
  }
  /**
   * @throws {Error}
   */
  async updateProfile(updatedProfile: WhatsDappProfile): Promise<void> {
    //TODO: Not sure if this should be done this way
    //Maybe update keys always?
    await this.dAPICommunicator.updateProfile(updatedProfile);
    const profile: WhatsDappProfile | null = await this.getProfileFromDrive();
    if (!profile) throw new Error("Error retrieving new profile.");
    //update member
    this.profile = profile;
  }

  /**
   * @throws {Error}
   */
  async deleteProfileFromDrive(): Promise<void> {
    console.log("Delete profile on drive of identity:", this.identityString);
    try {
      const deleted: boolean = await this.dAPICommunicator.deleteProfile();
      if (!deleted) {
        throw new Error("Error deleting profile.");
      }
    } catch (e) {
      console.error("Error deleting profile:", e);
    }
    //TODO: delete profile locally, too

  }

  async createAndUploadNewProfile(): Promise<WhatsDappProfile> {
    console.log("Create new profile (will take a while)");

    console.log("-creating keybundle");
    const keysBundle: WhatsDappSignalKeyBundle = await this.createKeys();
    const preKeyBundle: WhatsDappSignalPrekeyBundle = keysBundle.preKeyBundle;

    const profileDoc: WhatsDappProfile = {
      signalKeyBundle: preKeyBundle,
    };

    console.log("-create profile");
    try {
      await this.dAPICommunicator.createProfile(profileDoc);
    } catch (e) {
      console.error("Uploading profile failed");
      throw e;
    }

    console.log("-retrieve new profile");
    const profile: WhatsDappProfile | null = await this.getProfileFromDrive();
    if (!profile) throw new Error("Error retrieving new profile.");

    console.log("-created profile");
    return profile;
  }


  //**********************
  // SIGNAL
  //**********************

  async addToSessions(interlocutor: string): Promise<void> {
    //this.sessions.push(interlocutor);
    this.sessions.add(interlocutor);
    //TODO:
    //this.storage.addSession();
  }
  async isNewSession(interlocutor: string): Promise<boolean>{
    // return this.sessions.includes(interlocutor);
    return !this.sessions.has(interlocutor);
  } 

  async _getOrCreateSession(interlocutor: string/*, senderHandle: string*/): Promise<string> {
    //let session: Interlocutor = this.sessions[interlocutor] as Interlocutor;
    //if (session == null || session == undefined) {
    if (await this.isNewSession(interlocutor)) {
      console.log("create session");
      // session = { identityString: interlocutor };

      //TODO: undefined signalKeyBundle?

      const profile = await this.dAPICommunicator.getProfile(interlocutor);
      //TODO !
      if (!profile) {
        //TODO
      }
      const preKeyBundle: WhatsDappSignalPrekeyBundle = profile!.signalKeyBundle;
      //this.sessions[interlocutor] = session;


      console.log("sessions: ", this.sessions);

      /* TODO: This is only necessary when a new session is established by searching a contact.
      If a session is established by a new incoming message, this is a waste of time, since the
      signal lib will tear it down and rebuild it, because buildAndPersistSession establishes an
      outgoing session. Incoming sessions are created by the signal lib and don't require explicit
      session establishment by us. */
      //await this.signal.buildAndPersistSession(this.storage, session.identityString, preKeyBundle);
      await this.signal.buildAndPersistSession(this.storage, interlocutor, preKeyBundle);
      await this.addToSessions(interlocutor);
      this.emit(WhatsDappEvent.NewSession, interlocutor, preKeyBundle);
    }
    return interlocutor;
  }

  private async createKeys(): Promise<WhatsDappSignalKeyBundle> {
    const keys = await this.signal.generateSignalKeys();

    //TODO: sideeffects? We cannto use this currently to update profile, since it will reset existing private data...
    await this.storage.setPrivateData(keys.private);
    return keys;
  }


  //**********************
  // GETTER
  //**********************

  getCurrentProfile(): WhatsDappProfile | null {
    return this.profile;
  }
  getCurrentIdentityString(): string {
    return this.identityString;
  }


  //**********************
  // EVENTS
  //**********************

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
}
