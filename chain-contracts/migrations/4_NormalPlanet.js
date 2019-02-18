const NormalPlanet = artifacts.require("./NormalPlanet.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")
const UtilLib = artifacts.require("./lib/Util.sol")
const UserNormalPlanetArrayReaderLib = artifacts.require("./lib/UserNormalPlanetArrayReader.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await deployer.deploy(UtilLib)
    await deployer.deploy(UserNormalPlanetArrayReaderLib)
    await deployer.link(UtilLib, UserNormalPlanet)
    await deployer.link(UserNormalPlanetArrayReaderLib, UserNormalPlanet)

    const normalPlanet = await deployer.deploy(NormalPlanet)
    const userNormalPlanet = await deployer.deploy(UserNormalPlanet, normalPlanet.address)
    await normalPlanet.create(1, 1, 1, 5)
    await normalPlanet.create(2, 2, 1, 5)
  })
}
