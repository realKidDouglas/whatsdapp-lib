[whatsdapp](../README.md) / [Exports](../modules.md) / dapi/dapi

# Module: dapi/dapi

## Index

### Functions

* [createDpnsName](dapi_dapi.md#createdpnsname)
* [createIdentity](dapi_dapi.md#createidentity)
* [createMessage](dapi_dapi.md#createmessage)
* [createProfile](dapi_dapi.md#createprofile)
* [createWallet](dapi_dapi.md#createwallet)
* [deleteMessage](dapi_dapi.md#deletemessage)
* [deleteProfile](dapi_dapi.md#deleteprofile)
* [findIdentityByName](dapi_dapi.md#findidentitybyname)
* [getIdentityBalance](dapi_dapi.md#getidentitybalance)
* [getMessages](dapi_dapi.md#getmessages)
* [getMessagesByTime](dapi_dapi.md#getmessagesbytime)
* [getMessagesFrom](dapi_dapi.md#getmessagesfrom)
* [getMessagesFromByTime](dapi_dapi.md#getmessagesfrombytime)
* [getProfile](dapi_dapi.md#getprofile)
* [getUnusedAddress](dapi_dapi.md#getunusedaddress)
* [topUpIdentity](dapi_dapi.md#topupidentity)
* [updateProfile](dapi_dapi.md#updateprofile)

## Functions

### createDpnsName

▸ `Const`**createDpnsName**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `name`: *string*): *Promise*<*boolean*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`name` | *string* |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/dapi/dapi.ts:36](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L36)

___

### createIdentity

▸ `Const`**createIdentity**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

Defined in: [src/dapi/dapi.ts:34](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L34)

___

### createMessage

▸ `Const`**createMessage**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `receiverid`: *string*, `content`: *string*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`receiverid` | *string* |
`content` | *string* |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/dapi.ts:47](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L47)

___

### createProfile

▸ `Const`**createProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `content`: [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent)): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`content` | [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent) |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/dapi.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L41)

___

### createWallet

▸ `Const`**createWallet**(`client`: *Client*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`client` | *Client* |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/dapi.ts:30](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L30)

___

### deleteMessage

▸ `Const`**deleteMessage**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `time`: *number*, `senderid`: *string*): *Promise*<*boolean*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`time` | *number* |
`senderid` | *string* |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/dapi/dapi.ts:48](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L48)

___

### deleteProfile

▸ `Const`**deleteProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/dapi.ts:43](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L43)

___

### findIdentityByName

▸ `Const`**findIdentityByName**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `name`: *string*): *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`name` | *string* |

**Returns:** *Promise*<*null* \| [*DashIdentity*](types_dashtypes.md#dashidentity)\>

Defined in: [src/dapi/dapi.ts:37](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L37)

___

### getIdentityBalance

▸ `Const`**getIdentityBalance**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<*number*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<*number*\>

Defined in: [src/dapi/dapi.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L38)

___

### getMessages

▸ `Const`**getMessages**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Defined in: [src/dapi/dapi.ts:51](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L51)

___

### getMessagesByTime

▸ `Const`**getMessagesByTime**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `time`: *number*): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`time` | *number* |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Defined in: [src/dapi/dapi.ts:49](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L49)

___

### getMessagesFrom

▸ `Const`**getMessagesFrom**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `senderid`: *string*): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`senderid` | *string* |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Defined in: [src/dapi/dapi.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L52)

___

### getMessagesFromByTime

▸ `Const`**getMessagesFromByTime**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `time`: *number*, `senderid`: *string*): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`time` | *number* |
`senderid` | *string* |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Defined in: [src/dapi/dapi.ts:50](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L50)

___

### getProfile

▸ `Const`**getProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `ownerid`: *string*): *Promise*<[*RawProfile*](whatsdapp.md#rawprofile)\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`ownerid` | *string* |

**Returns:** *Promise*<[*RawProfile*](whatsdapp.md#rawprofile)\>

Defined in: [src/dapi/dapi.ts:44](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L44)

___

### getUnusedAddress

▸ `Const`**getUnusedAddress**(`client`: *Client*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`client` | *Client* |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/dapi.ts:31](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L31)

___

### topUpIdentity

▸ `Const`**topUpIdentity**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `topUpAmount`: *number*): *Promise*<*boolean*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`topUpAmount` | *number* |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/dapi/dapi.ts:35](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L35)

___

### updateProfile

▸ `Const`**updateProfile**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `content`: [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent)): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`content` | [*WhatsDappProfileContent*](whatsdapp.md#whatsdappprofilecontent) |

**Returns:** *Promise*<*any*\>

Defined in: [src/dapi/dapi.ts:42](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/dapi.ts#L42)
