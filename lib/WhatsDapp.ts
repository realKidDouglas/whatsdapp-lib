import * as dapi from './dapi/dapi';
import {EventEmitter} from 'events';
import {rawMessageToMessage} from './dapi/conversion';
import DashSDK from "dash";
import {DashClient, DashIdentity} from "./types/DashTypes";

type TimerHandle = ReturnType<typeof setTimeout>;

export type WhatsDappMessage = {
  // TODO: get senderHandle from (some) public profile!
  senderHandle: string,
  timestamp: number,
  content: string,
  id: string,
  ownerId: string
}


type WhatsDappSession = {
  //signal: any,
  identity_receiver: string,
  profile_name: string
}

// TODO: get type from contract
export type RawMessage = any
export type RawProfile = any;

type WhatsDappKeyBundle = {
  prekeys: Array<string>,
  identity_public_key: string,
  signed_identity_public_key: string;
}

type WhatsDappProfile = {
  identity: string,
  whatsDappName: string,
  keybundle: WhatsDappKeyBundle
}

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
  lastTimestamp: number,
  preKeyBundle: any
}

type ConnectResult = {
  handle: string,
  identity: DashIdentity
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
  initialized: Promise<ConnectResult> | null = null;

  /**
   * @param opts {}
   * @returns {Promise<{handle:string, identity}>}
   */
  async connect(opts: ConnectOptions): Promise<ConnectResult> {
    let {identity} = opts;
    const {mnemonic, sessions, displayname, lastTimestamp, preKeyBundle} = opts;
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

    this._profile = profile;

    // deferred initialization
    this.initialized = Promise.resolve()
      .then(() => this._pollTimeout = setTimeout(() => this._poll(), 0)) // first poll is immediate
      .catch(e => console.log("error", e))
      .then(() => ({handle: displayname, identity: identity}));

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
    const messages = await dapi.getMessagesByTime(this._connection, pollTime);

    console.log();
    const messagePromises = messages.map((m: RawMessage) => this._broadcastNewMessage(m).catch(e => console.log('broadcast failed!', e)));
    console.log('got', messagePromises.length, 'new messages.');
    if (messages.length > 0) {
      this._lastPollTime = messages[messages.length - 1].createdAt.getTime();
    }

    await Promise.all(messagePromises);

    this._pollTimeout = setTimeout(() => this._poll(), pollInterval);

  }

  async _broadcastNewMessage(rawMessage: RawMessage): Promise<void> {
    const message: WhatsDappMessage = rawMessageToMessage(rawMessage);
    const session = await this._getOrCreateSession(rawMessage.ownerId, message.senderHandle);
    const sentByUs = (message.ownerId === this._connection.ownerId);
    await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition
    // TODO: Separate Signals for messages sent by us and other people
    this.emit('new-message', message, session, sentByUs);
    this._lastPollTime = Math.max(this._lastPollTime, message.timestamp + 1);
  }

  async _getOrCreateSession(ownerId: any, senderHandle: string): Promise<WhatsDappSession> {
    let session: WhatsDappSession = this._sessions[ownerId] as WhatsDappSession;
    if (session == null) {
      session = {profile_name: senderHandle, identity_receiver: ownerId};
      const preKeyBundle = (await dapi.getProfile(this._connection, ownerId)).data;
      this._sessions[ownerId] = session;
      this.emit('new-session', session, preKeyBundle);
    }
    return session;
  }

  /**
   * TODO: instead of indefinitely awaiting init, set
   * TODO: timeout and reject after some amount
   * TODO: of time and mark message for retry in GUI
   * @param receiver {string} B58?
   * @param content {string}
   * @returns {Promise<boolean>}
   */
  async sendMessage(receiver: string, content: string) {

    // TODO: Hier kommt der Signalkram rein -> enc msg
    // TODO: keybundle soll der messenger sich selbst beschaffen,
    // TODO: muss nicht als arg kommen.

    await this.initialized;

    /*const batch = */
    await dapi.createMessage(this._connection, receiver, content);
    //const message = transitionToMessage(batch.transitions[0], this._connection.identity)

    // GUI listens to this, can then remove send-progressbar or w/e
    // storage also listens and will save the message.
    //this.emit('new-message', message, {handle: receiver})
  }

  getSessions() {
    return this._sessions;
  }

  disconnect() {
    if (this._pollTimeout) clearTimeout(this._pollTimeout);
    this._pollTimeout = null;
  }

  async getProfileByName(name: string): Promise<WhatsDappProfile | null> {
    const dpnsName = name + ".dash";


    const dpnsContract = await dapi.findIdentityByName(this._connection, dpnsName);
    if (dpnsContract == null) {
      console.log("no identity found for " + name);
      return null;
    }

    const profileContract = await dapi.getProfile(this._connection, dpnsContract.ownerId);
    if (profileContract == null) {
      console.log("no WhatsDapp profile found for " + name);
      return null;
    }

    const profile = {
      identity: dpnsContract.ownerId.toString(),
      whatsDappName: profileContract.data.displayname,
      keybundle: {
        prekeys: profileContract.data.prekeys,
        identity_public_key: profileContract.data.identity_public_key,
        signed_identity_public_key: profileContract.data.signed_identity_public_key
      }
    };

    console.log(profile);
    return profile;
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
