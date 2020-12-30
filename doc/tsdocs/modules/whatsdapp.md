[whatsdapp](../README.md) / [Exports](../modules.md) / WhatsDapp

# Module: WhatsDapp

## Index

### Classes

* [WhatsDapp](../classes/whatsdapp.whatsdapp-1.md)

### Type aliases

* [PreKey](whatsdapp.md#prekey)
* [RawMessage](whatsdapp.md#rawmessage)
* [RawProfile](whatsdapp.md#rawprofile)
* [SignedPreKey](whatsdapp.md#signedprekey)
* [WhatsDappConnection](whatsdapp.md#whatsdappconnection)
* [WhatsDappProfileContent](whatsdapp.md#whatsdappprofilecontent)

## Type aliases

### PreKey

Ƭ **PreKey**: { `keyId`: *number* ; `publicKey`: *Array*<*string*\> ; `signature`: *Array*<*string*\>  }

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | *number* |
`publicKey` | *Array*<*string*\> |
`signature` | *Array*<*string*\> |

Defined in: [lib/WhatsDapp.ts:46](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L46)

___

### RawMessage

Ƭ **RawMessage**: { `createdAt`: Date ; `data`: { `content`: *string* ; `receiverId`: *string*  } ; `id`: *Array*<*string*\> ; `ownerId`: *Array*<*string*\>  }

#### Type declaration:

Name | Type |
------ | ------ |
`createdAt` | Date |
`data` | { `content`: *string* ; `receiverId`: *string*  } |
`id` | *Array*<*string*\> |
`ownerId` | *Array*<*string*\> |

Defined in: [lib/WhatsDapp.ts:52](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L52)

___

### RawProfile

Ƭ **RawProfile**: { `createdAt`: Date ; `data`: { `displayname`: *string* ; `identityKey`: *Array*<*string*\> ; `preKey`: [*PreKey*](whatsdapp.md#prekey) ; `prekeys`: *Array*<*string*\> ; `registrationId`: *number* ; `signedPreKey`: [*SignedPreKey*](whatsdapp.md#signedprekey)  } ; `updatedAt`: Date  }

#### Type declaration:

Name | Type |
------ | ------ |
`createdAt` | Date |
`data` | { `displayname`: *string* ; `identityKey`: *Array*<*string*\> ; `preKey`: [*PreKey*](whatsdapp.md#prekey) ; `prekeys`: *Array*<*string*\> ; `registrationId`: *number* ; `signedPreKey`: [*SignedPreKey*](whatsdapp.md#signedprekey)  } |
`updatedAt` | Date |

Defined in: [lib/WhatsDapp.ts:28](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L28)

___

### SignedPreKey

Ƭ **SignedPreKey**: { `keyId`: *number* ; `publicKey`: *Array*<*string*\>  }

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | *number* |
`publicKey` | *Array*<*string*\> |

Defined in: [lib/WhatsDapp.ts:41](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L41)

___

### WhatsDappConnection

Ƭ **WhatsDappConnection**: { `identity`: *any* ; `ownerId`: *any* ; `platform`: *any*  }

#### Type declaration:

Name | Type |
------ | ------ |
`identity` | *any* |
`ownerId` | *any* |
`platform` | *any* |

Defined in: [lib/WhatsDapp.ts:106](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L106)

___

### WhatsDappProfileContent

Ƭ **WhatsDappProfileContent**: { `displayname`: *string* ; `identityKey`: *string* ; `preKey`: *string* ; `prekeys`: *Array*<*string*\> ; `registrationId`: *string* ; `signedPreKey`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`displayname` | *string* |
`identityKey` | *string* |
`preKey` | *string* |
`prekeys` | *Array*<*string*\> |
`registrationId` | *string* |
`signedPreKey` | *string* |

Defined in: [lib/WhatsDapp.ts:76](https://github.com/realKidDouglas/whatsdapp-lib/blob/5db9bb0/lib/WhatsDapp.ts#L76)
