const helper = require("../migrationHelper")

const Gold = artifacts.require("Gold") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const utilAddress = await helper.getRegistryContractAddress(deployer.network_id, "Util")
    Gold.setNetwork(deployer.network_id)
    Gold.link("Util", utilAddress)
    await helper.deployAndRegister(deployer, network, Gold)
  })
}
