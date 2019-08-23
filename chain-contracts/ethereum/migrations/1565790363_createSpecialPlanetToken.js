const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")
const SpecialPlanetTokenShop = artifacts.require("SpecialPlanetTokenShop")
const SpecialPlanetTokenShortIdGenerator = artifacts.require("SpecialPlanetTokenShortIdGenerator")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    await deployer.deploy(SpecialPlanetToken, getGatewayAddress(network))
    await deployer.deploy(SpecialPlanetTokenShortIdGenerator)
    await deployer.deploy(
      SpecialPlanetTokenShop,
      SpecialPlanetToken.address,
      SpecialPlanetTokenShortIdGenerator.address
    )

    await (await SpecialPlanetToken.deployed()).addMinter(SpecialPlanetTokenShop.address)
    await (await SpecialPlanetTokenShortIdGenerator.deployed()).addMinter(
      SpecialPlanetTokenShop.address
    )
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
