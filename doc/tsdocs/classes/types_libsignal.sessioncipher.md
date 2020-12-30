[whatsdapp](../README.md) / [Exports](../modules.md) / [types/libsignal](../modules/types_libsignal.md) / SessionCipher

# Class: SessionCipher

## Hierarchy

* **SessionCipher**

## Index

### Constructors

* [constructor](types_libsignal.sessioncipher.md#constructor)

### Methods

* [decryptPreKeyWhisperMessage](types_libsignal.sessioncipher.md#decryptprekeywhispermessage)
* [decryptWhisperMessage](types_libsignal.sessioncipher.md#decryptwhispermessage)
* [encrypt](types_libsignal.sessioncipher.md#encrypt)

## Constructors

### constructor

\+ **new SessionCipher**(`store`: *any*, `address`: [*ProtocolAddress*](types_libsignal.protocoladdress.md)): [*SessionCipher*](types_libsignal.sessioncipher.md)

#### Parameters:

Name | Type |
------ | ------ |
`store` | *any* |
`address` | [*ProtocolAddress*](types_libsignal.protocoladdress.md) |

**Returns:** [*SessionCipher*](types_libsignal.sessioncipher.md)

Defined in: [lib/types/libsignal.d.ts:78](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L78)

## Methods

### decryptPreKeyWhisperMessage

▸ **decryptPreKeyWhisperMessage**(`buf`: *Buffer*, `encoding`: *string*): *Promise*<ArrayBuffer\>

#### Parameters:

Name | Type |
------ | ------ |
`buf` | *Buffer* |
`encoding` | *string* |

**Returns:** *Promise*<ArrayBuffer\>

Defined in: [lib/types/libsignal.d.ts:81](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L81)

___

### decryptWhisperMessage

▸ **decryptWhisperMessage**(`buf`: *Buffer*, `encoding`: *string*): *Promise*<ArrayBuffer\>

#### Parameters:

Name | Type |
------ | ------ |
`buf` | *Buffer* |
`encoding` | *string* |

**Returns:** *Promise*<ArrayBuffer\>

Defined in: [lib/types/libsignal.d.ts:82](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L82)

___

### encrypt

▸ **encrypt**(`plaintextBuffer`: *Buffer*): ArrayBuffer

#### Parameters:

Name | Type |
------ | ------ |
`plaintextBuffer` | *Buffer* |

**Returns:** ArrayBuffer

Defined in: [lib/types/libsignal.d.ts:80](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L80)
