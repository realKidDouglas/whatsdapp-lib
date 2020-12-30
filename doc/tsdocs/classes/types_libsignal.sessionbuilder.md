[whatsdapp](../README.md) / [Exports](../modules.md) / [types/libsignal](../modules/types_libsignal.md) / SessionBuilder

# Class: SessionBuilder

## Hierarchy

* **SessionBuilder**

## Index

### Constructors

* [constructor](types_libsignal.sessionbuilder.md#constructor)

### Methods

* [initOutgoing](types_libsignal.sessionbuilder.md#initoutgoing)

## Constructors

### constructor

\+ **new SessionBuilder**(`store`: [*ProtocolStore*](../interfaces/types_libsignal.protocolstore.md), `address`: [*ProtocolAddress*](types_libsignal.protocoladdress.md)): [*SessionBuilder*](types_libsignal.sessionbuilder.md)

#### Parameters:

Name | Type |
------ | ------ |
`store` | [*ProtocolStore*](../interfaces/types_libsignal.protocolstore.md) |
`address` | [*ProtocolAddress*](types_libsignal.protocoladdress.md) |

**Returns:** [*SessionBuilder*](types_libsignal.sessionbuilder.md)

Defined in: [lib/types/libsignal.d.ts:85](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L85)

## Methods

### initOutgoing

▸ **initOutgoing**(`SignalPreKeyBundle`: *any*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`SignalPreKeyBundle` | *any* |

**Returns:** *Promise*<*void*\>

Defined in: [lib/types/libsignal.d.ts:87](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/types/libsignal.d.ts#L87)
