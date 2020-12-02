# WhatsDapp

## Overview

- [Abstract](#abstract)
- [Goals](#goals)
- [Usage](#usage)
    - [Install](#install)
    - [Quick start](#quick start)
    - [Used packages](#used packages)
- [Pitfall](#pitfall)
- [License](#license)



## Abstract
This is a library to apply signal-protocol to Dash-Drive.

Signal is a messaging-protocol to send every message absolutliy secure over unsecury structurs.
This is achieved via Diffie-Hellman key exchange for every message.
For more information consolidate this [page](https://signal.org/docs/specifications/x3dh/#security-considerations).

Dash is a ...


Attempt at a secure messaging library using the js-dash-sdk.
clone it next to your messenger-dapp-gui-prototype folder

## Goals

- Vorteile von Dash,
    - Manipulationssicher
    - DDOS sicher
    - Blockierungssicher

- Vorteile Signal
    - jede Nachricht wird mit eigenem Key verschlüsselt, geht ein Key verloren, ist nur die eine Nachricht betroffen die mit diesem Key verschlüsselt wurde
    - 

Gesamtziel: secure and safty messaging without dependency of any company

## Usage


### Install 

-
-
-


### Quick start

-
-
-
-

### Used packages

- https://github.com/ForstaLabs/libsignal-node
    - diese Package wird verwendet, weil das offizielle nicht ohne Browser funktioniert (fehler hinzufügen?)
    - alternative: https://github.com/signalapp/libsignal-protocol-javascript
- https://github.com/dy/arraybuffer-to-string
- https://github.com/dashevo/js-dash-sdk
- 

## Pitfall
- auf XSS attacken hinweisen

## License
Licensed under the GPLv3: http://www.gnu.org/licenses/gpl-3.0.html
