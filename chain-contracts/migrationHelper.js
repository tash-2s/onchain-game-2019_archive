const fs = require("fs")

export const deployWithRecord = async (deployer, network, contract, args) => {
  const name = Object.keys(contract)[0]
  const definition = Object.values(contract)[0]

  const deployed = await deployer.deploy(definition, ...args)
  fs.writeFileSync(`./networks/${network}/${name}`, deployed.address)

  return deployed
}

export const getAddress = (network, name) => {
  return fs.readFileSync(`./networks/${network}/${name}`)
}
