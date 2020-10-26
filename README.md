# WhatsDapp
```js
await open('alice')
c.add(0, 'message_alice', './contracts/message_contract.json')
await d.get('message_alice.note', {})
let messenger = m.get()
let si = await messenger.createSessionIdentity()
let client = messenger._client
let st = await client.platform.documents.create('message_alice.note', si._identity, {message:"SessionIdentity Hello"})
let stateTransition = await messenger.broadcastDocumentBatch(client.platform, {create: [st]}, si)
await d.get('message_alice.note', {})
stateTransition = await messenger.broadcastDocumentBatch(client.platform, {'delete': [st]}, si)
await d.get('message_alice.note', {})
```
