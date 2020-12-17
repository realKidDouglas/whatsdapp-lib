**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "dapi/Identity\_DAO"

# Module: "dapi/Identity\_DAO"

## Index

### Functions

* [createDpnsName](_dapi_identity_dao_.md#createdpnsname)
* [createIdentity](_dapi_identity_dao_.md#createidentity)
* [findIdentityByName](_dapi_identity_dao_.md#findidentitybyname)
* [getIdentityBalance](_dapi_identity_dao_.md#getidentitybalance)
* [topUpIdentity](_dapi_identity_dao_.md#topupidentity)

## Functions

### createDpnsName

▸ **createDpnsName**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `name`: string): Promise<boolean\>

*Defined in [lib/dapi/Identity_DAO.ts:47](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Identity_DAO.ts#L47)*

Register a name at dash platform

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |
`name` | string |

**Returns:** Promise<boolean\>

check if everything is fine

___

### createIdentity

▸ **createIdentity**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection)): Promise<[DashIdentity](_types_dashtypes_.md#dashidentity) \| null\>

*Defined in [lib/dapi/Identity_DAO.ts:16](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Identity_DAO.ts#L16)*

Create a new identity

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) | :{     identity: resolved identity by id -- Can be undefined     platform: Dash Platform object } |

**Returns:** Promise<[DashIdentity](_types_dashtypes_.md#dashidentity) \| null\>

the resolved identity

___

### findIdentityByName

▸ **findIdentityByName**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `name`: string): Promise<[DashIdentity](_types_dashtypes_.md#dashidentity) \| null\>

*Defined in [lib/dapi/Identity_DAO.ts:67](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Identity_DAO.ts#L67)*

Resolve a dpns-name to an identity

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |
`name` | string |

**Returns:** Promise<[DashIdentity](_types_dashtypes_.md#dashidentity) \| null\>

The identity which belongs to the name

___

### getIdentityBalance

▸ **getIdentityBalance**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection)): Promise<number\>

*Defined in [lib/dapi/Identity_DAO.ts:83](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Identity_DAO.ts#L83)*

Return the identity balance

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |

**Returns:** Promise<number\>

Credits

___

### topUpIdentity

▸ **topUpIdentity**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `topUpAmount`: number): Promise<boolean\>

*Defined in [lib/dapi/Identity_DAO.ts:32](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Identity_DAO.ts#L32)*

Top up the given identity in the connection with extra credits

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) | - |
`topUpAmount` | number | in credits |

**Returns:** Promise<boolean\>

check if everything is fine
