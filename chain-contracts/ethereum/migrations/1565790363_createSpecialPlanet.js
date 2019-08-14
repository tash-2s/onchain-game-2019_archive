const SpecialPlanet = artifacts.require("SpecialPlanet");
const SpecialPlanetShop = artifacts.require("SpecialPlanetShop");

module.exports = function(deployer) {
  deployer.then(async function() {
    await deployer.deploy(SpecialPlanet)
    await deployer.deploy(SpecialPlanetShop, SpecialPlanet.address)

    await (await SpecialPlanet.deployed()).addMinter(SpecialPlanetShop.address)
  })
};
