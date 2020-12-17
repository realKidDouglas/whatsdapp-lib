# Documentation
This folder contain the Documentation for this Lib.
- To see details about the Data contracts dive in [data_contracts.md](data_contracts.md)
- To see details about signal dive in [signal.md](signal.md)
- To see details about ...

# Class Diagram

- Auf der linken seite sehen wir die WhatsDapp Klasse, die kapselt alle aufrufe zu einer einzigen Klasse. Jemand der diese Api nutzt sollte ausschließlich diese Klasse verwenden.
- In der Klasse SignalWrapper werden alle aufrufe der Signal-lib gebündelt.
- DAPI_Facade Kapselt alle aufrufe gegen die DAPI der Dash Platform.


# Ts-Doc
To generate Typescript-Docs use [this](https://www.npmjs.com/package/typedoc-plugin-markdown).

1. npm install --save-dev typedoc typedoc-plugin-markdown
2. npm install, typedoc need all npm modules.
3. npx typedoc --plugin typedoc-plugin-markdown --out doc/tsdocs lib/
