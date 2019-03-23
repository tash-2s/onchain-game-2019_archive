const helper = require("../migrationHelper")

const Web = artifacts.require("Web") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const readerAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetArrayReader"
    )
    Web.setNetwork(deployer.network_id)
    Web.link("UserNormalPlanetArrayReader", readerAddress)

    const userNormalPlanetAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanet"
    )
    const userGoldPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserGoldPermanence"
    )
    await helper.deployAndRegister(deployer, network, Web, [
      userNormalPlanetAddress,
      userGoldPermanenceAddress
    ])
  })
}
