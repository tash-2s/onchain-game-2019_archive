const fs = require("fs")

const UserNormalPlanetArrayReader = artifacts.require("./lib/UserNormalPlanetArrayReader.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const reader = await deployer.deploy(UserNormalPlanetArrayReader)
    fs.writeFileSync(`./networks/${network}/UserNormalPlanetArrayReader`, reader.address)
  })
};
