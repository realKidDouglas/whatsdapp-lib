/* eslint @typescript-eslint/no-var-requires: "off" */

const Dash = require('dash');
const env = require('../env');
const client = new Dash.Client();

const retrieveIdentity = async () => {
  return client.platform.identities.get('CRzGj9J4aw1MunxnMNmAV6FWH3rch9TA5A87NMwP6yjD');
};

retrieveIdentity()
  .then((d) => console.log('Identity retrieved:\n', d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
