[whatsdapp](../README.md) / [Exports](../modules.md) / types/DashTypes

# Module: types/DashTypes

## Index

### Type aliases

* [AssetLock](types_dashtypes.md#assetlock)
* [DashClient](types_dashtypes.md#dashclient)
* [DashIdentifier](types_dashtypes.md#dashidentifier)
* [DashIdentity](types_dashtypes.md#dashidentity)
* [Encoder](types_dashtypes.md#encoder)
* [IdentityPublicKey](types_dashtypes.md#identitypublickey)
* [InstantAssetLockProof](types_dashtypes.md#instantassetlockproof)
* [InstantLock](types_dashtypes.md#instantlock)
* [JsonAssetLock](types_dashtypes.md#jsonassetlock)
* [JsonIdentity](types_dashtypes.md#jsonidentity)
* [JsonIdentityPublicKey](types_dashtypes.md#jsonidentitypublickey)
* [JsonInstantAssetLockProof](types_dashtypes.md#jsoninstantassetlockproof)
* [RawAssetLock](types_dashtypes.md#rawassetlock)
* [RawIdentity](types_dashtypes.md#rawidentity)
* [RawIdentityPublicKey](types_dashtypes.md#rawidentitypublickey)
* [RawInstantAssetLockProof](types_dashtypes.md#rawinstantassetlockproof)
* [Transaction](types_dashtypes.md#transaction)
* [TransactionOutput](types_dashtypes.md#transactionoutput)

## Type aliases

### AssetLock

Ƭ **AssetLock**: { `createIdentifier`: () => [*DashIdentifier*](types_dashtypes.md#dashidentifier) ; `getOutPoint`: () => Buffer ; `getOutput`: () => [*TransactionOutput*](types_dashtypes.md#transactionoutput) ; `getOutputIndex`: () => *number* ; `getProof`: () => [*InstantAssetLockProof*](types_dashtypes.md#instantassetlockproof) ; `getTransaction`: () => [*Transaction*](types_dashtypes.md#transaction) ; `toJSON`: () => [*JsonAssetLock*](types_dashtypes.md#jsonassetlock) ; `toObject`: () => [*RawAssetLock*](types_dashtypes.md#rawassetlock)  }

#### Type declaration:

Name | Type |
------ | ------ |
`createIdentifier` | () => [*DashIdentifier*](types_dashtypes.md#dashidentifier) |
`getOutPoint` | () => Buffer |
`getOutput` | () => [*TransactionOutput*](types_dashtypes.md#transactionoutput) |
`getOutputIndex` | () => *number* |
`getProof` | () => [*InstantAssetLockProof*](types_dashtypes.md#instantassetlockproof) |
`getTransaction` | () => [*Transaction*](types_dashtypes.md#transaction) |
`toJSON` | () => [*JsonAssetLock*](types_dashtypes.md#jsonassetlock) |
`toObject` | () => [*RawAssetLock*](types_dashtypes.md#rawassetlock) |

Defined in: [src/types/DashTypes.ts:85](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L85)

___

### DashClient

Ƭ **DashClient**: *typeof* DashSDK.Client.prototype

Defined in: [src/types/DashTypes.ts:3](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L3)

___

### DashIdentifier

Ƭ **DashIdentifier**: { `encodeCBOR`: (`encoder`: [*Encoder*](types_dashtypes.md#encoder)) => *boolean* ; `toBuffer`: () => Buffer ; `toJSON`: () => *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`encodeCBOR` | (`encoder`: [*Encoder*](types_dashtypes.md#encoder)) => *boolean* |
`toBuffer` | () => Buffer |
`toJSON` | () => *string* |

Defined in: [src/types/DashTypes.ts:4](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L4)

___

### DashIdentity

Ƭ **DashIdentity**: { `getAssetLock`: () => [*AssetLock*](types_dashtypes.md#assetlock) ; `getBalance`: () => *number* ; `getId`: () => [*DashIdentifier*](types_dashtypes.md#dashidentifier) ; `getProtocolVersion`: () => *number* ; `getPublicKeyById`: (`keyId`: *number*) => [*IdentityPublicKey*](types_dashtypes.md#identitypublickey) ; `getPublicKeys`: () => *Array*<[*IdentityPublicKey*](types_dashtypes.md#identitypublickey)\> ; `getRevision`: () => *number* ; `hash`: () => Buffer ; `id`: [*DashIdentifier*](types_dashtypes.md#dashidentifier) ; `increaseBalance`: (`amount`: *number*) => *number* ; `reduceBalance`: (`amount`: *number*) => *number* ; `setAssetLock`: (`assetLock`: [*AssetLock*](types_dashtypes.md#assetlock)) => [*DashIdentity*](types_dashtypes.md#dashidentity) ; `setBalance`: (`balance`: *number*) => [*DashIdentity*](types_dashtypes.md#dashidentity) ; `setPublicKeys`: (`pk`: *Array*<[*IdentityPublicKey*](types_dashtypes.md#identitypublickey)\>) => [*DashIdentity*](types_dashtypes.md#dashidentity) ; `toBuffer`: () => Buffer ; `toJSON`: () => [*JsonIdentity*](types_dashtypes.md#jsonidentity) ; `toObject`: () => [*RawIdentity*](types_dashtypes.md#rawidentity)  }

#### Type declaration:

Name | Type |
------ | ------ |
`getAssetLock` | () => [*AssetLock*](types_dashtypes.md#assetlock) |
`getBalance` | () => *number* |
`getId` | () => [*DashIdentifier*](types_dashtypes.md#dashidentifier) |
`getProtocolVersion` | () => *number* |
`getPublicKeyById` | (`keyId`: *number*) => [*IdentityPublicKey*](types_dashtypes.md#identitypublickey) |
`getPublicKeys` | () => *Array*<[*IdentityPublicKey*](types_dashtypes.md#identitypublickey)\> |
`getRevision` | () => *number* |
`hash` | () => Buffer |
`id` | [*DashIdentifier*](types_dashtypes.md#dashidentifier) |
`increaseBalance` | (`amount`: *number*) => *number* |
`reduceBalance` | (`amount`: *number*) => *number* |
`setAssetLock` | (`assetLock`: [*AssetLock*](types_dashtypes.md#assetlock)) => [*DashIdentity*](types_dashtypes.md#dashidentity) |
`setBalance` | (`balance`: *number*) => [*DashIdentity*](types_dashtypes.md#dashidentity) |
`setPublicKeys` | (`pk`: *Array*<[*IdentityPublicKey*](types_dashtypes.md#identitypublickey)\>) => [*DashIdentity*](types_dashtypes.md#dashidentity) |
`toBuffer` | () => Buffer |
`toJSON` | () => [*JsonIdentity*](types_dashtypes.md#jsonidentity) |
`toObject` | () => [*RawIdentity*](types_dashtypes.md#rawidentity) |

Defined in: [src/types/DashTypes.ts:10](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L10)

___

### Encoder

Ƭ **Encoder**: { `pushAny`: (`buf`: Buffer) => *void*  }

#### Type declaration:

Name | Type |
------ | ------ |
`pushAny` | (`buf`: Buffer) => *void* |

Defined in: [src/types/DashTypes.ts:77](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L77)

___

### IdentityPublicKey

Ƭ **IdentityPublicKey**: [*RawIdentityPublicKey*](types_dashtypes.md#rawidentitypublickey) & { `getData`: () => Buffer ; `getId`: () => *number* ; `getType`: () => *number* ; `hash`: () => Buffer ; `setData`: (`data`: Buffer) => [*IdentityPublicKey*](types_dashtypes.md#identitypublickey) ; `setId`: (`id`: *number*) => [*IdentityPublicKey*](types_dashtypes.md#identitypublickey) ; `setType`: (`type`: *number*) => [*IdentityPublicKey*](types_dashtypes.md#identitypublickey) ; `toJSON`: () => [*JsonIdentityPublicKey*](types_dashtypes.md#jsonidentitypublickey) ; `toObject`: () => [*RawIdentityPublicKey*](types_dashtypes.md#rawidentitypublickey)  }

Defined in: [src/types/DashTypes.ts:108](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L108)

___

### InstantAssetLockProof

Ƭ **InstantAssetLockProof**: [*RawInstantAssetLockProof*](types_dashtypes.md#rawinstantassetlockproof) & { `getInstantLock`: () => [*InstantLock*](types_dashtypes.md#instantlock) ; `getType`: () => *number* ; `toJSON`: () => [*JsonInstantAssetLockProof*](types_dashtypes.md#jsoninstantassetlockproof) ; `toObject`: () => [*RawInstantAssetLockProof*](types_dashtypes.md#rawinstantassetlockproof)  }

Defined in: [src/types/DashTypes.ts:48](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L48)

___

### InstantLock

Ƭ **InstantLock**: *any*

Defined in: [src/types/DashTypes.ts:46](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L46)

___

### JsonAssetLock

Ƭ **JsonAssetLock**: { `outputIndex`: *number* ; `proof`: [*JsonInstantAssetLockProof*](types_dashtypes.md#jsoninstantassetlockproof) ; `transaction`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`outputIndex` | *number* |
`proof` | [*JsonInstantAssetLockProof*](types_dashtypes.md#jsoninstantassetlockproof) |
`transaction` | *string* |

Defined in: [src/types/DashTypes.ts:65](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L65)

___

### JsonIdentity

Ƭ **JsonIdentity**: { `balance`: *number* ; `id`: *string* ; `protocolVersion`: *number* ; `publicKeys`: *Array*<[*JsonIdentityPublicKey*](types_dashtypes.md#jsonidentitypublickey)\> ; `revision`: *number*  }

#### Type declaration:

Name | Type |
------ | ------ |
`balance` | *number* |
`id` | *string* |
`protocolVersion` | *number* |
`publicKeys` | *Array*<[*JsonIdentityPublicKey*](types_dashtypes.md#jsonidentitypublickey)\> |
`revision` | *number* |

Defined in: [src/types/DashTypes.ts:30](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L30)

___

### JsonIdentityPublicKey

Ƭ **JsonIdentityPublicKey**: { `data`: *string* ; `id`: *number* ; `type`: *number*  }

#### Type declaration:

Name | Type |
------ | ------ |
`data` | *string* |
`id` | *number* |
`type` | *number* |

Defined in: [src/types/DashTypes.ts:96](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L96)

___

### JsonInstantAssetLockProof

Ƭ **JsonInstantAssetLockProof**: { `instantLock`: *string* ; `type`: *number*  }

#### Type declaration:

Name | Type |
------ | ------ |
`instantLock` | *string* |
`type` | *number* |

Defined in: [src/types/DashTypes.ts:60](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L60)

___

### RawAssetLock

Ƭ **RawAssetLock**: { `outputIndex`: *number* ; `proof`: [*RawInstantAssetLockProof*](types_dashtypes.md#rawinstantassetlockproof) ; `transaction`: Buffer  }

#### Type declaration:

Name | Type |
------ | ------ |
`outputIndex` | *number* |
`proof` | [*RawInstantAssetLockProof*](types_dashtypes.md#rawinstantassetlockproof) |
`transaction` | Buffer |

Defined in: [src/types/DashTypes.ts:71](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L71)

___

### RawIdentity

Ƭ **RawIdentity**: { `balance`: *number* ; `id`: Buffer ; `protocolVersion`: *number* ; `publicKeys`: *Array*<[*RawIdentityPublicKey*](types_dashtypes.md#rawidentitypublickey)\> ; `revision`: *number*  }

#### Type declaration:

Name | Type |
------ | ------ |
`balance` | *number* |
`id` | Buffer |
`protocolVersion` | *number* |
`publicKeys` | *Array*<[*RawIdentityPublicKey*](types_dashtypes.md#rawidentitypublickey)\> |
`revision` | *number* |

Defined in: [src/types/DashTypes.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L38)

___

### RawIdentityPublicKey

Ƭ **RawIdentityPublicKey**: { `data`: Buffer ; `id`: *number* ; `type`: *number*  }

#### Type declaration:

Name | Type |
------ | ------ |
`data` | Buffer |
`id` | *number* |
`type` | *number* |

Defined in: [src/types/DashTypes.ts:102](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L102)

___

### RawInstantAssetLockProof

Ƭ **RawInstantAssetLockProof**: { `instantLock`: Buffer ; `type`: *number*  }

#### Type declaration:

Name | Type |
------ | ------ |
`instantLock` | Buffer |
`type` | *number* |

Defined in: [src/types/DashTypes.ts:55](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L55)

___

### Transaction

Ƭ **Transaction**: *any*

Defined in: [src/types/DashTypes.ts:80](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L80)

___

### TransactionOutput

Ƭ **TransactionOutput**: *any*

Defined in: [src/types/DashTypes.ts:83](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/types/DashTypes.ts#L83)
