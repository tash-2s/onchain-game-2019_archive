const HexLogic = artifacts.require("./HexLogic.sol")
const NormalPlanet = artifacts.require("./NormalPlanet.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const normalPlanet = await NormalPlanet.deployed()
    const userNormalPlanet = await UserNormalPlanet.deployed()
    const hexLogic = await deployer.deploy(
      HexLogic,
      normalPlanet.address,
      userNormalPlanet.address
    )
    await userNormalPlanet.addMinter(hexLogic.address)
  })
}
