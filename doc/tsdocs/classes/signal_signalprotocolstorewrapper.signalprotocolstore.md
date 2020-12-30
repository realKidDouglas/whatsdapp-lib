[whatsdapp](../README.md) / [Exports](../modules.md) / [signal/SignalProtocolStoreWrapper](../modules/signal_signalprotocolstorewrapper.md) / SignalProtocolStore

# Class: SignalProtocolStore

## Hierarchy

* **SignalProtocolStore**

## Implements

* [*ProtocolStore*](../interfaces/types_libsignal.protocolstore.md)

## Index

### Constructors

* [constructor](signal_signalprotocolstorewrapper.signalprotocolstore.md#constructor)

### Properties

* [\_keyPairs](signal_signalprotocolstorewrapper.signalprotocolstore.md#_keypairs)
* [remoteIdentity](signal_signalprotocolstorewrapper.signalprotocolstore.md#remoteidentity)
* [store](signal_signalprotocolstorewrapper.signalprotocolstore.md#store)
* [Direction](signal_signalprotocolstorewrapper.signalprotocolstore.md#direction)

### Methods

* [getOurIdentity](signal_signalprotocolstorewrapper.signalprotocolstore.md#getouridentity)
* [getOurRegistrationId](signal_signalprotocolstorewrapper.signalprotocolstore.md#getourregistrationid)
* [isTrustedIdentity](signal_signalprotocolstorewrapper.signalprotocolstore.md#istrustedidentity)
* [loadIdentityKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#loadidentitykey)
* [loadPreKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#loadprekey)
* [loadSession](signal_signalprotocolstorewrapper.signalprotocolstore.md#loadsession)
* [loadSignedPreKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#loadsignedprekey)
* [removePreKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#removeprekey)
* [removeSignedPreKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#removesignedprekey)
* [saveIdentity](signal_signalprotocolstorewrapper.signalprotocolstore.md#saveidentity)
* [storePreKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#storeprekey)
* [storeSession](signal_signalprotocolstorewrapper.signalprotocolstore.md#storesession)
* [storeSignedPreKey](signal_signalprotocolstorewrapper.signalprotocolstore.md#storesignedprekey)

## Constructors

### constructor

\+ **new SignalProtocolStore**(`store`: *any*, `remoteIdentity`: *string*): [*SignalProtocolStore*](signal_signalprotocolstorewrapper.signalprotocolstore.md)

#### Parameters:

Name | Type |
------ | ------ |
`store` | *any* |
`remoteIdentity` | *string* |

**Returns:** [*SignalProtocolStore*](signal_signalprotocolstorewrapper.signalprotocolstore.md)

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L13)

## Properties

### \_keyPairs

• **\_keyPairs**: { [key: string]: [*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair);  }

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L13)

___

### remoteIdentity

• **remoteIdentity**: *string*

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:12](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L12)

___

### store

• **store**: *any*

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:11](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L11)

___

### Direction

▪ `Readonly` `Static` **Direction**: { `RECEIVING`: *number* = 2; `SENDING`: *number* = 1 }

#### Type declaration:

Name | Type |
------ | ------ |
`RECEIVING` | *number* |
`SENDING` | *number* |

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:6](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L6)

## Methods

### getOurIdentity

▸ **getOurIdentity**(): *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

loads the private IdentityKeyPair from the storage

**Returns:** *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:25](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L25)

___

### getOurRegistrationId

▸ **getOurRegistrationId**(): *Promise*<*number*\>

loads RegistrationID from the storage

**Returns:** *Promise*<*number*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:34](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L34)

___

### isTrustedIdentity

▸ **isTrustedIdentity**(`identifier`: *string*, `identityKey`: *any*, `_direction`: *number*): *Promise*<*boolean*\>

checks whether a given IdentityKey matches the one that is already stored.
If no key is stored, the identityKey is trusted.

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | *string* |
`identityKey` | *any* |
`_direction` | *number* |

**Returns:** *Promise*<*boolean*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:47](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L47)

___

### loadIdentityKey

▸ **loadIdentityKey**(`_identifier`: *string*): *Promise*<*void*\>

this function is part of the signal storage API but is currently not used

#### Parameters:

Name | Type |
------ | ------ |
`_identifier` | *string* |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:75](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L75)

___

### loadPreKey

▸ **loadPreKey**(`_keyId`: *number*): *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

loads the static PreKeyPair from the storage. This will be changed in
the future to support multiple PreKeyPairs.

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | *number* |

**Returns:** *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:108](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L108)

___

### loadSession

▸ **loadSession**(`identifier`: *string*): *Promise*<*null* \| [*SessionRecord*](types_libsignal.sessionrecord.md)\>

loads a persisted session from the storage

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | *string* |

**Returns:** *Promise*<*null* \| [*SessionRecord*](types_libsignal.sessionrecord.md)\>

if a session was found, else {Promise<null>}

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:173](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L173)

___

### loadSignedPreKey

▸ **loadSignedPreKey**(`_keyId`: *number*): *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

loads the static SignedPreKey from the storage. This will be changed in
the future to support SignedPreKey changes.

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | *number* |

**Returns:** *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:140](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L140)

___

### removePreKey

▸ **removePreKey**(`_keyId`: *number*): *Promise*<*void*\>

this function is part of the signal storage API but is currently not used

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | *number* |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:128](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L128)

___

### removeSignedPreKey

▸ **removeSignedPreKey**(`_keyId`: *number*): *Promise*<*void*\>

this function is part of the signal storage API but is currently not used

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | *number* |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:162](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L162)

___

### saveIdentity

▸ **saveIdentity**(`identifier`: *string*, `identityKey`: ArrayBuffer): *Promise*<*boolean*\>

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | *string* |
`identityKey` | ArrayBuffer |

**Returns:** *Promise*<*boolean*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:80](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L80)

___

### storePreKey

▸ **storePreKey**(`_keyId`: *number*, `_keyPair`: [*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)): *Promise*<*void*\>

this function is part of the signal storage API but is currently not used

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | *number* |
`_keyPair` | [*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair) |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:119](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L119)

___

### storeSession

▸ **storeSession**(`identifier`: *string*, `record`: [*SessionRecord*](types_libsignal.sessionrecord.md)): *Promise*<*void*\>

persists a new session state in the storage

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | *string* |
`record` | [*SessionRecord*](types_libsignal.sessionrecord.md) |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:195](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L195)

___

### storeSignedPreKey

▸ **storeSignedPreKey**(`_keyId`: *number*, `_keyPair`: [*SignalSignedPreKey*](../modules/types_libsignal.md#signalsignedprekey)): *Promise*<*void*\>

this function is part of the signal storage API but is currently not used

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | *number* |
`_keyPair` | [*SignalSignedPreKey*](../modules/types_libsignal.md#signalsignedprekey) |

**Returns:** *Promise*<*void*\>

Defined in: [lib/signal/SignalProtocolStoreWrapper.ts:151](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalProtocolStoreWrapper.ts#L151)
