const helper = require("../migrationHelper")

const UserNormalPlanet = artifacts.require("UserNormalPlanet") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const utilAddress = await helper.getRegistryContractAddress(deployer.network_id, "Util")
    const readerAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetArrayReader"
    )

    UserNormalPlanet.setNetwork(deployer.network_id)
    UserNormalPlanet.link("Util", utilAddress)
    UserNormalPlanet.link("UserNormalPlanetArrayReader", readerAddress)

    const normalPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "NormalPlanetPermanence"
    )
    await helper.deployAndRegister(deployer, network, UserNormalPlanet, [normalPlanetPermanenceAddress])
  })
}
