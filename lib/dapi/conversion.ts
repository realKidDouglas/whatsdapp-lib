import type {RawMessage, WhatsDappMessage} from '../WhatsDapp';
import {DashIdentity} from "../types/DashTypes";

function createdAtToTimestamp(createdAt: string): number {
  return Number(createdAt);
}

export function rawMessageToMessage(rawMessage: RawMessage): WhatsDappMessage {
  const ownerId = rawMessage.ownerId.toString();
  const timestamp = createdAtToTimestamp(rawMessage.createdAt);

  // TODO: put content through the signal lib
  const content = rawMessage.data.content;
  const id = rawMessage.id.toString();

  return {
    // TODO: get senderHandle from (some) public profile!
    senderHandle: ownerId,
    timestamp,
    content,
    id,
    ownerId
  };
}

export function transitionToMessage(transition: RawMessage, ownerId: DashIdentity): WhatsDappMessage {
  return rawMessageToMessage(Object.assign({}, transition, {ownerId: ownerId.id.toJSON()}));
}
