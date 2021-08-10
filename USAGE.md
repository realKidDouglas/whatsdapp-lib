# Usage (Work in Progress)

First you need a storage.
The `whatsdapp-lib` does not come with one, since we want developers to use the storage that best fits their needs.

_Note:_ For now it is probably best to just use the storage bundled with the [whatsdapp-ui-example](https://github.com/realKidDouglas/whatsdapp-ui-example/tree/master/src/node/storage)
as we have not tested the library with anything else.

You also (obviusly) need to import this library.

```
const LocalStorage = require("./storage/local_storage");
const {WhatsDapp, WhatsDappEvent} = require('whatsdapp');
```

## Connecting

### Creating the messenger and storage

First you want to create the storage and the messenger object.
Furthermore, make sure that signals for storage access emitted by the messenger are handled properly.

```
localStorage = new LocalStorage({password, storagePath})
messenger = new WhatsDapp();
messenger.on(WhatsDappEvent.StorageRead, (key, ret) => localStorage.get(key).then(value => ret(value)))
messenger.on(WhatsDappEvent.StorageWrite, (key, value) => localStorage.set(key, value))
messenger.on(WhatsDappEvent.StorageDelete, key => localStorage.set(key, null))
```

Next you need to create an `options` object.
Where these values come frome (i.e. user input, load from storage) is up to you to decide.
This object must contain the following:

* `options.mnemonic`: A Dash mnemonic
* `options.identity`: An identity for the Dash Platform. This is used for identification.
* `options.createDpnsName`: _Is this actually needed???_
* `options.displayname`: The username that should be displayed in the app. Not used for identification.
* `options.preKeyBundle`: The key material for the signal protocol. Can be generated with `messenger.createKeys()`.

After that you can connect:

```
const sessionIds = await storage.getSessions()
const contacts = sessionIds.map(si => ({profile_name: si}))
const lastTimestamp = await storage.getLastTimestamp();
const connectResult = await messenger.connect(Object.assign({}, options, {sessions: contacts, lastTimestamp}));
```

Lastly the user data should be stored.

```
if (! await storage.hasUserData()) {
    let newUsr = {
        mnemonic: options.mnemonic,
        displayName: options.displayname,
        identityAddr: connectResult.identity,
        dpnsName: connectResult.createDpnsName
    }
    await storage.setUserData(newUsr);
}

if (options.createDpnsName && !connectResult.createDpnsName) {
    //user wanted to register a DPNS name, but it didn't work
    //Stop polling because UI will try to reconnect later with new DPNS name
    messenger.disconnect(); //TODO: Doesn't work?
}
```


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
