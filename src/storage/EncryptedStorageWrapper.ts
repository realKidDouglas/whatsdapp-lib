import { KVStore } from "./StructuredStorage";

import {
    getKey,
    getSalt,
    getStorageKeyHash,
    aesEncryptUint8Array,
    aesDecryptUint8Array
} from './EncryptedStorageWrapperCrypt';

/**
 * //TODO
 * @param opts {{storagePath: string, password: string | Uint8Array}}
 * @constructor
 */
export class EncryptedStorageWrapper implements KVStore{
    private store: KVStore;
    private salt!: Uint8Array;
    private key!: Uint8Array;

    public static async create(store: KVStore, password: string):Promise<EncryptedStorageWrapper>{
        if (!password) throw new Error('Storage needs a password to encrypt the storage');
        const storageObj=new this(store);
        storageObj.salt=await getSalt(storageObj.store);
        storageObj.key=getKey(password, storageObj.salt);

        return storageObj;
    }
    private constructor(store: KVStore) {
        this.store = store;
    }

    /**
     *
     * @param key {string}
     * @return {Promise<Uint8Array | null>}
     */
    async get(key: string):Promise<Uint8Array|null> {
        const hashedKey = getStorageKeyHash(key, this.salt);
        const encValue = await this.store.get(hashedKey);
        if(!encValue)return null;
        return aesDecryptUint8Array(encValue, this.key);
    }

    /***
     *
     * @param key {string}
     * @param value {Uint8Array}
     */
    set(key: string, value: Uint8Array):void {
        const hashedKey = getStorageKeyHash(key, this.salt);
        const encValue = aesEncryptUint8Array(value, this.key);
        this.store.set(hashedKey,encValue);
    }

    del(key: string):void {
        const hashedKey = getStorageKeyHash(key, this.salt);
        this.store.del(hashedKey);
    }
}

export default EncryptedStorageWrapper;
