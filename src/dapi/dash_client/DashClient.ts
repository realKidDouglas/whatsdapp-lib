import contracts from "./Contracts";
import {DashClient} from "../../types/DashTypes";
import DashSDK from "dash";
import {Platform} from "dash/dist/src/SDK/Client/Platform";
import {cast} from "../../types/cast";

/**
 * create a properly configured dash client
 * @param mnemonic
 */
export function makeClient(mnemonic: string | null): DashClient & {platform: Platform} {
  const apps = Object.fromEntries(Object.entries(contracts)
    .map(([key, {contractId}]) => [key, {contractId}]));
  const clientOpts = {
    network: 'testnet',
    wallet: {
      mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 491290, // only sync from 2021-05-01
      },
    },
    apps
  };
  const client = new DashSDK.Client(clientOpts);
  if(!client.platform) throw new Error("no platform in client!");
  return cast(client);
}
