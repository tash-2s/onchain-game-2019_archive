const helper = require("../migrationHelper")

const token = artifacts.require("./tokens/SpecialPlanetToken") // TODO: fix
const locker = artifacts.require("./misc/SpecialPlanetTokenLocker") // TODO: fix

module.exports = function(deployer, network, accounts) {
  deployer.then(async function() {
    const gateway = getGatewayAddress(network, accounts[0])
    const t = await helper.deployAndRegister(deployer, network, token, [gateway])

    await helper.deployAndRegister(deployer, network, locker, [t.address])
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
