// the file where each session's metadata will be stored
export const METADATA_FILE_NAME = 'map.blk';
// the file where the own signal keys will be stored
export const PRIVATE_FILE_NAME = 'priv';
// the file where the user data will be stored
export const USER_FILE_NAME = 'usr';
// contains all the active sessions
export const SESSIONS_FILE_NAME = 'sessions';
//
export const KEY_DUE_TIMES_FILE_NAME = 'keyduetimes';
// default number of messages returned by query
export const DEFAULT_MSG_COUNT = 20;
// how many bytes will be stored in a chunk before the next one will be started
export const CHUNK_SIZE_SOFT_MAX = 1024 * 8;
// how big a chunk may get (due to out-of-order messages) before the history will be rewritten
export const CHUNK_SIZE_MAX = 1024 * 64;
// how fuzzy the chunk size is (ie 5 bytes will be considered empty)
export const CHUNK_SIZE_BUF = 5;
