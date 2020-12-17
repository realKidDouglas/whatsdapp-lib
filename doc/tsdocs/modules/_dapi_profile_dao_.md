**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "dapi/Profile\_DAO"

# Module: "dapi/Profile\_DAO"

## Index

### Functions

* [createProfile](_dapi_profile_dao_.md#createprofile)
* [deleteProfile](_dapi_profile_dao_.md#deleteprofile)
* [getProfile](_dapi_profile_dao_.md#getprofile)
* [updateProfile](_dapi_profile_dao_.md#updateprofile)

## Functions

### createProfile

▸ **createProfile**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `content`: [WhatsDappProfileContent](_whatsdapp_.md#whatsdappprofilecontent)): Promise<any\>

*Defined in [lib/dapi/Profile_DAO.ts:13](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Profile_DAO.ts#L13)*

Create a profile

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |
`content` | [WhatsDappProfileContent](_whatsdapp_.md#whatsdappprofilecontent) |

**Returns:** Promise<any\>

___

### deleteProfile

▸ **deleteProfile**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection)): Promise<any\>

*Defined in [lib/dapi/Profile_DAO.ts:100](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Profile_DAO.ts#L100)*

Delte the WhatsDapp profile so noone can create a signal message.

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |

**Returns:** Promise<any\>

Returns a document, that the profile was updated

___

### getProfile

▸ **getProfile**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `ownerid`: string): Promise<[RawProfile](_whatsdapp_.md#rawprofile)\>

*Defined in [lib/dapi/Profile_DAO.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Profile_DAO.ts#L52)*

Create a WhatsDapp profile

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |  |
`ownerid` | string | The ownerId in HEX |

**Returns:** Promise<[RawProfile](_whatsdapp_.md#rawprofile)\>

Returns a document, that the profile was created
TODO: Maybe its better to use the DashIdentity Type instead of the ownerid as a string

___

### updateProfile

▸ **updateProfile**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `content`: [WhatsDappProfileContent](_whatsdapp_.md#whatsdappprofilecontent)): Promise<any\>

*Defined in [lib/dapi/Profile_DAO.ts:73](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Profile_DAO.ts#L73)*

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |
`content` | [WhatsDappProfileContent](_whatsdapp_.md#whatsdappprofilecontent) |

**Returns:** Promise<any\>

Returns a document, that the profile was updated
