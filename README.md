<img src="/images/whatsDapp.png" width="100" height="100">

# WhatsDapp

<img src="https://img.shields.io/github/workflow/status/realKidDouglas/whatsdapp-lib/tests" alt="checks status">

WhatsDapp library applies the signal-protocol to the Dash Drive blockchain.

The prototype of our reference implementation Dapp you'll find here:
https://github.com/realKidDouglas/whatsdapp-ui-example

This development corresponds to the [Private Messenger Dapp project](https://trello.com/c/LUyEnwJ9/46-private-messenger-dapp) 
on Dash Incubator App.

There will be several variants of obfuscation in future. 
Find details in our [concept](https://docs.google.com/document/d/e/2PACX-1vSFlK-EMX8ItSCOH4cqDLcNncb--vzK2EI-3xzjWPwwbM9IGRj4j4wabeyc7QlZ_E1iSjReXZkC7VMr/pub)
.


# Goals
The core of whatsDapp as a private messenger library should be an asynchronous, 
censorship- and ddos-resistant (availability) end-2-end-encrypted communication channel (integrity) 
with forward- and backward-secrecy (confidentiality).


## Why Signal?
Storing private messages in the blockchain *forever* is risky.
For that we chose Signal protocol for its forward- and backward-secrecy. 
This way it’s not possible to find any previous or future keys from one compromised message-key. 
The basis is a double-key-ratchet that generates new keys for every message of each session. 
One ratchet performs extended triple Diffie-Hellman (X3DH) based on EC. 
There are 4 keypairs used for generating session key. 
This session key then runs through a hash-ratchet that generates new keys for each message. 
Each message will be encrypted AES-256 with kind of HMAC with an unique key. 
For further well-arranged protocol info see https://signal.org/docs/specifications/x3dh/ .


# Doc

- Jump in [documentation folder](/doc).

- Current [data contracts](/doc/data_contracts.md).

- Find Typedoc documentation in [doc/tsdocs/](/doc/tsdocs/).  
(converted with https://www.npmjs.com/package/typedoc-plugin-markdown)


# Pitfall

- Currently our implementation does not support refreshing signals prekey bundle. 
  Changing these keys periodically ensures the forward secrecy.
  Not changing it and keeping private prekey hides the risk of leaking it and the possibility of reconstructing session-keys.
  - We will go this on soon ;)

- Messages you receive are not validated yet, just decrypted and displayed. We need to think about XSS protection.


# Requirements
 - node v12+
 - npm v6+

## Used packages

- Node implementation of signal library: https://github.com/ForstaLabs/libsignal-node
  - The official [js signal-protocol](https://github.com/signalapp/libsignal-protocol-javascript) 
  needs crypto-feature of a browser and is not suitable for node.
- [Dash SDK](https://github.com/dashevo/js-dash-sdk)


# License
[Licensed under the MIT License](https://opensource.org/licenses/MIT).

Note that the [signal-protocol lib](https://www.npmjs.com/package/libsignal) we currently use is licensed under the [GPLv3](http://www.gnu.org/licenses/gpl-3.0.html).
