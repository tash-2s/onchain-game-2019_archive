const fs = require("fs")

const helper = require("../migrationHelper")

const NormalPlanetPermanence = artifacts.require("./permanences/NormalPlanetPermanence") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const planet = await helper.deployAndRegister(deployer, network, NormalPlanetPermanence)

    const data = JSON.parse(fs.readFileSync(`${__dirname}/NormalPlanets.json`))

    for (let i = 0; i < data.length; i++) {
      const r = data[i]
      let kind
      if (r.kind == "residence") {
        kind = 1
      } else if (r.kind == "goldmine") {
        kind = 2
      } else if (r.kind == "technology") {
        kind = 3
      }
      const d = buildData(kind, r.paramCommonLogarithm, r.priceGoldCommonLogarithm)
      await planet.update(r.id, d)
      if (!helper.isDevNetwork(network)) {
        await helper.sleep(300) // to prevent timeout error...
      }
    }
  })
}

// see NormalPlanetControllable.sol
const buildData = (kind, param, price) => {
  const d = (kind | (param << 8) | (price << 16)).toString(16)
  return "0x" + zeroPadding(d, 64)
}

const zeroPadding = (n, len) => {
  if (`${n}`.length > len) {
    throw new Error(`wrong range (zeroPadding): ${n}`)
  }
  return ("0".repeat(len - 1) + n).slice(-len)
}
