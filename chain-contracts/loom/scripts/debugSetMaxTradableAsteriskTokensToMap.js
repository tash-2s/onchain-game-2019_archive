const DebugController = artifacts.require("./controllers/DebugController")
const TradableAsteriskController = artifacts.require("./controllers/TradableAsteriskController")
const TradableAsteriskToken = artifacts.require("./tokens/TradableAsteriskToken")

module.exports = async function(callback) {
  const debugController = await DebugController.deployed()
  const tradableAsteriskController = await TradableAsteriskController.deployed()
  const tradableAsteriskToken = await TradableAsteriskToken.deployed()

  const myAddress = await tradableAsteriskToken.gateway()

  await tradableAsteriskToken.setApprovalForAll(tradableAsteriskController.address, true)

  await debugController.debugMintMaxGold(myAddress)
  const ids = await debugController.createTradableAsteriskTokenIds(1000)

  let q
  let r
  let start
  let end
  let i = 0

  for (q = -17; q <= 17; q++) {
    if (-17 < -q - 17) {
      start = -q - 17
    } else {
      start = -17
    }
    if (17 > -q + 17) {
      end = -q + 17
    } else {
      end = 17
    }

    for (r = start; r <= end; r++) {
      const id = ids[i]
      console.log(i, id, q, r)
      await tradableAsteriskToken.mintToGateway(id)
      console.log("minted")
      await tradableAsteriskController.setAsterisk(id, q, r)
      console.log("set")
      i++
    }
  }

  callback()
}
