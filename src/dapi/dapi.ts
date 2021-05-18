import {
  createWallet as _createWallet,
  getUnusedAddress as _getUnusedAddress,
} from './Wallet_DAO';
import {
  createIdentity as _createIdentity,
  getIdentity as _getIdentity,
  topUpIdentity as _topUpIdentity,
  getIdentityBalance as _getIdentityBalance,
  createDpnsName as _createDpnsName,
  getDpnsNames as _getDpnsNames,
  findIdentityByName as _findIdentityByName,
} from "./Identity_DAO";

import {
  deleteProfile as _deleteProfile,
  createProfile as _createProfile,
  updateProfile as _updateProfile,
  getProfile as _getProfile
} from "./Profile_DAO";

import {
  getMessageFromByTime as _getMessageFromByTime,
  getMessages as _getMessages,
  getMessagesFrom as _getMessagesFrom,
  getMessagesByTime as _getMessagesByTime,
  createMessage as _createMessage,
  deleteMessage as _deleteMessage,
} from "./Message_DAO";

// Wallet
export const createWallet = _createWallet;
export const getUnusedAddress = _getUnusedAddress;

// Identity
export const createIdentity = _createIdentity;
export const getIdentity = _getIdentity;
export const topUpIdentity = _topUpIdentity;
export const createDpnsName = _createDpnsName;
export const getDpnsNames = _getDpnsNames;
export const findIdentityByName = _findIdentityByName;
export const getIdentityBalance = _getIdentityBalance;

// Profile
export const createProfile = _createProfile;
export const updateProfile = _updateProfile;
export const deleteProfile = _deleteProfile;
export const getProfile = _getProfile;

// Message
export const createMessage = _createMessage;
export const deleteMessage = _deleteMessage;
export const getMessagesByTime = _getMessagesByTime;
export const getMessagesFromByTime = _getMessageFromByTime;
export const getMessages = _getMessages;
export const getMessagesFrom = _getMessagesFrom;
