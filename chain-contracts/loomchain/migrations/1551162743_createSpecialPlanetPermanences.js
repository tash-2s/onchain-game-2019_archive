const helper = require("../migrationHelper")

const UserSpecialPlanetPermanence = artifacts.require("./permanences/UserSpecialPlanetPermanence") // TODO: fix
const UserSpecialPlanetIdToDataPermanence = artifacts.require(
  "./permanences/UserSpecialPlanetIdToDataPermanence"
) // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserSpecialPlanetPermanence)
    await helper.deployAndRegister(deployer, network, UserSpecialPlanetIdToDataPermanence)
  })
}
