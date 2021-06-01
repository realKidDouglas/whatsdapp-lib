/* eslint @typescript-eslint/no-var-requires: "off" */

require('ts-node').register();

const Dash = require('dash');
const env = require('../env');
const contracts = require("../src/dapi/dash_client/Contracts.ts").default;
const apps = Object.fromEntries(Object.entries(contracts)
  .map(([key, {contractId}]) => [key, {contractId}]));

const client = new Dash.Client({
  network: "testnet",
  wallet:{
    mnemonic: env.ALICE_WALLET.mnemonic,
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
    }
  },
  apps
});

const retrieveIdentity = async () => {
  const {platform} = client;
  const identity = await platform.identities.get('CRzGj9J4aw1MunxnMNmBV6FWH3rch9TA5A87NMwP6yjD');
  console.log(identity);
  const docProperties = {
    receiverId: "horst",
    content: "everything is contenteverything is contenteverything ",
  };

  // Create the note document
  const noteDocument = await platform.documents.create(
    'message_contract.message',
    identity,
    docProperties,
  );

  const documentBatch = {
    create: [noteDocument], // Document(s) to create
    replace: [],            // Document(s) to update
    delete: [],             // Document(s) to delete
  };
  // Sign and submit the document(s)
  return platform.documents.broadcast(documentBatch, identity);
};

retrieveIdentity()
  .then((d) => console.log('document retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e.message, e.code))
  .finally(() => client.disconnect());
