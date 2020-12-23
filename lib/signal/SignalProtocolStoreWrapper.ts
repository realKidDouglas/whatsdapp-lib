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

  _getDeviceId(identifier: string): number {
    const regexMatch = identifier.match(/.*\.(\d+)/);
    return (regexMatch != null)
      ? Number(regexMatch[1])
      : -1;
  }

  async getOurIdentity(): Promise<SignalKeyPair> {
    const privateData = await this.store.getPrivateData();
    return privateData['identityKeyPair'];
  }

  async getOurRegistrationId(): Promise<number> {
    const privateData = await this.store.getPrivateData();
    return privateData['registrationId'];
  }

  async isTrustedIdentity(identifier: string, identityKey: any, _direction: number): Promise<boolean> {
    if (identifier == null) {
      throw new Error("tried to check identity key for undefined/null key");
    }

    let identity;
    try {
      const address = libsignal.ProtocolAddress.from(identifier);
      identity = address.id;
    } catch(e) {
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

  /* Not used by libsignal-node */
  async loadIdentityKey(identifier: string): Promise<SignalKeyPair> {
    if (identifier == null)
      throw new Error("Tried to get identity key for undefined/null key");
    return Promise.resolve(this.get('identityKey' + identifier));
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
    if (existing && arrayBufferToString(identityKey, 'binary') !== arrayBufferToString(existing['identityKey'] as any, 'binary')) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  /** TODO: what's the arg for? */
  async loadPreKey(_keyId: number): Promise<SignalKeyPair> {
    const res = (await this.store.getPrivateData()).preKey.keyPair;
    return Promise.resolve(res);
  }

  /** TODO: what's the arg for? */
  async storePreKey(_keyId: number, keyPair: SignalKeyPair): Promise<void> {
    const privateData = await this.store.getPrivateData();
    privateData['preKey'] = keyPair;
    return Promise.resolve(this.store.setPrivateData(privateData));
  }

  async removePreKey(_keyId: number): Promise<void> {
    /* Since we have no implementation of one-time prekey handling at the moment,
    we use a single static long time prekey. This will be addressed in the future. */
    return;
  }

  /** TODO: what's the arg for? */
  async loadSignedPreKey(_keyId: number): Promise<SignalKeyPair> {
    const res = (await this.store.getPrivateData()).signedPreKey.keyPair;
    return Promise.resolve(res);
  }

  async storeSignedPreKey(keyId: number, keyPair: SignalSignedPreKey): Promise<void> {
    return Promise.resolve(this.store.setPrivateData('signedPreKey_' + keyId, keyPair)['signedPreKey_' + keyId]);
  }

  async removeSignedPreKey(keyId: number): Promise<void> {
    return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
  }

  /** TODO: find out what's actually returned here */
  async loadSession(identifier: string): Promise<SessionRecord | null> {
    let identityId;
    let deviceString;
    try {
      const address = libsignal.ProtocolAddress.from(identifier);
      identityId = address.id;
      deviceString = "device" + address.deviceId;
    } catch (e){
      console.log('unreachable');
      throw e;
    }
    const data = await this.store.getSessionKeys(identityId);
    if(data == null) return null;
    return SessionRecord.deserialize(data[deviceString]);
  }

  /** TODO: find out types of record */
  async storeSession(identifier: string, record: SessionRecord): Promise<void> {
    let identityId;
    let deviceString;
    try {
      const address = libsignal.ProtocolAddress.from(identifier);
      identityId = address.id;
      deviceString = "device" + address.deviceId;
    } catch (e){
      console.log('unreachable');
      throw e;
    }
    if (await this.store.hasSession(identityId)) {
      await this.store.updateSessionKeys(identityId, deviceString, record.serialize());
    } else {
      await this.store.addSession(identityId, deviceString, record.serialize());
    }
  }

  // TODO: where did this come from?
  // TODO: introduce maybe type
  get(id: string): SignalKeyPair {
    const val = this._keyPairs[id];
    if (val == null) throw new Error('not found!');
    return val;
  }

  remove(id: string): void {
    delete this._keyPairs[id];
  }
}

