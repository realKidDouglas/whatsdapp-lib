import {METADATA_FILE_NAME} from "./StructuredStorageConstants";
import { WhatsDappUserData} from "../WhatsDapp";
import { WhatsDappSignalPrivateKeys } from "../signal/SignalWrapper";

export function objectToUint8Array(obj: unknown): Uint8Array {
  const json = JSON.stringify(obj);
  return new TextEncoder().encode(json);
}

export function uint8ArrayToObject(arr: Uint8Array): unknown {
  const json = new TextDecoder().decode(arr);
  return JSON.parse(json);
}

/**
 * todo: find a way to make this return a nominal type
 * @param id
 */
export function makeMetadataKey(id: string): string {
  return id + "-" + METADATA_FILE_NAME;
}

export function makeChunkKey(id: string, num: number): string {
  return id + "-" + num;
}

/**
 * TODO: make platform-agnostic/superfluous by replacing everything that uses buffers
 * takes a pojo that may have deserialized buffers of the form {type: 'Buffer', data: Array<number>}
 * should probably be part of our deserialize-logic
 * @param obj {any} that can contain buffers
 */
export function restoreBuffers(obj: any): any {
  //TODO: do we need this? if (typeof obj !== 'object' || Array.isArray(obj)) return obj;
  //commented out to have Buffers in preKey restored
  if (typeof obj !== 'object')return obj;
  if(!obj)return obj;
  if (isSerializedBuffer(obj)) {
    return Buffer.from(obj.data);
  } else {
    // recurse for each child that's an object and not an array
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) obj[k] = restoreBuffers(obj[k]);
    }
  }

  return obj;
}

export function isSerializedBuffer(obj: Record<string, unknown>): obj is { type: "Buffer", data: Array<number> } {
  return Object.keys(obj).length === 2 && obj['type'] === 'Buffer' && Array.isArray(obj.data);
}

export function isWhatsDappPrivateData(obj: Record<string, unknown> | null): obj is WhatsDappSignalPrivateKeys {
  return obj != null && [
    typeof obj.identityKeyPair !== 'undefined',
    typeof obj.registrationId !== 'undefined',
    typeof obj.preKeys !== 'undefined',
    typeof obj.signedPreKeys !== 'undefined',
  ].every(Boolean);
}

export function isWhatsDappUserData(obj: Record<string, unknown> | null): obj is WhatsDappUserData {
  return obj != null && [
    typeof obj.mnemonic !== 'undefined',
    typeof obj.identityString !== 'undefined',
    typeof obj.dpnsName !== 'undefined',
    typeof obj.profile !== 'undefined'
  ].every(Boolean);
}

export function isChunk(obj: any): obj is Array<string> {
  return Array.isArray(obj) && obj.every(v => typeof v === 'string');
}

/**
 * get a chunk a timestamp would lie in. assumes that
 * the first chunk starts at 0.
 * @param timestamp {number} timestamp to sort
 * @param chunks {Array<number>} array of timestamps
 * @returns {number} index of the last chunk that starts
 * before the timestamp.
 */
export function getTargetChunkIndex(timestamp: number, chunks: Array<number>): number {
  return chunks.reduce((best, cur, i) => cur < timestamp ? i : best, 0);
}

/**
 * place a string at the appropriate location in a history chunk
 * @param timestamp {number} location associated with the string
 * @param newEntry {string} value of the new string
 * @param histChunk {Array<string>} array to insert into
 */
export function insertMessageToChunk(timestamp: number, newEntry: string, histChunk: Array<string>): Array<string> {
  let i;
  // find first timestamp from the end that's smaller than our new timestamp
  for (i = histChunk.length - 1; i >= 0; i--) {
    const val = histChunk[i];
    if (val == null) continue;
    const msg = JSON.parse(val);
    if (msg.timestamp == null) continue;
    if (msg.timestamp < timestamp) break;
  }
  histChunk.splice(i + 1, 0, newEntry);
  return histChunk;
}
