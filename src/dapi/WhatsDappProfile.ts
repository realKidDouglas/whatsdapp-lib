import {PreKey, RawProfile, SignedPreKey} from "../WhatsDapp";

export class WhatsDappProfile {
  public identityKey: Array<string>;
  public registrationId: number;
  public signedPreKey: SignedPreKey;
  public preKey: PreKey;
  public preKeys: Array<string>;
  public displayName: string;
  public createdAt: Date;
  public updatedAt: Date;


  constructor(rawProfile: RawProfile) {
    this.identityKey = rawProfile.data.identityKey;
    this.registrationId = rawProfile.data.registrationId;
    this.signedPreKey = rawProfile.data.signedPreKey;
    this.preKey = rawProfile.data.preKey;
    this.preKeys = rawProfile.data.prekeys;
    this.displayName = rawProfile.data.displayname;
    this.createdAt = rawProfile.createdAt;
    this.updatedAt = rawProfile.updatedAt;
  }
}
