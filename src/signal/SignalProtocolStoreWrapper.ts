import {arrayBufferToString} from "./utils";
import libsignal, {ProtocolStore, SignalKeyPair, SessionRecord, SignalSignedPreKey} from 'libsignal';

export class SignalProtocolStore implements ProtocolStore {

  public static readonly Direction = {
    SENDING: 1,
    RECEIVING: 2,
  }

  store: any;
  remoteIdentity: string;
  _keyPairs: { [key: string]: SignalKeyPair }

  constructor(store: any, remoteIdentity: string) {
    this.store = store;
    this.remoteIdentity = remoteIdentity;
    this._keyPairs = {};
  }

  /**
   * loads the private IdentityKeyPair from the storage
   * @returns {Promise<SignalKeyPair>}
   */
  async getOurIdentity(): Promise<SignalKeyPair> {
    const privateData = await this.store.getPrivateData();
    return privateData['identityKeyPair'];
  }

  /**
   * loads RegistrationID from the storage
   * @returns {Promise<number>}
   */
  async getOurRegistrationId(): Promise<number> {
    const privateData = await this.store.getPrivateData();
    return privateData['registrationId'];
  }

  /**
   * checks whether a given IdentityKey matches the one that is already stored.
   * If no key is stored, the identityKey is trusted.
   * @param identifier: Identifier of the session that should be checked
   * @param identityKey: Key that should be checked
   * @param _direction: unused
   * @returns {Promise<boolean>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isTrustedIdentity(identifier: string, identityKey: ArrayBuffer, _direction: number): Promise<boolean> {
    if (identifier == null) {
      throw new Error("tried to check identity key for undefined/null key");
    }

    let identity;
    try {
      const address = libsignal.ProtocolAddress.from(identifier);
      identity = address.id;
    } catch (e) {
      identity = identifier;
    }

    if (!(identityKey instanceof Buffer)) {
      throw new Error("Expected identityKey to be an ArrayBuffer");
    }
    const trusted = await this.store.getSessionKeys(identity);
    if (trusted == null || trusted['identityKey'] == undefined) {
      return Promise.resolve(true);
    }
    return Promise.resolve(arrayBufferToString(identityKey, 'binary') === arrayBufferToString(trusted['identityKey'], 'binary'));
  }

  /**
   * this function is part of the signal storage API but is currently not used
   * @param _identifier: unused
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async loadIdentityKey(_identifier: string): Promise<void> {
    /* This function is currently not needed and therefore does nothing. */
    return;
  }

  async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    if (identifier === null || identifier === undefined)
      throw new Error("Tried to put identity key for undefined/null key");

    const address = libsignal.ProtocolAddress.from(identifier);
    const existing = await this.store.getSessionKeys(address.id);
    let sessionKeys;
    if (existing == undefined)
      sessionKeys = {};
    else
      sessionKeys = existing;
    sessionKeys['identityKey'] = identityKey; // TODO: Multi device support
    this.store.updateSessionKeys(address.id, sessionKeys);

    // TODO: What's the actual type of the keys?
    if (existing && arrayBufferToString(identityKey, 'binary') !== arrayBufferToString(existing['identityKey'] as ArrayBuffer, 'binary')) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * loads the static PreKeyPair from the storage. This will be changed in
   * the future to support multiple PreKeyPairs.
   * @param _keyId: unused
   * @returns {Promise<SignalKeyPair>}
   */
  async loadPreKey(keyId: number): Promise<SignalKeyPair> {
    const res = await this.store.getPrivateData().preKeys.get(keyId).keyPair;
    return Promise.resolve(res);
  }

  /**
   * this function is part of the signal storage API but is currently not used
   * @param _keyId: unused
   * @param _keyPair: unused
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async storePreKey(_keyId: number, _keyPair: SignalKeyPair): Promise<void> {
    return;
  }

  /**
   * this function is part of the signal storage API but is currently not used
   * @param _keyId: unused
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removePreKey(_keyId: number): Promise<void> {
    /* Since we have no implementation of one-time prekey handling at the moment,
    we use a single static long time prekey. This will be addressed in the future. */
    return;
  }

  /**
   * loads the static SignedPreKey from the storage. This will be changed in
   * the future to support SignedPreKey changes.
   * @param _keyId: unused
   * @returns {Promise<SignalKeyPair>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async loadSignedPreKey(_keyId: number): Promise<SignalKeyPair> {
    const res = (await this.store.getPrivateData()).signedPreKey.keyPair;
    return Promise.resolve(res);
  }

  /**
   * this function is part of the signal storage API but is currently not used
   * @param _keyId: unused
   * @param _keyPair: unused
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async storeSignedPreKey(_keyId: number, _keyPair: SignalSignedPreKey): Promise<void> {
    /* Changing SignedPreKeys is currently not implemented, so this function does nothing.
    This will be addressed in the future. */
    return;
  }

  /**
   * this function is part of the signal storage API but is currently not used
   * @param _keyId: unused
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeSignedPreKey(_keyId: number): Promise<void> {
    /* Changing SignedPreKeys is currently not implemented, so this function does nothing.
    This will be addressed in the future. */
    return;
  }

  /**
   * loads a persisted session from the storage
   * @param identifier: Identifier of the communication partner
   * @returns {Promise<SessionRecord>} if a session was found, else {Promise<null>}
   */
  async loadSession(identifier: string): Promise<SessionRecord | null> {
    let identityId;
    let deviceString;
    try {
      const address = libsignal.ProtocolAddress.from(identifier);
      identityId = address.id;
      deviceString = "device" + address.deviceId;
    } catch (e) {
      console.log('unreachable');
      throw e;
    }
    const data = await this.store.getSessionKeys(identityId);
    if (data == null) return null;
    return SessionRecord.deserialize(data[deviceString]);
  }

  /**
   * persists a new session state in the storage
   * @param identifier: Identifier of the communication partner
   * @param record: the session that should be persisted
   * @returns {Promise<void>}
   */
  async storeSession(identifier: string, record: SessionRecord): Promise<void> {
    let identityId;
    let deviceString;
    try {
      const address = libsignal.ProtocolAddress.from(identifier);
      identityId = address.id;
      deviceString = "device" + address.deviceId;
    } catch (e) {
      console.log('unreachable');
      throw e;
    }
    if (await this.store.hasSession(identityId)) {
      await this.store.updateSessionKeys(identityId, deviceString, record.serialize());
    } else {
      await this.store.addSession(identityId, deviceString, record.serialize());
    }
  }
}
