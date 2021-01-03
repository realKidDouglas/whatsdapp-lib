[whatsdapp](../README.md) / [Exports](../modules.md) / storage/StructuredStorageUtils

# Module: storage/StructuredStorageUtils

## Index

### Functions

* [getTargetChunkIndex](storage_structuredstorageutils.md#gettargetchunkindex)
* [insertMessageToChunk](storage_structuredstorageutils.md#insertmessagetochunk)
* [isChunk](storage_structuredstorageutils.md#ischunk)
* [isSerializedBuffer](storage_structuredstorageutils.md#isserializedbuffer)
* [isWhatsDappPrivateData](storage_structuredstorageutils.md#iswhatsdappprivatedata)
* [isWhatsDappUserData](storage_structuredstorageutils.md#iswhatsdappuserdata)
* [makeChunkKey](storage_structuredstorageutils.md#makechunkkey)
* [makeMetadataKey](storage_structuredstorageutils.md#makemetadatakey)
* [objectToUint8Array](storage_structuredstorageutils.md#objecttouint8array)
* [restoreBuffers](storage_structuredstorageutils.md#restorebuffers)
* [uint8ArrayToObject](storage_structuredstorageutils.md#uint8arraytoobject)

## Functions

### getTargetChunkIndex

▸ **getTargetChunkIndex**(`timestamp`: *number*, `chunks`: *number*[]): *number*

get a chunk a timestamp would lie in. assumes that
the first chunk starts at 0.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`timestamp` | *number* | timestamp to sort   |
`chunks` | *number*[] | array of timestamps   |

**Returns:** *number*

index of the last chunk that starts
before the timestamp.

Defined in: [src/storage/StructuredStorageUtils.ts:80](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L80)

___

### insertMessageToChunk

▸ **insertMessageToChunk**(`timestamp`: *number*, `newEntry`: *string*, `histChunk`: *string*[]): *string*[]

place a string at the appropriate location in a history chunk

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`timestamp` | *number* | location associated with the string   |
`newEntry` | *string* | value of the new string   |
`histChunk` | *string*[] | array to insert into    |

**Returns:** *string*[]

Defined in: [src/storage/StructuredStorageUtils.ts:90](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L90)

___

### isChunk

▸ **isChunk**(`obj`: *any*): obj is string[]

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *any* |

**Returns:** obj is string[]

Defined in: [src/storage/StructuredStorageUtils.ts:68](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L68)

___

### isSerializedBuffer

▸ **isSerializedBuffer**(`obj`: *Record*<*string*, *unknown*\>): obj is object

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *Record*<*string*, *unknown*\> |

**Returns:** obj is object

Defined in: [src/storage/StructuredStorageUtils.ts:46](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L46)

___

### isWhatsDappPrivateData

▸ **isWhatsDappPrivateData**(`obj`: *null* \| *Record*<*string*, *unknown*\>): obj is WhatsDappPrivateData

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *null* \| *Record*<*string*, *unknown*\> |

**Returns:** obj is WhatsDappPrivateData

Defined in: [src/storage/StructuredStorageUtils.ts:50](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L50)

___

### isWhatsDappUserData

▸ **isWhatsDappUserData**(`obj`: *null* \| *Record*<*string*, *unknown*\>): obj is WhatsDappUserData

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *null* \| *Record*<*string*, *unknown*\> |

**Returns:** obj is WhatsDappUserData

Defined in: [src/storage/StructuredStorageUtils.ts:59](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L59)

___

### makeChunkKey

▸ **makeChunkKey**(`id`: *string*, `num`: *number*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`id` | *string* |
`num` | *number* |

**Returns:** *string*

Defined in: [src/storage/StructuredStorageUtils.ts:22](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L22)

___

### makeMetadataKey

▸ **makeMetadataKey**(`id`: *string*): *string*

todo: find a way to make this return a nominal type

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | *string* |     |

**Returns:** *string*

Defined in: [src/storage/StructuredStorageUtils.ts:18](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L18)

___

### objectToUint8Array

▸ **objectToUint8Array**(`obj`: *unknown*): *Uint8Array*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *unknown* |

**Returns:** *Uint8Array*

Defined in: [src/storage/StructuredStorageUtils.ts:4](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L4)

___

### restoreBuffers

▸ **restoreBuffers**(`obj`: *any*): *any*

TODO: make platform-agnostic/superfluous by replacing everything that uses buffers
takes a pojo that may have deserialized buffers of the form {type: 'Buffer', data: Array<number>}
should probably be part of our deserialize-logic

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`obj` | *any* | that can contain buffers    |

**Returns:** *any*

Defined in: [src/storage/StructuredStorageUtils.ts:32](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L32)

___

### uint8ArrayToObject

▸ **uint8ArrayToObject**(`arr`: *Uint8Array*): *unknown*

#### Parameters:

Name | Type |
------ | ------ |
`arr` | *Uint8Array* |

**Returns:** *unknown*

Defined in: [src/storage/StructuredStorageUtils.ts:9](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorageUtils.ts#L9)
