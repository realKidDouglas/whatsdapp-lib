/* eslint @typescript-eslint/no-var-requires: "off" */
const Dash = require('dash');
const env = require('../env');

const wrong_id = 'CRzGj9J4aw1MunxnMNmAV6FWH3rch9TA5A87NMwP6yjD';

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

const topupIdentity = async () => {
  const topUpAmount = 1; // Number of duffs

  await client.platform.identities.topUp(wrong_id, topUpAmount);
  return client.platform.identities.get(wrong_id);
};

topupIdentity()
  .then((d) => console.log('Identity credit balance: ', d.balance))
  .catch((e) => console.error(
    'Something went wrong:\n',
    JSON.stringify(e),
    e.error, "||",
    e.message, "||",
    e.code, "||"
  ))
  .finally(() => client.disconnect());
