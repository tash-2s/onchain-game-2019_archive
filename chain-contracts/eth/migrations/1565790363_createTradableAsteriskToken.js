const TradableAsteriskToken = artifacts.require("TradableAsteriskToken")
const TradableAsteriskTokenShop = artifacts.require("TradableAsteriskTokenShop")
const TradableAsteriskTokenShortIdGenerator = artifacts.require("TradableAsteriskTokenShortIdGenerator")

module.exports = function(deployer, network, [account]) {
  deployer.then(async function() {
    const token = await deployer.deploy(TradableAsteriskToken, getGatewayAddress(network, account))
    const idGenerator = await deployer.deploy(TradableAsteriskTokenShortIdGenerator)
    const shop = await deployer.deploy(
      TradableAsteriskTokenShop,
      TradableAsteriskToken.address,
      TradableAsteriskTokenShortIdGenerator.address
    )

    await token.addWhitelisted(TradableAsteriskTokenShop.address)
    await idGenerator.addWhitelisted(TradableAsteriskTokenShop.address)
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
