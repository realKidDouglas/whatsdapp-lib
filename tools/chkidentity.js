/* eslint @typescript-eslint/no-var-requires: "off" */

const Dash = require('dash');
const env = require('../env');
const client = new Dash.Client();

const retrieveIdentity = async () => {
  // return client.platform.identities.get(env.TESTNET_DEPLOY_WALLET.identity);
  return client.platform.identities.get('HK4WrC2eMRKVDWJbvRjt4nswFSkmhGfCcgDKDhFeAZKw');
};

retrieveIdentity()
  .then((d) => console.log('Identity retrieved:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
