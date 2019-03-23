const helper = require("../migrationHelper")

const NormalPlanetPermanence = artifacts.require("./permanences/NormalPlanetPermanence") // TODO: fix

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const planet = await helper.deployAndRegister(deployer, network, NormalPlanetPermanence)

    await planet.update(1, 500010001) // id: 1, kind: 1, param: 10, priceGold: 5
    await planet.update(2, 500010002)
    await planet.update(3, 500010003)
  })
}
