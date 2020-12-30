[whatsdapp](../README.md) / [Exports](../modules.md) / dapi/Identity_DAO

# Module: dapi/Identity\_DAO

## Index

### Functions

* [createDpnsName](dapi_identity_dao.md#createdpnsname)
* [createIdentity](dapi_identity_dao.md#createidentity)
* [findIdentityByName](dapi_identity_dao.md#findidentitybyname)
* [getIdentityBalance](dapi_identity_dao.md#getidentitybalance)
* [topUpIdentity](dapi_identity_dao.md#topupidentity)

## Functions

### createDpnsName

▸ **createDpnsName**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `name`: *string*): *Promise*<*boolean*\>

Register a name at dash platform

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`name` | *string* |

**Returns:** *Promise*<*boolean*\>

check if everything is fine

Defined in: [lib/dapi/Identity_DAO.ts:47](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/dapi/Identity_DAO.ts#L47)

___

### createIdentity

▸ **createIdentity**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

Create a new identity

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) | :{     identity: resolved identity by id -- Can be undefined     platform: Dash Platform object }   |

**Returns:** *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

the resolved identity

Defined in: [lib/dapi/Identity_DAO.ts:16](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/dapi/Identity_DAO.ts#L16)

___

### findIdentityByName

▸ **findIdentityByName**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `name`: *string*): *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

Resolve a dpns-name to an identity

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`name` | *string* |

**Returns:** *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

The identity which belongs to the name

Defined in: [lib/dapi/Identity_DAO.ts:67](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/dapi/Identity_DAO.ts#L67)

___

### getIdentityBalance

▸ **getIdentityBalance**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<*number*\>

Return the identity balance

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<*number*\>

Credits

Defined in: [lib/dapi/Identity_DAO.ts:83](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/dapi/Identity_DAO.ts#L83)

___

### topUpIdentity

▸ **topUpIdentity**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `topUpAmount`: *number*): *Promise*<*boolean*\>

Top up the given identity in the connection with extra credits

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) | - |
`topUpAmount` | *number* | in credits   |

**Returns:** *Promise*<*boolean*\>

check if everything is fine

Defined in: [lib/dapi/Identity_DAO.ts:32](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/dapi/Identity_DAO.ts#L32)
