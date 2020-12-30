[whatsdapp](../README.md) / [Exports](../modules.md) / [types/libsignal](../modules/types_libsignal.md) / SessionRecord

# Class: SessionRecord

## Hierarchy

* **SessionRecord**

## Index

### Constructors

* [constructor](types_libsignal.sessionrecord.md#constructor)

### Methods

* [closeSession](types_libsignal.sessionrecord.md#closesession)
* [deleteAllSessions](types_libsignal.sessionrecord.md#deleteallsessions)
* [getOpenSession](types_libsignal.sessionrecord.md#getopensession)
* [getSession](types_libsignal.sessionrecord.md#getsession)
* [getSessions](types_libsignal.sessionrecord.md#getsessions)
* [haveOpenSession](types_libsignal.sessionrecord.md#haveopensession)
* [isClosed](types_libsignal.sessionrecord.md#isclosed)
* [openSession](types_libsignal.sessionrecord.md#opensession)
* [removeOldSessions](types_libsignal.sessionrecord.md#removeoldsessions)
* [serialize](types_libsignal.sessionrecord.md#serialize)
* [setSession](types_libsignal.sessionrecord.md#setsession)
* [createEntry](types_libsignal.sessionrecord.md#createentry)
* [deserialize](types_libsignal.sessionrecord.md#deserialize)

## Constructors

### constructor

\+ **new SessionRecord**(): [*SessionRecord*](types_libsignal.sessionrecord.md)

**Returns:** [*SessionRecord*](types_libsignal.sessionrecord.md)

## Methods

### closeSession

▸ **closeSession**(`session`: [*SessionEntry*](types_libsignal.sessionentry.md)): *void*

#### Parameters:

Name | Type |
------ | ------ |
`session` | [*SessionEntry*](types_libsignal.sessionentry.md) |

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:40](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L40)

___

### deleteAllSessions

▸ **deleteAllSessions**(): *void*

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:44](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L44)

___

### getOpenSession

▸ **getOpenSession**(): [*SessionEntry*](types_libsignal.sessionentry.md)

**Returns:** [*SessionEntry*](types_libsignal.sessionentry.md)

Defined in: [lib/types/libsignal.d.ts:37](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L37)

___

### getSession

▸ **getSession**(`key`: *Buffer*): [*SessionEntry*](types_libsignal.sessionentry.md)

#### Parameters:

Name | Type |
------ | ------ |
`key` | *Buffer* |

**Returns:** [*SessionEntry*](types_libsignal.sessionentry.md)

Defined in: [lib/types/libsignal.d.ts:36](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L36)

___

### getSessions

▸ **getSessions**(`session`: [*SessionEntry*](types_libsignal.sessionentry.md)): [*SessionEntry*](types_libsignal.sessionentry.md)[]

#### Parameters:

Name | Type |
------ | ------ |
`session` | [*SessionEntry*](types_libsignal.sessionentry.md) |

**Returns:** [*SessionEntry*](types_libsignal.sessionentry.md)[]

Defined in: [lib/types/libsignal.d.ts:39](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L39)

___

### haveOpenSession

▸ **haveOpenSession**(): *any*

**Returns:** *any*

Defined in: [lib/types/libsignal.d.ts:35](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L35)

___

### isClosed

▸ **isClosed**(`session`: [*SessionEntry*](types_libsignal.sessionentry.md)): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`session` | [*SessionEntry*](types_libsignal.sessionentry.md) |

**Returns:** *boolean*

Defined in: [lib/types/libsignal.d.ts:42](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L42)

___

### openSession

▸ **openSession**(`session`: [*SessionEntry*](types_libsignal.sessionentry.md)): *void*

#### Parameters:

Name | Type |
------ | ------ |
`session` | [*SessionEntry*](types_libsignal.sessionentry.md) |

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L41)

___

### removeOldSessions

▸ **removeOldSessions**(): *void*

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:43](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L43)

___

### serialize

▸ **serialize**(): *unknown*

**Returns:** *unknown*

Defined in: [lib/types/libsignal.d.ts:32](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L32)

___

### setSession

▸ **setSession**(`session`: [*SessionEntry*](types_libsignal.sessionentry.md)): *void*

#### Parameters:

Name | Type |
------ | ------ |
`session` | [*SessionEntry*](types_libsignal.sessionentry.md) |

**Returns:** *void*

Defined in: [lib/types/libsignal.d.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L38)

___

### createEntry

▸ `Static`**createEntry**(): [*SessionEntry*](types_libsignal.sessionentry.md)

**Returns:** [*SessionEntry*](types_libsignal.sessionentry.md)

Defined in: [lib/types/libsignal.d.ts:34](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L34)

___

### deserialize

▸ `Static`**deserialize**(`data`: *unknown*): [*SessionRecord*](types_libsignal.sessionrecord.md)

#### Parameters:

Name | Type |
------ | ------ |
`data` | *unknown* |

**Returns:** [*SessionRecord*](types_libsignal.sessionrecord.md)

Defined in: [lib/types/libsignal.d.ts:33](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L33)
