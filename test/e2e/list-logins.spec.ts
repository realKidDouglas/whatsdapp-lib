import {WhatsDapp} from "../../src";
import env from "../../env.json";
import {KVMock} from "../KVMock";
import o from 'ospec';
import {ConnectOptions} from "../../src/WhatsDapp";

export default async function (): Promise<void> {
  const mnemonic = env.ALICE_WALLET.mnemonic;
  const alice_messenger = new WhatsDapp(new KVMock());

  // get all the ways alice could access whatsdapp currently
  const alice_access1 = (await WhatsDapp.listLoginInfos(mnemonic))._unsafeUnwrap();

  // delete every access that contains a profile
  for (const access of alice_access1.filter(a => a.displayName != null)) {
    console.log('deleting', access.displayName);
    await alice_messenger.deleteProfile(access);
  }
  const alice_access2 = (await WhatsDapp.listLoginInfos(mnemonic))._unsafeUnwrap();

  const access = alice_access2.find(a => a.dpnsNames.includes('allicewd.dash')) || {
    mnemonic,
    identityId: null,
    dpnsNames: [],
    displayName: 'alice'
  };

  const connectOptions: ConnectOptions = Object.assign(access, {
    dpnsName: access.dpnsNames[0] || "alicewd.dash",
    extraDpnsNames: access.dpnsNames,
    lastTimestamp: 0,
    password: "hello123",
    displayName: "alice"
  });
  const connectResult = await alice_messenger.connect(connectOptions);
  if (connectResult.isErr()) {
    console.log("could not connect", connectResult.error.message);
    throw connectResult.error;
  }
  const userData = connectResult.value;

  const alice_access3 = (await WhatsDapp.listLoginInfos(mnemonic))._unsafeUnwrap();

  o.spec('list-logins', function () {
    o("listed access doesn't contain profile", function () {
      o(alice_access2.find(a => a.displayName != null)).equals(undefined);
      o(alice_access3.find(a => a.displayName != null)).deepEquals({
        mnemonic: userData.mnemonic,
        identityId: userData.identityId,
        dpnsNames: [userData.dpnsName],
        displayName: userData.displayName,
      });
    });
  });
}
