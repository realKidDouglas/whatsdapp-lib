import {KVStore} from "../../src/storage/StructuredStorage";


export class KVMock implements KVStore {
  _store : Record<string, Uint8Array> = {};

  clear(): void {
    this._store = {};
  }

  del(key: string): Promise<void> {
    delete this._store[key];
    return Promise.resolve();
  }

  get(key: string): Promise<Uint8Array | null> {
    return Promise.resolve(this._store[key] || null);
  }

  set(key: string, value: Uint8Array): Promise<void> {
    this._store[key] = value;
    return Promise.resolve();
  }
}
