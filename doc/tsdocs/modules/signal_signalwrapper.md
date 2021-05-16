[whatsdapp](../README.md) / [Exports](../modules.md) / signal/SignalWrapper

# Module: signal/SignalWrapper

## Index

### Classes

* [SignalWrapper](../classes/signal_signalwrapper.signalwrapper.md)

### Type aliases

* [WhatsDappSignalKeyBundle](signal_signalwrapper.md#whatsdappsignalkeybundle)
* [WhatsDappSignalPrekeyBundle](signal_signalwrapper.md#whatsdappsignalprekeybundle)
* [WhatsDappSignalPrivateKeys](signal_signalwrapper.md#whatsdappsignalprivatekeys)
* [WhatsDappSignalSignedPreKey](signal_signalwrapper.md#whatsdappsignalsignedprekey)

## Type aliases

### WhatsDappSignalKeyBundle

Ƭ **WhatsDappSignalKeyBundle**: { `preKeyBundle`: [*WhatsDappSignalPrekeyBundle*](signal_signalwrapper.md#whatsdappsignalprekeybundle) ; `private`: [*WhatsDappSignalPrivateKeys*](signal_signalwrapper.md#whatsdappsignalprivatekeys)  }

#### Type declaration:

Name | Type |
------ | ------ |
`preKeyBundle` | [*WhatsDappSignalPrekeyBundle*](signal_signalwrapper.md#whatsdappsignalprekeybundle) |
`private` | [*WhatsDappSignalPrivateKeys*](signal_signalwrapper.md#whatsdappsignalprivatekeys) |

Defined in: [src/signal/SignalWrapper.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/signal/SignalWrapper.ts#L41)

___

### WhatsDappSignalPrekeyBundle

Ƭ **WhatsDappSignalPrekeyBundle**: { `identityKey`: ArrayBuffer ; `preKeys`: { `keyId`: *number* ; `publicKey`: ArrayBuffer  } ; `registrationId`: *number* ; `signedPreKey`: { `keyId`: *number* ; `publicKey`: ArrayBuffer ; `signature`: ArrayBuffer  }  }

#### Type declaration:

Name | Type |
------ | ------ |
`identityKey` | ArrayBuffer |
`preKeys` | { `keyId`: *number* ; `publicKey`: ArrayBuffer  } |
`registrationId` | *number* |
`signedPreKey` | { `keyId`: *number* ; `publicKey`: ArrayBuffer ; `signature`: ArrayBuffer  } |

Defined in: [src/signal/SignalWrapper.ts:30](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/signal/SignalWrapper.ts#L30)

___

### WhatsDappSignalPrivateKeys

Ƭ **WhatsDappSignalPrivateKeys**: { `identityKeyPair`: [*SignalKeyPair*](types_libsignal.md#signalkeypair) ; `preKeys`: [*SignalPreKey*](types_libsignal.md#signalprekey) ; `registrationId`: *number* ; `signedPreKey`: [*SignalSignedPreKey*](types_libsignal.md#signalsignedprekey)  }

#### Type declaration:

Name | Type |
------ | ------ |
`identityKeyPair` | [*SignalKeyPair*](types_libsignal.md#signalkeypair) |
`preKeys` | [*SignalPreKey*](types_libsignal.md#signalprekey) |
`registrationId` | *number* |
`signedPreKey` | [*SignalSignedPreKey*](types_libsignal.md#signalsignedprekey) |

Defined in: [src/signal/SignalWrapper.ts:14](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/signal/SignalWrapper.ts#L14)

___

### WhatsDappSignalSignedPreKey

Ƭ **WhatsDappSignalSignedPreKey**: WhatsDappSignalPreKey & { `signature`: *string*  }

Defined in: [src/signal/SignalWrapper.ts:21](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/signal/SignalWrapper.ts#L21)
