import {RawMessage} from "../WhatsDapp";

export class WhatsDappMessage {
  public senderHandle: string;
  public timestamp: number;
  public content: string;
  public id: string;
  public ownerId: string;
  public deleteTime: number;

  constructor(rawMessage: RawMessage) {
    this.senderHandle = rawMessage.ownerId.toString();
    this.timestamp = Number(rawMessage.createdAt);
    this.content = JSON.parse(rawMessage.data.content).message;
    this.deleteTime = JSON.parse(rawMessage.data.content).deleteTime.getTime();
    console.log(this.content);
    this.id = rawMessage.id.toString();
    this.ownerId = rawMessage.ownerId.toString();
  }


}
