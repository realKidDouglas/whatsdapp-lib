import {WhatsDappCipherMessage} from "./WhatsDappCipherMessage";

export class WhatsDappPlainMessageOut {
  public senderHandle: string;
  public timestamp: number;
  public content: {
    message: string,
    deleteTime: number
  }
  public id: string;
  public ownerId: string;

  constructor(cipherMessage: WhatsDappCipherMessage) {
    this.senderHandle = cipherMessage.senderHandle;
    this.timestamp = cipherMessage.timestamp;
    this.content = {
      message: this._getMessageFromContent(cipherMessage.content),
      deleteTime: this._getDeleteTimeFromContent(cipherMessage.content)
    };
    this.id = cipherMessage.id;
    this.ownerId = cipherMessage.ownerId;
  }

  _getMessageFromContent(content: string): string {
    return JSON.parse(content).message;
  }

  _getDeleteTimeFromContent(content: string): number {
    return JSON.parse(content).deleteTime;
  }
}
