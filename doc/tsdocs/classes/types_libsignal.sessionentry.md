[whatsdapp](../README.md) / [Exports](../modules.md) / [types/libsignal](../modules/types_libsignal.md) / SessionEntry

# Class: SessionEntry

## Hierarchy

* **SessionEntry**

## Index

### Constructors

* [constructor](types_libsignal.sessionentry.md#constructor)

### Methods

* [addChain](types_libsignal.sessionentry.md#addchain)
* [deleteChain](types_libsignal.sessionentry.md#deletechain)
* [getChain](types_libsignal.sessionentry.md#getchain)
* [inspect](types_libsignal.sessionentry.md#inspect)
* [serialize](types_libsignal.sessionentry.md#serialize)
* [deserialize](types_libsignal.sessionentry.md#deserialize)

## Constructors

### constructor

\+ **new SessionEntry**(): [*SessionEntry*](types_libsignal.sessionentry.md)

**Returns:** [*SessionEntry*](types_libsignal.sessionentry.md)

## Methods

### addChain

▸ **addChain**(`key`: *Buffer*, `value`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`key` | *Buffer* |
`value` | *any* |

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:23](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L23)

___

### deleteChain

▸ **deleteChain**(`key`: *Buffer*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`key` | *Buffer* |

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:25](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L25)

___

### getChain

▸ **getChain**(`key`: *Buffer*, `value`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`key` | *Buffer* |
`value` | *any* |

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:24](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L24)

___

### inspect

▸ **inspect**(): *string*

**Returns:** *string*

Defined in: [lib/types/libsignal.d.ts:22](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L22)

___

### serialize

▸ **serialize**(): *unknown*

**Returns:** *unknown*

Defined in: [lib/types/libsignal.d.ts:27](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L27)

___

### deserialize

▸ `Static`**deserialize**(`data`: *unknown*): [*SessionEntry*](types_libsignal.sessionentry.md)

#### Parameters:

Name | Type |
------ | ------ |
`data` | *unknown* |

**Returns:** [*SessionEntry*](types_libsignal.sessionentry.md)

Defined in: [lib/types/libsignal.d.ts:28](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L28)
