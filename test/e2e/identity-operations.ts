import o from 'ospec';
import * as Identity_DAO from "../../src/dapi/Identity_DAO";
import {makeClient} from "../../src/dapi/dash_client/DashClient";
import {InsufficientDashError, NotFoundError} from "../../src/error/WhatsDappError";
import env from "../../env.json";

o.spec("Identity_DAO", async function() {
  o.specTimeout(25000);
  const funding_client = makeClient(env.TESTNET_DEPLOY_WALLET.mnemonic);
  const unfunded_client = makeClient(null);
  const funded_client = makeClient(null);
  const account_to_fund = await funded_client.getWalletAccount();
  const funding_account = await funding_client.getWalletAccount();
  const tx = funding_account.createTransaction({
    recipient: account_to_fund.getUnusedAddress().address,
    satoshis: 10000
  });
  await funding_account.broadcastTransaction(tx);
  o.after(async () => {
    await funded_client.disconnect();
    await unfunded_client.disconnect();
  });

  o("unfunded wallet => return InsufficientDashError on identity create", async function () {
    const res = await Identity_DAO.create(unfunded_client.platform);
    o(res.isErr()).equals(true);
    o(res._unsafeUnwrapErr() instanceof InsufficientDashError).equals(true);
  });

  o("unfunded wallet => return InsufficientDashError on identity topup", async function () {
    const res = await Identity_DAO.topUpIdentity(
      unfunded_client.platform,
      "ttttttttttttttttttttttttttttttttttttttttttt",
      10
    );
    o(res.isErr()).equals(true);
    o(res._unsafeUnwrapErr() instanceof InsufficientDashError).equals(true);
  });

  o("funded wallet, invalid identity => IdentityNotFoundError", async function() {
    const res = await Identity_DAO.topUpIdentity(
      unfunded_client.platform,
      "ttttttttttttttttttttttttttttttttttttttttttt",
      10);
    o(res.isErr()).equals(true)("res is not err");
    o(res._unsafeUnwrapErr() instanceof NotFoundError).equals(true)("error has right type");
  });
});
