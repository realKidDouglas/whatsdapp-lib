const {wait} = require('../utils/wait')

/**
 * responsible for the creation, registration and funding
 * of a platform identity with a given secret key
 */
function SessionIdentityFactory(sdk) {

  const PrivateKey = sdk.Core.PrivateKey
  const Transaction = sdk.Core.Transaction
  const coinSelection = sdk.WalletLib.utils.coinSelection

  return class SessionIdentity {
    _identity = null
    _privateKey

    constructor(key, identity) {
      this._privateKey = key
      this._identity = identity || null
    }

    static fromParts(key, identity) {
      return new SessionIdentity(key, identity)
    }

    /**
     * reconstruct instance from object that was
     * obtained by toObject()
     */
    static fromObject(obj) {
      // PrivateKey.fromString is the
      // inverse of PrivateKey.toWIF
      // not of PrivateKey.toString
      const key = PrivateKey.fromString(obj.privateKey)
      let identity = null
      if (obj.identity) {
        //identity = IdentityFactory.createFromObject(obj.identity)
      }
      return new SessionIdentity(key, identity)
    }

    toObject() {
      return {
        privateKey: this._privateKey.toWIF(),
        identity: this._identity
          ? this._identity.toObject()
          : null
      }
    }

    /**
     * register the Identity to the platform if it is not already registered,
     * and provide it with credits according to amountInDuffs
     *
     * TODO: may lose funds if an error occurs after creation of the assetLockTransaction
     * TODO: i.e. if trying to top up a deactivated identity?
     */
    async fund(amountInDuffs, platform) {
      if (!platform) {
        throw new Error("platform is null?")
      }
      if (amountInDuffs <= 0) {
        throw new Error("non-positive duff amount")
      }

      const {client, dpp} = platform
      const account = await client.getWalletAccount()

      const {
        transaction: assetLockTransaction,
        privateKey: assetLockPrivateKey
      } = await this._createAssetLockTransaction(platform, amountInDuffs)

      await account.broadcastTransaction(assetLockTransaction)
      await wait(1000)

      // create topUpTransition or createTransition
      let transition
      // this gets called at the end when the transition was broadcast
      let storageCb = async () => {
      }
      const outPointBuffer = assetLockTransaction.getOutPointBuffer(0)
      if (await this._checkRegistered()) {
        console.log("topping up existing identity!")
        transition = dpp.identity.createIdentityTopUpTransition(this._identity.id, outPointBuffer)
      } else {
        console.log("creating new identity!")
        const identityPublicKey = this._privateKey.toPublicKey()
        const identity = dpp.identity.create(outPointBuffer, [identityPublicKey])
        transition = dpp.identity.createIdentityCreateTransition(identity)
        this._identity = identity
        storageCb = async () => {
          // TODO: this is not properly storing the identity because it's taking
          // TODO: a place of a 'real' identity.
          // TODO: a fresh account instance that's syncing for the first time probably won't find it.
          // TODO: and god knows what's going to happen if another device tries to create an identity
          // TODO: for this wallet at this index. only putting it there so it gets synced by the wallet.
          const identityIndex = await account.getUnusedIdentityIndex()
          account.storage.insertIdentityIdAtIndex(account.walletId, this._identity.getId().toString(), identityIndex)
        }
      }

      transition.signByPrivateKey(assetLockPrivateKey)

      const result = await dpp.stateTransition.validateStructure(transition)

      if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`)
      }
      await client.getDAPIClient().platform.broadcastStateTransition(transition.serialize())
      await storageCb()
      await wait(1000)
    }

    /**
     * this is almost 100% createAssetLockTransaction() from
     * https://github.com/dashevo/js-dash-sdk/tree/v0.16-dev/src/SDK/Client/Platform
     * it would be suitable to use, but it's not accessible.
     * @param platform
     * @param fundingAmount
     * @returns {Promise<{privateKey: *, transaction: *}>}
     * @private
     */
    async _createAssetLockTransaction(platform, fundingAmount) {
      const account = await platform.client.getWalletAccount()

      const assetLockOneTimePrivateKey = new PrivateKey()
      const assetLockOneTimePublicKey = assetLockOneTimePrivateKey.toPublicKey()

      const identityAddress = assetLockOneTimePublicKey.toAddress(platform.client.network).toString()
      const changeAddress = account.getUnusedAddress('internal').address

      const lockTransaction = new Transaction(undefined)

      const output = {
        satoshis: fundingAmount,
        address: identityAddress
      }

      const utxos = account.getUTXOS()
      const balance = account.getTotalBalance()

      if (balance < output.satoshis) {
        throw new Error(`Not enough balance (${balance}) to cover burn amount of ${fundingAmount}`)
      }

      const selection = coinSelection(utxos, [output])

      lockTransaction
        .from(selection.utxos)
        // this line is different from createTransaction, which uses .to instead of .addBurnOutput
        // apparently burnOutputs can't be spent on L1 anymore?
        .addBurnOutput(output.satoshis, assetLockOneTimePublicKey._getID())
        .change(changeAddress)

      const utxoAddresses = selection.utxos.map(utxo => utxo.address.toString())

      const utxoHDPrivateKey = account.getPrivateKeys(utxoAddresses)

      const signingKeys = utxoHDPrivateKey.map((hdprivateKey) => hdprivateKey.privateKey)

      const transaction = lockTransaction.sign(signingKeys)

      return {
        transaction,
        privateKey: assetLockOneTimePrivateKey
      }
    }

    async _checkRegistered() {
      // TODO: this NEEDS to be checked with the platform
      return !!this._identity
    }

    async deactivate() {
      // TODO: check if the identity is registered
      // TODO: check if enough credits for transition is available
      // TODO: if not, get funding (topup)
      // TODO: create & send IdentityDeactivateTransition
      throw new Error("not implemented")
    }
  }
}

module.exports = {SessionIdentityFactory}


