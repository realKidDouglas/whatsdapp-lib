import * as dapi from './dapi/dapi';
import {EventEmitter} from 'events';
import {WhatsDappMessage} from "./dapi/WhatsDappMessage";
import {WhatsDappProfile} from "./dapi/WhatsDappProfile";
import {KVStore, StructuredStorage, WhatsDappUserData} from "./storage/StructuredStorage";
import {
  AbstractDocumentTransition,
  DashClient,
  DashDocument,
  DashIdentifier,
  DashIdentity,
  DashPlatform,
  makeClient
} from "./dapi/dash_client/DashClient";
import {SignalWrapper} from "./signal/SignalWrapper";
import {combine, err, errAsync, ok, Result, ResultAsync} from "neverthrow";
import {downcast} from "./types/downcast";
import {DocumentBroadcastError, DocumentCreateError} from "./error/DocumentErrors";
import {
  DapiError,
  InsufficientCreditsError,
  InsufficientDashError,
  NoCredentialsError,
  NotFoundError, PreconditionFailedError
} from "./error/WhatsDappError";
import {IdentityGetError} from "./error/IdentityErrors";
import {DpnsRegisterError, DpnsResolveError} from "./error/DpnsErrors";

type TimerHandle = ReturnType<typeof setTimeout>;
type ListenerType = Parameters<typeof EventEmitter.prototype.on>[1];

export type WhatsDappSession = {
  //signal: any,
  identity_receiver: string,
  profile_name: string
}

export enum WhatsDappEvent {
  NewMessage = 'new-message',
}

export type RawPreKeyBundle = {
  identityKey: Array<string>,
  registrationId: number,
  signedPreKey: SignedPreKey,
  preKey: PreKey,
  prekeys: Array<string>,
  displayname: string,
}

// TODO: get types from contracts
export type RawProfile = DashDocument<RawPreKeyBundle>;
export type RawMessage = DashDocument<{ receiverId: string, content: string }>

export type SignedPreKey = {
  keyId: number,
  publicKey: Array<string>
}

export type PreKey = {
  keyId: number,
  publicKey: Array<string>,
  signature: Array<string>
}

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
  identity: DashIdentity
  platform: DashPlatform,
  ownerId: DashIdentifier,
}

const pollInterval = 5000;

export class WhatsDapp extends EventEmitter {
  _connection: WhatsDappConnection | null = null;
  _pollTimeout: TimerHandle | null = null;
  _lastPollTime = 0;
  _client: DashClient | null = null;
  _profile: WhatsDappProfile | null = null;
  _sessions: Record<string, WhatsDappSession> = {};
  initialized: Promise<WhatsDappUserData> | null = null;
  _storage: StructuredStorage;
  _signal: SignalWrapper;

  constructor(kv: KVStore) {
    super();
    this._storage = new StructuredStorage(kv);
    this._signal = new SignalWrapper();
  }

  /**
   * get the stored login from the storage
   */
  async getSavedLogin(): Promise<LoginInfo | null> {
    const savedLogin = await this._storage.getUserData();
    if (savedLogin == null) return null;
    return {
      mnemonic: savedLogin.mnemonic,
      identityId: savedLogin.identityId,
      dpnsNames: [savedLogin.dpnsName, ...savedLogin.extraDpnsNames],
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
  static async listLoginInfos(mnemonic: string): Promise<Result<Array<LoginInfo>, DapiError>> {
    const ret: Array<LoginInfo> = [{mnemonic, identityId: null, dpnsNames: [], displayName: null,}];
    const clientRes = makeClient(mnemonic);
    if (clientRes.isErr()) return err(clientRes.error);
    const client = clientRes.value;
    const account = await client.getWalletAccount();
    const identityIds = await account.identities.getIdentityIds();
    console.log("identities:", identityIds);
    for (let i = 0; i < identityIds.length; i++) {
      const identityId = identityIds[i];
      if (identityId == null) continue;
      ret.push({mnemonic, identityId, dpnsNames: [], displayName: null});
      // check for dpns name of identity
      const names_res = await dapi.name.getByIdentity(client.platform, identityId);
      if (names_res.isErr() || names_res.value.length === 0) continue;
      const dpnsNames = names_res.value;
      console.log("names:", dpnsNames);
      ret.push({mnemonic, identityId, dpnsNames, displayName: null});

      // check if identity has registered a whatsdapp profile
      const profile = await dapi.profile.get(client.platform, identityId);
      if (profile.isErr() || profile.value == null) continue;
      ret.push({mnemonic, identityId, dpnsNames, displayName: profile.value.data.displayname});
    }
    await client.disconnect();
    return ok(ret);
  }

  deleteProfile(
    profile: LoginInfo
  ): ResultAsync<void, DapiError | IdentityGetError | InsufficientCreditsError | DocumentBroadcastError | NotFoundError> {
    const {mnemonic, identityId, displayName} = profile;
    if (identityId == null || displayName == null) return errAsync(new NotFoundError());
    const clientRes = makeClient(mnemonic);
    if (clientRes.isErr()) return errAsync(clientRes.error);
    const client = clientRes.value;
    return dapi.identity.get(client.platform, identityId)
      .andThen(retrievedIdentity => dapi.profile.remove(client.platform, retrievedIdentity))
      .map(() => undefined);
  }

  /**
   * try to get a valid connection so we can send messages and load saved sessions
   * * @param opts {ConnectOptions}
   */
  async connect(
    opts: ConnectOptions
  ): Promise<Result<WhatsDappUserData, DapiError | PreconditionFailedError | DpnsRegisterError | InsufficientCreditsError | InsufficientDashError>> {
    const {identityId, lastTimestamp, displayName, dpnsName, extraDpnsNames, mnemonic} = opts;

    // first, create a dash client
    const clientRes = makeClient(mnemonic);
    if(clientRes.isErr()) return err(clientRes.error);
    this._client = clientRes.value;
    const platform = this._client.platform;

    // try to get an identity that owns all the given dpns names
    const identityRes = await this._ensureConnectPreconditions(platform, identityId, dpnsName, extraDpnsNames);
    if (identityRes.isErr()) return err(identityRes.error);
    const identity = identityRes.value;

    // retrieve/make a profile
    const profileRes = await this._ensureProfile(platform, identity, displayName);
    if (profileRes.isErr()) return err(profileRes.error);
    this._profile = profileRes.value;

    // set up the rest of the information
    const id = identity.getId().toJSON();
    const userData: WhatsDappUserData = {
      mnemonic,
      displayName,
      identityId: id,
      dpnsName,
      extraDpnsNames: []
    };

    this._pollTimeout = setTimeout(() => this._poll(), 0);
    await this._storage.setUserData(userData);
    this.initialized = Promise.resolve(userData);
    this._connection = {platform, identity, ownerId: identity.getId()};
    this._lastPollTime = lastTimestamp + 1;
    return ok(userData);
  }

  /**
   * makes sure that
   * 1. we have an identityId that we can use
   * 2. it is associated with all of the given dpns names.
   * @param platform
   * @param identityId {string} the id that is preferred to be used for the profile.
   * @param dpnsName
   * @param extraDpnsNames
   * @return the identity Id that's set up for the profile
   * @private
   */
  private async _ensureConnectPreconditions(
    platform: DashPlatform,
    identityId: string | null,
    dpnsName: string,
    extraDpnsNames: Array<string>
  ): Promise<Result<DashIdentity, DapiError | PreconditionFailedError | InsufficientDashError | InsufficientCreditsError | DpnsRegisterError>> {
    if (identityId) {
      const registeredIdentitiesRes = await dapi.identity.getWalletIdentityIds(platform);
      if (registeredIdentitiesRes.isErr()) return err(registeredIdentitiesRes.error);
      const registeredIdentities = registeredIdentitiesRes.value;
      // in this case, the given identity is not associated with the wallet.
      // we can't fix that since we can't ensure that identities.register()
      // will give back an identity with the given identityId.
      if (!registeredIdentities.includes(identityId)) return err(new PreconditionFailedError());
    } else {
      const identityRegRes = await dapi.identity.create(platform);
      if (identityRegRes.isErr()) return err(identityRegRes.error.parent);
      identityId = identityRegRes.value.getId().toJSON();
    } // now we know that identityId is a registered Identity associated with our wallet
    const identityRes = await dapi.identity.get(platform, identityId)
      .mapErr(e => new DapiError("dapi.getIdentity", e));
    if (identityRes.isErr()) return err(identityRes.error);
    const identity = identityRes.value;

    // makes sure there is at least one dpns name given.
    const dpnsNames = [dpnsName, ...extraDpnsNames];
    const nameGetRes = await dapi.name.getAll(platform, dpnsNames);
    if (nameGetRes.isErr()) return err(nameGetRes.error);
    // first we need to check that all names are either
    // unregistered or registered to the same identity.
    const nameDocs = nameGetRes.value;
    // check that the names are unregistered or registered to our identityId
    const owningIdentity = nameDocs.reduce((prev, curr) => {
      if (!prev) return null;
      if (curr != null) {
        const id = typeof curr.ownerId === 'string' ? curr.ownerId : curr.ownerId.toJSON();
        if (id === prev) return id;
        else return null;
      } else {
        return prev;
      }
    }, identityId as string | null);
    // one or more of the given names are registered to different identities.
    // that can't be fixed here, the name list must be modified.
    if (!owningIdentity) return err(new PreconditionFailedError());

    // we now have an identity that owns all registered names from the list.
    // now try to register all unregistered names to our identity as well.
    const namesToRegister = dpnsNames.filter((_n, i) => nameDocs[i] === null);
    const registerRes = await combine(namesToRegister.map(n => dapi.name.create(platform, identity, n)));
    if (registerRes.isErr()) return err(registerRes.error);

    // now all the given names are registered to the given
    // identity (or a new one), so our preconditions are fulfilled.
    return ok(identity);
  }

  /**
   * ensures that the given identity has a profile with the given displayname in the drive
   * @param platform
   * @param identity
   * @param displayName
   * @private
   */
  private async _ensureProfile(
    platform: DashPlatform,
    identity: DashIdentity,
    displayName: string
  ): Promise<Result<WhatsDappProfile, DapiError | InsufficientCreditsError>> {
    // first get the profile if there is one in the drive
    const id = identity.getId().toJSON();
    const profileRes = await dapi.profile.get(platform, id);
    if (profileRes.isErr() && !(profileRes.error instanceof NotFoundError)) return err(profileRes.error);
    if (profileRes.isErr() && profileRes.error instanceof NotFoundError) {
      // this identity doesn't have a profile, create a new one.
      // TODO: if there's a profile, check that it belongs to our saved signal data
      const signalData = (await this._storage.getSignalData()) || (await this._signal.generateSignalKeys());
      await this._storage.setSignalData(signalData);
      const preKeyBundle = signalData.preKeyBundle;
      const content: WhatsDappProfileContent = {
        identityKey: downcast(preKeyBundle.identityKey),
        registrationId: downcast(preKeyBundle.registrationId),
        signedPreKey: downcast(preKeyBundle.signedPreKey),
        preKey: downcast(preKeyBundle.preKey),
        prekeys: [],
        displayname: displayName,
      };
      console.log(content);
      const create_profile_res = await dapi.profile.create(platform, identity, content)
        .mapErr(e => {
          if (e instanceof DocumentCreateError) {
            console.error("critical developer Error in createProfile!");
            return new DapiError('dapi.createProfile', e);
          }
          return e;
        });
      if (create_profile_res.isErr()) return err(create_profile_res.error);
      const get_profile_res = await dapi.profile.get(platform, id)
        .mapErr(e => e instanceof NotFoundError ? new DapiError('dapi.getProfile', e) : e);
      if (get_profile_res.isErr()) return err(get_profile_res.error);
      return ok(new WhatsDappProfile(get_profile_res.value));
    }

    // todo: check that the profile has displayName as displayname. if not -> update.

    // cast NotFoundError away, tsc doesn't recognize that we handled that case.
    return (profileRes as Result<RawProfile, DapiError>).map(rp => new WhatsDappProfile(rp));
  }

  /** _poll is async, if we used an interval we might start a new poll before
   * the last one was done. that's why _poll sets up the next poll after it's done.
   */
  async _poll(): Promise<void> {
    const resetInterval = () => {
      this._pollTimeout = setTimeout(() => this._poll(), pollInterval);
    };
    if (this._connection == null || this._connection.identity == null) return resetInterval();
    console.log("poll new messages since", this._lastPollTime);
    this._pollTimeout = null;
    const pollTime = this._lastPollTime;

    // TODO: it should be possible to do this per session / chat partner.
    const msg_res = await dapi.message.getByTime(this._connection.platform, this._connection.identity, pollTime);
    if (msg_res.isErr()) return resetInterval();
    const messages = msg_res.value;
    const messagePromises = messages.map((m: RawMessage) => this._broadcastNewMessageLocally(m).catch(e => console.log('broadcast failed!', e)));
    console.log('got', messagePromises.length, 'new messages.');
    if (messages.length > 0) {
      const polledMessage = messages[messages.length - 1];
      if (polledMessage !== undefined)
        this._lastPollTime = polledMessage.createdAt.getTime();
    }

    await Promise.all(messagePromises);

    return resetInterval();
  }

  async _broadcastNewMessageLocally(rawMessage: RawMessage): Promise<void> {
    const message: WhatsDappMessage = new WhatsDappMessage(rawMessage);
    const id = rawMessage.ownerId.toJSON();
    const sess_res = await this._getOrCreateSession(id, message.senderHandle);
    if (sess_res.isErr()) return Promise.reject(sess_res.error);
    const session = sess_res.value;
    await new Promise(r => setTimeout(r, 2000)); // TODO: Solve race condition
    this.emit(WhatsDappEvent.NewMessage, message, session);
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

  async getLocalProfile(): Promise<void> {
    return;
  }

  async clearLocalProfile(): Promise<void> {
    return;
  }

  /**
   *
   * @param ownerId {string} IdentityId of the other party
   * @param displayName {string} display name of the other party
   */
  async _getOrCreateSession(
    ownerId: string,
    displayName: string
  ): Promise<Result<WhatsDappSession, DapiError | NotFoundError | NoCredentialsError>> {
    let session = this._sessions[ownerId];
    if (session == null) {
      if (this._connection == null) return err(new NoCredentialsError());
      session = {profile_name: displayName, identity_receiver: ownerId};
      const preKeyBundle_res = await dapi.profile.get(this._connection.platform, ownerId);
      if (preKeyBundle_res.isErr()) return err(preKeyBundle_res.error);
      if (preKeyBundle_res.value == null) return err(new NotFoundError());
      this._sessions[ownerId] = session;
      return ok(session);
    }
    return ok(session);
  }

  emit(ev: WhatsDappEvent.NewMessage, message: WhatsDappMessage, session: WhatsDappSession): boolean;
  emit(ev: string, ...args: unknown[]): boolean {
    return super.emit(ev, ...Array.from(args));
  }

  on(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: WhatsDappSession) => void): this;
  on(ev: string, listener: ListenerType): this {
    return super.on(ev, listener);
  }

  removeListener(ev: WhatsDappEvent.NewMessage, listener: (msg: WhatsDappMessage, session: WhatsDappSession) => void): this;
  removeListener(ev: string, listener: ListenerType): this {
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
   * @param plaintext {string}
   */
  async sendMessage(
    receiver: string,
    plaintext: string
  ): Promise<Result<void, DapiError | InsufficientCreditsError | DocumentCreateError | NoCredentialsError>> {
    console.log("start init sending");
    try {
      await this.initialized;
    } catch (e) {
      return err(new NoCredentialsError());
    }
    console.log("end init sending");
    if (this._connection == null) return err(new NoCredentialsError());
    const send_res = await dapi.message.create(
      this._connection.platform,
      this._connection.identity,
      receiver,
      plaintext
    );
    if (send_res.isErr()) return err(send_res.error);
    const sentMessage = send_res.value;
    console.log("sentMessage:", sentMessage);
    // dapi.createMessage guarantees that this is not empty
    const transition = sentMessage.getTransitions()[0] as AbstractDocumentTransition;
    if (transition == null || transition.getAction() !== 0) return err(
      new DocumentCreateError('something went _seriously_ wrong', null)
    );
    const receiverIdentity = await this._connection.platform.identities.get(receiver);

    const rawMessage: RawMessage = (transition as unknown) as RawMessage;

    console.log(rawMessage);

    const whatsDappMessage: WhatsDappMessage = new WhatsDappMessage(rawMessage);
    //await dapi.createMessage(this._connection, receiver, ciphertext);
    //const message = transitionToMessage(batch.transitions[0], this._connection.identity)

    // GUI listens to this, can then remove send-progressbar or w/e
    // storage also listens and will save the message.
    console.log({profile_name: receiver, identity_receiver: receiverIdentity.getId()});
    await this._storage.addMessageToSession(receiver, whatsDappMessage);
    console.log("sent");
    return ok(undefined);
  }

  createInputMessage(plaintext: string): string {
    const inputMessage: WhatsDappMessageContent = {message: plaintext, deleteTime: new Date().getTime()};
    return JSON.stringify(inputMessage);
  }

  getSessions() {
    return this._sessions;
  }

  disconnect() {
    if (this._pollTimeout) clearTimeout(this._pollTimeout);
    this._pollTimeout = null;
    console.log("WhatsDapp: Disconnect!");
  }

  async getProfileByName(
    name: string
  ): Promise<Result<WhatsDappSession, DapiError | NoCredentialsError | NotFoundError | DpnsResolveError>> {
    // Resolve DPNS-Name to Identity
    if (this._connection == null) return err(new NoCredentialsError());
    const dpnsName: string = name + ".dash";
    const identityRes = await dapi.name.resolve(this._connection.platform, dpnsName);
    if (identityRes.isErr()) return err(identityRes.error);
    const identity = identityRes.value;
    //TODO: Es sollte nicht bei jedem suchen eine Session erzeugt werden
    // TODO: Was soll der Anzeigename sein
    return await this._getOrCreateSession(identity.getId().toJSON(), identity.getId().toJSON());
  }
}
