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

Defined in: [lib/signal/SignalWrapper.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L41)

___

### WhatsDappSignalPrekeyBundle

Ƭ **WhatsDappSignalPrekeyBundle**: { `identityKey`: ArrayBuffer ; `preKey`: { `keyId`: *number* ; `publicKey`: ArrayBuffer  } ; `registrationId`: *number* ; `signedPreKey`: { `keyId`: *number* ; `publicKey`: ArrayBuffer ; `signature`: ArrayBuffer  }  }

#### Type declaration:

Name | Type |
------ | ------ |
`identityKey` | ArrayBuffer |
`preKey` | { `keyId`: *number* ; `publicKey`: ArrayBuffer  } |
`registrationId` | *number* |
`signedPreKey` | { `keyId`: *number* ; `publicKey`: ArrayBuffer ; `signature`: ArrayBuffer  } |

Defined in: [lib/signal/SignalWrapper.ts:30](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L30)

___

### WhatsDappSignalPrivateKeys

Ƭ **WhatsDappSignalPrivateKeys**: { `identityKeyPair`: *any* ; `preKey`: *any* ; `registrationId`: *any* ; `signedPreKey`: *any*  }

#### Type declaration:

Name | Type |
------ | ------ |
`identityKeyPair` | *any* |
`preKey` | *any* |
`registrationId` | *any* |
`signedPreKey` | *any* |

Defined in: [lib/signal/SignalWrapper.ts:14](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L14)

___

### WhatsDappSignalSignedPreKey

Ƭ **WhatsDappSignalSignedPreKey**: WhatsDappSignalPreKey & { `signature`: *string*  }

Defined in: [lib/signal/SignalWrapper.ts:21](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/signal/SignalWrapper.ts#L21)
