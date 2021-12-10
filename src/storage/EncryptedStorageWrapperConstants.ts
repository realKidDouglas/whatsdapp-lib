// the file where the salt for this storage will be stored
export const SALT_FILE_NAME = 'salt';
// salt byte length for scrypt
export const SALT_LENGTH = 32;
// the used block cipher
export const ALGO = 'aes-256-gcm';
// iv byte length for aes-gcm
export const IV_LENGTH = 16;
// byte length of the auth tag for aes-gcm
export const TAG_LENGTH = 16;