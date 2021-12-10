# Install

TODO: `npm install whatsdapp`

# Usage (Work in Progress)

## Storage
First you need a storage.
The `whatsdapp-lib` does not come with one, since we want developers to use the storage that best fits their needs.
Therefore we defined the interface `KVStore` in `src/storage/StructuredStorage.ts` as follows:
```
export type KVStore = {
  get(key: string): Promise<Uint8Array | null>,
  set(key: string, value: Uint8Array): void,
  del(key: string): void,
}
```

WhatsDapp comes with an encryption tidbit for storage. 
If you give a password it will AES-encrypt all local data so you can use an unencrypted local storage as well.

TODO: For a start you can use the localstorgae implementation in chatbot-repo.

### Prepare Storage
On first use (and only on first use) you need to give your mnemonic. 
From then it stays in local storage.
Therefore call static function:
```
static async prepareEmptyStorage(mnemonic: string, identityString: string | null, storageObj: KVStore, storagePassword?: string): Promise<void>;
```
e.g.
```
//identity will be generated later, use unencrypted storage
await WhatsDapp.prepareEmptyStorage(<MNEMONIC>, null, storageObj);
```
or:
```
//fixed identity, use password encrypted storage
await WhatsDapp.prepareEmptyStorage(<MNEMONIC>, <IDENTITY>, storageObj, '53cur3p455w0rd');
```

## Create Messenger

To create a new WhatsDapp-object use the static factory function:
```
static async createWhatsDapp(storageObj: KVStore, storagePassword?: string): Promise<WhatsDapp>;
```
Set optional password according parameters set in `prepareEmptyStorage`:
```
const messenger = await WhatsDapp.createWhatsDapp(storageObj);
```
resp:
```
const messenger = await WhatsDapp.createWhatsDapp(storageObj, '53cur3p455w0rd');
```

If there is no identity deposited in storage a new one will be generated and automatically topped up.

After the initialization, generated Dash-Identity and WhatsDapp-Profile can be retrieved by getter-functions:
```
messenger.getCurrentProfile(): WhatsDappProfile | null
messenger.getCurrentIdentityString(): string
```

## Connecting Events



## Minimal working Example
```
const {WhatsDapp, WhatsDappEvent} = require('whatsdapp');
const MNEMONIC='<mnemonic goes here>';
const IDENTITY='<identity id goes here>'
// retrieve appdata path
const appDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
//set storage path for dev purpose in a directory depending on identity
const storagePath = path.join(appDataPath, /*app.getPath('userData'),*/ 'whatsDappSessions/'+IDENTITY)

//use one arbitraty KVStore
const storage = new LocalStorage(storagePath)

//prepare first time. If userdata exist, this will throw an error and move on
try {
  await WhatsDapp.prepareEmptyStorage(MNEMONIC, IDENTITY, storage, "lol");
} catch (e) {
  console.log("Storage seems to be initiated already. Try to move on...")
}

//optionally an new identity and a generic profile will be created
const messenger = await WhatsDapp.createWhatsDapp(storage, "lol");

//define listener function
const newMsgArrived=async (msg, interlocutor)=>{
  //DO SOMETHING
}

//connect event
messenger.on(WhatsDappEvent.NewIncomingMessage, newMsgArrived)

//start polling for new messages
messenger.startPolling();
```




1639167951000 last poll (before msg)
1639167878000 what storage says :/
1639167977000 last message





## Handling Signals

The `whatsdapp-lib` emits a couple of signals that you need to handle.
These signals are:

* `WhatsDappEvent.NewSession`
 * Parameters:
   * `WhatsDappSession`: The session with the communication partner
   * `RawPreKeyBundle`: The signal keybundle of the communication partner
* `WhatsDappEvent.NewMessage`: New incoming message; Parameters:
 * Parameters:
   * `WhatsDappPlainMessage`: Decrypted message
   * `WhatsDappSession`: The session with the communication partner
* `WhatsDappEvent.NewMessageSent`
 * Parameters:
   * `WhatsDappCipherMessage`: Encrypted message
   * `WhatsDappSession`: The session with the communication partner

Furthermore there are the 3 storage related events that have already been mentioned above.

* `WhatsDappEvent.StorageRead`
* `WhatsDappEvent.StorageWrite`
* `WhatsDappEvent.StorageDelete`






## Net Prefs
WhatsDapp currently running on `testnet` synchronizing from mid 2021 as stated in `src/dapi/dash_client/WhatsDappDashClient.ts`:
```
const clientOpts = {
    network: 'testnet',
    wallet: {
      mnemonic: mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 500000, // only sync from mid of 2021
      },
    },
    apps
  };
```
