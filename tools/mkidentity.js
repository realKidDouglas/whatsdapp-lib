/* eslint @typescript-eslint/no-var-requires: "off" */

/*
*
* create an identity for the testnet deploy wallet & top it up
*
 */

require('ts-node').register();
const Dash = require('dash');
const env = require('../env');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: env.ALICE_WALLET.mnemonic,
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
    },
  },
};
const client = new Dash.Client(clientOpts);

const createIdentity = async () => {
  return client.platform.identities.register(10);
};

createIdentity()
  .then((d) => console.log('Identity:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
