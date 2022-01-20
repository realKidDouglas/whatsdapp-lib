<p align="center">
  <img alt="WhatsDapp" src="https://github.com/realKidDouglas/whatsdapp-lib/raw/master/images/whatsDapp.png" width="100" height="100">  
</p>

<p align="center">
  WhatsDapp library applies the signal-protocol to the Dash Platform.
</p>

# WhatsDapp
The core of WhatsDapp as a private messenger library should be an asynchronous, 
censorship- and ddos-resistant (availability) end-2-end-encrypted communication channel (integrity) 
with forward- and backward-secrecy (confidentiality).

This development corresponds to the [Private Messenger Dapp project](https://trello.com/c/LUyEnwJ9/46-private-messenger-dapp) 
on Dash Incubator App.


# Install

Just install via `npm`
```
npm i whatsdapp
```

or clone, compile via: 
```
npm run dist
```
and add to your `package.json`-dependencies:
```
"whatsdapp": "<path-to>/whatsdapp-lib"
```


# Usage

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

For a quick start you can use the `LocalStorageClearDevPurposeOnly` implementing the `KVStore` interface located in `little_helper/local_storage_clear_dev.js`.

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
getCurrentIdentityString(): string
getCurrentProfile(): WhatsDappProfile | null
```


## Connecting Events

There are currently three events emitted by WhatsDapp:
```
emit(ev: WhatsDappEvent.NewIncomingMessage, msg: WhatsDappMessage, interlocutor: string): boolean;
emit(ev: WhatsDappEvent.MessageSent, msg: WhatsDappMessage, interlocutor: string): boolean;
emit(ev: WhatsDappEvent.LowFunds, remainingDuffs: number): boolean;
```

The type `WhatsDappMessage` contains also drive info as `$id`, `$createdAt` and `$updatedAt`. 
So the `MessageSent` event tells the listenig application that the document was uploaded to the drive, at what point of time and with what id.
```
export type WhatsDappMessage = {
  //global 32B ID derived from document on drive
  id: string,
  //plaintext message content
  content: string,
  //timestamps
  createdAt: number,
  updatedAt: number,
  //Dash identity-IDs
  senderId: string, //same as ownerId
  recipientId: string,
  referenceToMessageId?: string,
  //marks new messages as unread
  read?: boolean,
}
```
While the `LowFunds`-event is fired if `identity.getBalance()` returns a value lower than `MINIMUM_DUFFS_TO_SEND_MESSAGE= 100`.

## Polling

To receive new messages we use a polling. 
The default interval is currently 5 seconds.

There are three functions to control the polling:

```
startPolling(pollIntervalMilliseconds?: number): boolean;
setPollIntervall(pollIntervalMilliseconds: number): void;
stopPolling(): void;
```

## Send Message

To send a message there is the following function.
```
sendMessage(recipientId: string, plaintext: string, referenceToMessageId?: string): Promise<boolean> 
```
The `recipientId` is a Dash-Identity string.

## Minimal working Example
Bring above info together in one code snippet you can reuse.

```
const {WhatsDapp, WhatsDappEvent} = require('whatsdapp');
const MNEMONIC='<mnemonic goes here>';
const IDENTITY='<identity id goes here>'
// retrieve appdata path
const path = require('path');
const appDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
//set storage path for dev purpose in a directory depending on identity
const storagePath = path.join(appDataPath, 'whatsDappSessions/'+IDENTITY)

//use one arbitraty KVStore (copy js from little_helper/)
const LocalStorageClearDevPurposeOnly = require('./local_storage_clear_dev');
const storage = new LocalStorageClearDevPurposeOnly(storagePath)

const demoRun = async () => {
  //prepare first time. If userdata exist, this will throw an error and move on
  try {
    await WhatsDapp.prepareEmptyStorage(MNEMONIC, IDENTITY, storage, "53cur3p455w0rd");
  } catch (e) {
    console.log("Storage seems to be initiated already. Try to move on...")
  }

  //optionally an new identity and a generic profile will be created
  const messenger = await WhatsDapp.createWhatsDapp(storage, "53cur3p455w0rd");

  //define listener function
  const newMsgArrived=async (msg, interlocutor)=>{
    //DO SOMETHING
    console.log("New message arrived:",msg);
  }

  //connect event
  messenger.on(WhatsDappEvent.NewIncomingMessage, newMsgArrived)

  //start polling for new messages
  messenger.startPolling();
}
demoRun();
```

## Test with Echo-Bot

<img alt="WhatsDapp Echo-Bot" src="https://github.com/realKidDouglas/whatsdapp-chatbot/raw/main/images/whatsDapp_EchoBot.png" height="50">

The [WhatsDapp Echo-Bot](https://github.com/realKidDouglas/whatsdapp-chatbot) answering on each of your messages.
This is quite convenient for tests.
See how-to and address of a running instance in its repo.

## Loss of private Keys

If you loose your storage, remote profile is useless since we don't have the private keys to do anything. 
In this case run:
```
await messenger.discardOldProfileAndCreateNew()
```
This will remove the old profile from Drive, so nobody can retrieve invalid keys.
After that a new keybundle will be created and a new profile uploaded, so you can start over again.

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

## Data Contracts
There are two data contracts we use:
- `profile`: WhatsDapp profiles conatining the signal keybundle and
- `message`: Container for the encrypted messages

You can find them in `src/dapi/dash_client/Contracts.ts`


# Pitfalls

- You cannot write yourself ;)  
  That's not provided by `libsignal`
  
- Messages you receive are not validated yet, just decrypted and displayed. We need to think about XSS protection.

# Used packages

- Node implementation of signal library: https://github.com/ForstaLabs/libsignal-node
  - The official [js signal-protocol](https://github.com/signalapp/libsignal-protocol-javascript) 
  needs crypto-feature of a browser and is not suitable for node.
- [Dash SDK](https://github.com/dashevo/js-dash-sdk)

## Why Signal?
Storing private messages in the blockchain *forever* is risky.
For that we chose Signal protocol for its forward- and backward-secrecy. 
This way it’s not possible to find any previous or future keys from one compromised message-key. 
The basis is a double-key-ratchet that generates new keys for every message of each session. 
One ratchet performs extended triple Diffie-Hellman (X3DH) based on EC. 
There are 4 keypairs used for generating session key. 
This session key then runs through a hash-ratchet that generates new keys for each message. 
Each message will be encrypted AES-256 with kind of HMAC with an unique key. 
For further well-arranged protocol info see https://signal.org/docs/specifications/x3dh/ .


# Links
- The prototype of our reference implementation Dapp you'll find here: 
  https://github.com/realKidDouglas/whatsdapp-ui-example
  _This is outdated and we're currently on an Ionic app using our lib._
- There will be several variants of obfuscation in future. 
  Find details in our [concept](https://docs.google.com/document/d/e/2PACX-1vSFlK-EMX8ItSCOH4cqDLcNncb--vzK2EI-3xzjWPwwbM9IGRj4j4wabeyc7QlZ_E1iSjReXZkC7VMr/pub).


# License
[Licensed under the MIT License](https://opensource.org/licenses/MIT).

Note that the [signal-protocol lib](https://www.npmjs.com/package/libsignal) we currently use is licensed under the [GPLv3](http://www.gnu.org/licenses/gpl-3.0.html).

