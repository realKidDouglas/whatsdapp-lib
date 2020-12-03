import {DashClient} from "../types/DashTypes";

export async function createWallet(client: DashClient): Promise<any> {
  try {
    if (client.wallet) return client.wallet.exportWallet();
  } catch (e) {
    console.log('Something went wrong:', e);
  }
}

export async function getUnusedAddress(client: DashClient): Promise<any> {
  try {
    const account = await client.getWalletAccount();
    const address = account.getUnusedAddress();

    return address;
  } catch (e) {
    console.log('Something went wrong:', e);
  }
}
