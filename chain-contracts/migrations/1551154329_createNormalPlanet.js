const fs = require("fs")
const deployWithRecord = require("../misc/deployWithRecord")

const NormalPlanet = artifacts.require("./NormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const normalPlanet = await deployWithRecord(network, { NormalPlanet })

    await normalPlanet.create(1, 1, 10, 5)
    await normalPlanet.create(2, 2, 10, 5)
  })
}
