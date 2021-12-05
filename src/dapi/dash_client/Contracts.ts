
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
          preKey: {
            type: "object",
            properties: {
              keyId: {
                type: "number",
              },
              publicKey: {
                type: "array",
                byteArray: true,
                minItems: 30,
                maxItems: 40
              }
            },
            required: [
              "keyId",
              "publicKey",
            ],
            additionalProperties: false
          },
          identityKey: {
            type: "array",
            byteArray: true,
            minItems: 30,
            maxItems: 40
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
                minItems: 30,
                maxItems: 40
              },
              signature: {
                type: "array",
                byteArray: true,
                minItems: 30,
                maxItems: 70
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
          "preKey",
          "identityKey",
          "registrationId",
          "signedPreKey",
        ],
        additionalProperties: false
      },
      //optional
      nickname: {
        type: "string",
        maxLength: 50
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
          {$updatedAt: "desc"},
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
        type: "string",
        maxLength: 500
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
    contractId: "brGVMsrJRYghfHMCD3ku5oQXHodvoPJEdt2nLkykpc3",
    contractFormat: profileContractFormat
  },
  "message_contract": {
    contractId: "ERpJDghoZZvD8QFjZXxGjg3LhMBQrFMzKtDHkZrT8uAU",
    contractFormat: messageContractFormat
  }
};

export default whatsDappContracts;
