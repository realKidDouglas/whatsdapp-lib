# WhatsDapp

Attempt at a secure messaging library using the js-dash-sdk.

clone it next to your dapi-testprojekt folder (see dapicli dependencies in its [package.json](https://gitlab.com/hsh-mpro-blockchain-ws20/dapi-testprojekt/-/blob/master/package.json))

## Testing
can be tested by using the dapicli tool and pasting the following code ('alice' needs to be a funded wallet in dapicli):

```js
await open('alice')
c.add(0, 'message_alice', './contracts/message_contract.json')
await d.get('message_alice.note', {}) // should return []
let messenger = m.get()
let si = await messenger.createSessionIdentity()
let client = messenger._client
let st = await client.platform.documents.create('message_alice.note', si._identity, {message:"SessionIdentity Hello"})
let stateTransition = await messenger.broadcastDocumentBatch(client.platform, {create: [st]}, si)
await d.get('message_alice.note', {}) // there's a document there with ownerId of si._identity
stateTransition = await messenger.broadcastDocumentBatch(client.platform, {'delete': [st]}, si)
await d.get('message_alice.note', {}) // empty again
```
