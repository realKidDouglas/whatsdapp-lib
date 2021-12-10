const fs = require('fs-extra');
const path = require('path');

/**
 * Clear file key-value-store
 * Adapted from: https://github.com/realKidDouglas/whatsdapp-ui-example
 * 
 * Example implementation of a WhatsDapp storage provider for node/electron
 *
 * stores information in a directory that's configured with the constructor
 * options.
 *
 * @param storagePath {string}
 * @constructor
 */
class LocalStorageClearDevPurposeOnly {

    constructor(storagePath) {
        if (!storagePath) throw new Error('storage opts need a string path to a directory')

        // set up lifetime constants
        this._storagePath = storagePath

        //create directory if not exists
        if (!fs.existsSync(storagePath)){
            fs.mkdirSync(storagePath, { recursive: true });
        }
    }

    /**
     *
     * @param key {string}
     * @return {Promise<Uint8Array | null>}
     */
    async get(key) {
        let ret = null;
        try {
            const pathToRead = path.join(this._storagePath, key);
            if(!fs.existsSync(pathToRead))return null;
            ret = await fs.readFile(pathToRead)
        } catch (e) {
            console.log("could not find value for key", e);
        }
        return ret;
    }

    /***
     *
     * @param key {string}
     * @param value {Uint8Array}
     */
    set(key, value) {
        if (value == null) {
            this._delete(key);
            return;
        }
        const pathToWrite = path.join(this._storagePath, key);
        fs.writeFileSync(pathToWrite, value);
    }

    del(key){
        this.set(key, null);
    }

    /**
     *
     * @param key {string}
     * @private
     */
    _delete(key) {
        const pathToDelete = path.join(this._storagePath, key);
        fs.removeSync(pathToDelete);
    }
}

module.exports = LocalStorageClearDevPurposeOnly
