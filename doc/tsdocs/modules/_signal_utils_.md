**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "signal/utils"

# Module: "signal/utils"

## Index

### Type aliases

* [Encoding](_signal_utils_.md#encoding)

### Functions

* [arrayBufferToString](_signal_utils_.md#arraybuffertostring)
* [toHex](_signal_utils_.md#tohex)

## Type aliases

### Encoding

Ƭ  **Encoding**: \"utf8\" \| \"binary\" \| \"base64\" \| \"hex\" \| \"latin1\" \| \"utf16le\"

*Defined in [lib/signal/utils.ts:1](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/utils.ts#L1)*

## Functions

### arrayBufferToString

▸ **arrayBufferToString**(`buffer`: ArrayBuffer, `encoding?`: [Encoding](_signal_utils_.md#encoding)): string

*Defined in [lib/signal/utils.ts:3](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/utils.ts#L3)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`buffer` | ArrayBuffer | - |
`encoding` | [Encoding](_signal_utils_.md#encoding) | "utf8" |

**Returns:** string

___

### toHex

▸ **toHex**(`n`: number): string

*Defined in [lib/signal/utils.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/signal/utils.ts#L41)*

#### Parameters:

Name | Type |
------ | ------ |
`n` | number |

**Returns:** string
