const helper = require("../migrationHelper")

const NormalPlanetPermanence = artifacts.require("./permanences/NormalPlanetPermanence") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const planet = await helper.deployAndRegister(deployer, network, NormalPlanetPermanence)

    let id = 1
    let param = 1
    const residenceAndGoldvein = []
    while (id <= 32) {
      residenceAndGoldvein.push(
        { id: id++, kind: "residence", param: param, priceGold: param * 3 },
        { id: id++, kind: "goldvein", param: param, priceGold: param * 3 }
      )
      param++
    }

    const data = residenceAndGoldvein.concat([
      { id: 101, kind: "technology", param: 2, priceGold: 8 },
      { id: 102, kind: "technology", param: 3, priceGold: 11 }
    ])

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
