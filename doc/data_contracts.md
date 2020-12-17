# Data Contracts

## User Profile
Attributes:
- ownerID: dash identity of the profile you can query (not a public key).
- identityKey: X3DH
- registrationId: X3DH
- signedPreKey: X3DH
- preKey: X3DH
- PreKeys: X3DH, should be used only once.


```
const contractDocuments = {
		profile: {
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
```


## Message
Attributes:
- receiver: ID of receiver in base58Check
- messages: encrypted messages with timestamp and sender id.


```
const contractDocuments = {
			message: {
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
							{$createdAt: "asc"}
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
```
