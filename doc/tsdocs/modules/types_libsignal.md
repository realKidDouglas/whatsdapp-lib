[whatsdapp](../README.md) / [Exports](../modules.md) / types/libsignal

# Module: types/libsignal

## Index

### Classes

* [ProtocolAddress](../classes/types_libsignal.protocoladdress.md)
* [SessionBuilder](../classes/types_libsignal.sessionbuilder.md)
* [SessionCipher](../classes/types_libsignal.sessioncipher.md)
* [SessionEntry](../classes/types_libsignal.sessionentry.md)
* [SessionRecord](../classes/types_libsignal.sessionrecord.md)

### Interfaces

* [ProtocolStore](../interfaces/types_libsignal.protocolstore.md)

### Type aliases

* [SerializedSessionEntry](types_libsignal.md#serializedsessionentry)
* [SerializedSessionRecord](types_libsignal.md#serializedsessionrecord)
* [SignalKeyPair](types_libsignal.md#signalkeypair)
* [SignalPreKey](types_libsignal.md#signalprekey)
* [SignalSignedPreKey](types_libsignal.md#signalsignedprekey)

### Variables

* [keyhelper](types_libsignal.md#keyhelper)

## Type aliases

### SerializedSessionEntry

Ƭ **SerializedSessionEntry**: *unknown*

Defined in: [lib/types/libsignal.d.ts:18](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L18)

___

### SerializedSessionRecord

Ƭ **SerializedSessionRecord**: *unknown*

Defined in: [lib/types/libsignal.d.ts:19](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L19)

___

### SignalKeyPair

Ƭ **SignalKeyPair**: { `privateKey`: ArrayBuffer ; `pubKey`: ArrayBuffer  }

#### Type declaration:

Name | Type |
------ | ------ |
`privateKey` | ArrayBuffer |
`pubKey` | ArrayBuffer |

Defined in: [lib/types/libsignal.d.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L13)

___

### SignalPreKey

Ƭ **SignalPreKey**: { `keyId`: *number* ; `keyPair`: [*SignalKeyPair*](types_libsignal.md#signalkeypair)  }

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | *number* |
`keyPair` | [*SignalKeyPair*](types_libsignal.md#signalkeypair) |

Defined in: [lib/types/libsignal.d.ts:8](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L8)

___

### SignalSignedPreKey

Ƭ **SignalSignedPreKey**: [*SignalPreKey*](types_libsignal.md#signalprekey) & { `signature`: ArrayBuffer  }

Defined in: [lib/types/libsignal.d.ts:4](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L4)

## Variables

### keyhelper

• `Const` **keyhelper**: object

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`generateIdentityKeyPair` | function | () => [*SignalKeyPair*](types_libsignal.md#signalkeypair) |
`generatePreKey` | function | (`preKeyId`: *number*) => [*SignalPreKey*](types_libsignal.md#signalprekey) |
`generateRegistrationId` | function | () => *any* |
`generateSignedPreKey` | function | (`identityKeyPair`: [*SignalKeyPair*](types_libsignal.md#signalkeypair), `signedPreKeyId`: *number*) => [*SignalSignedPreKey*](types_libsignal.md#signalsignedprekey) |

Defined in: [lib/types/libsignal.d.ts:63](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L63)
