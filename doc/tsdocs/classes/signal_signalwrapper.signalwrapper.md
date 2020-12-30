[whatsdapp](../README.md) / [Exports](../modules.md) / [signal/SignalWrapper](../modules/signal_signalwrapper.md) / SignalWrapper

# Class: SignalWrapper

## Hierarchy

* **SignalWrapper**

## Index

### Constructors

* [constructor](signal_signalwrapper.signalwrapper.md#constructor)

### Methods

* [\_generatePreKey](signal_signalwrapper.signalwrapper.md#_generateprekey)
* [\_generateSignedPreKey](signal_signalwrapper.signalwrapper.md#_generatesignedprekey)
* [buildAndPersistSession](signal_signalwrapper.signalwrapper.md#buildandpersistsession)
* [decryptMessage](signal_signalwrapper.signalwrapper.md#decryptmessage)
* [encryptMessage](signal_signalwrapper.signalwrapper.md#encryptmessage)
* [generateSignalKeys](signal_signalwrapper.signalwrapper.md#generatesignalkeys)
* [\_b64toCipherText](signal_signalwrapper.signalwrapper.md#_b64tociphertext)

## Constructors

### constructor

\+ **new SignalWrapper**(): [*SignalWrapper*](signal_signalwrapper.signalwrapper.md)

**Returns:** [*SignalWrapper*](signal_signalwrapper.signalwrapper.md)

## Methods

### \_generatePreKey

▸ **_generatePreKey**(): [*SignalPreKey*](../modules/types_libsignal.md#signalprekey)

**Returns:** [*SignalPreKey*](../modules/types_libsignal.md#signalprekey)

Defined in: [lib/signal/SignalWrapper.ts:136](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L136)

___

### \_generateSignedPreKey

▸ **_generateSignedPreKey**(`identityKeyPair`: [*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)): [*SignalSignedPreKey*](../modules/types_libsignal.md#signalsignedprekey)

#### Parameters:

Name | Type |
------ | ------ |
`identityKeyPair` | [*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair) |

**Returns:** [*SignalSignedPreKey*](../modules/types_libsignal.md#signalsignedprekey)

Defined in: [lib/signal/SignalWrapper.ts:141](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L141)

___

### buildAndPersistSession

▸ **buildAndPersistSession**(`whatsDappStore`: *any*, `identifier`: *string*, `preKeyBundle`: [*WhatsDappSignalPrekeyBundle*](../modules/signal_signalwrapper.md#whatsdappsignalprekeybundle)): *Promise*<*void*\>

builds a new outgoing signal session by parsing the preKeyBundle of the
communication partner. This signal session is then persisted.

#### Parameters:

Name | Type |
------ | ------ |
`whatsDappStore` | *any* |
`identifier` | *string* |
`preKeyBundle` | [*WhatsDappSignalPrekeyBundle*](../modules/signal_signalwrapper.md#whatsdappsignalprekeybundle) |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalWrapper.ts:127](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L127)

___

### decryptMessage

▸ **decryptMessage**(`whatsDappStore`: *any*, `senderId`: *string*, `base64`: *string*): *Promise*<*string*\>

decrypts a message from a specific receiver

#### Parameters:

Name | Type |
------ | ------ |
`whatsDappStore` | *any* |
`senderId` | *string* |
`base64` | *string* |

**Returns:** *Promise*<*string*\>

: The original plaintext

Defined in: [lib/signal/SignalWrapper.ts:102](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L102)

___

### encryptMessage

▸ **encryptMessage**(`whatsDappStore`: *any*, `receiverId`: *string*, `plaintext`: *string*): *Promise*<*string*\>

encrypts a given message for a specific receiver

#### Parameters:

Name | Type |
------ | ------ |
`whatsDappStore` | *any* |
`receiverId` | *string* |
`plaintext` | *string* |

**Returns:** *Promise*<*string*\>

: The CipherText object converted into JSON and encoded as Base64

Defined in: [lib/signal/SignalWrapper.ts:85](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L85)

___

### generateSignalKeys

▸ **generateSignalKeys**(): *Promise*<[*WhatsDappSignalKeyBundle*](../modules/signal_signalwrapper.md#whatsdappsignalkeybundle)\>

generate a new WhatsDappSignalKeyBundle containing the public keys of the IdentityKey,
PreKey and SignedPreKey and the RegistationID. This bundle will be made publicly available.
In addition it also contains all the Keypairs (with private key) which are to be stored locally.

**Returns:** *Promise*<[*WhatsDappSignalKeyBundle*](../modules/signal_signalwrapper.md#whatsdappsignalkeybundle)\>

Defined in: [lib/signal/SignalWrapper.ts:55](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L55)

___

### \_b64toCipherText

▸ `Static`**_b64toCipherText**(`b64`: *string*): WhatsDappSignalCipherText

#### Parameters:

Name | Type |
------ | ------ |
`b64` | *string* |

**Returns:** WhatsDappSignalCipherText

Defined in: [lib/signal/SignalWrapper.ts:146](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L146)
