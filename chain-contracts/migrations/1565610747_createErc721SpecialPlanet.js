const helper = require("../migrationHelper")

const erc721 = artifacts.require("./tokens/ERC721SpecialPlanet") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await helper.deployAndRegister(deployer, network, erc721)
  })
}
