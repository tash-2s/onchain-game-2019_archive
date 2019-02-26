const registerInstance = (network, instance) => {
  const tdr = require("truffle-deploy-registry")

  if (!tdr.isDryRunNetworkName(network)) {
    return tdr.appendInstance(instance)
  }
}

module.exports = {
  buildContract: (artifacts, name, scheme) => {
    const tc = require("truffle-contract")
    const contract = tc({ contractName: name, ...scheme })

    const _Migrations = artifacts.require("Migrations")
    contract.setProvider(_Migrations.currentProvider)
    contract.defaults(_Migrations.defaults())

    return contract
  },
  registerInstance: registerInstance,
  deployAndRegister: async (deployer, network, contract, args = []) => {
    const instance = await deployer.deploy(contract, ...args)
    registerInstance(network, instance)
    return instance
  },
  getRegistryContractAddress: async (networkId, name) => {
    const tdr = require("truffle-deploy-registry")
    const entry = await tdr.findLastByContractName(networkId, name)
    return entry.address
  }
}
