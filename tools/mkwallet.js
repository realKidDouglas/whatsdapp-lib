/* eslint @typescript-eslint/no-var-requires: "off" */

const Dash = require('dash');

const clientOpts = {
        network: 'testnet',
        wallet: {
            mnemonic: null,
            offlineMode: true,
        },
};

const client = new Dash.Client(clientOpts);

const createWallet = async () => {
    const account = await client.getWalletAccount();

    const mnemonic = client.wallet.exportWallet();
    const address = account.getUnusedAddress();
    console.log('Mnemonic:', mnemonic);
    console.log('Unused address:', address.address);
};

createWallet()
    .catch((e) => console.error('Something went wrong:\n', e))
.finally(() => client.disconnect());

// Handle wallet async errors
client.on('error', (error, context) => {
    console.error(`Client error: ${error.name}`);
console.error(context);
});
