const helper = require("../migrationHelper")

const RemarkableUsers = artifacts.require("RemarkableUsers") // TODO: fix

module.exports = function(deployer, network, accounts) {
  deployer.then(async function() {
    const goldAddress = await helper.getRegistryContractAddress(deployer.network_id, "Gold")

    await helper.deployAndRegister(deployer, network, RemarkableUsers, [goldAddress])
  })
}
