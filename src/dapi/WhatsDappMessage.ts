import {RawMessage} from "../WhatsDapp";

export class WhatsDappMessage {
  public senderHandle: string;
  public timestamp: number;
  public content: string;
  public id: string;
  public ownerId: string;

  constructor(rawMessage: RawMessage) {
    this.senderHandle = rawMessage.ownerId.toString();
    this.timestamp = Number(rawMessage.createdAt);
    this.content = rawMessage.data.content;
    this.id = rawMessage.id.toString();
    this.ownerId = rawMessage.ownerId.toString();
  }


}
