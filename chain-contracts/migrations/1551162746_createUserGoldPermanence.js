const helper = require("../migrationHelper")

const UserGoldPermanence = artifacts.require("./permanences/UserGoldPermanence") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserGoldPermanence)
  })
}
