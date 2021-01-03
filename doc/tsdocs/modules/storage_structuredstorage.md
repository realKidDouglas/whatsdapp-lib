[whatsdapp](../README.md) / [Exports](../modules.md) / storage/StructuredStorage

# Module: storage/StructuredStorage

## Index

### Classes

* [StructuredStorage](../classes/storage_structuredstorage.structuredstorage.md)

### Type aliases

* [KVStore](storage_structuredstorage.md#kvstore)
* [SessionMetaData](storage_structuredstorage.md#sessionmetadata)

## Type aliases

### KVStore

Ƭ **KVStore**: { `del`: (`key`: *string*) => *void* ; `get`: (`key`: *string*) => *Promise*<*null* \| *Uint8Array*\> ; `set`: (`key`: *string*, `value`: *Uint8Array*) => *void*  }

#### Type declaration:

Name | Type |
------ | ------ |
`del` | (`key`: *string*) => *void* |
`get` | (`key`: *string*) => *Promise*<*null* \| *Uint8Array*\> |
`set` | (`key`: *string*, `value`: *Uint8Array*) => *void* |

Defined in: [src/storage/StructuredStorage.ts:20](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L20)

___

### SessionMetaData

Ƭ **SessionMetaData**: { `chunks`: *Array*<*number*\> ; `identityId`: *string* ; `info`: *any*  }

#### Type declaration:

Name | Type |
------ | ------ |
`chunks` | *Array*<*number*\> |
`identityId` | *string* |
`info` | *any* |

Defined in: [src/storage/StructuredStorage.ts:26](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/storage/StructuredStorage.ts#L26)
