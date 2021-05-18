/* eslint @typescript-eslint/no-var-requires: "off" */
require('ts-node').register();
const Dash = require('dash');
const env = require('../env');
const contracts = require('../src/dapi/dash_client/Contracts');

const clientOpts = {
  wallet: {
    mnemonic: env.TESTNET_DEPLOY_WALLET.mnemonic,
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
    },
  },
};
const client = new Dash.Client(clientOpts);

const registerContracts = async (contractDocuments, identity, platform) => {
  const ret = [];
  const err = [];

  for(let i = 0; i < contractDocuments.length; i++) {
    const contract = await platform.contracts.create(contractDocuments[i], identity);
    const validationResult = await platform.dpp.dataContract.validate(contract);

    if (validationResult.isValid()) {
      console.log('Validation passed, broadcasting contract..');
      ret.push(await platform.contracts.broadcast(contract, identity));
    } else {
      err.push(...validationResult.errors);
    }

    await new Promise(r => setTimeout(r, 10000));
  }
  if(err.length > 0) throw err;
  return ret;
};

const contractFormats = [
  contracts.default.message_contract.contractFormat,
  contracts.default.profile_contract.contractFormat
];

console.log(contractFormats);

client.platform.identities.get(env.TESTNET_DEPLOY_WALLET.identity)
  .then(identity => registerContracts(contractFormats, identity, client.platform))
    .catch((e) => console.error('contract err:\n', e))
    .then((d) => console.log('Contracts registered:\n', d[0].toJSON(), d[1].toJSON()))
    .finally(() => client.disconnect());

