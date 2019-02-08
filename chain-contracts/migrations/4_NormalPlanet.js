const NormalPlanet = artifacts.require("./NormalPlanet.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.deploy(NormalPlanet).then(function(normalPlanet) {
    return deployer.deploy(UserNormalPlanet, normalPlanet.address)
  })
}
