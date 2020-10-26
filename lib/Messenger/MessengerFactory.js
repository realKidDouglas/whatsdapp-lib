const {SessionIdentityFactory} = require("../SessionIdentity/SessionIdentityFactory")
const {wait} = require('../utils/wait')

/**
 * Main Wrapper around the functionality to send
 * secure & anonymous messages to any identity on
 * the dash platform.
 */
function MessengerFactory(sdk) {

  const SessionIdentity = SessionIdentityFactory(sdk)
  const PrivateKey = sdk.Core.PrivateKey

  return function (opts) {
    this._client = opts.client

    // TODO: move to whatever's going to manage sessions
    this.createSessionIdentity = async function createSessionIdentity() {
      const identity = SessionIdentity.fromParts(PrivateKey.fromRandom())
      await identity.fund(10000, this._client.platform)
      return identity
    }

    // TODO: move to whatever's going to manage sessions
    this.fundSessionIdentity = async function fundSessionIdentity(amount, identity) {
      identity.fund(amount, this._client.platform)
    }

    /**
     * this is almost broadcastStateTransition() from
     * https://github.com/dashevo/js-dash-sdk/blob/v0.16-dev/src/SDK/Client/Platform/broadcastStateTransition.ts
     * it would be suitable to use if it gave the option to use any private key instead
     * of always deriving one from the wallet
     * TODO: this should not be on this class
     * @param platform platform object
     * @param documents state transition batch to broadcast
     * @param sessionIdentity the sessionIdentity containing a dpp identity and a private key
     * @returns {Promise<{privateKey: *, transaction: *}>}
     * @private
     */
    this.broadcastDocumentBatch = async function broadcastDocumentBatch(platform, documents, sessionIdentity) {
      const { client, dpp } = platform
      const identity = sessionIdentity._identity
      const privateKey = sessionIdentity._privateKey

      const stateTransition = dpp.document.createStateTransition(documents)

      stateTransition.sign(
        identity.getPublicKeyById(0),
        privateKey,
      )

      const result = await dpp.stateTransition.validateStructure(stateTransition)

      if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`)
      }

      await client.getDAPIClient().platform.broadcastStateTransition(stateTransition.serialize())

      // Wait some time for propagation
      await wait(1000)

      return stateTransition
    }

  }
}

module.exports = {MessengerFactory}



