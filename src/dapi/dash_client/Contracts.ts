
/**
 * information about a deployed contract on the
 * dash platform
 */
export type PlatformContract = {
  // the actual contract that's to be used by the contract
  contractId : string,
  // the contract definition that was broadcast to deploy
  contractFormat: unknown
}

//Dash Index Constraints: https://dashplatform.readme.io/docs/platform-protocol-reference-data-contract#index-constraints

/*
* Attributes:
* TODO: docs
*/

const profileContractFormat = {
  //TODO: update prekeys
  profile: {
    type: "object",
    indices: [
      {
        properties: [
          { $ownerId: "asc" },
        ],
        unique: true
      },
    ],
    properties: {
      signalKeyBundle: {
        type: "object",
        properties: {
          preKeys: {
            type: "array",
            minItems: 1,
            maxItems: 100,
            items: {
              type: "object",
              properties: {
                keyId: {
                  type: "number",
                },
                publicKey: {
                  type: "array",
                  byteArray: true,
                  minItems: 33,
                  maxItems: 33
                }
              },
              required: [
                "keyId",
                "publicKey",
              ],
              additionalProperties: false
            },
          },
          identityKey: {
            type: "array",
            byteArray: true,
            minItems: 33,
            maxItems: 33
          },
          registrationId: {
            type: "number",
          },
          signedPreKey: {
            type: "object",
            properties: {
              keyId: {
                type: "number",
              },
              publicKey: {
                type: "array",
                byteArray: true,
                minItems: 33,
                maxItems: 33
              },
              signature: {
                type: "array",
                byteArray: true,
                minItems: 64,
                maxItems: 64
              },
            },
            required: [
              "keyId",
              "publicKey",
              "signature",
            ],
            additionalProperties: false
          },
        },
        required: [
          "preKeys",
          "identityKey",
          "registrationId",
          "signedPreKey",
        ],
        additionalProperties: false
      },
      //optional
      nickname: {
        type: "string",
        maxLength: 100
      },
    },
    required: [
      "signalKeyBundle",
      "$id",
      "$createdAt",
      "$updatedAt"
    ],
    additionalProperties: false
  }
};

/*
* Attributes:
* TODO: docs
*/

const messageContractFormat = {
  message: {
    type: "object",
    indices: [
      {
        //for delete all messages
        properties: [
          {$ownerId: "asc"},
        ]
      },
      {
        //for message after timestamp queries
        properties: [
          {recipientId: "asc"},
          {$updatedAt: "asc"},
        ]
      },
      {
        properties: [
          {$updatedAt: "desc"}
        ]
      }
    ],
    properties: {
      recipientId: {
        // type: "array",
        // byteArray: true,
        // minItems: 33,
        // maxItems: 33
        type: "string",
        maxLength: 50
      },
      payload: {
        type: "array",
        byteArray: true,
      }
    },
    required: [
      "recipientId", 
      "payload", 
      "$createdAt", 
      "$updatedAt"],
    additionalProperties: false
  }
};

const whatsDappContracts : Record<string, PlatformContract>= {
  "profile_contract":{
    // contractId: "brGVMsrJRYghfHMCD3ku5oQXHodvoPJEdt2nLkykpc3", //old with only one prekey
    contractId: "CJV1nJduxpfRY9JdCayDzmXKEH6ALu1pev2enVAi4Sg8",
    contractFormat: profileContractFormat
  },
  "message_contract": {
    // contractId: "ERpJDghoZZvD8QFjZXxGjg3LhMBQrFMzKtDHkZrT8uAU", //old with 500 id string
    // contractId: "3yKm4jsnAykeYZrEzzoCUU4gHpzvD1M2JxR8cuW4Lzau", //old desc updatedAt
    contractId: "78Bg23U83kUD4EereMWovWsB8idwMSbd5n4BRDpgEjuu",
    contractFormat: messageContractFormat
  }
};

export default whatsDappContracts;
