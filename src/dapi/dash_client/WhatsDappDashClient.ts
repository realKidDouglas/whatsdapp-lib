import contracts from "./Contracts";
import {DashClient} from "../../types/DashTypes";
import DashSDK from "dash";

/**
 * create a properly configured dash client
 * @param mnemonic
 */

//TODO: what happens if it's null?
export function getWhatsDappDashClient(mnemonic: string | null): DashClient {
  //init client with contracts, so we can use the dot-notation to retrieve contracts
  const apps = Object.fromEntries(Object.entries(contracts)
    .map(([key, {contractId}]) => [key, {contractId}]));
  const clientOpts = {
    network: 'testnet',
    wallet: {
      mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 500000, // only sync from mid of 2021
      },
    },
    apps
  };
  return new DashSDK.Client(clientOpts);
}
