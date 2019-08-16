const helper = require("../migrationHelper")

const erc721 = artifacts.require("./tokens/Erc721SpecialPlanet") // TODO: fix

module.exports = function(deployer, network, accounts) {
  deployer.then(async function() {
    const gateway = getGatewayAddress(network, accounts[0])
    await helper.deployAndRegister(deployer, network, erc721, [gateway])
  })
}

const getGatewayAddress = (network, myAddress) => {
  // got from client.getContractAddressAsync("gateway")

  switch (network) {
    case "extdev":
      return "0xe754d9518bf4a9c63476891ef9aa7d91c8236a5d"
    default:
      return myAddress
  }
}
