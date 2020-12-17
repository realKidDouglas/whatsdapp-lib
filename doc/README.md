# Documentation
This folder (will) contain the Documentation for this Lib.
- To see details about the Data contracts dive in [data_contracts.md](data_contracts.md)
- ...

# Tsdoc
To generate Typescript-Docs we used [this](https://www.npmjs.com/package/typedoc-plugin-markdown).

1. npm install --save-dev typedoc typedoc-plugin-markdown
2. npm install, typedoc need all npm modules.
3. npx typedoc --plugin typedoc-plugin-markdown --out doc/tsdocs lib/
