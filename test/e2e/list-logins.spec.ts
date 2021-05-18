import {WhatsDapp} from "../../src";
import env from "../../env.json";
import {KVMock} from "./KVMock";
import o from 'ospec';
import {ConnectOptions} from "../../src/WhatsDapp";

export default async function() : Promise<void> {
  const alice_messenger = await WhatsDapp.createMessenger(new KVMock());
  const mnemonic = env.ALICE_WALLET.mnemonic;
  const alice_access1 = await alice_messenger.listLoginInfos(mnemonic);
  for(const access of alice_access1.filter(a => a.displayName != null)) {
    console.log('deleting', access.displayName);
    await alice_messenger.deleteProfile(access);
  }
  const alice_access2 = await alice_messenger.listLoginInfos(mnemonic);

  const access = alice_access2[alice_access2.length - 1] || {
    mnemonic,
    identity: null,
    dpnsNames: [],
    displayName: 'alice'
  };

  const connectOptions : ConnectOptions = Object.assign(access, {
    dpnsName: access.dpnsNames[0] || "alicewd.dash",
    extraDpnsNames: access.dpnsNames,
    lastTimestamp: 0,
    password: "hello123",
    displayName: "alice"
  });

  const profileInfo = await alice_messenger.connect(connectOptions);
  console.log(profileInfo);

  const alice_access3 = await alice_messenger.listLoginInfos(mnemonic);

  o.spec('list-logins', function() {
    o("listed access doesn't contain profile", function() {
      o(alice_access2.find(a => a.displayName != null)).equals(undefined);
      o(alice_access3.find(a => a.displayName != null)).equals({
        mnemonic: profileInfo.mnemonic,
        identity: profileInfo.identity,
        dpnsNames: profileInfo.dpnsNames,
        displayName: profileInfo.displayName,
      });
    });
  });
}
