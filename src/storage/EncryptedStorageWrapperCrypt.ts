import { KVStore } from "./StructuredStorage";

import { SALT_FILE_NAME, IV_LENGTH, ALGO, TAG_LENGTH, SALT_LENGTH } from "./EncryptedStorageWrapperConstants";
import * as crypto from 'crypto';
// const crypto = require('crypto')

/**
 * decrypt a Uint8Array
 * @param buf {Buffer}
 * @param key {Buffer}
 * @returns {Uint8Array | null}
 */
export function aesDecryptUint8Array(buf: Uint8Array, key: Uint8Array): Uint8Array | null {
    try {
        const iv = buf.slice(0, IV_LENGTH);
        const tag = buf.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const ct = buf.slice(IV_LENGTH + TAG_LENGTH);
        const decipher = crypto.createDecipheriv(ALGO, key, iv, { authTagLength: TAG_LENGTH });
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(ct), decipher.final()]);
    } catch (e) {
        console.log('could not decipher array!', e);
        return null;
    }
}

/**
 * encrypt a Uint8Array
 * @param arr {Uint8Array}
 * @param key {Buffer}
 * @returns {Buffer} iv | authTag | ciphertext
 */
export function aesEncryptUint8Array(arr: Uint8Array, key: Uint8Array): Uint8Array {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const ctBuffers = [];
    ctBuffers.push(cipher.update(Buffer.from(arr)));
    ctBuffers.push(cipher.final());
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag].concat(ctBuffers));
}


export async function getSalt(store: KVStore): Promise<Uint8Array> {
    let saltBuffer: Uint8Array | null;
    try {
        saltBuffer = await store.get(SALT_FILE_NAME);
        if (!saltBuffer/* === null*/) throw new Error("No salt yet");//TODO
    } catch (e) {
        console.log('could not retrieve salt, generating new one.');
        saltBuffer = crypto.randomBytes(SALT_LENGTH);
        try {
            store.set(SALT_FILE_NAME, saltBuffer);
        } catch (e) {
            console.log(`master salt could not be stored: ${saltBuffer.toString()}\n\n`, e);
        }
    }
    if (!saltBuffer || saltBuffer.length === 0) throw new Error('something went wrong during master key derivation!');
    return saltBuffer;
}

export function getKey(password: string, saltBuffer: Uint8Array): Uint8Array {
    return crypto.scryptSync(password, saltBuffer, 32, {
        cost: 16384, // default
        blockSize: 8, // default
        parallelization: 1, // default
        maxmem: 32 * 1024 * 1024 //default
    });
}

/**
 * fairly high cost is desired so if the storage gets leaked,
 * it's not easy to find out who we talked to by looking at the
 * file names.
 * @param storageKey {string}
 * @param saltBuffer {Buffer} salt used for the scrypt hash
 * @returns {string} hex encoded hash
 */
export function getStorageKeyHash(storageKey: string, saltBuffer: Uint8Array): string {
    // if(typeof input !== 'string' || input.length !== X) throw new Error('invalid identity id')
    return crypto.scryptSync(storageKey, saltBuffer, 16, {
        cost: 16384, // default
        blockSize: 8, // default
        parallelization: 1, // default
        maxmem: 32 * 1024 * 1024 //default
    }).toString('hex');
}