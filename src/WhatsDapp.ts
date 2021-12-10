import { EventEmitter } from 'events';
import { DashClient, DashIdentity } from "./types/DashTypes";
import { KVStore, StructuredStorage } from "./storage/StructuredStorage";
import { getWhatsDappDashClient } from "./dapi/dash_client/WhatsDappDashClient";
import { ISignalLib, SignalWrapper, WhatsDappSignalKeyBundle, WhatsDappSignalPrekeyBundle } from "./signal/SignalWrapper";

import { DAPICommunicator } from './dapi/DAPICommunicator';
import { Platform } from 'dash/dist/src/SDK/Client/Platform';
import { retryFunctionXTimes } from './dapi/utils';
import { EncryptedStorageWrapper } from './storage/EncryptedStorageWrapper';


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
  NewIncomingMessage = 'new-incoming-message',
  // NewSession = 'new-session',
  MessageSent = 'message-sent',
  // StorageRead = 'storage-read',
  // StorageWrite = 'storage-write',
  // StorageDelete = 'storage-delete'
}


/**
 * Content of a profile document on drive
 */
export type WhatsDappProfile = {
  signalKeyBundle: WhatsDappSignalPrekeyBundle,
  //TODO: max 50 chars! (contract)
  nickname?: string,
}

/**
 * Userdata to store
 */
export type WhatsDappUserData = {
  mnemonic: string,
  identityString: string | null,
  dpnsName: string | null,
  profile: WhatsDappProfile | null
}


type TimerHandle = ReturnType<typeof setTimeout>;

export class WhatsDapp extends EventEmitter {

  private identityString!: string;
  private profile: WhatsDappProfile | null = null;

  private client: DashClient | undefined;
  private dAPICommunicator!: DAPICommunicator;

  private storage!: StructuredStorage;
  private signal: ISignalLib;

  private pollTimeout: TimerHandle | null = null;
  private pollInterval = 5000;
  private newestRemoteTimestamp = 0;
  //TODO: Better with an ID per message and still the same timestamp :/
  private POLLTIME_OFFSET_DUE_TO_MONGODB_INPRECISION = 1000;

  //contains all identityStrings of interlocutors
  private sessions: Set<string> = new Set();

  private initialized = false;

  static async prepareEmptyStorage(mnemonic: string, identityString: string | null, storageObj: KVStore, storagePassword?: string): Promise<void> {
    //TODO DPNS _OR_ IDENTITY
    console.log("Prepare storage for first use with mnemonic.");
    const whatsDapp: WhatsDapp=new this();
    await whatsDapp.initStorage(storageObj,storagePassword);
    const storage:StructuredStorage = whatsDapp.storage;

    if (await storage.hasUserData()) throw new Error(`Userdata already available in this store. Use it by calling ${this.createWhatsDapp.name}(), delete it or give another store.`);

    console.log("-save mnemonic");
    const userData: WhatsDappUserData = {
      mnemonic: mnemonic,
      identityString: identityString,
      dpnsName: null,
      profile: null
    };
    await storage.setUserData(userData);

    console.log("-done");
  }
  private async initStorage(storageObj: KVStore, storagePassword?: string):Promise<void>{
    if (!storageObj) throw new Error("No storage was given");

    if (storagePassword) {
      console.log("-use encrypted store with password: ", storagePassword);
      const encryptedStorage: KVStore = await EncryptedStorageWrapper.create(storageObj, storagePassword);
      this.storage = new StructuredStorage(encryptedStorage);
    } else {
      console.warn("Disabled encryption feature for whatsDapp store. Make sure given store supports encryption!");
      console.log("-use unencrypted store");
      this.storage = new StructuredStorage(storageObj);
    }
  }
  //factory function
  static async createWhatsDapp(storageObj: KVStore, storagePassword?: string): Promise<WhatsDapp> {
    console.log("Create WhatsDapp client");
    //synchronous stuff here
    const whatsDapp = new this();
    
    await whatsDapp.initStorage(storageObj,storagePassword);

    //asnychronous stuff here
    const storage:StructuredStorage = whatsDapp.storage;
    console.log("-retrieving storage data");
    if (!await storage.hasUserData()) throw new Error("No userdata available in this store or wrong password. Prepare store first.");
    const userData: WhatsDappUserData | null = await storage.getUserData();
    if (!userData) throw new Error("No userdata available in this store.");

    const mnemonic: string = userData.mnemonic;
    if (!mnemonic) throw new Error("No mnemonic in storage");
    // const identityString: string | null = userData.identityString;
    // const profile: WhatsDappProfile | null = userData.profile;
    // const dpnsName: string | null = userData.dpnsName

    //PrivateData is done by SignalProtocolStore ;)

    //get last poll timestamp
    let lastPollTime = await storage.getLastTimestamp();
    if (isNaN(lastPollTime)) lastPollTime = 0;
    whatsDapp.setNewestRemoteTimestamp(lastPollTime);

    //TODO: Define somewhere what these "sessions" are and what they are used for
    const sessions = await storage.getSessions();
    whatsDapp.sessions = new Set(sessions);

    console.log("-init messenger");
    await whatsDapp.init(userData);

    //just to be sure
    if (!whatsDapp.initialized) throw new Error("Unknown Error initiating whatsDapp :/");
    return whatsDapp;
  }

  private constructor(signalLib?: ISignalLib) {
    super();

    //TODO: check for node or browser and choose libs accordingly
    //TODO: implement signal lib replacement ;)
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
  private async init(userData: WhatsDappUserData): Promise<void> {
    const mnemonic: string = userData.mnemonic;
    let identityString: string | null = userData.identityString;
    const dpnsName: string | null = userData.identityString;
    let profile: WhatsDappProfile | null = userData.profile;


    console.log("-setup client with mnemonic: ", mnemonic, " and identity: ", identityString);
    this.client = getWhatsDappDashClient(mnemonic);
    if (!this.client) throw new Error("Client undefined");
    const platform: Platform | undefined = this.client.platform;
    if (!platform) throw new Error("Platform undefined");


    //TODO: DPNS
    if(dpnsName){
      console.log("-resolve dpns name");
      //TODO: https://dashplatform.readme.io/docs/tutorial-retrieve-a-name
      //TODO
      const retrievedIdentityString:string|null=identityString;
      if(retrievedIdentityString!==identityString){
        //TODO
        //choose identity string and delete dpns for now
      }
    }

    //IDENTITY
    //if no identity was given, register a new one
    if (!identityString) {
      console.log("-no idetity string was given. Creating new identity...");
      //TODO try catch?
      identityString = await this.createNewIdentity(); //throws Error
      console.log("-created identity:", identityString);
      console.log("-tops up identity");
      await this.topUpIdentity(identityString, 1000); //throws Error
    }
    console.log("-retrieving identity (", identityString, ")");
    //TODO: retries?
    const retrievedIdentity = await platform.identities.get(identityString); //throws Error
    const identity: DashIdentity | undefined = retrievedIdentity;

    if (!identity) throw new Error("Identity undefined. Cannot retrieve or create one.");
    this.identityString = identity.getId().toJSON();

    console.log("-save identity");
    userData.identityString = identityString;
    await this.storage.setUserData(userData);

    if (identity.getBalance() === 0) {

      //TODO: get balance. If low inform
      //if 0 throw error
      //WE cannot even perform profile update
      //check at the end, if profile update is nessecary
    }

    this.dAPICommunicator = new DAPICommunicator(platform, identity);

    //PROFILE
    if (!profile){
      console.log("-retrieving profile");
      profile = await this.dAPICommunicator.getProfile(this.identityString); //throws error
      if (profile == null) {
        //other error should be thrown, so at this point a profile==null means "no profile on drive"
        console.log("-no profile for identity was found.");
        //TODO: be sure, that it's not an error of DAPI! If there are connection errors our (old) profile will be overwritten by createKeys ;)
        profile = await this.createAndUploadNewProfile(); //throws error
      }
      if (!profile) throw new Error("Profile undefined. Cannot retrieve or create one.");
    }
    this.profile = profile;
    console.log("-save profile");
    userData.profile=profile;
    await this.storage.setUserData(userData);


    //save data
    const userdata: WhatsDappUserData = {
      mnemonic: mnemonic,
      identityString: identityString,
      dpnsName: '',//TODO
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
    this.pollTimeout = setTimeout(() => this.pollForNewMessages(), 0);

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
      this.pollTimeout = setTimeout(() => this.pollForNewMessages(), this.pollInterval);
    }
  }
  private setNewestRemoteTimestamp(latestUpdatedAt: number): void { this.newestRemoteTimestamp = Math.max(this.newestRemoteTimestamp, latestUpdatedAt + this.POLLTIME_OFFSET_DUE_TO_MONGODB_INPRECISION); }


  //**********************
  // MESSAGES
  //**********************

  /** _poll is async, if we used an interval we might start a new poll before
   * the last one was done. that's why _poll sets up the next poll after it's done.
   */
  //TODO
  private async pollForNewMessages(): Promise<void> {
    console.log("Poll new messages since", this.newestRemoteTimestamp);
    this.pollTimeout = null;
    const pollTime = this.newestRemoteTimestamp;

    let messages: Array<DriveMessage>;
    try {
      messages = await this.dAPICommunicator.getMessagesByTime(pollTime);
    } catch (e) {
      console.error('Error retrieving message documents from drive:', e);
      //setup next poll
      this.pollTimeout = setTimeout(() => this.pollForNewMessages(), this.pollInterval);
      return;
    }

    try {
      const messagePromises = messages.map((m: DriveMessage) => {
        this.handleIncomingMessage(m)
          //TODO catch
          //TODO idea: chache ids of files throwing errors to do further handling? But keep polltime?
          .catch(e => console.log('retrieving message failed!', e));
      });
      console.log('-got', messagePromises.length, 'new messages');

      await Promise.all(messagePromises);
    } catch (e) {
      console.error('Error decrypting messages:', e);
      //setup next poll
      this.pollTimeout = setTimeout(() => this.pollForNewMessages(), this.pollInterval);
      return;
    }

    //if everything went well ;)
    this.pollTimeout = setTimeout(() => this.pollForNewMessages(), this.pollInterval);
  }

  //TODO
  private async handleIncomingMessage(driveMessage: DriveMessage): Promise<void> {
    const interlocutorId: string = driveMessage.ownerId;

    if (interlocutorId == this.identityString) {
      //TODO: You cannot write to yourself
      //Error("Tried to lookup a session using our basekey"); session_record.js l.242
      console.log("You cannot write yourself. Will ignore message and step further.");
      this.setNewestRemoteTimestamp(driveMessage.updatedAt);
      throw new Error("Message from yourself, you cannot write yourself.");
      //TODO: use an array, that contains messageIds, that pretends to have them sent via drive :/
    }

    //TODO?
    //await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition

    console.log("-decrypt message");
    //TODO: catch MessageCounterError('Key used already or never filled'); //session_cipher.js l.234
    let plainInternalMessage: WhatsDappInternalMessage;
    try {
      const plainJson: string = await this.signal.decryptMessage(this.storage, interlocutorId, driveMessage.payload);
      plainInternalMessage = JSON.parse(plainJson);
      console.log("-done decrypt message");
    } catch (e:any) {
      if(e.name=="SessionError"){
        //TODO: Try to reinit session
        // console.log("Error while decrypting. Try to reinit session.");
        // this.sessions.delete(driveMessage.ownerId);
        // await this.getOrCreateOutgoingSession(driveMessage.ownerId);
        //commented out: this leads to MAC-errors in decrypting if first message (of a bunch of messages) from the same interlocutor throws an error but follwoing won't.
        //Better: answer with an internal message. New handshake will be perfomred automatically and read messages can be removed by sender.
      }
      //TODO
      //case 1: first msg comtaining prekey => signal makes it
      //case 2: n-th msg => signal makes it
      //case x: if you cleared your storage and a (not PreKey) message arrives, you'll need to establish a new session wirh interlocutor with his prekey from drive...
      console.error("Error while decrypting");
      throw e;
    }

    //If it's a NEW incoming msg (first of this chat) do nothing, since signal will do this for us ;)
    //Just put interlocutor in sessions as "known"
    //Now outgoing messages won't retrieve prekey from profile anymore
    if (await this.isNewSession(interlocutorId)) {
      await this.addToSessions(interlocutorId);
    }

    if (plainInternalMessage.internal) {
      //TODO: DO ANYTHING INTERNALLY ;)
      //Ideas: Resend aked messages, or exchange keys, or something...
    }
    if (plainInternalMessage.listOfReadMessageIds) {
      //TODO: DO ANYTHING INTERNALLY ;)
      //this list contains two infos:
      // 1) which messages, we can delete on drive (explicitly by its id). Can be done anyways
      // 2) which (old) messages sent before this answer were possibly not delivered
      //const listOfMessageIdsToDelete=plainInternalMessage.listOfReadMessageIds;
      //await deleteMessagesByIdArray(listOfMessageIdsToDelete);
    }

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

    await this.storage.addMessageToSession(interlocutorId, plainMessage);

    //at least, when everything went well, update pollTime
    this.setNewestRemoteTimestamp(plainMessage.updatedAt);
    this.emit(WhatsDappEvent.NewIncomingMessage, plainMessage, interlocutorId);
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
      console.error("You cannot write yourself");
      return false;
    }
    if (!this.initialized) {
      console.error("WhatsDapp is not initialized yet");
      return false;
    }
    console.log("Send message...");

    //build up session if it's first message
    await this.getOrCreateOutgoingSession(recipientId);

    const whatsDappInternalMessage: WhatsDappInternalMessage = {
      content: plaintext,
      listOfReadMessageIds: [],
    };
    if (referenceToMessageId) whatsDappInternalMessage.referenceToMessageId = referenceToMessageId;
    //TODO: Fill listOfReadMessageIds


    let ciphertext: ArrayBuffer;
    try {
      console.log("-encrypt message");
      ciphertext = await this.signal.encryptMessage(this.storage, recipientId, JSON.stringify(whatsDappInternalMessage));
      console.log("-done encrypt message");
    } catch (e) {
      //TODO
      //case 1: first msg comtaining prekey => signal makes it
      //case 2: n-th msg => signal makes it
      //case x: if you cleared your storage and a (not PreKey) message arrives, you'll need to establish a new session wirh interlocutor with his prekey from drive...
      console.error("Error while decrypting:", e);
      return false;
    }

    let sentMessage: DriveMessage | null;
    try {
      console.log("-upload message");
      sentMessage = await this.dAPICommunicator.createAndBroadcastMessage(recipientId, ciphertext);
      if (!sentMessage) {
        throw new Error("Message is null");
      }
    } catch (e) {
      console.log("Error while uploading encrypted message:", e);
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

    this.emit(WhatsDappEvent.MessageSent, msg, recipientId);

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
    //TODO: max is 10 per transaction
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
        return await retryFunctionXTimes(() => {
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
      //throw e;
      return false;
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
    //await this._getOrCreateSession(identityString);
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

    //TODO: keep signals identity-key the same

    const nickname:string|undefined=updatedProfile.nickname;
    if(nickname){
      if(nickname.length>100)throw new Error("Nickname too long. Max. number of char is 100.");
    }

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
      //TODO make boolean?
      throw e;
    }
    //TODO: delete profile locally, too

  }
  /**
   * e.g. in case of storage loss
   * @throws {Error}
   */
  async discardOldProfileAndCreateNew(): Promise<void> {
    //TODO: Keep signals idenintity key the same
    await this.deleteProfileFromDrive();
    await this.createAndUploadNewProfile();
  }

  private async createAndUploadNewProfile(): Promise<WhatsDappProfile> {
    //TODO: check if a profile exists abort if yes (first run deleteProfileFromDrive)
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
      //TODO: retriueve updatedAt from this transition and set it to pollTime (in case you updated your profile and dont want to die under a huge amount of decryption errors ;))
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

  private async addToSessions(interlocutor: string): Promise<void> {
    //this.sessions.push(interlocutor);
    this.sessions.add(interlocutor);
    //TODO:
    //this.storage.addSession();
  }
  private async isNewSession(interlocutor: string): Promise<boolean> {
    // return this.sessions.includes(interlocutor);
    return !this.sessions.has(interlocutor);
  }

  /**
   * 
   * @param interlocutorId 
   * @returns 
   * @throws {Error}
   */
  private async getOrCreateOutgoingSession(interlocutorId: string): Promise<string> {
    //only if this is the first outgoing message to interlocutor
    if (await this.isNewSession(interlocutorId)) {
      console.log("-unknown whatsDapp user");
      console.log("-create session with new chatpartner", interlocutorId);

      //TODO: undefined signalKeyBundle?
      console.log("-retrieve interlocutors profile");
      const profile = await this.dAPICommunicator.getProfile(interlocutorId);//throws error
      if (!profile) {
        throw new Error("Error retrieving interlocutors profile");
      }
      const preKeyBundle: WhatsDappSignalPrekeyBundle = profile.signalKeyBundle;

      /* TODO: This is only necessary when a new session is established by searching a contact.
      If a session is established by a new incoming message, this is a waste of time, since the
      signal lib will tear it down and rebuild it, because buildAndPersistSession establishes an
      outgoing session. Incoming sessions are created by the signal lib and don't require explicit
      session establishment by us. */
      //LONG STORY SHORT: IMPLEMENT PROFILE SEARCH FOR INCOMING MESSAGES ;)

      await this.signal.buildAndPersistOutgoingSession(this.storage, interlocutorId, preKeyBundle);
      await this.addToSessions(interlocutorId);
      //this.emit(WhatsDappEvent.NewSession, interlocutorId, preKeyBundle);
    }
    return interlocutorId;
  }

  private async createKeys(): Promise<WhatsDappSignalKeyBundle> {
    const preKeyId = 42; // TODO: replace
    const preKeyCount=10;
    const signedPreKeyId = 1337; // TODO: replace
  
    const keys = await this.signal.generateSignalKeys(preKeyId, preKeyCount, signedPreKeyId);

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

  emit(ev: WhatsDappEvent.NewIncomingMessage, msg: WhatsDappMessage, interlocutor: string): boolean;
  // emit(ev: WhatsDappEvent.NewSession, interlocutor: string, bundle: WhatsDappSignalPrekeyBundle): boolean;
  emit(ev: WhatsDappEvent.MessageSent, msg: WhatsDappMessage, interlocutor: string): boolean;
  // emit(ev: WhatsDappEvent.StorageRead, storageKey: string, ret: (val: Uint8Array | null) => void): boolean;
  // emit(ev: WhatsDappEvent.StorageWrite, storageKey: string, storageValue: Uint8Array): boolean;
  // emit(ev: WhatsDappEvent.StorageDelete, storageKey: string): boolean;
  emit(ev: string, ...args: unknown[]): boolean {
    return super.emit(ev, ...Array.from(args));
  }

  on(ev: WhatsDappEvent.NewIncomingMessage, listener: (msg: WhatsDappMessage, interlocutor: string) => void): this;
  // on(ev: WhatsDappEvent.NewSession, listener: (interlocutor: string, bundle: WhatsDappSignalPrekeyBundle) => void): this;
  on(ev: WhatsDappEvent.MessageSent, listener: (msg: WhatsDappMessage, interlocutor: string) => void): this;
  // on(ev: WhatsDappEvent.StorageRead, listener: (storageKey: string, ret: (val: Uint8Array | null) => void) => void): this;
  // on(ev: WhatsDappEvent.StorageWrite, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  // on(ev: WhatsDappEvent.StorageDelete, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  on(ev: string, listener: (...args: any[]) => void): this {
    return super.on(ev, listener);
  }

  removeListener(ev: WhatsDappEvent.NewIncomingMessage, listener: (msg: WhatsDappMessage, interlocutor: string) => void): this;
  // removeListener(ev: WhatsDappEvent.NewSession, listener: (interlocutor: string, bundle: WhatsDappSignalPrekeyBundle) => void): this;
  removeListener(ev: WhatsDappEvent.MessageSent, listener: (msg: WhatsDappMessage, interlocutor: string) => void): this;
  // removeListener(ev: WhatsDappEvent.StorageRead, listener: (storageKey: string, ret: (val: Uint8Array | null) => void) => void): this;
  // removeListener(ev: WhatsDappEvent.StorageWrite, listener: (storageKey: string, storageValue: Uint8Array) => void): this;
  // removeListener(ev: WhatsDappEvent.StorageDelete, listener: (storageKey: string) => void): this;
  removeListener(ev: string, listener: (...args: any[]) => void): this {
    return super.removeListener(ev, listener);
  }

  removeAllListeners(ev?: WhatsDappEvent): this;
  removeAllListeners(ev?: string): this {
    return super.removeAllListeners(ev);
  }
}
