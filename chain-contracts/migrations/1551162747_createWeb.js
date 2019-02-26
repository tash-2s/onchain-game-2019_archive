const helper = require("../migrationHelper")

const Web = artifacts.require("./Web.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await deployer.link(helper.getAddress(network, "UserNormalPlanetArrayReader"), Web)

    const userNormalPlanetAddress = helper.getAddress(network, "UserNormalPlanet")
    const goldAddress = helper.getAddress(network, "Gold")
    await helper.deployWithRecord(deployer, network, { Web }, [userNormalPlanetAddress, goldAddress])
  })
}
