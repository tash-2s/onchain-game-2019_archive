const helper = require("../migrationHelper")

const Logic = artifacts.require("./Logic.sol")
const Gold = artifacts.require("./Gold.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const utilAddress = helper.getAddress(network, "Util")
    const readerAddress = helper.getAddress(network, "UserNormalPlanetArrayReader")
    await deployer.link(utilAddress, Logic)
    await deployer.link(readerAddress, Logic)

    const goldAddress = helper.getAddress(network, "Gold")
    const normalPlanetAddress = helper.getAddress(network, "NormalPlanet")
    const userNormalPlanetAddress = helper.getAddress(network, "UserNormalPlanet")
    const logic = await helper.deployWithRecord(deployer, network, { Logic }, [goldAddress, normalPlanetAddress, userNormalPlanetAddress])

    await Gold.at(goldAddress).addMinter(logic.address)
    await UserNormalPlanet.at(userNormalPlanetAddress).addMinter(logic.address)
  })
}
