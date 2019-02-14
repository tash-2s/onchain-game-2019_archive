const Logic = artifacts.require("./Logic.sol")
const Gold = artifacts.require("./Gold.sol")
const NormalPlanet = artifacts.require("./NormalPlanet.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const gold = await Gold.deployed()
    const normalPlanet = await NormalPlanet.deployed()
    const userNormalPlanet = await UserNormalPlanet.deployed()

    const logic = await deployer.deploy(
      Logic,
      gold.address,
      normalPlanet.address,
      userNormalPlanet.address
    )

    await gold.addMinter(logic.address)
    await userNormalPlanet.addMinter(logic.address)
  })
}
