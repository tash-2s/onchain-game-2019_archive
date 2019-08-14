const helper = require("../migrationHelper")

const UserNormalPlanetPermanence = artifacts.require("./permanences/UserNormalPlanetPermanence") // TODO: fix
const UserNormalPlanetIdCounterPermanence = artifacts.require(
  "./permanences/UserNormalPlanetIdCounterPermanence"
) // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserNormalPlanetPermanence)
    await helper.deployAndRegister(deployer, network, UserNormalPlanetIdCounterPermanence)
  })
}
