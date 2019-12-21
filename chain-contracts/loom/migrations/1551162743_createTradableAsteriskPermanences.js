const helper = require("../migrationHelper")

const UserTradableAsteriskPermanence = artifacts.require("./permanences/UserTradableAsteriskPermanence") // TODO: fix
const TradableAsteriskIdToDataPermanence = artifacts.require(
  "./permanences/TradableAsteriskIdToDataPermanence"
) // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserTradableAsteriskPermanence)
    await helper.deployAndRegister(deployer, network, TradableAsteriskIdToDataPermanence)
  })
}
