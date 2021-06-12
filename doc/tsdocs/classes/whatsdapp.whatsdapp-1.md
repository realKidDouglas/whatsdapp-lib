[whatsdapp](../README.md) / [Exports](../modules.md) / [WhatsDapp](../modules/whatsdapp.md) / WhatsDapp

# Class: WhatsDapp

## Hierarchy

* *EventEmitter*

  ↳ **WhatsDapp**

## Index

### Constructors

* [constructor](whatsdapp.whatsdapp-1.md#constructor)

### Properties

* [\_client](whatsdapp.whatsdapp-1.md#_client)
* [\_connection](whatsdapp.whatsdapp-1.md#_connection)
* [\_lastPollTime](whatsdapp.whatsdapp-1.md#_lastpolltime)
* [\_pollTimeout](whatsdapp.whatsdapp-1.md#_polltimeout)
* [\_profile](whatsdapp.whatsdapp-1.md#_profile)
* [\_sessions](whatsdapp.whatsdapp-1.md#_sessions)
* [initialized](whatsdapp.whatsdapp-1.md#initialized)
* [storage](whatsdapp.whatsdapp-1.md#storage)
* [defaultMaxListeners](whatsdapp.whatsdapp-1.md#defaultmaxlisteners)
* [errorMonitor](whatsdapp.whatsdapp-1.md#errormonitor)

### Methods

* [\_broadcastNewMessage](whatsdapp.whatsdapp-1.md#_broadcastnewmessage)
* [\_deleteMessages](whatsdapp.whatsdapp-1.md#_deletemessages)
* [\_getDeleteTimeFromContent](whatsdapp.whatsdapp-1.md#_getdeletetimefromcontent)
* [\_getMessageFromContent](whatsdapp.whatsdapp-1.md#_getmessagefromcontent)
* [\_getOrCreateSession](whatsdapp.whatsdapp-1.md#_getorcreatesession)
* [\_poll](whatsdapp.whatsdapp-1.md#_poll)
* [addListener](whatsdapp.whatsdapp-1.md#addlistener)
* [connect](whatsdapp.whatsdapp-1.md#connect)
* [createInputMessage](whatsdapp.whatsdapp-1.md#createinputmessage)
* [disconnect](whatsdapp.whatsdapp-1.md#disconnect)
* [emit](whatsdapp.whatsdapp-1.md#emit)
* [eventNames](whatsdapp.whatsdapp-1.md#eventnames)
* [getMaxListeners](whatsdapp.whatsdapp-1.md#getmaxlisteners)
* [getProfileByName](whatsdapp.whatsdapp-1.md#getprofilebyname)
* [getSessions](whatsdapp.whatsdapp-1.md#getsessions)
* [listenerCount](whatsdapp.whatsdapp-1.md#listenercount)
* [listeners](whatsdapp.whatsdapp-1.md#listeners)
* [off](whatsdapp.whatsdapp-1.md#off)
* [on](whatsdapp.whatsdapp-1.md#on)
* [once](whatsdapp.whatsdapp-1.md#once)
* [prependListener](whatsdapp.whatsdapp-1.md#prependlistener)
* [prependOnceListener](whatsdapp.whatsdapp-1.md#prependoncelistener)
* [rawListeners](whatsdapp.whatsdapp-1.md#rawlisteners)
* [removeAllListeners](whatsdapp.whatsdapp-1.md#removealllisteners)
* [removeListener](whatsdapp.whatsdapp-1.md#removelistener)
* [sendMessage](whatsdapp.whatsdapp-1.md#sendmessage)
* [setMaxListeners](whatsdapp.whatsdapp-1.md#setmaxlisteners)
* [listenerCount](whatsdapp.whatsdapp-1.md#listenercount)

## Constructors

### constructor

\+ **new WhatsDapp**(): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:124](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L124)

## Properties

### \_client

• **\_client**: [*DashClient*](../modules/types_dashtypes.md#dashclient) \| *null*= null

Defined in: [src/WhatsDapp.ts:120](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L120)

___

### \_connection

• **\_connection**: [*WhatsDappConnection*](../modules/whatsdapp.md#whatsdappconnection)

Defined in: [src/WhatsDapp.ts:117](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L117)

___

### \_lastPollTime

• **\_lastPollTime**: *number*= 0

Defined in: [src/WhatsDapp.ts:119](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L119)

___

### \_pollTimeout

• **\_pollTimeout**: TimerHandle \| *null*= null

Defined in: [src/WhatsDapp.ts:118](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L118)

___

### \_profile

• **\_profile**: [*WhatsDappProfile*](dapi_whatsdappprofile.whatsdappprofile.md) \| *null*= null

Defined in: [src/WhatsDapp.ts:121](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L121)

___

### \_sessions

• **\_sessions**: *Array*<[*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)\>

Defined in: [src/WhatsDapp.ts:122](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L122)

___

### initialized

• **initialized**: *Promise*<ConnectResult\> \| *null*= null

Defined in: [src/WhatsDapp.ts:123](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L123)

___

### storage

• **storage**: [*StructuredStorage*](storage_structuredstorage.structuredstorage.md)

Defined in: [src/WhatsDapp.ts:124](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L124)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: *number*

Defined in: node_modules/@types/node/events.d.ts:45

___

### errorMonitor

▪ `Readonly` `Static` **errorMonitor**: unique *symbol*

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

Defined in: node_modules/@types/node/events.d.ts:55

## Methods

### \_broadcastNewMessage

▸ **_broadcastNewMessage**(`rawMessage`: [*RawMessage*](../modules/whatsdapp.md#rawmessage)): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`rawMessage` | [*RawMessage*](../modules/whatsdapp.md#rawmessage) |

**Returns:** *Promise*<*void*\>

Defined in: [src/WhatsDapp.ts:210](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L210)

___

### \_deleteMessages

▸ **_deleteMessages**(`deleteTime`: *number*, `senderid`: *string*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`deleteTime` | *number* |
`senderid` | *string* |

**Returns:** *Promise*<*void*\>

Defined in: [src/WhatsDapp.ts:228](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L228)

___

### \_getDeleteTimeFromContent

▸ **_getDeleteTimeFromContent**(`content`: *string*): *number*

#### Parameters:

Name | Type |
------ | ------ |
`content` | *string* |

**Returns:** *number*

Defined in: [src/WhatsDapp.ts:224](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L224)

___

### \_getMessageFromContent

▸ **_getMessageFromContent**(`content`: *string*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`content` | *string* |

**Returns:** *string*

Defined in: [src/WhatsDapp.ts:220](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L220)

___

### \_getOrCreateSession

▸ **_getOrCreateSession**(`ownerId`: *any*, `senderHandle`: *string*): *Promise*<[*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)\>

#### Parameters:

Name | Type |
------ | ------ |
`ownerId` | *any* |
`senderHandle` | *string* |

**Returns:** *Promise*<[*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)\>

Defined in: [src/WhatsDapp.ts:234](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L234)

___

### \_poll

▸ **_poll**(): *Promise*<*void*\>

_poll is async, if we used an interval we might start a new poll before
the last one was done. that's why _poll sets up the next poll after it's done.

**Returns:** *Promise*<*void*\>

Defined in: [src/WhatsDapp.ts:188](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L188)

___

### addListener

▸ **addListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:62

___

### connect

▸ **connect**(`opts`: ConnectOptions): *Promise*<ConnectResult\>

#### Parameters:

Name | Type |
------ | ------ |
`opts` | ConnectOptions |

**Returns:** *Promise*<ConnectResult\>

>}

Defined in: [src/WhatsDapp.ts:141](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L141)

___

### createInputMessage

▸ **createInputMessage**(`plaintext`: *string*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`plaintext` | *string* |

**Returns:** *string*

Defined in: [src/WhatsDapp.ts:327](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L327)

___

### disconnect

▸ **disconnect**(): *void*

**Returns:** *void*

Defined in: [src/WhatsDapp.ts:337](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L337)

___

### emit

▸ **emit**(`ev`: [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage), `message`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage) |
`message` | [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md) |
`session` | [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession) |

**Returns:** *boolean*

Defined in: [src/WhatsDapp.ts:245](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L245)

▸ **emit**(`ev`: [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession), `session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession), `bundle`: [*RawPreKeyBundle*](../modules/whatsdapp.md#rawprekeybundle)): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession) |
`session` | [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession) |
`bundle` | [*RawPreKeyBundle*](../modules/whatsdapp.md#rawprekeybundle) |

**Returns:** *boolean*

Defined in: [src/WhatsDapp.ts:246](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L246)

▸ **emit**(`ev`: [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent), `wMessage`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: { `identity_receiver`: *any* ; `profile_name`: *any*  }): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent) |
`wMessage` | [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md) |
`session` | { `identity_receiver`: *any* ; `profile_name`: *any*  } |

**Returns:** *boolean*

Defined in: [src/WhatsDapp.ts:247](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L247)

▸ **emit**(`ev`: [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread), `storageKey`: *string*, `ret`: (`val`: *null* \| *Uint8Array*) => *void*): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread) |
`storageKey` | *string* |
`ret` | (`val`: *null* \| *Uint8Array*) => *void* |

**Returns:** *boolean*

Defined in: [src/WhatsDapp.ts:248](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L248)

▸ **emit**(`ev`: [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite), `storageKey`: *string*, `storageValue`: *Uint8Array*): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite) |
`storageKey` | *string* |
`storageValue` | *Uint8Array* |

**Returns:** *boolean*

Defined in: [src/WhatsDapp.ts:249](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L249)

▸ **emit**(`ev`: [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete), `storageKey`: *string*): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete) |
`storageKey` | *string* |

**Returns:** *boolean*

Defined in: [src/WhatsDapp.ts:250](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L250)

___

### eventNames

▸ **eventNames**(): (*string* \| *symbol*)[]

**Returns:** (*string* \| *symbol*)[]

Defined in: node_modules/@types/node/events.d.ts:77

___

### getMaxListeners

▸ **getMaxListeners**(): *number*

**Returns:** *number*

Defined in: node_modules/@types/node/events.d.ts:69

___

### getProfileByName

▸ **getProfileByName**(`name`: *string*): *Promise*<*null* \| [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)\>

#### Parameters:

Name | Type |
------ | ------ |
`name` | *string* |

**Returns:** *Promise*<*null* \| [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)\>

Defined in: [src/WhatsDapp.ts:344](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L344)

___

### getSessions

▸ **getSessions**(): [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)[]

**Returns:** [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)[]

Defined in: [src/WhatsDapp.ts:333](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L333)

___

### listenerCount

▸ **listenerCount**(`event`: *string* \| *symbol*): *number*

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |

**Returns:** *number*

Defined in: node_modules/@types/node/events.d.ts:73

___

### listeners

▸ **listeners**(`event`: *string* \| *symbol*): Function[]

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |

**Returns:** Function[]

Defined in: node_modules/@types/node/events.d.ts:70

___

### off

▸ **off**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:66

___

### on

▸ **on**(`ev`: [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage), `listener`: (`msg`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage) |
`listener` | (`msg`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:255](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L255)

▸ **on**(`ev`: [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession), `listener`: (`session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession), `bundle`: [*RawPreKeyBundle*](../modules/whatsdapp.md#rawprekeybundle)) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession) |
`listener` | (`session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession), `bundle`: [*RawPreKeyBundle*](../modules/whatsdapp.md#rawprekeybundle)) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:256](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L256)

▸ **on**(`ev`: [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent), `listener`: (`wMessage`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: { `identity_receiver`: *any* ; `profile_name`: *any*  }) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent) |
`listener` | (`wMessage`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: { `identity_receiver`: *any* ; `profile_name`: *any*  }) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:257](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L257)

▸ **on**(`ev`: [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread), `listener`: (`storageKey`: *string*, `ret`: (`val`: *null* \| *Uint8Array*) => *void*) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread) |
`listener` | (`storageKey`: *string*, `ret`: (`val`: *null* \| *Uint8Array*) => *void*) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:258](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L258)

▸ **on**(`ev`: [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite), `listener`: (`storageKey`: *string*, `storageValue`: *Uint8Array*) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite) |
`listener` | (`storageKey`: *string*, `storageValue`: *Uint8Array*) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:259](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L259)

▸ **on**(`ev`: [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete), `listener`: (`storageKey`: *string*, `storageValue`: *Uint8Array*) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete) |
`listener` | (`storageKey`: *string*, `storageValue`: *Uint8Array*) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:260](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L260)

___

### once

▸ **once**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:64

___

### prependListener

▸ **prependListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:75

___

### prependOnceListener

▸ **prependOnceListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:76

___

### rawListeners

▸ **rawListeners**(`event`: *string* \| *symbol*): Function[]

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |

**Returns:** Function[]

Defined in: node_modules/@types/node/events.d.ts:71

___

### removeAllListeners

▸ **removeAllListeners**(`ev?`: [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage) \| [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession) \| [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent) \| [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread) \| [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite) \| [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete)): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev?` | [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage) \| [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession) \| [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent) \| [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread) \| [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite) \| [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete) |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:275](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L275)

___

### removeListener

▸ **removeListener**(`ev`: [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage), `listener`: (`msg`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewMessage*](../enums/whatsdapp.whatsdappevent.md#newmessage) |
`listener` | (`msg`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession)) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:265](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L265)

▸ **removeListener**(`ev`: [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession), `listener`: (`session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession), `bundle`: [*RawPreKeyBundle*](../modules/whatsdapp.md#rawprekeybundle)) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewSession*](../enums/whatsdapp.whatsdappevent.md#newsession) |
`listener` | (`session`: [*WhatsDappSession*](../modules/whatsdapp.md#whatsdappsession), `bundle`: [*RawPreKeyBundle*](../modules/whatsdapp.md#rawprekeybundle)) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:266](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L266)

▸ **removeListener**(`ev`: [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent), `listener`: (`wMessage`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: { `identity_receiver`: *any* ; `profile_name`: *any*  }) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*NewMessageSent*](../enums/whatsdapp.whatsdappevent.md#newmessagesent) |
`listener` | (`wMessage`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md), `session`: { `identity_receiver`: *any* ; `profile_name`: *any*  }) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:267](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L267)

▸ **removeListener**(`ev`: [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread), `listener`: (`storageKey`: *string*, `ret`: (`val`: *null* \| *Uint8Array*) => *void*) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageRead*](../enums/whatsdapp.whatsdappevent.md#storageread) |
`listener` | (`storageKey`: *string*, `ret`: (`val`: *null* \| *Uint8Array*) => *void*) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:268](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L268)

▸ **removeListener**(`ev`: [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite), `listener`: (`storageKey`: *string*, `storageValue`: *Uint8Array*) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageWrite*](../enums/whatsdapp.whatsdappevent.md#storagewrite) |
`listener` | (`storageKey`: *string*, `storageValue`: *Uint8Array*) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:269](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L269)

▸ **removeListener**(`ev`: [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete), `listener`: (`storageKey`: *string*) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`ev` | [*StorageDelete*](../enums/whatsdapp.whatsdappevent.md#storagedelete) |
`listener` | (`storageKey`: *string*) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: [src/WhatsDapp.ts:270](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L270)

___

### sendMessage

▸ **sendMessage**(`receiver`: *string*, `ciphertext`: *string*, `plaintext`: *string*): *Promise*<*void*\>

TODO: instead of indefinitely awaiting init, set
TODO: timeout and reject after some amount
TODO: of time and mark message for retry in GUI

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`receiver` | *string* | B58?   |
`ciphertext` | *string* |  |
`plaintext` | *string* |  |

**Returns:** *Promise*<*void*\>

Defined in: [src/WhatsDapp.ts:290](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L290)

___

### setMaxListeners

▸ **setMaxListeners**(`n`: *number*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`n` | *number* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:68

___

### listenerCount

▸ `Static`**listenerCount**(`emitter`: *EventEmitter*, `event`: *string* \| *symbol*): *number*

**`deprecated`** since v4.0.0

#### Parameters:

Name | Type |
------ | ------ |
`emitter` | *EventEmitter* |
`event` | *string* \| *symbol* |

**Returns:** *number*

Defined in: node_modules/@types/node/events.d.ts:44
