const helper = require("../migrationHelper")

const Web = artifacts.require("Web") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const userNormalPlanetAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetPermanence"
    )
    const userNormalPlanetIdCounterAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetIdCounterPermanence"
    )
    const userGoldPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserGoldPermanence"
    )
    await helper.deployAndRegister(deployer, network, Web, [
      userNormalPlanetAddress,
      userNormalPlanetIdCounterAddress,
      userGoldPermanenceAddress
    ])
  })
}
