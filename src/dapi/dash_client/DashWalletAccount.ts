import type {Account, Identities} from "@dashevo/wallet-lib";

export type DashWalletAccount = Account & {
  identities: Identities,
};
