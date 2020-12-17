**[whatsdapp](../README.md)**

> [Globals](../globals.md) / ["WhatsDapp"](../modules/_whatsdapp_.md) / WhatsDapp

# Class: WhatsDapp

## Hierarchy

* EventEmitter

  ↳ **WhatsDapp**

## Index

### Constructors

* [constructor](_whatsdapp_.whatsdapp.md#constructor)

### Properties

* [\_client](_whatsdapp_.whatsdapp.md#_client)
* [\_lastPollTime](_whatsdapp_.whatsdapp.md#_lastpolltime)
* [\_pollTimeout](_whatsdapp_.whatsdapp.md#_polltimeout)
* [\_profile](_whatsdapp_.whatsdapp.md#_profile)
* [\_sessions](_whatsdapp_.whatsdapp.md#_sessions)
* [initialized](_whatsdapp_.whatsdapp.md#initialized)
* [defaultMaxListeners](_whatsdapp_.whatsdapp.md#defaultmaxlisteners)
* [errorMonitor](_whatsdapp_.whatsdapp.md#errormonitor)

### Methods

* [\_broadcastNewMessage](_whatsdapp_.whatsdapp.md#_broadcastnewmessage)
* [\_deleteMessages](_whatsdapp_.whatsdapp.md#_deletemessages)
* [\_getDeleteTimeFromContent](_whatsdapp_.whatsdapp.md#_getdeletetimefromcontent)
* [\_getMessageFromContent](_whatsdapp_.whatsdapp.md#_getmessagefromcontent)
* [\_getOrCreateSession](_whatsdapp_.whatsdapp.md#_getorcreatesession)
* [\_poll](_whatsdapp_.whatsdapp.md#_poll)
* [addListener](_whatsdapp_.whatsdapp.md#addlistener)
* [connect](_whatsdapp_.whatsdapp.md#connect)
* [createInputMessage](_whatsdapp_.whatsdapp.md#createinputmessage)
* [disconnect](_whatsdapp_.whatsdapp.md#disconnect)
* [emit](_whatsdapp_.whatsdapp.md#emit)
* [eventNames](_whatsdapp_.whatsdapp.md#eventnames)
* [getMaxListeners](_whatsdapp_.whatsdapp.md#getmaxlisteners)
* [getProfileByName](_whatsdapp_.whatsdapp.md#getprofilebyname)
* [getSessions](_whatsdapp_.whatsdapp.md#getsessions)
* [listenerCount](_whatsdapp_.whatsdapp.md#listenercount)
* [listeners](_whatsdapp_.whatsdapp.md#listeners)
* [off](_whatsdapp_.whatsdapp.md#off)
* [on](_whatsdapp_.whatsdapp.md#on)
* [once](_whatsdapp_.whatsdapp.md#once)
* [prependListener](_whatsdapp_.whatsdapp.md#prependlistener)
* [prependOnceListener](_whatsdapp_.whatsdapp.md#prependoncelistener)
* [rawListeners](_whatsdapp_.whatsdapp.md#rawlisteners)
* [removeAllListeners](_whatsdapp_.whatsdapp.md#removealllisteners)
* [removeListener](_whatsdapp_.whatsdapp.md#removelistener)
* [sendMessage](_whatsdapp_.whatsdapp.md#sendmessage)
* [setMaxListeners](_whatsdapp_.whatsdapp.md#setmaxlisteners)
* [listenerCount](_whatsdapp_.whatsdapp.md#listenercount)

### Object literals

* [\_connection](_whatsdapp_.whatsdapp.md#_connection)

## Constructors

### constructor

\+ **new WhatsDapp**(`options?`: EventEmitterOptions): [WhatsDapp](_whatsdapp_.whatsdapp.md)

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[constructor](_whatsdapp_.whatsdapp.md#constructor)*

*Defined in node_modules/@types/node/events.d.ts:41*

#### Parameters:

Name | Type |
------ | ------ |
`options?` | EventEmitterOptions |

**Returns:** [WhatsDapp](_whatsdapp_.whatsdapp.md)

## Properties

### \_client

•  **\_client**: [DashClient](../modules/_types_dashtypes_.md#dashclient) \| null = null

*Defined in [lib/WhatsDapp.ts:116](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L116)*

___

### \_lastPollTime

•  **\_lastPollTime**: number = 0

*Defined in [lib/WhatsDapp.ts:115](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L115)*

___

### \_pollTimeout

•  **\_pollTimeout**: [TimerHandle](../modules/_whatsdapp_.md#timerhandle) \| null = null

*Defined in [lib/WhatsDapp.ts:114](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L114)*

___

### \_profile

•  **\_profile**: [WhatsDappProfile](_dapi_whatsdappprofile_.whatsdappprofile.md) \| null = null

*Defined in [lib/WhatsDapp.ts:117](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L117)*

___

### \_sessions

•  **\_sessions**: Array<[WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession)\> = []

*Defined in [lib/WhatsDapp.ts:118](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L118)*

___

### initialized

•  **initialized**: Promise<[ConnectResult](../modules/_whatsdapp_.md#connectresult)\> \| null = null

*Defined in [lib/WhatsDapp.ts:119](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L119)*

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: number

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[defaultMaxListeners](_whatsdapp_.whatsdapp.md#defaultmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:45*

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: unique symbol

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[errorMonitor](_whatsdapp_.whatsdapp.md#errormonitor)*

*Defined in node_modules/@types/node/events.d.ts:55*

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

### \_broadcastNewMessage

▸ **_broadcastNewMessage**(`rawMessage`: [RawMessage](../modules/_whatsdapp_.md#rawmessage)): Promise<void\>

*Defined in [lib/WhatsDapp.ts:188](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L188)*

#### Parameters:

Name | Type |
------ | ------ |
`rawMessage` | [RawMessage](../modules/_whatsdapp_.md#rawmessage) |

**Returns:** Promise<void\>

___

### \_deleteMessages

▸ **_deleteMessages**(`deleteTime`: number, `senderid`: string): Promise<void\>

*Defined in [lib/WhatsDapp.ts:205](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L205)*

#### Parameters:

Name | Type |
------ | ------ |
`deleteTime` | number |
`senderid` | string |

**Returns:** Promise<void\>

___

### \_getDeleteTimeFromContent

▸ **_getDeleteTimeFromContent**(`content`: string): number

*Defined in [lib/WhatsDapp.ts:201](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L201)*

#### Parameters:

Name | Type |
------ | ------ |
`content` | string |

**Returns:** number

___

### \_getMessageFromContent

▸ **_getMessageFromContent**(`content`: string): string

*Defined in [lib/WhatsDapp.ts:197](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L197)*

#### Parameters:

Name | Type |
------ | ------ |
`content` | string |

**Returns:** string

___

### \_getOrCreateSession

▸ **_getOrCreateSession**(`ownerId`: any, `senderHandle`: string): Promise<[WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession)\>

*Defined in [lib/WhatsDapp.ts:210](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L210)*

#### Parameters:

Name | Type |
------ | ------ |
`ownerId` | any |
`senderHandle` | string |

**Returns:** Promise<[WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession)\>

___

### \_poll

▸ **_poll**(): Promise<void\>

*Defined in [lib/WhatsDapp.ts:166](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L166)*

_poll is async, if we used an interval we might start a new poll before
the last one was done. that's why _poll sets up the next poll after it's done.

**Returns:** Promise<void\>

___

### addListener

▸ **addListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[addListener](_whatsdapp_.whatsdapp.md#addlistener)*

*Defined in node_modules/@types/node/events.d.ts:62*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### connect

▸ **connect**(`opts`: [ConnectOptions](../modules/_whatsdapp_.md#connectoptions)): Promise<[ConnectResult](../modules/_whatsdapp_.md#connectresult)\>

*Defined in [lib/WhatsDapp.ts:125](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L125)*

#### Parameters:

Name | Type |
------ | ------ |
`opts` | [ConnectOptions](../modules/_whatsdapp_.md#connectoptions) |

**Returns:** Promise<[ConnectResult](../modules/_whatsdapp_.md#connectresult)\>

>}

___

### createInputMessage

▸ **createInputMessage**(`plaintext`: string): string

*Defined in [lib/WhatsDapp.ts:266](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L266)*

#### Parameters:

Name | Type |
------ | ------ |
`plaintext` | string |

**Returns:** string

___

### disconnect

▸ **disconnect**(): void

*Defined in [lib/WhatsDapp.ts:276](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L276)*

**Returns:** void

___

### emit

▸ **emit**(`event`: string \| symbol, ...`args`: any[]): boolean

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[emit](_whatsdapp_.whatsdapp.md#emit)*

*Defined in node_modules/@types/node/events.d.ts:72*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`...args` | any[] |

**Returns:** boolean

___

### eventNames

▸ **eventNames**(): Array<string \| symbol\>

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[eventNames](_whatsdapp_.whatsdapp.md#eventnames)*

*Defined in node_modules/@types/node/events.d.ts:77*

**Returns:** Array<string \| symbol\>

___

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[getMaxListeners](_whatsdapp_.whatsdapp.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### getProfileByName

▸ **getProfileByName**(`name`: string): Promise<[WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession) \| null\>

*Defined in [lib/WhatsDapp.ts:282](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L282)*

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |

**Returns:** Promise<[WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession) \| null\>

___

### getSessions

▸ **getSessions**(): [WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession)[]

*Defined in [lib/WhatsDapp.ts:272](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L272)*

**Returns:** [WhatsDappSession](../modules/_whatsdapp_.md#whatsdappsession)[]

___

### listenerCount

▸ **listenerCount**(`event`: string \| symbol): number

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[listenerCount](_whatsdapp_.whatsdapp.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:73*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** number

___

### listeners

▸ **listeners**(`event`: string \| symbol): Function[]

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[listeners](_whatsdapp_.whatsdapp.md#listeners)*

*Defined in node_modules/@types/node/events.d.ts:70*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### off

▸ **off**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[off](_whatsdapp_.whatsdapp.md#off)*

*Defined in node_modules/@types/node/events.d.ts:66*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### on

▸ **on**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[on](_whatsdapp_.whatsdapp.md#on)*

*Defined in node_modules/@types/node/events.d.ts:63*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### once

▸ **once**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[once](_whatsdapp_.whatsdapp.md#once)*

*Defined in node_modules/@types/node/events.d.ts:64*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### prependListener

▸ **prependListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[prependListener](_whatsdapp_.whatsdapp.md#prependlistener)*

*Defined in node_modules/@types/node/events.d.ts:75*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### prependOnceListener

▸ **prependOnceListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[prependOnceListener](_whatsdapp_.whatsdapp.md#prependoncelistener)*

*Defined in node_modules/@types/node/events.d.ts:76*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### rawListeners

▸ **rawListeners**(`event`: string \| symbol): Function[]

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[rawListeners](_whatsdapp_.whatsdapp.md#rawlisteners)*

*Defined in node_modules/@types/node/events.d.ts:71*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: string \| symbol): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[removeAllListeners](_whatsdapp_.whatsdapp.md#removealllisteners)*

*Defined in node_modules/@types/node/events.d.ts:67*

#### Parameters:

Name | Type |
------ | ------ |
`event?` | string \| symbol |

**Returns:** this

___

### removeListener

▸ **removeListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[removeListener](_whatsdapp_.whatsdapp.md#removelistener)*

*Defined in node_modules/@types/node/events.d.ts:65*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### sendMessage

▸ **sendMessage**(`receiver`: string, `ciphertext`: string, `plaintext`: string): Promise<void\>

*Defined in [lib/WhatsDapp.ts:230](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L230)*

TODO: instead of indefinitely awaiting init, set
TODO: timeout and reject after some amount
TODO: of time and mark message for retry in GUI

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`receiver` | string | B58? |
`ciphertext` | string |  |
`plaintext` | string |  |

**Returns:** Promise<void\>

___

### setMaxListeners

▸ **setMaxListeners**(`n`: number): this

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[setMaxListeners](_whatsdapp_.whatsdapp.md#setmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:68*

#### Parameters:

Name | Type |
------ | ------ |
`n` | number |

**Returns:** this

___

### listenerCount

▸ `Static`**listenerCount**(`emitter`: EventEmitter, `event`: string \| symbol): number

*Inherited from [WhatsDapp](_whatsdapp_.whatsdapp.md).[listenerCount](_whatsdapp_.whatsdapp.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:44*

**`deprecated`** since v4.0.0

#### Parameters:

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string \| symbol |

**Returns:** number

## Object literals

### \_connection

▪  **\_connection**: object

*Defined in [lib/WhatsDapp.ts:113](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L113)*

#### Properties:

Name | Type | Value |
------ | ------ | ------ |
`identity` | null | null |
`ownerId` | null | null |
`platform` | null | null |
