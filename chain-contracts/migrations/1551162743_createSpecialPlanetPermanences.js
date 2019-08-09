const helper = require("../migrationHelper")

const UserSpecialPlanetPermanence = artifacts.require("./permanences/UserSpecialPlanetPermanence") // TODO: fix
const UserSpecialPlanetIdToOwnerPermanence = artifacts.require(
  "./permanences/UserSpecialPlanetIdToOwnerPermanence"
) // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserSpecialPlanetPermanence)
    await helper.deployAndRegister(deployer, network, UserSpecialPlanetIdToOwnerPermanence)
  })
}
