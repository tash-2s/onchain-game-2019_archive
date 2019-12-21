const helper = require("../migrationHelper")

const UserInGameAsteriskPermanence = artifacts.require("./permanences/UserInGameAsteriskPermanence") // TODO: fix
const UserInGameAsteriskIdGeneratorPermanence = artifacts.require(
  "./permanences/UserInGameAsteriskIdGeneratorPermanence"
) // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, UserInGameAsteriskPermanence)
    await helper.deployAndRegister(deployer, network, UserInGameAsteriskIdGeneratorPermanence)
  })
}
