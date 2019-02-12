const Web = artifacts.require("./Web.sol")
//const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    //const userNormalPlanet = await UserNormalPlanet.deployed()
    const hexLogic = await deployer.deploy(Web)
  })
}
