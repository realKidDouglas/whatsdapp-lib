# Documentation
This folder (will) contain the Documentation for this Lib.
- To see details about the Data contracts dive in [data_contracts.md](data_contracts.md)
- ...

# Tsdoc
To generate Typescript-Docs we used [this](https://www.npmjs.com/package/typedoc-plugin-markdown).
1. npm install --global typedoc
2. npm install --legacy-peer-deps --save-dev typedoc typedoc-plugin-markdown
3. npm install, typedoc need all npm modules.
4. npx typedoc --plugin typedoc-plugin-markdown --out doc/tsdocs lib/
5. in Folder doc/tsdoc delete README.md and rename modules.md to README.md
