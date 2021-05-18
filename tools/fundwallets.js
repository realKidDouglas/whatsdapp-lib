/* eslint @typescript-eslint/no-var-requires: "off" */

/*
  send dash to the alice & bob wallets in the env.json
 */

require('ts-node').register();
const Dash = require('dash');
const env = require('../env');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: env.TESTNET_DEPLOY_WALLET.mnemonic,
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 450000,
    },
  },
};
const client = new Dash.Client(clientOpts);

const sendFunds = async (recipients) => {
  const account = await client.getWalletAccount();
  const res = [];

  for(let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    console.log("sending 1D to", recipient);
    const transaction = account.createTransaction({
      recipient,
      satoshis: 100000000, // 1 Dash
    });
    res.push(await account.broadcastTransaction(transaction));
  }
  return res;
};

sendFunds([env.BOB_WALLET.address,env.ALICE_WALLET.address])
  .then(d => console.log('Transaction broadcast!\nTransaction IDs:', d))
  .catch(e => {
    console.error('Something went wrong:\n', e);
    process.exit(1);
  })
  .finally(() => client.disconnect());

// Handle wallet async errors
client.on('error', (error, context) => {
  console.error(`Client error: ${error.name}`);
  console.error(context);
  process.exit(1);
});
