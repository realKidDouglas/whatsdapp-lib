[whatsdapp](../README.md) / [Exports](../modules.md) / WhatsDapp

# Module: WhatsDapp

## Index

### Enumerations

* [WhatsDappEvent](../enums/whatsdapp.whatsdappevent.md)

### Classes

* [WhatsDapp](../classes/whatsdapp.whatsdapp-1.md)

### Type aliases

* [PreKey](whatsdapp.md#prekey)
* [RawMessage](whatsdapp.md#rawmessage)
* [RawPreKeyBundle](whatsdapp.md#rawprekeybundle)
* [RawProfile](whatsdapp.md#rawprofile)
* [SignedPreKey](whatsdapp.md#signedprekey)
* [WhatsDappConnection](whatsdapp.md#whatsdappconnection)
* [WhatsDappPrivateData](whatsdapp.md#whatsdappprivatedata)
* [WhatsDappProfileContent](whatsdapp.md#whatsdappprofilecontent)
* [WhatsDappSession](whatsdapp.md#whatsdappsession)
* [WhatsDappUserData](whatsdapp.md#whatsdappuserdata)

## Type aliases

### PreKey

Ƭ **PreKey**: { `keyId`: *number* ; `publicKey`: *Array*<*string*\> ; `signature`: *Array*<*string*\>  }

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | *number* |
`publicKey` | *Array*<*string*\> |
`signature` | *Array*<*string*\> |

Defined in: [src/WhatsDapp.ts:48](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L48)

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

Defined in: [src/WhatsDapp.ts:54](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L54)

___

### RawPreKeyBundle

Ƭ **RawPreKeyBundle**: { `displayname`: *string* ; `identityKey`: *Array*<*string*\> ; `preKey`: [*PreKey*](whatsdapp.md#prekey) ; `prekeys`: *Array*<*string*\> ; `registrationId`: *number* ; `signedPreKey`: [*SignedPreKey*](whatsdapp.md#signedprekey)  }

#### Type declaration:

Name | Type |
------ | ------ |
`displayname` | *string* |
`identityKey` | *Array*<*string*\> |
`preKey` | [*PreKey*](whatsdapp.md#prekey) |
`prekeys` | *Array*<*string*\> |
`registrationId` | *number* |
`signedPreKey` | [*SignedPreKey*](whatsdapp.md#signedprekey) |

Defined in: [src/WhatsDapp.ts:27](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L27)

___

### RawProfile

Ƭ **RawProfile**: { `createdAt`: Date ; `data`: [*RawPreKeyBundle*](whatsdapp.md#rawprekeybundle) ; `updatedAt`: Date  }

#### Type declaration:

Name | Type |
------ | ------ |
`createdAt` | Date |
`data` | [*RawPreKeyBundle*](whatsdapp.md#rawprekeybundle) |
`updatedAt` | Date |

Defined in: [src/WhatsDapp.ts:37](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L37)

___

### SignedPreKey

Ƭ **SignedPreKey**: { `keyId`: *number* ; `publicKey`: *Array*<*string*\>  }

#### Type declaration:

Name | Type |
------ | ------ |
`keyId` | *number* |
`publicKey` | *Array*<*string*\> |

Defined in: [src/WhatsDapp.ts:43](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L43)

___

### WhatsDappConnection

Ƭ **WhatsDappConnection**: { `identity`: *any* ; `ownerId`: *any* ; `platform`: *any*  }

#### Type declaration:

Name | Type |
------ | ------ |
`identity` | *any* |
`ownerId` | *any* |
`platform` | *any* |

Defined in: [src/WhatsDapp.ts:94](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L94)

___

### WhatsDappPrivateData

Ƭ **WhatsDappPrivateData**: { `identityKeyPair`: [*SignalKeyPair*](types_libsignal.md#signalkeypair) ; `preKey`: [*SignalPreKey*](types_libsignal.md#signalprekey) ; `registrationId`: *number* ; `signedPreKey`: [*SignalSignedPreKey*](types_libsignal.md#signalsignedprekey)  }

#### Type declaration:

Name | Type |
------ | ------ |
`identityKeyPair` | [*SignalKeyPair*](types_libsignal.md#signalkeypair) |
`preKey` | [*SignalPreKey*](types_libsignal.md#signalprekey) |
`registrationId` | *number* |
`signedPreKey` | [*SignalSignedPreKey*](types_libsignal.md#signalsignedprekey) |

Defined in: [src/WhatsDapp.ts:107](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L107)

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

Defined in: [src/WhatsDapp.ts:64](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L64)

___

### WhatsDappSession

Ƭ **WhatsDappSession**: { `identity_receiver`: *string* ; `profile_name`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`identity_receiver` | *string* |
`profile_name` | *string* |

Defined in: [src/WhatsDapp.ts:12](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L12)

___

### WhatsDappUserData

Ƭ **WhatsDappUserData**: { `displayName`: *string* ; `dpnsName`: *string* ; `identityAddr`: *string* ; `mnemonic`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`displayName` | *string* |
`dpnsName` | *string* |
`identityAddr` | *string* |
`mnemonic` | *string* |

Defined in: [src/WhatsDapp.ts:100](https://github.com/realKidDouglas/whatsdapp-lib/blob/73a2f4d/src/WhatsDapp.ts#L100)
