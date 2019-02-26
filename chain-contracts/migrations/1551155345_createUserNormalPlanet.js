const NormalPlanet = artifacts.require("./NormalPlanet.sol")
const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")
const fs = require("fs")

const UserNormalPlanet = artifacts.require("./UserNormalPlanet.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const utilAddress = JSON.parse(fs.readFileSync(`./networks/${network}/Util`))
    const readerAddress = JSON.parse(fs.readFileSync(`./networks/${network}/UserNormalPlanetArrayReader`))
    await deployer.link(utilAddress, UserNormalPlanet)
    await deployer.link(readerAddress, UserNormalPlanet)

    const normalPlanetAddress = JSON.parse(fs.readFileSync(`./networks/${network}/NormalPlanet`))

    const userNormalPlanet = await deployer.deploy(UserNormalPlanet, normalPlanetAddress)
  })
}
