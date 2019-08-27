const helper = require("../migrationHelper")

const UserSpecialPlanetPermanence = artifacts.require("./permanences/UserSpecialPlanetPermanence") // TODO: fix
const SpecialPlanetIdToDataPermanence = artifacts.require(
  "./permanences/SpecialPlanetIdToDataPermanence"
) // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserSpecialPlanetPermanence)
    await helper.deployAndRegister(deployer, network, SpecialPlanetIdToDataPermanence)
  })
}
