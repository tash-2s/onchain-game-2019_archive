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
      await planet.update(
        r.id,
        `1${zeroPadding(r.priceGoldCommonLogarithm, 66)}${zeroPadding(
          r.paramCommonLogarithm,
          3
        )}${zeroPadding(kind, 3)}`
      )
      if (!helper.isDevNetwork(network)) {
        await helper.sleep(300) // to prevent timeout error...
      }
    }
  })
}

const zeroPadding = (num, len) => {
  if (`${num}`.length > len) {
    throw new Error(`wrong range (zeroPadding): ${num}`)
  }
  return ("0".repeat(len - 1) + num).slice(-len)
}
