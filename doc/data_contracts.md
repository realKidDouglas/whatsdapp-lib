# Data Contracts

## User Profil
Attribute:
- OwnerID: ID des Profils, nachdem gequeried werden kann.
- identityKey: Für X3DH - Würde den Identity-Public-Key dafür nehmen
- registrationId: Für X3DH
- signedPreKey: Für X3DH
- preKey: Für X3DH
- Pre Keys: Für X3DH, nur einmal gültig. Jeder Key braucht ne Unique ID. Werden ID's wiederverwendet, könnte es zu Kollisionen kommen
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

Anmerkungen:
1. OwnerID ist die ID der Identity (nicht der Public Key)
2. Resolve von DPNS zu Identity sollte auf der Clientseite mittels SDK stattfinden
3. Alle Attribute sind öffentlich einsehbar und es kann nur nach OwnerID gesucht werden


## Message
Attribute:
- Receiver: ID in Base58Check vom Empfänger
- Messages: Verschlüsselste Nachrichten via Ratchet mit Timestamp und Sender


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