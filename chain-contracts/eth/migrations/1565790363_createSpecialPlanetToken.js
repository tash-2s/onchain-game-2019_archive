const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")
const SpecialPlanetTokenShop = artifacts.require("SpecialPlanetTokenShop")
const SpecialPlanetTokenShortIdGenerator = artifacts.require("SpecialPlanetTokenShortIdGenerator")

module.exports = function(deployer, network, [account]) {
  deployer.then(async function() {
    const token = await deployer.deploy(SpecialPlanetToken, getGatewayAddress(network, account))
    const idGenerator = await deployer.deploy(SpecialPlanetTokenShortIdGenerator)
    const shop = await deployer.deploy(
      SpecialPlanetTokenShop,
      SpecialPlanetToken.address,
      SpecialPlanetTokenShortIdGenerator.address
    )

    await token.addWhitelisted(SpecialPlanetTokenShop.address)
    await idGenerator.addWhitelisted(SpecialPlanetTokenShop.address)
    await shop.addWhitelisted(account)
  })
}

const getGatewayAddress = (network, myAddress) => {
  // https://loomx.io/developers/en/testnet-plasma.html
  switch (network) {
    case "staging":
      return "0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2"
    default:
      return myAddress
  }
}
