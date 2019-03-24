const helper = require("../migrationHelper")

const RemarkableUserController = artifacts.require("./controllers/RemarkableUserController") // TODO: fix

module.exports = function(deployer, network, accounts) {
  deployer.then(async function() {
    const userGoldPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserGoldPermanence"
    )

    await helper.deployAndRegister(deployer, network, RemarkableUserController, [userGoldPermanenceAddress])
  })
}
