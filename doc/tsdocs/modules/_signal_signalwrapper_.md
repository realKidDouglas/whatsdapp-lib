**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "signal/SignalWrapper"

# Module: "signal/SignalWrapper"

## Index

### Classes

* [SignalWrapper](../classes/_signal_signalwrapper_.signalwrapper.md)

### Type aliases

* [CipherTextType](_signal_signalwrapper_.md#ciphertexttype)
* [WhatsDappSignalCipherText](_signal_signalwrapper_.md#whatsdappsignalciphertext)
* [WhatsDappSignalKeyBundle](_signal_signalwrapper_.md#whatsdappsignalkeybundle)
* [WhatsDappSignalPreKey](_signal_signalwrapper_.md#whatsdappsignalprekey)
* [WhatsDappSignalPrekeyBundle](_signal_signalwrapper_.md#whatsdappsignalprekeybundle)
* [WhatsDappSignalPrivateKeys](_signal_signalwrapper_.md#whatsdappsignalprivatekeys)
* [WhatsDappSignalSignedPreKey](_signal_signalwrapper_.md#whatsdappsignalsignedprekey)

## Type aliases

### CipherTextType

Ƭ  **CipherTextType**: number

*Defined in [lib/signal/SignalWrapper.ts:5](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L5)*

___

### WhatsDappSignalCipherText

Ƭ  **WhatsDappSignalCipherText**: { body: { data: string  } ; type: [CipherTextType](_signal_signalwrapper_.md#ciphertexttype)  }

*Defined in [lib/signal/SignalWrapper.ts:7](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L7)*

#### Type declaration:

Name | Type |
------ | ------ |
`body` | { data: string  } |
`type` | [CipherTextType](_signal_signalwrapper_.md#ciphertexttype) |

___

### WhatsDappSignalKeyBundle

Ƭ  **WhatsDappSignalKeyBundle**: { preKeyBundle: [WhatsDappSignalPrekeyBundle](_signal_signalwrapper_.md#whatsdappsignalprekeybundle) ; private: [WhatsDappSignalPrivateKeys](_signal_signalwrapper_.md#whatsdappsignalprivatekeys)  }

*Defined in [lib/signal/SignalWrapper.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L41)*

#### Type declaration:

Name | Type |
------ | ------ |
`preKeyBundle` | [WhatsDappSignalPrekeyBundle](_signal_signalwrapper_.md#whatsdappsignalprekeybundle) |
`private` | [WhatsDappSignalPrivateKeys](_signal_signalwrapper_.md#whatsdappsignalprivatekeys) |

___

### WhatsDappSignalPreKey

Ƭ  **WhatsDappSignalPreKey**: { keyId: number ; keyPair: SignalKeyPair  }

*Defined in [lib/signal/SignalWrapper.ts:25](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L25)*

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | number |
`keyPair` | SignalKeyPair |

___

### WhatsDappSignalPrekeyBundle

Ƭ  **WhatsDappSignalPrekeyBundle**: { identityKey: string ; preKey: { keyId: number ; publicKey: string  } ; registrationId: string ; signedPreKey: { keyId: number ; publicKey: string ; signature: string  }  }

*Defined in [lib/signal/SignalWrapper.ts:30](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L30)*

#### Type declaration:

Name | Type |
------ | ------ |
`identityKey` | string |
`preKey` | { keyId: number ; publicKey: string  } |
`registrationId` | string |
`signedPreKey` | { keyId: number ; publicKey: string ; signature: string  } |

___

### WhatsDappSignalPrivateKeys

Ƭ  **WhatsDappSignalPrivateKeys**: { identityKeyPair: any ; preKey: any ; registrationId: any ; signedPreKey: any  }

*Defined in [lib/signal/SignalWrapper.ts:14](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L14)*

#### Type declaration:

Name | Type |
------ | ------ |
`identityKeyPair` | any |
`preKey` | any |
`registrationId` | any |
`signedPreKey` | any |

___

### WhatsDappSignalSignedPreKey

Ƭ  **WhatsDappSignalSignedPreKey**: [WhatsDappSignalPreKey](_signal_signalwrapper_.md#whatsdappsignalprekey) & { signature: string  }

*Defined in [lib/signal/SignalWrapper.ts:21](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L21)*
