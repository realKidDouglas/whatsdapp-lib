**[whatsdapp](../README.md)**

> [Globals](../globals.md) / "WhatsDapp"

# Module: "WhatsDapp"

## Index

### Classes

* [WhatsDapp](../classes/_whatsdapp_.whatsdapp.md)

### Type aliases

* [ConnectOptions](_whatsdapp_.md#connectoptions)
* [ConnectResult](_whatsdapp_.md#connectresult)
* [PreKey](_whatsdapp_.md#prekey)
* [RawMessage](_whatsdapp_.md#rawmessage)
* [RawProfile](_whatsdapp_.md#rawprofile)
* [SignedPreKey](_whatsdapp_.md#signedprekey)
* [TimerHandle](_whatsdapp_.md#timerhandle)
* [WhatsDappConnection](_whatsdapp_.md#whatsdappconnection)
* [WhatsDappMessageContent](_whatsdapp_.md#whatsdappmessagecontent)
* [WhatsDappProfileContent](_whatsdapp_.md#whatsdappprofilecontent)
* [WhatsDappSession](_whatsdapp_.md#whatsdappsession)

### Variables

* [pollInterval](_whatsdapp_.md#pollinterval)

### Functions

* [makeClient](_whatsdapp_.md#makeclient)

## Type aliases

### ConnectOptions

Ƭ  **ConnectOptions**: { displayname: string ; identity: any ; lastTimestamp: number ; mnemonic: string ; preKeyBundle: any ; sessions: Array<[WhatsDappSession](_whatsdapp_.md#whatsdappsession)\>  }

*Defined in [lib/WhatsDapp.ts:85](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L85)*

#### Type declaration:

Name | Type |
------ | ------ |
`displayname` | string |
`identity` | any |
`lastTimestamp` | number |
`mnemonic` | string |
`preKeyBundle` | any |
`sessions` | Array<[WhatsDappSession](_whatsdapp_.md#whatsdappsession)\> |

___

### ConnectResult

Ƭ  **ConnectResult**: { identity: [DashIdentity](_types_dashtypes_.md#dashidentity) ; profile_name: string  }

*Defined in [lib/WhatsDapp.ts:99](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L99)*

#### Type declaration:

Name | Type |
------ | ------ |
`identity` | [DashIdentity](_types_dashtypes_.md#dashidentity) |
`profile_name` | string |

___

### PreKey

Ƭ  **PreKey**: { keyId: number ; publicKey: Array<string\> ; signature: Array<string\>  }

*Defined in [lib/WhatsDapp.ts:46](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L46)*

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | number |
`publicKey` | Array<string\> |
`signature` | Array<string\> |

___

### RawMessage

Ƭ  **RawMessage**: { createdAt: Date ; data: { content: string ; receiverId: string  } ; id: Array<string\> ; ownerId: Array<string\>  }

*Defined in [lib/WhatsDapp.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L52)*

#### Type declaration:

Name | Type |
------ | ------ |
`createdAt` | Date |
`data` | { content: string ; receiverId: string  } |
`id` | Array<string\> |
`ownerId` | Array<string\> |

___

### RawProfile

Ƭ  **RawProfile**: { createdAt: Date ; data: { displayname: string ; identityKey: Array<string\> ; preKey: [PreKey](_whatsdapp_.md#prekey) ; prekeys: Array<string\> ; registrationId: number ; signedPreKey: [SignedPreKey](_whatsdapp_.md#signedprekey)  } ; updatedAt: Date  }

*Defined in [lib/WhatsDapp.ts:28](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L28)*

#### Type declaration:

Name | Type |
------ | ------ |
`createdAt` | Date |
`data` | { displayname: string ; identityKey: Array<string\> ; preKey: [PreKey](_whatsdapp_.md#prekey) ; prekeys: Array<string\> ; registrationId: number ; signedPreKey: [SignedPreKey](_whatsdapp_.md#signedprekey)  } |
`updatedAt` | Date |

___

### SignedPreKey

Ƭ  **SignedPreKey**: { keyId: number ; publicKey: Array<string\>  }

*Defined in [lib/WhatsDapp.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L41)*

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | number |
`publicKey` | Array<string\> |

___

### TimerHandle

Ƭ  **TimerHandle**: ReturnType<*typeof* setTimeout\>

*Defined in [lib/WhatsDapp.ts:8](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L8)*

___

### WhatsDappConnection

Ƭ  **WhatsDappConnection**: { identity: any ; ownerId: any ; platform: any  }

*Defined in [lib/WhatsDapp.ts:104](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L104)*

#### Type declaration:

Name | Type |
------ | ------ |
`identity` | any |
`ownerId` | any |
`platform` | any |

___

### WhatsDappMessageContent

Ƭ  **WhatsDappMessageContent**: { deleteTime: number ; message: string  }

*Defined in [lib/WhatsDapp.ts:94](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L94)*

#### Type declaration:

Name | Type |
------ | ------ |
`deleteTime` | number |
`message` | string |

___

### WhatsDappProfileContent

Ƭ  **WhatsDappProfileContent**: { displayname: string ; identityKey: string ; preKey: string ; prekeys: Array<string\> ; registrationId: string ; signedPreKey: string  }

*Defined in [lib/WhatsDapp.ts:76](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L76)*

#### Type declaration:

Name | Type |
------ | ------ |
`displayname` | string |
`identityKey` | string |
`preKey` | string |
`prekeys` | Array<string\> |
`registrationId` | string |
`signedPreKey` | string |

___

### WhatsDappSession

Ƭ  **WhatsDappSession**: { identity_receiver: string ; profile_name: string  }

*Defined in [lib/WhatsDapp.ts:21](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L21)*

#### Type declaration:

Name | Type |
------ | ------ |
`identity_receiver` | string |
`profile_name` | string |

## Variables

### pollInterval

• `Const` **pollInterval**: 5000 = 5000

*Defined in [lib/WhatsDapp.ts:110](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L110)*

## Functions

### makeClient

▸ **makeClient**(`mnemonic?`: undefined \| string): [DashClient](_types_dashtypes_.md#dashclient)

*Defined in [lib/WhatsDapp.ts:297](https://github.com/realKidDouglas/whatsdapp-lib/blob/b70ff17/lib/WhatsDapp.ts#L297)*

#### Parameters:

Name | Type |
------ | ------ |
`mnemonic?` | undefined \| string |

**Returns:** [DashClient](_types_dashtypes_.md#dashclient)
