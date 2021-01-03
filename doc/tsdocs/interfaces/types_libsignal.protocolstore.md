[whatsdapp](../README.md) / [Exports](../modules.md) / [types/libsignal](../modules/types_libsignal.md) / ProtocolStore

# Interface: ProtocolStore

## Hierarchy

* **ProtocolStore**

## Implemented by

* [*SignalProtocolStore*](../classes/signal_signalprotocolstorewrapper.signalprotocolstore.md)

## Index

### Properties

* [getOurIdentity](types_libsignal.protocolstore.md#getouridentity)
* [getOurRegistrationId](types_libsignal.protocolstore.md#getourregistrationid)
* [isTrustedIdentity](types_libsignal.protocolstore.md#istrustedidentity)
* [loadIdentityKey](types_libsignal.protocolstore.md#loadidentitykey)
* [loadPreKey](types_libsignal.protocolstore.md#loadprekey)
* [loadSession](types_libsignal.protocolstore.md#loadsession)
* [loadSignedPreKey](types_libsignal.protocolstore.md#loadsignedprekey)
* [removePreKey](types_libsignal.protocolstore.md#removeprekey)
* [removeSignedPreKey](types_libsignal.protocolstore.md#removesignedprekey)
* [saveIdentity](types_libsignal.protocolstore.md#saveidentity)
* [storePreKey](types_libsignal.protocolstore.md#storeprekey)
* [storeSession](types_libsignal.protocolstore.md#storesession)
* [storeSignedPreKey](types_libsignal.protocolstore.md#storesignedprekey)

## Properties

### getOurIdentity

• **getOurIdentity**: () => *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

Defined in: [src/types/libsignal.d.ts:48](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L48)

___

### getOurRegistrationId

• **getOurRegistrationId**: () => *Promise*<*number*\>

Defined in: [src/types/libsignal.d.ts:49](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L49)

___

### isTrustedIdentity

• **isTrustedIdentity**: (`identifier`: *string*, `identityKey`: ArrayBuffer, `\_direction`: *number*) => *Promise*<*boolean*\>

Defined in: [src/types/libsignal.d.ts:50](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L50)

___

### loadIdentityKey

• **loadIdentityKey**: (`identifier`: *string*) => *Promise*<*void*\>

Defined in: [src/types/libsignal.d.ts:51](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L51)

___

### loadPreKey

• **loadPreKey**: (`keyId`: *number*) => *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

Defined in: [src/types/libsignal.d.ts:53](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L53)

___

### loadSession

• **loadSession**: (`identifier`: *string*) => *Promise*<[*SessionRecord*](../classes/types_libsignal.sessionrecord.md) \| *null*\>

Defined in: [src/types/libsignal.d.ts:59](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L59)

___

### loadSignedPreKey

• **loadSignedPreKey**: (`keyId`: *number*) => *Promise*<[*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)\>

Defined in: [src/types/libsignal.d.ts:56](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L56)

___

### removePreKey

• **removePreKey**: (`keyId`: *number*) => *Promise*<*void*\>

Defined in: [src/types/libsignal.d.ts:55](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L55)

___

### removeSignedPreKey

• **removeSignedPreKey**: (`keyId`: *number*) => *Promise*<*void*\>

Defined in: [src/types/libsignal.d.ts:58](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L58)

___

### saveIdentity

• **saveIdentity**: (`identifier`: *string*, `identityKey`: ArrayBuffer) => *Promise*<*boolean*\>

Defined in: [src/types/libsignal.d.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L52)

___

### storePreKey

• **storePreKey**: (`keyId`: *number*, `keyPair`: [*SignalKeyPair*](../modules/types_libsignal.md#signalkeypair)) => *Promise*<*void*\>

Defined in: [src/types/libsignal.d.ts:54](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L54)

___

### storeSession

• **storeSession**: (`identifier`: *string*, `record`: [*SessionRecord*](../classes/types_libsignal.sessionrecord.md)) => *Promise*<*void*\>

Defined in: [src/types/libsignal.d.ts:60](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L60)

___

### storeSignedPreKey

• **storeSignedPreKey**: (`keyId`: *number*, `keyPair`: [*SignalSignedPreKey*](../modules/types_libsignal.md#signalsignedprekey)) => *Promise*<*void*\>

Defined in: [src/types/libsignal.d.ts:57](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/libsignal.d.ts#L57)
