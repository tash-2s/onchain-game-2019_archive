const SpecialPlanet = artifacts.require("SpecialPlanet")
const SpecialPlanetShop = artifacts.require("SpecialPlanetShop")
const SpecialPlanetShortIdGenerator = artifacts.require("SpecialPlanetShortIdGenerator")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await deployer.deploy(SpecialPlanet, getGatewayAddress(network))
    await deployer.deploy(SpecialPlanetShortIdGenerator)
    await deployer.deploy(
      SpecialPlanetShop,
      SpecialPlanet.address,
      SpecialPlanetShortIdGenerator.address
    )

    await (await SpecialPlanet.deployed()).addMinter(SpecialPlanetShop.address)
    await (await SpecialPlanetShortIdGenerator.deployed()).addMinter(SpecialPlanetShop.address)
  })
}

const getGatewayAddress = network => {
  // https://loomx.io/developers/en/testnet-plasma.html
  switch (network) {
    case "rinkeby":
      return "0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2"
    default:
      return "0x0000000000000000000000000000000000000000"
  }
}
