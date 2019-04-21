const helper = require("../migrationHelper")

const NormalPlanetPermanence = artifacts.require("./permanences/NormalPlanetPermanence") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const planet = await helper.deployAndRegister(deployer, network, NormalPlanetPermanence)

    const data = [
      { id: 1, kind: "residence", param: 1, priceGold: 3 },
      { id: 2, kind: "goldvein", param: 1, priceGold: 3 }
    ]

    for (i = 0; i < data.length; i++) {
      const r = data[i]
      let kind
      if (r.kind == "residence") {
        kind = 1
      } else if (r.kind == "goldvein") {
        kind = 2
      } else if (r.kind == "technology") {
        kind = 3
      }
      await planet.update(
        r.id,
        `1${("0".repeat(67) + r.priceGold).slice(-68)}${("0000" + r.param).slice(-5)}00${kind}`
      )
    }
  })
}
