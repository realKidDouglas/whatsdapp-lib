import { SignalKeyPair } from "libsignal";
import { ISignalLib, WhatsDappSignalKeyBundle, WhatsDappSignalPrekeyBundle, WhatsDappSignalPrivateKeys } from "./signal/SignalWrapper";
import { StructuredStorage } from "./storage/StructuredStorage";

/**
 * Helper class to create and update keys in profile and keep overview
 */
export class KeyManager {
    private signal: ISignalLib;
    private storage: StructuredStorage;

    private DEFAULT_PREKEYS_COUNT = 10;

    private lastSignedPreKeyUpdate = 0;
    private SIGNED_PREKEYS_TIME_OFFSET_IN_MILLIS = 7 * 24 * 60 * 60 * 1000;//one week

    private lastPreKeysUpdate = 0;
    private newSessionsSinceLastKeyUpdate = 0;

    private doNotUpdateKeys: boolean;

    constructor(signal: ISignalLib, storage: StructuredStorage, doNotUpdateKeys: boolean) {
        this.signal = signal;
        this.storage = storage;
        this.doNotUpdateKeys = doNotUpdateKeys;
    }

    //TODO: persistance of update times

    isTimeForKeyUpdate(): boolean {
        return this.isTimeForPreKeyUpdate() || this.isTimeForSignedKeyUpdate();
    }

    async isProfileKeySameAsStorageKey(profilePreKeyBundle: WhatsDappSignalPrekeyBundle): Promise<boolean> {
        await this.getCorrespondingKeyBundleFromStorage(profilePreKeyBundle);
        return true;
    }

    /**
     * 
     * @param oldPreKeyBundle 
     * @returns updated prekeys, signedprekeys, or given keybundle if no need ti update
     */
    async updateKeys(oldPreKeyBundle: WhatsDappSignalPrekeyBundle): Promise<WhatsDappSignalKeyBundle> {
        const oldKeyBundle: WhatsDappSignalKeyBundle = await this.getCorrespondingKeyBundleFromStorage(oldPreKeyBundle);

        let newKeyBundle: WhatsDappSignalKeyBundle = oldKeyBundle;

        if (this.isTimeForPreKeyUpdate()) {
            console.log("PreKeys Update is necessary. Update keys.");
            newKeyBundle = await this.updatePreKeys(newKeyBundle);
        }
        if (this.isTimeForSignedKeyUpdate()) {
            console.log("Signed PreKey Update is necessary. Update keys.");
            newKeyBundle = await this.updateSignedPreKey(newKeyBundle);
        }
        return newKeyBundle;
    }


    private isTimeForSignedKeyUpdate(): boolean {
        if (this.doNotUpdateKeys) return false;
        //renew signedprekey if it's one week since last update
        return (Date.now() - this.lastSignedPreKeyUpdate) > this.SIGNED_PREKEYS_TIME_OFFSET_IN_MILLIS;
    }
    addNewSessionsSinceLastKeyUpdate(): void {
        this.newSessionsSinceLastKeyUpdate++;
    }
    private isTimeForPreKeyUpdate(): boolean {
        if (this.doNotUpdateKeys) return false;
        //renew prekeys if there were 10 new sessions made (prekeys most likely used)
        //or after one week
        const keysUsed = this.newSessionsSinceLastKeyUpdate >= this.DEFAULT_PREKEYS_COUNT;
        const oneWeekAgo = (Date.now() - this.lastPreKeysUpdate) > this.SIGNED_PREKEYS_TIME_OFFSET_IN_MILLIS;
        return keysUsed || oneWeekAgo;
    }

    /**
     * Initial key generation (first use ever).
     * @returns 
     */
    async createNewKeys(preKeyCount: number = this.DEFAULT_PREKEYS_COUNT, overwriteExistingKeys = false): Promise<WhatsDappSignalKeyBundle> {
        if (!overwriteExistingKeys) {
            if (await this.storage.hasPrivateData()) {
                throw new Error("There are keys already stored. Use updateKeys instead to prevent overwriting private keys.");
            }
        }
        const preKeyId = 0;
        const signedPreKeyId = 0;

        const keys = await this.signal.generateSignalKeys(preKeyId, preKeyCount, null, signedPreKeyId);

        this.lastPreKeysUpdate = Date.now();
        this.lastSignedPreKeyUpdate = Date.now();

        await this.storage.setPrivateData(keys.private);
        return keys;
    }

    /**
     * Generates new prekeys for given preKeyBundle
     * @returns 
     */
    private async updatePreKeys(oldKeyBundle: WhatsDappSignalKeyBundle, preKeyCount: number = this.DEFAULT_PREKEYS_COUNT): Promise<WhatsDappSignalKeyBundle> {
        const identityKeyPair: SignalKeyPair = oldKeyBundle.private.identityKeyPair;

        //find max preKeyId
        const lastPreKeyId: number = Math.max(...oldKeyBundle.preKeyBundle.preKeys.map(preKey => preKey.keyId), 0);
        const preKeyId = lastPreKeyId + 1;

        //does not matter here
        const signedPreKeyId = 0;

        const newKeyBundle = await this.signal.generateSignalKeys(preKeyId, preKeyCount, identityKeyPair, signedPreKeyId);

        //only updates preKeys
        const newKeys: WhatsDappSignalKeyBundle = {
            private: {
                identityKeyPair: oldKeyBundle.private.identityKeyPair,
                registrationId: oldKeyBundle.private.registrationId,
                //add private keys to storage (since they have an id, signal can match them)
                //TODO: remove old/used keys after some time
                preKeys: [...newKeyBundle.private.preKeys, ...oldKeyBundle.private.preKeys],
                signedPreKeys: oldKeyBundle.private.signedPreKeys
            },
            preKeyBundle: {
                preKeys: newKeyBundle.preKeyBundle.preKeys,
                identityKey: oldKeyBundle.preKeyBundle.identityKey,
                registrationId: oldKeyBundle.preKeyBundle.registrationId,
                signedPreKey: oldKeyBundle.preKeyBundle.signedPreKey
            }
        };

        this.lastPreKeysUpdate = Date.now();

        //since we only added some private keys to this object, we can overwrite existing
        await this.storage.setPrivateData(newKeys.private);
        return newKeys;
    }

    /**
     * Generates new signedPreKey for given preKeyBundle
     * @param oldPreKeyBundle 
     * @returns 
     */
    private async updateSignedPreKey(oldKeyBundle: WhatsDappSignalKeyBundle): Promise<WhatsDappSignalKeyBundle> {
        const identityKeyPair: SignalKeyPair = oldKeyBundle.private.identityKeyPair;

        //find last signedPreKeyId
        const lastsignedPreKeyId: number = oldKeyBundle.preKeyBundle.signedPreKey.keyId;
        const signedPreKeyId = lastsignedPreKeyId + 1;

        //does not matter here
        const preKeyId = 0;
        const preKeyCount = 1;

        const newKeyBundle = await this.signal.generateSignalKeys(preKeyId, preKeyCount, identityKeyPair, signedPreKeyId);

        const newKeys: WhatsDappSignalKeyBundle = {
            private: {
                identityKeyPair: oldKeyBundle.private.identityKeyPair,
                registrationId: oldKeyBundle.private.registrationId,
                preKeys: oldKeyBundle.private.preKeys,
                //add private keys to storage (since they have an id, signal can match them)
                //TODO: remove old/used keys after some time
                signedPreKeys: [...newKeyBundle.private.signedPreKeys, ...oldKeyBundle.private.signedPreKeys]
            },
            preKeyBundle: {
                preKeys: oldKeyBundle.preKeyBundle.preKeys,
                identityKey: oldKeyBundle.preKeyBundle.identityKey,
                registrationId: oldKeyBundle.preKeyBundle.registrationId,
                signedPreKey: newKeyBundle.preKeyBundle.signedPreKey
            }
        };

        this.lastSignedPreKeyUpdate = Date.now();

        //since we only added some private keys to this object, we can overwrite existing
        await this.storage.setPrivateData(newKeys.private);
        return newKeys;
    }

    private static isEqualArrayBuffer(buf1: ArrayBuffer, buf2: ArrayBuffer): boolean {
        //from: https://stackoverflow.com/questions/21553528/how-to-test-for-equality-in-arraybuffer-dataview-and-typedarray
        if (buf1.byteLength != buf2.byteLength) return false;
        const dv1 = new Uint8Array(buf1);
        const dv2 = new Uint8Array(buf2);
        for (let i = 0; i != buf1.byteLength; i++) {
            if (dv1[i] != dv2[i]) return false;
        }
        return true;
    }

    private async getCorrespondingKeyBundleFromStorage(pubs: WhatsDappSignalPrekeyBundle): Promise<WhatsDappSignalKeyBundle> {
        const privateKeys: WhatsDappSignalPrivateKeys | null = await this.storage.getPrivateData();
        if (!privateKeys) {
            throw new Error("Error retrieving private data from storage.");
        }

        //check if these keys correspond
        const identityPubKeyFromStorage = privateKeys.identityKeyPair.pubKey;
        const identityPubKeyFromProfile = pubs.identityKey;
        if (!KeyManager.isEqualArrayBuffer(identityPubKeyFromStorage, identityPubKeyFromProfile)) {
            throw new Error("Identity Keys not matching. Messed up private data and profile data.");
        }

        const keyBundle: WhatsDappSignalKeyBundle = {
            private: privateKeys,
            preKeyBundle: pubs
        };
        return keyBundle;
    }

}