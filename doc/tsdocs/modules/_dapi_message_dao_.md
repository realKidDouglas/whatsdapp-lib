**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "dapi/Message\_DAO"

# Module: "dapi/Message\_DAO"

## Index

### Functions

* [createMessage](_dapi_message_dao_.md#createmessage)
* [deleteMessage](_dapi_message_dao_.md#deletemessage)
* [getMessageFromByTime](_dapi_message_dao_.md#getmessagefrombytime)
* [getMessages](_dapi_message_dao_.md#getmessages)
* [getMessagesByTime](_dapi_message_dao_.md#getmessagesbytime)
* [getMessagesFrom](_dapi_message_dao_.md#getmessagesfrom)

## Functions

### createMessage

▸ **createMessage**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `receiverid`: string, `content`: string): Promise<any\>

*Defined in [lib/dapi/Message_DAO.ts:14](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Message_DAO.ts#L14)*

Create a message in form of the message contract and broadcast it to the platform

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |  |
`receiverid` | string | ID in Base58Check of the receiver |
`content` | string | The content of the message |

**Returns:** Promise<any\>

The check, that the message is published

___

### deleteMessage

▸ **deleteMessage**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `time`: number, `senderid`: string): Promise<boolean\>

*Defined in [lib/dapi/Message_DAO.ts:110](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Message_DAO.ts#L110)*

Delete a message by id

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |
`time` | number |
`senderid` | string |

**Returns:** Promise<boolean\>

___

### getMessageFromByTime

▸ **getMessageFromByTime**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `time`: number, `senderid`: string): Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

*Defined in [lib/dapi/Message_DAO.ts:155](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Message_DAO.ts#L155)*

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |
`time` | number |
`senderid` | string |

**Returns:** Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

___

### getMessages

▸ **getMessages**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection)): Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

*Defined in [lib/dapi/Message_DAO.ts:62](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Message_DAO.ts#L62)*

Receive all messages of the user

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |

**Returns:** Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

all messages of the user

___

### getMessagesByTime

▸ **getMessagesByTime**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `time`: number): Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

*Defined in [lib/dapi/Message_DAO.ts:87](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Message_DAO.ts#L87)*

Receive all messages after a specific time. To parse a timestring (Json-Timestring) into a integer (milliseconds)
use the following function:
<document>.createdAt.getTime()

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |  |
`time` | number | Time in milliseconds |

**Returns:** Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

the messages since time

___

### getMessagesFrom

▸ **getMessagesFrom**(`connection`: [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection), `senderid`: string): Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

*Defined in [lib/dapi/Message_DAO.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/dapi/Message_DAO.ts#L38)*

Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection) |  |
`senderid` | string | ID of the owner encoded in HEX and the identifier flag |

**Returns:** Promise<Array<[RawMessage](_whatsdapp_.md#rawmessage)\>\>

all messages of a specified user
