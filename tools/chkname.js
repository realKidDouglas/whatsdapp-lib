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

const registerName = async () => {
  const { platform } = client;

  const identity = await platform.identities.get('HK4WrC2eMRKVDWJbvRjt4nswFSkmhGfCcgDKDhFeAZKw');
  console.log('got identity');
  const nameRegistration = await platform.names.register(
    'allicewd.dash',
    { dashUniqueIdentityId: identity.getId() },
    identity,
  );

  return nameRegistration;
};

registerName()
.then((d) => console.log('Name registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
