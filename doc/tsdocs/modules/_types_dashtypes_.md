**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "types/DashTypes"

# Module: "types/DashTypes"

## Index

### Type aliases

* [AssetLock](_types_dashtypes_.md#assetlock)
* [DashClient](_types_dashtypes_.md#dashclient)
* [DashIdentifier](_types_dashtypes_.md#dashidentifier)
* [DashIdentity](_types_dashtypes_.md#dashidentity)
* [Encoder](_types_dashtypes_.md#encoder)
* [IdentityPublicKey](_types_dashtypes_.md#identitypublickey)
* [InstantAssetLockProof](_types_dashtypes_.md#instantassetlockproof)
* [InstantLock](_types_dashtypes_.md#instantlock)
* [JsonAssetLock](_types_dashtypes_.md#jsonassetlock)
* [JsonIdentity](_types_dashtypes_.md#jsonidentity)
* [JsonIdentityPublicKey](_types_dashtypes_.md#jsonidentitypublickey)
* [JsonInstantAssetLockProof](_types_dashtypes_.md#jsoninstantassetlockproof)
* [RawAssetLock](_types_dashtypes_.md#rawassetlock)
* [RawIdentity](_types_dashtypes_.md#rawidentity)
* [RawIdentityPublicKey](_types_dashtypes_.md#rawidentitypublickey)
* [RawInstantAssetLockProof](_types_dashtypes_.md#rawinstantassetlockproof)
* [Transaction](_types_dashtypes_.md#transaction)
* [TransactionOutput](_types_dashtypes_.md#transactionoutput)

## Type aliases

### AssetLock

Ƭ  **AssetLock**: { createIdentifier: () => [DashIdentifier](_types_dashtypes_.md#dashidentifier) ; getOutPoint: () => Buffer ; getOutput: () => [TransactionOutput](_types_dashtypes_.md#transactionoutput) ; getOutputIndex: () => number ; getProof: () => [InstantAssetLockProof](_types_dashtypes_.md#instantassetlockproof) ; getTransaction: () => [Transaction](_types_dashtypes_.md#transaction) ; toJSON: () => [JsonAssetLock](_types_dashtypes_.md#jsonassetlock) ; toObject: () => [RawAssetLock](_types_dashtypes_.md#rawassetlock)  }

*Defined in [lib/types/DashTypes.ts:85](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L85)*

#### Type declaration:

Name | Type |
------ | ------ |
`createIdentifier` | () => [DashIdentifier](_types_dashtypes_.md#dashidentifier) |
`getOutPoint` | () => Buffer |
`getOutput` | () => [TransactionOutput](_types_dashtypes_.md#transactionoutput) |
`getOutputIndex` | () => number |
`getProof` | () => [InstantAssetLockProof](_types_dashtypes_.md#instantassetlockproof) |
`getTransaction` | () => [Transaction](_types_dashtypes_.md#transaction) |
`toJSON` | () => [JsonAssetLock](_types_dashtypes_.md#jsonassetlock) |
`toObject` | () => [RawAssetLock](_types_dashtypes_.md#rawassetlock) |

___

### DashClient

Ƭ  **DashClient**: *typeof* prototype

*Defined in [lib/types/DashTypes.ts:3](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L3)*

___

### DashIdentifier

Ƭ  **DashIdentifier**: { encodeCBOR: (encoder: [Encoder](_types_dashtypes_.md#encoder)) => boolean ; toBuffer: () => Buffer ; toJSON: () => string  }

*Defined in [lib/types/DashTypes.ts:4](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L4)*

#### Type declaration:

Name | Type |
------ | ------ |
`encodeCBOR` | (encoder: [Encoder](_types_dashtypes_.md#encoder)) => boolean |
`toBuffer` | () => Buffer |
`toJSON` | () => string |

___

### DashIdentity

Ƭ  **DashIdentity**: { getAssetLock: () => [AssetLock](_types_dashtypes_.md#assetlock) ; getBalance: () => number ; getId: () => [DashIdentifier](_types_dashtypes_.md#dashidentifier) ; getProtocolVersion: () => number ; getPublicKeyById: (keyId: number) => [IdentityPublicKey](_types_dashtypes_.md#identitypublickey) ; getPublicKeys: () => Array<[IdentityPublicKey](_types_dashtypes_.md#identitypublickey)\> ; getRevision: () => number ; hash: () => Buffer ; id: [DashIdentifier](_types_dashtypes_.md#dashidentifier) ; increaseBalance: (amount: number) => number ; reduceBalance: (amount: number) => number ; setAssetLock: (assetLock: [AssetLock](_types_dashtypes_.md#assetlock)) => [DashIdentity](_types_dashtypes_.md#dashidentity) ; setBalance: (balance: number) => [DashIdentity](_types_dashtypes_.md#dashidentity) ; setPublicKeys: (pk: Array<[IdentityPublicKey](_types_dashtypes_.md#identitypublickey)\>) => [DashIdentity](_types_dashtypes_.md#dashidentity) ; toBuffer: () => Buffer ; toJSON: () => [JsonIdentity](_types_dashtypes_.md#jsonidentity) ; toObject: () => [RawIdentity](_types_dashtypes_.md#rawidentity)  }

*Defined in [lib/types/DashTypes.ts:10](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L10)*

#### Type declaration:

Name | Type |
------ | ------ |
`getAssetLock` | () => [AssetLock](_types_dashtypes_.md#assetlock) |
`getBalance` | () => number |
`getId` | () => [DashIdentifier](_types_dashtypes_.md#dashidentifier) |
`getProtocolVersion` | () => number |
`getPublicKeyById` | (keyId: number) => [IdentityPublicKey](_types_dashtypes_.md#identitypublickey) |
`getPublicKeys` | () => Array<[IdentityPublicKey](_types_dashtypes_.md#identitypublickey)\> |
`getRevision` | () => number |
`hash` | () => Buffer |
`id` | [DashIdentifier](_types_dashtypes_.md#dashidentifier) |
`increaseBalance` | (amount: number) => number |
`reduceBalance` | (amount: number) => number |
`setAssetLock` | (assetLock: [AssetLock](_types_dashtypes_.md#assetlock)) => [DashIdentity](_types_dashtypes_.md#dashidentity) |
`setBalance` | (balance: number) => [DashIdentity](_types_dashtypes_.md#dashidentity) |
`setPublicKeys` | (pk: Array<[IdentityPublicKey](_types_dashtypes_.md#identitypublickey)\>) => [DashIdentity](_types_dashtypes_.md#dashidentity) |
`toBuffer` | () => Buffer |
`toJSON` | () => [JsonIdentity](_types_dashtypes_.md#jsonidentity) |
`toObject` | () => [RawIdentity](_types_dashtypes_.md#rawidentity) |

___

### Encoder

Ƭ  **Encoder**: { pushAny: (buf: Buffer) => void  }

*Defined in [lib/types/DashTypes.ts:77](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L77)*

#### Type declaration:

Name | Type |
------ | ------ |
`pushAny` | (buf: Buffer) => void |

___

### IdentityPublicKey

Ƭ  **IdentityPublicKey**: [RawIdentityPublicKey](_types_dashtypes_.md#rawidentitypublickey) & { getData: () => Buffer ; getId: () => number ; getType: () => number ; hash: () => Buffer ; setData: (data: Buffer) => [IdentityPublicKey](_types_dashtypes_.md#identitypublickey) ; setId: (id: number) => [IdentityPublicKey](_types_dashtypes_.md#identitypublickey) ; setType: (type: number) => [IdentityPublicKey](_types_dashtypes_.md#identitypublickey) ; toJSON: () => [JsonIdentityPublicKey](_types_dashtypes_.md#jsonidentitypublickey) ; toObject: () => [RawIdentityPublicKey](_types_dashtypes_.md#rawidentitypublickey)  }

*Defined in [lib/types/DashTypes.ts:108](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L108)*

___

### InstantAssetLockProof

Ƭ  **InstantAssetLockProof**: [RawInstantAssetLockProof](_types_dashtypes_.md#rawinstantassetlockproof) & { getInstantLock: () => [InstantLock](_types_dashtypes_.md#instantlock) ; getType: () => number ; toJSON: () => [JsonInstantAssetLockProof](_types_dashtypes_.md#jsoninstantassetlockproof) ; toObject: () => [RawInstantAssetLockProof](_types_dashtypes_.md#rawinstantassetlockproof)  }

*Defined in [lib/types/DashTypes.ts:48](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L48)*

___

### InstantLock

Ƭ  **InstantLock**: any

*Defined in [lib/types/DashTypes.ts:46](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L46)*

___

### JsonAssetLock

Ƭ  **JsonAssetLock**: { outputIndex: number ; proof: [JsonInstantAssetLockProof](_types_dashtypes_.md#jsoninstantassetlockproof) ; transaction: string  }

*Defined in [lib/types/DashTypes.ts:65](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L65)*

#### Type declaration:

Name | Type |
------ | ------ |
`outputIndex` | number |
`proof` | [JsonInstantAssetLockProof](_types_dashtypes_.md#jsoninstantassetlockproof) |
`transaction` | string |

___

### JsonIdentity

Ƭ  **JsonIdentity**: { balance: number ; id: string ; protocolVersion: number ; publicKeys: Array<[JsonIdentityPublicKey](_types_dashtypes_.md#jsonidentitypublickey)\> ; revision: number  }

*Defined in [lib/types/DashTypes.ts:30](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L30)*

#### Type declaration:

Name | Type |
------ | ------ |
`balance` | number |
`id` | string |
`protocolVersion` | number |
`publicKeys` | Array<[JsonIdentityPublicKey](_types_dashtypes_.md#jsonidentitypublickey)\> |
`revision` | number |

___

### JsonIdentityPublicKey

Ƭ  **JsonIdentityPublicKey**: { data: string ; id: number ; type: number  }

*Defined in [lib/types/DashTypes.ts:96](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L96)*

#### Type declaration:

Name | Type |
------ | ------ |
`data` | string |
`id` | number |
`type` | number |

___

### JsonInstantAssetLockProof

Ƭ  **JsonInstantAssetLockProof**: { instantLock: string ; type: number  }

*Defined in [lib/types/DashTypes.ts:60](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L60)*

#### Type declaration:

Name | Type |
------ | ------ |
`instantLock` | string |
`type` | number |

___

### RawAssetLock

Ƭ  **RawAssetLock**: { outputIndex: number ; proof: [RawInstantAssetLockProof](_types_dashtypes_.md#rawinstantassetlockproof) ; transaction: Buffer  }

*Defined in [lib/types/DashTypes.ts:71](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L71)*

#### Type declaration:

Name | Type |
------ | ------ |
`outputIndex` | number |
`proof` | [RawInstantAssetLockProof](_types_dashtypes_.md#rawinstantassetlockproof) |
`transaction` | Buffer |

___

### RawIdentity

Ƭ  **RawIdentity**: { balance: number ; id: Buffer ; protocolVersion: number ; publicKeys: Array<[RawIdentityPublicKey](_types_dashtypes_.md#rawidentitypublickey)\> ; revision: number  }

*Defined in [lib/types/DashTypes.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L38)*

#### Type declaration:

Name | Type |
------ | ------ |
`balance` | number |
`id` | Buffer |
`protocolVersion` | number |
`publicKeys` | Array<[RawIdentityPublicKey](_types_dashtypes_.md#rawidentitypublickey)\> |
`revision` | number |

___

### RawIdentityPublicKey

Ƭ  **RawIdentityPublicKey**: { data: Buffer ; id: number ; type: number  }

*Defined in [lib/types/DashTypes.ts:102](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L102)*

#### Type declaration:

Name | Type |
------ | ------ |
`data` | Buffer |
`id` | number |
`type` | number |

___

### RawInstantAssetLockProof

Ƭ  **RawInstantAssetLockProof**: { instantLock: Buffer ; type: number  }

*Defined in [lib/types/DashTypes.ts:55](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L55)*

#### Type declaration:

Name | Type |
------ | ------ |
`instantLock` | Buffer |
`type` | number |

___

### Transaction

Ƭ  **Transaction**: any

*Defined in [lib/types/DashTypes.ts:80](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L80)*

___

### TransactionOutput

Ƭ  **TransactionOutput**: any

*Defined in [lib/types/DashTypes.ts:83](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/types/DashTypes.ts#L83)*
