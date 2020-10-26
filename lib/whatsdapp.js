const {MessengerFactory} = require('./Messenger/MessengerFactory')

/**
 * it turned out to be incredibly difficult to use js-dash-sdk in a typescript library
 * that's used in an application that also uses the sdk ('more than one dash-corelib detected'
 * , 'type' is not instanceof 'type'),
 * so we're opting to get _all_ dependencies injected from the main application.
 * @param sdk the object obtained by require('dash') from js-dash-sdk
 * @returns a messenger constructor that constructs objects using the given sdk object
 */
const whatsdapp = sdk => MessengerFactory(sdk)

module.exports = whatsdapp
