const DebugController = artifacts.require("./controllers/DebugController")
const SpecialPlanetController = artifacts.require("./controllers/SpecialPlanetController")
const SpecialPlanetToken = artifacts.require("./tokens/SpecialPlanetToken")

module.exports = async function(callback) {
  const debugController = await DebugController.deployed()
  const specialPlanetController = await SpecialPlanetController.deployed()
  const specialPlanetToken = await SpecialPlanetToken.deployed()

  const myAddress = await specialPlanetToken.gateway()

  await specialPlanetToken.setApprovalForAll(specialPlanetController.address, true)

  await debugController.debugMintMaxGold(myAddress)
  const ids = await debugController.createSpecialPlanetTokenIds(1000)

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
      await specialPlanetToken.mintToGateway(id)
      console.log("minted")
      await specialPlanetController.setPlanet(id, q, r)
      console.log("set")
      i++
    }
  }

  callback()
}
