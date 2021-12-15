import { WhatsDappSignalPrivateKeys } from "../signal/SignalWrapper";
import type { WhatsDappUserData, WhatsDappMessage} from "../WhatsDapp";

import {
  USER_FILE_NAME,
  PRIVATE_FILE_NAME,
  SESSIONS_FILE_NAME,
  DEFAULT_MSG_COUNT, CHUNK_SIZE_BUF, CHUNK_SIZE_SOFT_MAX,
  //CHUNK_SIZE_MAX
} from "./StructuredStorageConstants";
import {
  getTargetChunkIndex, insertMessageToChunk, isChunk,
  isWhatsDappPrivateData,
  isWhatsDappUserData, makeChunkKey,
  makeMetadataKey,
  objectToUint8Array,
  restoreBuffers,
  uint8ArrayToObject
} from "./StructuredStorageUtils";

export type KVStore = {
  get(key: string): Promise<Uint8Array | null>,
  set(key: string, value: Uint8Array): void,
  del(key: string): void,
}

export type SessionMetaData = {
  identityId: string,
  info: any,
  chunks: Array<number>,
}

/**
 * this class provides a translation between a simple
 * key-value-store and the structured information the library
 * needs to function.
 *
 * the keys and values both contain sensitive data and must be
 * hashed & salted (keys) and/or encrypted (values) by the
 * library user before being stored.
 *
 * suggestion:
 * use a per-device salt with a reasonably expensive, 16-byte password hash/kdf like scrypt for the keys,
 * symmetrically encrypt the values with aes-256-gcm.
 *
 */
export class StructuredStorage {
  _metadata: { [key: string]: SessionMetaData } | null;
  _userData: WhatsDappUserData | null;
  _privateData: WhatsDappSignalPrivateKeys | null;
  _store: KVStore;

  /**
   * create an instance of LocalStorage
   * @param store {KVStore} an object with a set() and a get() function.
   * calls to get() with a key must return the value from the last set() call.
   * if there is none, null must be returned.
   */
  constructor(store: KVStore) {
    this._metadata = null;
    this._userData = null;
    this._privateData = null;
    this._store = store;
  }

  async getSessionKeys(identityId: string): Promise<any> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }
    const md = this._metadata[identityId];
    return (md && md.info) || null;
  }

  async updateSessionKeys(identityId: string, device: string, info: any): Promise<void> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }

    const md = this._metadata[identityId];
    if (md == null) throw new Error("could not update session keys, no session with " + identityId + " found!");
    md.info[device] = info;
    this._metadata[identityId] = md;
    await this._saveMetaData(identityId);
  }

  async addSession(identityId: string, device: string, info: any): Promise<void> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }

    this._metadata[identityId] = {
      identityId,
      chunks: [0], // the first chunk contains all messages from unix epoch
      info: {
        [device]: info
      } // the session keys (signal)
    };

    const chunkKey = makeChunkKey(identityId, 0);
    this._store.set(chunkKey, objectToUint8Array([]));
    await this._saveSessions();
    return this._saveMetaData(identityId);
  }

  async addMessageToSession(identityId: string, message: WhatsDappMessage): Promise<void> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }
    const md = this._metadata[identityId];
    if (md == null) {
      console.log("session not found, can't add message");
      return;
    }

    const timestamp = message.updatedAt;
    const newEntryStr = JSON.stringify(message);
    const newEntryLength = newEntryStr.length * 2;
    // sorted list of the first message time stamp in each hist file for this session
    const chunks = md.chunks;
    const targetChunkIndex = getTargetChunkIndex(timestamp, chunks);
    let histKey = makeChunkKey(identityId, targetChunkIndex);
    const currentChunkArr = await this._store.get(histKey);
    if (currentChunkArr == null) {
      console.log('missing chunk, the history is corrupt!');
      return;
    }
    const currentChunk = uint8ArrayToObject(currentChunkArr);
    if (!isChunk(currentChunk)) {
      console.log('chunk is corrupt!');
      return;
    }
    if (targetChunkIndex === chunks.length - 1) { // it's the last one

      const currentChunkSize = currentChunkArr.length;
      // if the file is empty, we can still put a message in there even if it's too big
      if (currentChunkSize > CHUNK_SIZE_BUF && currentChunkSize + newEntryLength + CHUNK_SIZE_BUF > CHUNK_SIZE_SOFT_MAX) {
        histKey = makeChunkKey(identityId, targetChunkIndex + 1);
        md.chunks.push(timestamp);
        const histChunk = [newEntryStr];
        this._store.set(histKey, objectToUint8Array(histChunk));
      } else {
        const newChunk = insertMessageToChunk(timestamp, newEntryStr, currentChunk);
        this._store.set(histKey, objectToUint8Array(newChunk));
      }
    } else {
      // it's a delayed message, add to the found histFile and check afterwards if hardMaxSize was exceeded
      const newChunk = insertMessageToChunk(timestamp, newEntryStr, currentChunk);
      this._store.set(histKey, objectToUint8Array(newChunk));
      // TODO: if (Buffer.byteLength(json, 'utf8') > CHUNK_SIZE_MAX) await this._reorganizeHistory(identityId)
    }

    this._metadata[identityId] = md;
    return this._saveMetaData(identityId);
  }

  async hasSession(identityId: string): Promise<boolean> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }
    return this._metadata[identityId] != undefined;
  }

  async deleteSession(identityId: string): Promise<void> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }
    const md = this._metadata[identityId];
    if (md == null) return;
    md.chunks.forEach(n => this._store.del(makeChunkKey(identityId, n)));
    delete this._metadata[identityId];
    this._store.del(makeMetadataKey(identityId));
    await this._saveSessions();
  }

  //
  // metadata persistence
  //

  async getSessions(): Promise<Array<string>> {
    if (!this._metadata) {
      this._metadata = await this._loadMetaData();
    }
    return Object.keys(this._metadata);
  }

  async getLastTimestamp(): Promise<number> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }
    let max = 0;
    for (const identityId in this._metadata) {
      // get the newest message that has a timestamp smaller than infinity
      const lastMessage = (await this.getPreviousMessages(identityId, Infinity, 1))[0];
      if (lastMessage == null) continue;
      max = Math.max(max, lastMessage.updatedAt);
    }
    return max;
  }

  private async _loadSessions(): Promise<Array<string>> {
    const arr = await this._store.get(SESSIONS_FILE_NAME);
    return arr == null
      ? []
      : uint8ArrayToObject(arr) as Array<string>;
  }

  private async _saveSessions(): Promise<void> {
    const sessions = await this.getSessions();
    this._store.set(SESSIONS_FILE_NAME, objectToUint8Array(sessions));
  }

  private async _loadMetaData(): Promise<{ [key: string]: SessionMetaData }> {
    const sessions = await this._loadSessions();
    const sessionsPromises = sessions.map(s => this._loadBlockMap(s));
    const sessionInfos = await Promise.all(sessionsPromises);
    const ret: { [key: string]: SessionMetaData } = {};
    sessions.forEach((s, i) => {
      const info = sessionInfos[i];
      if (info != null) ret[s] = info;
    });
    if (Object.keys(ret).length != sessions.length) await this._saveSessions();
    return ret;
  }

  private async _loadBlockMap(identityId: string): Promise<SessionMetaData | null> {
    const arr = await this._store.get(makeMetadataKey(identityId));
    return arr == null
      ? null
      : uint8ArrayToObject(arr) as SessionMetaData;
  }

  private async _saveMetaData(identityId: string): Promise<void> {
    //console.log("save metadata");
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
      return;
    }
    const md = this._metadata[identityId];
    if (md == null) return;
    const mdKey = makeMetadataKey(identityId);
    const contents = {
      identityId,
      info: md.info,
      chunks: md.chunks
    };
    const mdArr = objectToUint8Array(contents);
    this._store.set(mdKey, mdArr);
  }

  //
  // privateData persistence
  //

  async setPrivateData(data: WhatsDappSignalPrivateKeys): Promise<void> {
    this._privateData = data;
    return this._savePrivateData();
  }

  async getPrivateData(): Promise<WhatsDappSignalPrivateKeys | null> {
    if (this._privateData == null) {
      this._privateData = await this._loadPrivateData();
    }
    return this._privateData;
  }

  async hasPrivateData(): Promise<boolean> {
    const pd = await this.getPrivateData();
    return isWhatsDappPrivateData(pd);
  }

  private async _savePrivateData(): Promise<void> {
    console.log("save private data");
    const pd = await this.getPrivateData();
    //console.log(pd,PRIVATE_FILE_NAME);
    return this._store.set(PRIVATE_FILE_NAME, objectToUint8Array(pd));
  }

  private async _loadPrivateData(): Promise<WhatsDappSignalPrivateKeys | null> {
    console.log("getting private data!");
    const loadedPrivateData = await this._store.get(PRIVATE_FILE_NAME);
    if (loadedPrivateData == null) return null;
    const pdObj = uint8ArrayToObject(loadedPrivateData);
    return restoreBuffers(pdObj) as WhatsDappSignalPrivateKeys;
  }

  //
  // userData persistence
  //

  async hasUserData(): Promise<boolean> {
    if (this._userData == null) {
      this._userData = await this._loadUserData();
    }
    return isWhatsDappUserData(this._userData);
  }

  async setUserData(data: WhatsDappUserData): Promise<void> {
    this._userData = data;
    return this._saveUserData();
  }

  async getUserData(): Promise<WhatsDappUserData | null> {
    if (this._userData == null) {
      this._userData = await this._loadUserData();
    }
    return this._userData;
  }

  private async _saveUserData(): Promise<void> {
    const userData = await this.getUserData();
    this._store.set(USER_FILE_NAME, objectToUint8Array(userData));
  }

  private async _loadUserData(): Promise<WhatsDappUserData | null> {
    const loadedUserData = await this._store.get(USER_FILE_NAME);
    if(!loadedUserData)return null;
    const udObj=uint8ArrayToObject(loadedUserData);
    return restoreBuffers(udObj) as WhatsDappUserData;
  }


  //
  // message queries
  //

  /**
   * return a list of promises of messages, starting at a timestamp.
   * will not return a message that was sent exactly at timestamp.
   *
   * usage: to get the next chunk of messages when the user is scrolling up,
   * simply call this with the timestamp of the oldest message that's currently loaded.
   *
   * if there are not enough messages to return, remaining promises will be resolved with null.
   *
   * @type {function(identityId: string, timestamp: ?number, limit: ?number):Array<Promise<?{timestamp: number, message: string}>>}
   */
  getPreviousMessages(identityId: string, timestamp = Infinity, limit: number = DEFAULT_MSG_COUNT): Promise<Array<WhatsDappMessage>> {
    return this._getMessageByTimestamp(identityId, timestamp, limit, true);
  }

  /**
   * return a list of promises of messages, starting at a timestamp.
   * will not return a message that was sent exactly at timestamp.
   *
   * usage: to get the next chunk of messages when the user is scrolling down
   * simply call this with the timestamp of the newest message that's currently loaded.
   *
   * if there are not enough messages to return, remaining promises will be resolved with null.
   *
   * @type {function(identityId: string, timestamp: ?number, limit: ?number):Array<Promise<?{timestamp: number, message: string}>>}
   */
  getNextMessages(identityId: string, timestamp = 0, limit: number = DEFAULT_MSG_COUNT): Promise<Array<WhatsDappMessage>> {
    return this._getMessageByTimestamp(identityId, timestamp, limit, false);
  }

  private async _getMessageByTimestamp(identityId: string, timestamp: number, limit: number, older: boolean): Promise<Array<WhatsDappMessage>> {
    if (this._metadata == null) {
      this._metadata = await this._loadMetaData();
    }
    const md = this._metadata[identityId];
    if (md == null) return [];

    // if we want older than timestamp, the timestamp of the returned messages has to be smaller
    // than the query timestamp.
    const comparer: (mt: number, qt: number) => boolean = older
      ? (mt, qt) => mt > qt
      : (mt, qt) => mt < qt;

    // if we want older than timestamp, we need to inspect the newest message in chunk first.
    const reverser: (arr: Array<WhatsDappMessage>) => Array<WhatsDappMessage> = older
      ? arr => arr.reverse()
      : arr => arr;

    // if we want older than timestamp, we need to iterate the chunks from the end.
    const dir = older
      ? -1
      : 1;

    console.log("retrieve msg for", identityId);
    const ret: Array<WhatsDappMessage> = [];
    if (limit <= 0 || timestamp < 0) return ret;
    const chunks = md.chunks;
    const targetChunkIndex = getTargetChunkIndex(timestamp, chunks);


    // run through the chunks until we can't find messages anymore
    // or we fulfilled limit
    const stopVal = dir > 0
      ? chunks.length
      : -1;

    for (let i = targetChunkIndex; i !== stopVal; i = i + dir) {
      // read in chunk contents
      const chunkKey = makeChunkKey(identityId, i);
      const chunkArr = await this._store.get(chunkKey);
      if (chunkArr == null) {
        console.log("history is corrupt, chunkArr null!");
        break;
      }
      const chunk = uint8ArrayToObject(chunkArr);
      if (!isChunk(chunk)) {
        console.log("history is corrupt, chunk is not a chunk!");
        break;
      }
      const decChunk = chunk.map(s => JSON.parse(s) as WhatsDappMessage);
      reverser(decChunk).forEach(message => {
        if (ret.length === limit) return;
        if (comparer(message.updatedAt, timestamp)) {
          console.log('message in wrong time slice');
          return;
        }
        ret.push(message);
      });
      if (ret.length === limit) break;
    }

    return ret;
  }
}
