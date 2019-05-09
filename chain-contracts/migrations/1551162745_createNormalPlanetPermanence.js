const helper = require("../migrationHelper")

const NormalPlanetPermanence = artifacts.require("./permanences/NormalPlanetPermanence") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const planet = await helper.deployAndRegister(deployer, network, NormalPlanetPermanence)

    let id = 1
    let param = 1
    const residenceAndGoldvein = []
    while (id <= 16) {
      residenceAndGoldvein.push(
        { id: id++, kind: "residence", param: param, priceGoldCommonLogarithm: param * 3 },
        { id: id++, kind: "goldvein", param: param, priceGoldCommonLogarithm: param * 3 }
      )
      param += 2
    }

    const data = residenceAndGoldvein.concat([
      { id: 101, kind: "technology", param: 2, priceGoldCommonLogarithm: 8 },
      { id: 102, kind: "technology", param: 3, priceGoldCommonLogarithm: 12 }
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
        `1${("0".repeat(67) + r.priceGoldCommonLogarithm).slice(-68)}${("0000" + r.param).slice(
          -5
        )}00${kind}`
      )
    }
  })
}
