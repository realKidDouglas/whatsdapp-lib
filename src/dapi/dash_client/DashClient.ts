import contracts from "./Contracts";
import {DashClient} from "../../types/DashTypes";
import DashSDK from "dash";

/**
 * create a properly configured dash client
 * @param mnemonic
 */
export function makeClient(mnemonic: string | null): DashClient {
  const apps = Object.fromEntries(Object.entries(contracts)
    .map(([key, {contractId}]) => [key, {contractId}]));
  const clientOpts = {
    network: 'testnet',
    wallet: {
      mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
      },
    },
    apps
  };
  return new DashSDK.Client(clientOpts);
}
