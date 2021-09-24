
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

/*
* Attributes:
* - ownerID: dash identity of the profile you can query (not a public key).
* - identityKey: X3DH
* - registrationId: X3DH
* - signedPreKey: X3DH
* - preKey: X3DH
* - PreKeys: X3DH, should be used only once.
*/

const userProfileContractFormat = {
  
  //TODO: update prekeys

  profile: {
    type: "object",
    indices: [
      {
        properties: [
          {$ownerId: "asc"},
        ],
        unique: true
      }
    ],
    properties: {
      identityKey: {
        "type": "array",
        "byteArray": true,
        "minItems": 30,
        "maxItems": 40
      },
      registrationId:{
        type: "number",
        maxLength: 500,
      },
      preKey: {
        type: "object",
        properties: {
          keyId: {
            type: "number",
            maxLength: 500
          },
          publicKey: {
            "type": "array",
            "byteArray": true,
            "minItems": 30,
            "maxItems": 40
          }
        },
        additionalProperties: false
      },
      signedPreKey: {
        type: "object",
        properties: {
          keyId: {
            type: "number",
            maxLength: 500
          },
          publicKey: {
            "type": "array",
            "byteArray": true,
            "minItems": 30,
            "maxItems": 40
          },
          signature: {
            "type": "array",
            "byteArray": true,
            "minItems": 30,
            "maxItems": 70
          }
        },
        additionalProperties: false
      },
      prekeys: {
        type: "array",
        items: {
          type: "string",
          maxLength: 500
        }
      },
      displayname: {
        type: "string",
        maxLength: 50
      }
    },
    required: ["identityKey", "registrationId", "preKey", "signedPreKey", "$createdAt", "$updatedAt"],
    additionalProperties: false
  }
};

/*
* Attributes:
* - receiver: ID of receiver in base58Check
* - messages: encrypted messages with timestamp and sender id.
*/

const messageContractFormat = {
  message: {
    type: "object",
    indices: [
      {
        properties: [
          {$ownerId: "asc"},
        ]
      },
      {
        properties: [
          {receiverid: "asc"},
        ]
      },
      {
        properties: [
          {$createdAt: "desc"}
        ]
      }
    ],
    properties: {
      receiverid: {
        type: "string",
        maxLength: 500
      },
      content: {
        type: "string",
      }
    },
    required: ["receiverid", "content", "$createdAt", "$updatedAt"],
    additionalProperties: false
  }
};

const contracts : Record<string, PlatformContract>= {
  "profile_contract":{

    //TODO: script for updating contracts

    //TODO: new contracts
    contractId: "DjMSzc5bRDij3UN1W8E5dKsbxki9vYQ67ChNKKTTUHwm",
    contractFormat: userProfileContractFormat
  },
  "message_contract": {
    contractId: "FKY4fxmSzbDKewQRKsytxZ8HMBNgM2oTbzSKVEbtr2eP",
    contractFormat: messageContractFormat
  }
};

export default contracts;
