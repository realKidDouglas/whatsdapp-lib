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

\+ **new WhatsDapp**(`options?`: EventEmitterOptions): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`options?` | EventEmitterOptions |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:41

## Properties

### \_client

• **\_client**: [*DashClient*](../modules/types_dashtypes.md#dashclient) \| *null*= null

Defined in: [lib/WhatsDapp.ts:118](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L118)

___

### \_connection

• **\_connection**: [*WhatsDappConnection*](../modules/whatsdapp.md#whatsdappconnection)

Defined in: [lib/WhatsDapp.ts:115](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L115)

___

### \_lastPollTime

• **\_lastPollTime**: *number*= 0

Defined in: [lib/WhatsDapp.ts:117](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L117)

___

### \_pollTimeout

• **\_pollTimeout**: TimerHandle \| *null*= null

Defined in: [lib/WhatsDapp.ts:116](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L116)

___

### \_profile

• **\_profile**: [*WhatsDappProfile*](dapi_whatsdappprofile.whatsdappprofile.md) \| *null*= null

Defined in: [lib/WhatsDapp.ts:119](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L119)

___

### \_sessions

• **\_sessions**: *Array*<WhatsDappSession\>

Defined in: [lib/WhatsDapp.ts:120](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L120)

___

### initialized

• **initialized**: *Promise*<ConnectResult\> \| *null*= null

Defined in: [lib/WhatsDapp.ts:121](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L121)

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

Defined in: [lib/WhatsDapp.ts:196](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L196)

___

### \_deleteMessages

▸ **_deleteMessages**(`deleteTime`: *number*, `senderid`: *string*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`deleteTime` | *number* |
`senderid` | *string* |

**Returns:** *Promise*<*void*\>

Defined in: [lib/WhatsDapp.ts:213](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L213)

___

### \_getDeleteTimeFromContent

▸ **_getDeleteTimeFromContent**(`content`: *string*): *number*

#### Parameters:

Name | Type |
------ | ------ |
`content` | *string* |

**Returns:** *number*

Defined in: [lib/WhatsDapp.ts:209](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L209)

___

### \_getMessageFromContent

▸ **_getMessageFromContent**(`content`: *string*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`content` | *string* |

**Returns:** *string*

Defined in: [lib/WhatsDapp.ts:205](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L205)

___

### \_getOrCreateSession

▸ **_getOrCreateSession**(`ownerId`: *any*, `senderHandle`: *string*): *Promise*<WhatsDappSession\>

#### Parameters:

Name | Type |
------ | ------ |
`ownerId` | *any* |
`senderHandle` | *string* |

**Returns:** *Promise*<WhatsDappSession\>

Defined in: [lib/WhatsDapp.ts:219](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L219)

___

### \_poll

▸ **_poll**(): *Promise*<*void*\>

_poll is async, if we used an interval we might start a new poll before
the last one was done. that's why _poll sets up the next poll after it's done.

**Returns:** *Promise*<*void*\>

Defined in: [lib/WhatsDapp.ts:174](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L174)

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

Defined in: [lib/WhatsDapp.ts:127](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L127)

___

### createInputMessage

▸ **createInputMessage**(`plaintext`: *string*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`plaintext` | *string* |

**Returns:** *string*

Defined in: [lib/WhatsDapp.ts:275](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L275)

___

### disconnect

▸ **disconnect**(): *void*

**Returns:** *void*

Defined in: [lib/WhatsDapp.ts:285](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L285)

___

### emit

▸ **emit**(`event`: *string* \| *symbol*, ...`args`: *any*[]): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`...args` | *any*[] |

**Returns:** *boolean*

Defined in: node_modules/@types/node/events.d.ts:72

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

▸ **getProfileByName**(`name`: *string*): *Promise*<*null* \| WhatsDappSession\>

#### Parameters:

Name | Type |
------ | ------ |
`name` | *string* |

**Returns:** *Promise*<*null* \| WhatsDappSession\>

Defined in: [lib/WhatsDapp.ts:292](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L292)

___

### getSessions

▸ **getSessions**(): WhatsDappSession[]

**Returns:** WhatsDappSession[]

Defined in: [lib/WhatsDapp.ts:281](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L281)

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

▸ **on**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:63

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

▸ **removeAllListeners**(`event?`: *string* \| *symbol*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event?` | *string* \| *symbol* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:67

___

### removeListener

▸ **removeListener**(`event`: *string* \| *symbol*, `listener`: (...`args`: *any*[]) => *void*): [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

#### Parameters:

Name | Type |
------ | ------ |
`event` | *string* \| *symbol* |
`listener` | (...`args`: *any*[]) => *void* |

**Returns:** [*WhatsDapp*](whatsdapp.whatsdapp-1.md)

Defined in: node_modules/@types/node/events.d.ts:65

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

Defined in: [lib/WhatsDapp.ts:239](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L239)

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
