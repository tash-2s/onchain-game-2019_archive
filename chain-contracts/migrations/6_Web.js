const Web = artifacts.require("./Web.sol")
const Gold = artifacts.require("./Gold.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")
const UserNormalPlanetArrayReaderLib = artifacts.require("./lib/UserNormalPlanetArrayReader.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await deployer.deploy(UserNormalPlanetArrayReaderLib)
    await deployer.link(UserNormalPlanetArrayReaderLib, Web)

    const userNormalPlanet = await UserNormalPlanet.deployed()
    const gold = await Gold.deployed()
    const hexLogic = await deployer.deploy(Web, userNormalPlanet.address, gold.address)
  })
}
