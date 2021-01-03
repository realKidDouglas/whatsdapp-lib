[whatsdapp](../README.md) / [Exports](../modules.md) / dapi/Profile_DAO

# Module: dapi/Profile\_DAO

## Index

### Functions

* [createProfile](dapi_profile_dao.md#createprofile)
* [deleteProfile](dapi_profile_dao.md#deleteprofile)
* [getProfile](dapi_profile_dao.md#getprofile)
* [updateProfile](dapi_profile_dao.md#updateprofile)

## Functions

### createProfile

▸ **createProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `content`: [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent)): *Promise*<*any*\>

Create a profile

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`content` | [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent) |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/Profile_DAO.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Profile_DAO.ts#L13)

___

### deleteProfile

▸ **deleteProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<*any*\>

Delte the WhatsDapp profile so noone can create a signal message.

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<*any*\>

Returns a document, that the profile was updated

Defined in: [src/dapi/Profile_DAO.ts:100](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Profile_DAO.ts#L100)

___

### getProfile

▸ **getProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `ownerid`: *string*): *Promise*<[*RawProfile*](whatsdapp.md#rawprofile)\>

Create a WhatsDapp profile

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |  |
`ownerid` | *string* | The ownerId in HEX   |

**Returns:** *Promise*<[*RawProfile*](whatsdapp.md#rawprofile)\>

Returns a document, that the profile was created
TODO: Maybe its better to use the DashIdentity Type instead of the ownerid as a string

Defined in: [src/dapi/Profile_DAO.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Profile_DAO.ts#L52)

___

### updateProfile

▸ **updateProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `content`: [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent)): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`content` | [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent) |

**Returns:** *Promise*<*any*\>

Returns a document, that the profile was updated

Defined in: [src/dapi/Profile_DAO.ts:73](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Profile_DAO.ts#L73)
