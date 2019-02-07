const Gold = artifacts.require("./Gold.sol")
const CheatForDevelopment = artifacts.require("./CheatForDevelopment.sol")

module.exports = function(deployer, network) {
  deployer.deploy(Gold).then(function(gold) {
    if (network === 'development') {
      return deployer.deploy(CheatForDevelopment, gold.address).then(function(cheat) {
        return gold.addMinter(cheat.address)
      })
    }
  })
}
