[whatsdapp](../README.md) / [Exports](../modules.md) / dapi/Message_DAO

# Module: dapi/Message\_DAO

## Index

### Functions

* [createMessage](dapi_message_dao.md#createmessage)
* [deleteMessage](dapi_message_dao.md#deletemessage)
* [getMessageFromByTime](dapi_message_dao.md#getmessagefrombytime)
* [getMessages](dapi_message_dao.md#getmessages)
* [getMessagesByTime](dapi_message_dao.md#getmessagesbytime)
* [getMessagesFrom](dapi_message_dao.md#getmessagesfrom)

## Functions

### createMessage

▸ **createMessage**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `receiverid`: *string*, `content`: *string*): *Promise*<*any*\>

Create a message in form of the message contract and broadcast it to the platform

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |  |
`receiverid` | *string* | ID in Base58Check of the receiver   |
`content` | *string* | The content of the message   |

**Returns:** *Promise*<*any*\>

The check, that the message is published

Defined in: [src/dapi/Message_DAO.ts:14](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Message_DAO.ts#L14)

___

### deleteMessage

▸ **deleteMessage**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `time`: *number*, `senderid`: *string*): *Promise*<*boolean*\>

Delete a message by id

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`time` | *number* |
`senderid` | *string* |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/dapi/Message_DAO.ts:110](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Message_DAO.ts#L110)

___

### getMessageFromByTime

▸ **getMessageFromByTime**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `time`: *number*, `senderid`: *string*): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |
`time` | *number* |
`senderid` | *string* |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Defined in: [src/dapi/Message_DAO.ts:159](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Message_DAO.ts#L159)

___

### getMessages

▸ **getMessages**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection)): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Receive all messages of the user

#### Parameters:

Name | Type |
------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

all messages of the user

Defined in: [src/dapi/Message_DAO.ts:62](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Message_DAO.ts#L62)

___

### getMessagesByTime

▸ **getMessagesByTime**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `time`: *number*): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Receive all messages after a specific time. To parse a timestring (Json-Timestring) into a integer (milliseconds)
use the following function:
<document>.createdAt.getTime()

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |  |
`time` | *number* | Time in milliseconds   |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

the messages since time

Defined in: [src/dapi/Message_DAO.ts:87](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Message_DAO.ts#L87)

___

### getMessagesFrom

▸ **getMessagesFrom**(`connection`: [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection), `senderid`: *string*): *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`connection` | [*WhatsDappConnection*](whatsdapp.md#whatsdappconnection) |  |
`senderid` | *string* | ID of the owner encoded in HEX and the identifier flag   |

**Returns:** *Promise*<[*RawMessage*](whatsdapp.md#rawmessage)[]\>

all messages of a specified user

Defined in: [src/dapi/Message_DAO.ts:38](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/dapi/Message_DAO.ts#L38)
