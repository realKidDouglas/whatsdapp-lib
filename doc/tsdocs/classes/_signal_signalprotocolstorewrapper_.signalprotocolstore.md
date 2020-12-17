**[whatsdapp](../README.md)**

> [Globals](../globals.md) / ["signal/SignalProtocolStoreWrapper"](../modules/_signal_signalprotocolstorewrapper_.md) / SignalProtocolStore

# Class: SignalProtocolStore

## Hierarchy

* **SignalProtocolStore**

## Implements

* ProtocolStore

## Index

### Constructors

* [constructor](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#constructor)

### Properties

* [\_keyPairs](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#_keypairs)
* [remoteIdentity](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#remoteidentity)
* [store](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#store)

### Methods

* [\_getDeviceId](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#_getdeviceid)
* [get](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#get)
* [getOurIdentity](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#getouridentity)
* [getOurRegistrationId](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#getourregistrationid)
* [isTrustedIdentity](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#istrustedidentity)
* [loadIdentityKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#loadidentitykey)
* [loadPreKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#loadprekey)
* [loadSession](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#loadsession)
* [loadSignedPreKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#loadsignedprekey)
* [remove](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#remove)
* [removePreKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#removeprekey)
* [removeSignedPreKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#removesignedprekey)
* [saveIdentity](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#saveidentity)
* [storePreKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#storeprekey)
* [storeSession](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#storesession)
* [storeSignedPreKey](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#storesignedprekey)

### Object literals

* [Direction](_signal_signalprotocolstorewrapper_.signalprotocolstore.md#direction)

## Constructors

### constructor

\+ **new SignalProtocolStore**(`store`: any, `remoteIdentity`: string): [SignalProtocolStore](_signal_signalprotocolstorewrapper_.signalprotocolstore.md)

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L13)*

#### Parameters:

Name | Type |
------ | ------ |
`store` | any |
`remoteIdentity` | string |

**Returns:** [SignalProtocolStore](_signal_signalprotocolstorewrapper_.signalprotocolstore.md)

## Properties

### \_keyPairs

•  **\_keyPairs**: { [key:string]: SignalKeyPair;  }

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L13)*

___

### remoteIdentity

•  **remoteIdentity**: string

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:12](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L12)*

___

### store

•  **store**: any

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:11](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L11)*

## Methods

### \_getDeviceId

▸ **_getDeviceId**(`identifier`: string): number

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:21](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L21)*

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | string |

**Returns:** number

___

### get

▸ **get**(`id`: string): SignalKeyPair

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:151](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L151)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |

**Returns:** SignalKeyPair

___

### getOurIdentity

▸ **getOurIdentity**(): Promise<SignalKeyPair\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:28](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L28)*

**Returns:** Promise<SignalKeyPair\>

___

### getOurRegistrationId

▸ **getOurRegistrationId**(): Promise<number\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:33](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L33)*

**Returns:** Promise<number\>

___

### isTrustedIdentity

▸ **isTrustedIdentity**(`identifier`: string, `identityKey`: any, `_direction`: number): Promise<boolean\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L38)*

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | string |
`identityKey` | any |
`_direction` | number |

**Returns:** Promise<boolean\>

___

### loadIdentityKey

▸ **loadIdentityKey**(`identifier`: string): Promise<SignalKeyPair\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L52)*

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | string |

**Returns:** Promise<SignalKeyPair\>

___

### loadPreKey

▸ **loadPreKey**(`_keyId`: number): Promise<SignalKeyPair\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:81](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L81)*

TODO: what's the arg for?

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | number |

**Returns:** Promise<SignalKeyPair\>

___

### loadSession

▸ **loadSession**(`identifier`: string): Promise<SessionRecord \| null\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:114](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L114)*

TODO: find out what's actually returned here

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | string |

**Returns:** Promise<SessionRecord \| null\>

___

### loadSignedPreKey

▸ **loadSignedPreKey**(`_keyId`: number): Promise<SignalKeyPair\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:100](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L100)*

TODO: what's the arg for?

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | number |

**Returns:** Promise<SignalKeyPair\>

___

### remove

▸ **remove**(`id`: string): void

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:157](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L157)*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |

**Returns:** void

___

### removePreKey

▸ **removePreKey**(`_keyId`: number): Promise<void\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:93](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L93)*

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | number |

**Returns:** Promise<void\>

___

### removeSignedPreKey

▸ **removeSignedPreKey**(`keyId`: number): Promise<void\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:109](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L109)*

#### Parameters:

Name | Type |
------ | ------ |
`keyId` | number |

**Returns:** Promise<void\>

___

### saveIdentity

▸ **saveIdentity**(`identifier`: string, `identityKey`: ArrayBuffer): Promise<boolean\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:58](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L58)*

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | string |
`identityKey` | ArrayBuffer |

**Returns:** Promise<boolean\>

___

### storePreKey

▸ **storePreKey**(`_keyId`: number, `keyPair`: SignalKeyPair): Promise<void\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:87](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L87)*

TODO: what's the arg for?

#### Parameters:

Name | Type |
------ | ------ |
`_keyId` | number |
`keyPair` | SignalKeyPair |

**Returns:** Promise<void\>

___

### storeSession

▸ **storeSession**(`identifier`: string, `record`: SessionRecord): Promise<void\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:131](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L131)*

TODO: find out types of record

#### Parameters:

Name | Type |
------ | ------ |
`identifier` | string |
`record` | SessionRecord |

**Returns:** Promise<void\>

___

### storeSignedPreKey

▸ **storeSignedPreKey**(`keyId`: number, `keyPair`: SignalSignedPreKey): Promise<void\>

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:105](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L105)*

#### Parameters:

Name | Type |
------ | ------ |
`keyId` | number |
`keyPair` | SignalSignedPreKey |

**Returns:** Promise<void\>

## Object literals

### Direction

▪ `Static` `Readonly` **Direction**: object

*Defined in [lib/signal/SignalProtocolStoreWrapper.ts:6](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalProtocolStoreWrapper.ts#L6)*

#### Properties:

Name | Type | Value |
------ | ------ | ------ |
`RECEIVING` | number | 2 |
`SENDING` | number | 1 |
