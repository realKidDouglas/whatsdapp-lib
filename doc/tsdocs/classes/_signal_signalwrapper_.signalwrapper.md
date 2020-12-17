**[whatsdapp](../README.md)**

> [Globals](../globals.md) / ["signal/SignalWrapper"](../modules/_signal_signalwrapper_.md) / SignalWrapper

# Class: SignalWrapper

## Hierarchy

* **SignalWrapper**

## Index

### Methods

* [\_generatePreKey](_signal_signalwrapper_.signalwrapper.md#_generateprekey)
* [\_generateSignedPreKey](_signal_signalwrapper_.signalwrapper.md#_generatesignedprekey)
* [buildAndPersistSession](_signal_signalwrapper_.signalwrapper.md#buildandpersistsession)
* [decryptMessage](_signal_signalwrapper_.signalwrapper.md#decryptmessage)
* [encryptMessage](_signal_signalwrapper_.signalwrapper.md#encryptmessage)
* [generateSignalKeys](_signal_signalwrapper_.signalwrapper.md#generatesignalkeys)
* [\_b64toCipherText](_signal_signalwrapper_.signalwrapper.md#_b64tociphertext)

## Methods

### \_generatePreKey

▸ **_generatePreKey**(): SignalPreKey

*Defined in [lib/signal/SignalWrapper.ts:109](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L109)*

**Returns:** SignalPreKey

___

### \_generateSignedPreKey

▸ **_generateSignedPreKey**(`identityKeyPair`: SignalKeyPair): SignalSignedPreKey

*Defined in [lib/signal/SignalWrapper.ts:114](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L114)*

#### Parameters:

Name | Type |
------ | ------ |
`identityKeyPair` | SignalKeyPair |

**Returns:** SignalSignedPreKey

___

### buildAndPersistSession

▸ **buildAndPersistSession**(`whatsDappStore`: any, `identifier`: string, `preKeyBundle`: [WhatsDappSignalPrekeyBundle](../modules/_signal_signalwrapper_.md#whatsdappsignalprekeybundle)): Promise<void\>

*Defined in [lib/signal/SignalWrapper.ts:101](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L101)*

#### Parameters:

Name | Type |
------ | ------ |
`whatsDappStore` | any |
`identifier` | string |
`preKeyBundle` | [WhatsDappSignalPrekeyBundle](../modules/_signal_signalwrapper_.md#whatsdappsignalprekeybundle) |

**Returns:** Promise<void\>

___

### decryptMessage

▸ **decryptMessage**(`whatsDappStore`: any, `senderId`: string, `base64`: string): Promise<string\>

*Defined in [lib/signal/SignalWrapper.ts:82](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L82)*

#### Parameters:

Name | Type |
------ | ------ |
`whatsDappStore` | any |
`senderId` | string |
`base64` | string |

**Returns:** Promise<string\>

___

### encryptMessage

▸ **encryptMessage**(`whatsDappStore`: any, `receiverId`: string, `plaintext`: string): Promise<string\>

*Defined in [lib/signal/SignalWrapper.ts:72](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L72)*

#### Parameters:

Name | Type |
------ | ------ |
`whatsDappStore` | any |
`receiverId` | string |
`plaintext` | string |

**Returns:** Promise<string\>

___

### generateSignalKeys

▸ **generateSignalKeys**(): Promise<[WhatsDappSignalKeyBundle](../modules/_signal_signalwrapper_.md#whatsdappsignalkeybundle)\>

*Defined in [lib/signal/SignalWrapper.ts:49](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L49)*

**Returns:** Promise<[WhatsDappSignalKeyBundle](../modules/_signal_signalwrapper_.md#whatsdappsignalkeybundle)\>

___

### \_b64toCipherText

▸ `Static`**_b64toCipherText**(`b64`: string): [WhatsDappSignalCipherText](../modules/_signal_signalwrapper_.md#whatsdappsignalciphertext)

*Defined in [lib/signal/SignalWrapper.ts:119](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/SignalWrapper.ts#L119)*

#### Parameters:

Name | Type |
------ | ------ |
`b64` | string |

**Returns:** [WhatsDappSignalCipherText](../modules/_signal_signalwrapper_.md#whatsdappsignalciphertext)
