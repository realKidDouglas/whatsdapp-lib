[whatsdapp](../README.md) / [Exports](../modules.md) / [storage/StructuredStorage](../modules/storage_structuredstorage.md) / StructuredStorage

# Class: StructuredStorage

this class provides a translation between a simple
key-value-store and the structured information the library
needs to function.

the keys and values both contain sensitive data and must be
hashed & salted (keys) and/or encrypted (values) by the
library user before being stored.

suggestion:
use a per-device salt with a reasonably expensive, 16-byte password hash/kdf like scrypt for the keys,
symmetrically encrypt the values with aes-256-gcm.

## Hierarchy

* **StructuredStorage**

## Index

### Constructors

* [constructor](storage_structuredstorage.structuredstorage.md#constructor)

### Properties

* [\_metadata](storage_structuredstorage.structuredstorage.md#_metadata)
* [\_privateData](storage_structuredstorage.structuredstorage.md#_privatedata)
* [\_store](storage_structuredstorage.structuredstorage.md#_store)
* [\_userData](storage_structuredstorage.structuredstorage.md#_userdata)

### Methods

* [\_getMessageByTimestamp](storage_structuredstorage.structuredstorage.md#_getmessagebytimestamp)
* [\_loadBlockMap](storage_structuredstorage.structuredstorage.md#_loadblockmap)
* [\_loadMetaData](storage_structuredstorage.structuredstorage.md#_loadmetadata)
* [\_loadPrivateData](storage_structuredstorage.structuredstorage.md#_loadprivatedata)
* [\_loadSessions](storage_structuredstorage.structuredstorage.md#_loadsessions)
* [\_loadUserData](storage_structuredstorage.structuredstorage.md#_loaduserdata)
* [\_saveMetaData](storage_structuredstorage.structuredstorage.md#_savemetadata)
* [\_savePrivateData](storage_structuredstorage.structuredstorage.md#_saveprivatedata)
* [\_saveSessions](storage_structuredstorage.structuredstorage.md#_savesessions)
* [\_saveUserData](storage_structuredstorage.structuredstorage.md#_saveuserdata)
* [addMessageToSession](storage_structuredstorage.structuredstorage.md#addmessagetosession)
* [addSession](storage_structuredstorage.structuredstorage.md#addsession)
* [deleteSession](storage_structuredstorage.structuredstorage.md#deletesession)
* [getLastTimestamp](storage_structuredstorage.structuredstorage.md#getlasttimestamp)
* [getNextMessages](storage_structuredstorage.structuredstorage.md#getnextmessages)
* [getPreviousMessages](storage_structuredstorage.structuredstorage.md#getpreviousmessages)
* [getPrivateData](storage_structuredstorage.structuredstorage.md#getprivatedata)
* [getSessionKeys](storage_structuredstorage.structuredstorage.md#getsessionkeys)
* [getSessions](storage_structuredstorage.structuredstorage.md#getsessions)
* [getUserData](storage_structuredstorage.structuredstorage.md#getuserdata)
* [hasPrivateData](storage_structuredstorage.structuredstorage.md#hasprivatedata)
* [hasSession](storage_structuredstorage.structuredstorage.md#hassession)
* [hasUserData](storage_structuredstorage.structuredstorage.md#hasuserdata)
* [setPrivateData](storage_structuredstorage.structuredstorage.md#setprivatedata)
* [setUserData](storage_structuredstorage.structuredstorage.md#setuserdata)
* [updateSessionKeys](storage_structuredstorage.structuredstorage.md#updatesessionkeys)

## Constructors

### constructor

\+ **new StructuredStorage**(`store`: [*KVStore*](../modules/storage_structuredstorage.md#kvstore)): [*StructuredStorage*](storage_structuredstorage.structuredstorage.md)

create an instance of LocalStorage

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`store` | [*KVStore*](../modules/storage_structuredstorage.md#kvstore) | an object with a set() and a get() function. calls to get() with a key must return the value from the last set() call. if there is none, null must be returned.    |

**Returns:** [*StructuredStorage*](storage_structuredstorage.structuredstorage.md)

Defined in: [src/storage/StructuredStorage.ts:50](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L50)

## Properties

### \_metadata

• **\_metadata**: { [key: string]: [*SessionMetaData*](../modules/storage_structuredstorage.md#sessionmetadata);  } \| *null*

Defined in: [src/storage/StructuredStorage.ts:47](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L47)

___

### \_privateData

• **\_privateData**: [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata) \| *null*

Defined in: [src/storage/StructuredStorage.ts:49](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L49)

___

### \_store

• **\_store**: [*KVStore*](../modules/storage_structuredstorage.md#kvstore)

Defined in: [src/storage/StructuredStorage.ts:50](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L50)

___

### \_userData

• **\_userData**: [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata) \| *null*

Defined in: [src/storage/StructuredStorage.ts:48](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L48)

## Methods

### \_getMessageByTimestamp

▸ `Private`**_getMessageByTimestamp**(`identityId`: *string*, `timestamp`: *number*, `limit`: *number*, `older`: *boolean*): *Promise*<[*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |
`timestamp` | *number* |
`limit` | *number* |
`older` | *boolean* |

**Returns:** *Promise*<[*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)[]\>

Defined in: [src/storage/StructuredStorage.ts:354](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L354)

___

### \_loadBlockMap

▸ `Private`**_loadBlockMap**(`identityId`: *string*): *Promise*<*null* \| [*SessionMetaData*](../modules/storage_structuredstorage.md#sessionmetadata)\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |

**Returns:** *Promise*<*null* \| [*SessionMetaData*](../modules/storage_structuredstorage.md#sessionmetadata)\>

Defined in: [src/storage/StructuredStorage.ts:224](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L224)

___

### \_loadMetaData

▸ `Private`**_loadMetaData**(): *Promise*<{ [key: string]: [*SessionMetaData*](../modules/storage_structuredstorage.md#sessionmetadata);  }\>

**Returns:** *Promise*<{ [key: string]: [*SessionMetaData*](../modules/storage_structuredstorage.md#sessionmetadata);  }\>

Defined in: [src/storage/StructuredStorage.ts:211](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L211)

___

### \_loadPrivateData

▸ `Private`**_loadPrivateData**(): *Promise*<*null* \| [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata)\>

**Returns:** *Promise*<*null* \| [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata)\>

Defined in: [src/storage/StructuredStorage.ts:276](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L276)

___

### \_loadSessions

▸ `Private`**_loadSessions**(): *Promise*<*string*[]\>

**Returns:** *Promise*<*string*[]\>

Defined in: [src/storage/StructuredStorage.ts:199](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L199)

___

### \_loadUserData

▸ `Private`**_loadUserData**(): *Promise*<*null* \| [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata)\>

**Returns:** *Promise*<*null* \| [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata)\>

Defined in: [src/storage/StructuredStorage.ts:312](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L312)

___

### \_saveMetaData

▸ `Private`**_saveMetaData**(`identityId`: *string*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:231](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L231)

___

### \_savePrivateData

▸ `Private`**_savePrivateData**(): *Promise*<*void*\>

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:270](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L270)

___

### \_saveSessions

▸ `Private`**_saveSessions**(): *Promise*<*void*\>

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:206](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L206)

___

### \_saveUserData

▸ `Private`**_saveUserData**(): *Promise*<*void*\>

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:307](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L307)

___

### addMessageToSession

▸ **addMessageToSession**(`identityId`: *string*, `message`: [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |
`message` | [*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md) |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:104](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L104)

___

### addSession

▸ **addSession**(`identityId`: *string*, `device`: *string*, `info`: *any*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |
`device` | *string* |
`info` | *any* |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:85](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L85)

___

### deleteSession

▸ **deleteSession**(`identityId`: *string*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:162](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L162)

___

### getLastTimestamp

▸ **getLastTimestamp**(): *Promise*<*number*\>

**Returns:** *Promise*<*number*\>

Defined in: [src/storage/StructuredStorage.ts:185](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L185)

___

### getNextMessages

▸ **getNextMessages**(`identityId`: *string*, `timestamp?`: *number*, `limit?`: *number*): *Promise*<[*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)[]\>

return a list of promises of messages, starting at a timestamp.
will not return a message that was sent exactly at timestamp.

usage: to get the next chunk of messages when the user is scrolling down
simply call this with the timestamp of the newest message that's currently loaded.

if there are not enough messages to return, remaining promises will be resolved with null.

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`identityId` | *string* | - |
`timestamp` | *number* | 0 |
`limit` | *number* | ... |

**Returns:** *Promise*<[*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)[]\>

Defined in: [src/storage/StructuredStorage.ts:350](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L350)

___

### getPreviousMessages

▸ **getPreviousMessages**(`identityId`: *string*, `timestamp?`: *number*, `limit?`: *number*): *Promise*<[*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)[]\>

return a list of promises of messages, starting at a timestamp.
will not return a message that was sent exactly at timestamp.

usage: to get the next chunk of messages when the user is scrolling up,
simply call this with the timestamp of the oldest message that's currently loaded.

if there are not enough messages to return, remaining promises will be resolved with null.

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`identityId` | *string* | - |
`timestamp` | *number* | ... |
`limit` | *number* | ... |

**Returns:** *Promise*<[*WhatsDappCipherMessage*](dapi_whatsdappmessage.whatsdappmessage.md)[]\>

Defined in: [src/storage/StructuredStorage.ts:335](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L335)

___

### getPrivateData

▸ **getPrivateData**(): *Promise*<*null* \| [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata)\>

**Returns:** *Promise*<*null* \| [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata)\>

Defined in: [src/storage/StructuredStorage.ts:258](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L258)

___

### getSessionKeys

▸ **getSessionKeys**(`identityId`: *string*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |

**Returns:** *Promise*<*any*\>

Defined in: [src/storage/StructuredStorage.ts:65](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L65)

___

### getSessions

▸ **getSessions**(): *Promise*<*string*[]\>

**Returns:** *Promise*<*string*[]\>

Defined in: [src/storage/StructuredStorage.ts:178](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L178)

___

### getUserData

▸ **getUserData**(): *Promise*<*null* \| [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata)\>

**Returns:** *Promise*<*null* \| [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata)\>

Defined in: [src/storage/StructuredStorage.ts:300](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L300)

___

### hasPrivateData

▸ **hasPrivateData**(): *Promise*<*boolean*\>

**Returns:** *Promise*<*boolean*\>

Defined in: [src/storage/StructuredStorage.ts:265](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L265)

___

### hasSession

▸ **hasSession**(`identityId`: *string*): *Promise*<*boolean*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/storage/StructuredStorage.ts:155](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L155)

___

### hasUserData

▸ **hasUserData**(): *Promise*<*boolean*\>

**Returns:** *Promise*<*boolean*\>

Defined in: [src/storage/StructuredStorage.ts:288](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L288)

___

### setPrivateData

▸ **setPrivateData**(`data`: [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata)): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`data` | [*WhatsDappPrivateData*](../modules/whatsdapp.md#whatsdappprivatedata) |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:253](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L253)

___

### setUserData

▸ **setUserData**(`data`: [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata)): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`data` | [*WhatsDappUserData*](../modules/whatsdapp.md#whatsdappuserdata) |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:295](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L295)

___

### updateSessionKeys

▸ **updateSessionKeys**(`identityId`: *string*, `device`: *string*, `info`: *any*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`identityId` | *string* |
`device` | *string* |
`info` | *any* |

**Returns:** *Promise*<*void*\>

Defined in: [src/storage/StructuredStorage.ts:73](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L73)
