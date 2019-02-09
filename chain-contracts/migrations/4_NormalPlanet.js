const NormalPlanet = artifacts.require("./NormalPlanet.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const normalPlanet = await deployer.deploy(NormalPlanet)
    const userNormalPlanet = await deployer.deploy(
      UserNormalPlanet,
      normalPlanet.address
    )
    await normalPlanet.create(1, 2, 3, 4)
  })
}
